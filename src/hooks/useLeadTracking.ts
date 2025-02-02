import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UAParser } from 'ua-parser-js';
import { Json } from '@/integrations/supabase/types';
import { useToast } from "@/components/ui/use-toast";

interface LeadTrackingData {
  id?: string;
  lead_id?: string;
  landing_page_id?: string;
  session_start?: string;
  session_end?: string;
  page_views?: Json;
  interactions?: Json;
  created_at?: string;
  device_info?: Json;
  user_preferences?: Json;
  ip_address?: string;
  user_agent?: string;
  location_info?: Json;
  session_duration?: number;
  last_activity?: string;
}

export const useLeadTracking = (leadId: string | null) => {
  const { toast } = useToast();
  const sessionRef = useRef<string | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const lastActivityRef = useRef<Date>(new Date());
  const isFirstVisitRef = useRef<boolean>(true);
  const retryAttemptsRef = useRef<number>(0);
  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 1000;

  const getDeviceInfo = () => {
    const parser = new UAParser();
    const result = parser.getResult();
    
    return {
      browser: result.browser.name,
      browserVersion: result.browser.version,
      os: result.os.name,
      osVersion: result.os.version,
      device: result.device.type || 'desktop',
      deviceVendor: result.device.vendor,
      deviceModel: result.device.model,
    };
  };

  const handleError = async (operation: string, error: any, retryFn: () => Promise<void>) => {
    console.error(`Error in ${operation}:`, error);
    
    if (retryAttemptsRef.current < MAX_RETRY_ATTEMPTS) {
      retryAttemptsRef.current++;
      const delay = RETRY_DELAY * retryAttemptsRef.current;
      
      console.log(`Retrying ${operation} attempt ${retryAttemptsRef.current} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return retryFn();
    } else {
      toast({
        title: "Error",
        description: `Failed to ${operation}. Please try again later.`,
        variant: "destructive",
      });
      retryAttemptsRef.current = 0;
    }
  };

  const startTracking = async () => {
    if (!leadId) return;

    try {
      const { data: existingLead, error: leadError } = await supabase
        .from('leads')
        .select('total_visits, created_at, last_interaction')
        .eq('id', leadId)
        .maybeSingle();

      if (leadError) throw leadError;

      const isFirstVisit = existingLead?.created_at === existingLead?.last_interaction;
      isFirstVisitRef.current = isFirstVisit;

      const trackingData: LeadTrackingData = {
        lead_id: leadId,
        session_start: new Date().toISOString(),
        page_views: [{
          path: window.location.pathname,
          timestamp: new Date().toISOString(),
          referrer: document.referrer
        }],
        interactions: [],
        device_info: {
          ...getDeviceInfo(),
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          windowSize: `${window.innerWidth}x${window.innerHeight}`,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      const { data: session, error: sessionError } = await supabase
        .from('lead_tracking')
        .insert(trackingData)
        .select('id')
        .single();

      if (sessionError) throw sessionError;

      sessionRef.current = session.id;
      retryAttemptsRef.current = 0;

      if (isFirstVisit || !existingLead?.total_visits) {
        await supabase
          .from('leads')
          .update({ 
            total_visits: 1,
            last_interaction: new Date().toISOString()
          })
          .eq('id', leadId);
      } else {
        const lastInteraction = new Date(existingLead.last_interaction);
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        
        if (lastInteraction < thirtyMinutesAgo) {
          await supabase
            .from('leads')
            .update({ 
              total_visits: (existingLead.total_visits || 0) + 1,
              last_interaction: new Date().toISOString()
            })
            .eq('id', leadId);
        }
      }
    } catch (error) {
      await handleError('start tracking', error, startTracking);
    }
  };

  const updateActivity = async () => {
    if (!sessionRef.current || !leadId) return;

    const now = new Date();
    const timeSinceLastActivity = now.getTime() - lastActivityRef.current.getTime();
    
    if (timeSinceLastActivity > 5000) {
      lastActivityRef.current = now;
      
      try {
        const { error } = await supabase
          .from('lead_tracking')
          .update({
            last_activity: now.toISOString()
          })
          .eq('id', sessionRef.current);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    }
  };

  const trackPageView = async (path: string) => {
    if (!sessionRef.current) return;

    try {
      const { data: currentTracking, error: fetchError } = await supabase
        .from('lead_tracking')
        .select('page_views')
        .eq('id', sessionRef.current)
        .single();

      if (fetchError) throw fetchError;

      const updatedPageViews = Array.isArray(currentTracking?.page_views) 
        ? [...currentTracking.page_views] 
        : [];

      updatedPageViews.push({
        path,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
      });

      const { error: updateError } = await supabase
        .from('lead_tracking')
        .update({ page_views: updatedPageViews })
        .eq('id', sessionRef.current);

      if (updateError) throw updateError;
    } catch (error) {
      await handleError('track page view', error, () => trackPageView(path));
    }
  };

  const trackInteraction = async (type: string, metadata: any = {}) => {
    if (!sessionRef.current || !leadId) return;

    try {
      const { data: currentTracking, error: fetchError } = await supabase
        .from('lead_tracking')
        .select('interactions')
        .eq('id', sessionRef.current)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const updatedInteractions = Array.isArray(currentTracking?.interactions) 
        ? [...currentTracking.interactions] 
        : [];

      updatedInteractions.push({
        type,
        timestamp: new Date().toISOString(),
        metadata
      });

      const { error: updateError } = await supabase
        .from('lead_tracking')
        .update({ interactions: updatedInteractions })
        .eq('id', sessionRef.current);

      if (updateError) throw updateError;

      const { error: leadError } = await supabase
        .from('leads')
        .update({ 
          last_interaction: new Date().toISOString()
        })
        .eq('id', leadId);

      if (leadError) throw leadError;
    } catch (error) {
      await handleError('track interaction', error, () => trackInteraction(type, metadata));
    }
  };

  const endTracking = async () => {
    if (!sessionRef.current || !leadId) return;

    try {
      const sessionDuration = new Date().getTime() - startTimeRef.current.getTime();
      
      const { error: sessionError } = await supabase
        .from('lead_tracking')
        .update({
          session_end: new Date().toISOString(),
          session_duration: Math.floor(sessionDuration / 1000)
        })
        .eq('id', sessionRef.current);

      if (sessionError) throw sessionError;

      const { data: currentLead, error: leadError } = await supabase
        .from('leads')
        .select('total_time_spent')
        .eq('id', leadId)
        .maybeSingle();

      if (leadError) throw leadError;

      const currentTimeInSeconds = currentLead?.total_time_spent 
        ? parseInt(currentLead.total_time_spent.toString().split(' ')[0]) 
        : 0;
      
      const newTimeInSeconds = currentTimeInSeconds + Math.floor(sessionDuration / 1000);

      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          total_time_spent: `${newTimeInSeconds} seconds`
        })
        .eq('id', leadId);

      if (updateError) throw updateError;

    } catch (error) {
      await handleError('end tracking', error, endTracking);
    }
  };

  useEffect(() => {
    if (leadId) {
      startTracking();
    }

    const handleActivity = () => {
      updateActivity();
    };

    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keypress', handleActivity);
    document.addEventListener('scroll', handleActivity);
    document.addEventListener('click', handleActivity);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        endTracking();
      } else {
        startTracking();
      }
    };

    const handleBeforeUnload = () => {
      endTracking();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keypress', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endTracking();
    };
  }, [leadId]);

  return {
    trackPageView,
    trackInteraction
  };
};
