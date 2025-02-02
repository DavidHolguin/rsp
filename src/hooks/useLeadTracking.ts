import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UAParser } from 'ua-parser-js';
import { Json } from '@/integrations/supabase/types';

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
  const sessionRef = useRef<string | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const lastActivityRef = useRef<Date>(new Date());
  const isFirstVisitRef = useRef<boolean>(true);
  const retryAttemptsRef = useRef<number>(0);
  const MAX_RETRY_ATTEMPTS = 3;

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

  const startTracking = async () => {
    if (!leadId) return;

    try {
      // Check if this is actually the first visit
      const { data: existingLead, error: leadError } = await supabase
        .from('leads')
        .select('total_visits, created_at, last_interaction')
        .eq('id', leadId)
        .maybeSingle();

      if (leadError) {
        console.error('Error fetching lead:', leadError);
        if (retryAttemptsRef.current < MAX_RETRY_ATTEMPTS) {
          retryAttemptsRef.current++;
          setTimeout(startTracking, 1000 * retryAttemptsRef.current);
        }
        return;
      }

      const isFirstVisit = existingLead?.created_at === existingLead?.last_interaction;
      isFirstVisitRef.current = isFirstVisit;

      // Create new session
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

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        if (retryAttemptsRef.current < MAX_RETRY_ATTEMPTS) {
          retryAttemptsRef.current++;
          setTimeout(startTracking, 1000 * retryAttemptsRef.current);
        }
        return;
      }

      sessionRef.current = session.id;
      retryAttemptsRef.current = 0;

      // Only increment total_visits if it's a new session
      if (isFirstVisit || !existingLead?.total_visits) {
        await supabase
          .from('leads')
          .update({ 
            total_visits: 1,
            last_interaction: new Date().toISOString()
          })
          .eq('id', leadId);
      } else {
        // Check if last interaction was more than 30 minutes ago
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
      console.error('Error starting tracking:', error);
      if (retryAttemptsRef.current < MAX_RETRY_ATTEMPTS) {
        retryAttemptsRef.current++;
        setTimeout(startTracking, 1000 * retryAttemptsRef.current);
      }
    }
  };

  const updateActivity = async () => {
    if (!sessionRef.current || !leadId) return;

    const now = new Date();
    const timeSinceLastActivity = now.getTime() - lastActivityRef.current.getTime();
    
    // Solo actualizar si han pasado más de 5 segundos desde la última actividad
    if (timeSinceLastActivity > 5000) {
      lastActivityRef.current = now;
      
      try {
        await supabase
          .from('lead_tracking')
          .update({
            last_activity: now.toISOString()
          })
          .eq('id', sessionRef.current);
      } catch (error) {
        console.error('Error updating activity:', error);
      }
    }
  };

  const trackPageView = async (path: string) => {
    if (!sessionRef.current) return;

    try {
      const { data: currentTracking } = await supabase
        .from('lead_tracking')
        .select('page_views')
        .eq('id', sessionRef.current)
        .single();

      const updatedPageViews = Array.isArray(currentTracking?.page_views) 
        ? [...currentTracking.page_views] 
        : [];

      updatedPageViews.push({
        path,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
      });

      await supabase
        .from('lead_tracking')
        .update({ page_views: updatedPageViews })
        .eq('id', sessionRef.current);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const trackInteraction = async (type: string, metadata: any = {}) => {
    if (!sessionRef.current || !leadId) return;

    try {
      const { data: currentTracking, error: trackingError } = await supabase
        .from('lead_tracking')
        .select('interactions')
        .eq('id', sessionRef.current)
        .maybeSingle();

      if (trackingError) {
        console.error('Error fetching tracking:', trackingError);
        return;
      }

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

      if (updateError) {
        console.error('Error updating interactions:', updateError);
        return;
      }

      // Update last_interaction in leads
      const { error: leadError } = await supabase
        .from('leads')
        .update({ 
          last_interaction: new Date().toISOString()
        })
        .eq('id', leadId);

      if (leadError) {
        console.error('Error updating lead:', leadError);
      }

    } catch (error) {
      console.error('Error tracking interaction:', error);
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
          session_duration: Math.floor(sessionDuration / 1000) // Convert to seconds
        })
        .eq('id', sessionRef.current);

      if (sessionError) {
        console.error('Error updating session:', sessionError);
        return;
      }

      // Update total time in leads
      const { data: currentLead, error: leadError } = await supabase
        .from('leads')
        .select('total_time_spent')
        .eq('id', leadId)
        .maybeSingle();

      if (leadError) {
        console.error('Error fetching lead time:', leadError);
        return;
      }

      // Parse the interval string to get seconds
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

      if (updateError) {
        console.error('Error updating total time:', updateError);
      }

    } catch (error) {
      console.error('Error ending tracking:', error);
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
