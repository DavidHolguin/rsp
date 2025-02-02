import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UAParser } from 'ua-parser-js';

export const useLeadTracking = (leadId: string | null) => {
  const sessionRef = useRef<string | null>(null);
  const startTimeRef = useRef<Date>(new Date());

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
      // Create new session
      const { data: session, error } = await supabase
        .from('lead_tracking')
        .insert({
          lead_id: leadId,
          session_start: new Date().toISOString(),
          page_views: [{
            path: window.location.pathname,
            timestamp: new Date().toISOString(),
            referrer: document.referrer
          }],
          interactions: [],
          metadata: {
            ...getDeviceInfo(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            windowSize: `${window.innerWidth}x${window.innerHeight}`,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        })
        .select('id')
        .single();

      if (error) throw error;
      sessionRef.current = session.id;

      // Incrementar total_visits directamente
      const { data: currentLead } = await supabase
        .from('leads')
        .select('total_visits')
        .eq('id', leadId)
        .single();

      await supabase
        .from('leads')
        .update({ 
          total_visits: (currentLead?.total_visits || 0) + 1 
        })
        .eq('id', leadId);

    } catch (error) {
      console.error('Error starting tracking:', error);
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

      const { error } = await supabase
        .from('lead_tracking')
        .update({ page_views: updatedPageViews })
        .eq('id', sessionRef.current);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const trackInteraction = async (type: string, metadata: any = {}) => {
    if (!sessionRef.current) return;

    try {
      const { data: currentTracking } = await supabase
        .from('lead_tracking')
        .select('interactions')
        .eq('id', sessionRef.current)
        .single();

      const updatedInteractions = Array.isArray(currentTracking?.interactions) 
        ? [...currentTracking.interactions] 
        : [];

      updatedInteractions.push({
        type,
        timestamp: new Date().toISOString(),
        metadata
      });

      const { error } = await supabase
        .from('lead_tracking')
        .update({ interactions: updatedInteractions })
        .eq('id', sessionRef.current);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const endTracking = async () => {
    if (!sessionRef.current || !leadId) return;

    try {
      // Update session end time
      const { error } = await supabase
        .from('lead_tracking')
        .update({
          session_end: new Date().toISOString()
        })
        .eq('id', sessionRef.current);

      if (error) throw error;

      // Calculate session duration
      const sessionDuration = new Date().getTime() - startTimeRef.current.getTime();
      
      // Convert milliseconds to interval string (PostgreSQL format)
      const intervalStr = `${Math.floor(sessionDuration / 1000)} seconds`;
      
      const { data: currentLead } = await supabase
        .from('leads')
        .select('total_time_spent')
        .eq('id', leadId)
        .single();

      await supabase
        .from('leads')
        .update({ 
          total_time_spent: currentLead?.total_time_spent || '0 seconds'
        })
        .eq('id', leadId);

    } catch (error) {
      console.error('Error ending tracking:', error);
    }
  };

  useEffect(() => {
    if (leadId) {
      startTracking();
    }

    // Setup page visibility change handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        endTracking();
      } else {
        startTracking();
      }
    };

    // Setup beforeunload handler
    const handleBeforeUnload = () => {
      endTracking();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
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