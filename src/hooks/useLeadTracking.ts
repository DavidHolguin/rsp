import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import UAParser from 'ua-parser-js';

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

      // Update lead's total_visits
      await supabase.rpc('increment_lead_visits', { p_lead_id: leadId });

    } catch (error) {
      console.error('Error starting tracking:', error);
    }
  };

  const trackPageView = async (path: string) => {
    if (!sessionRef.current) return;

    try {
      const { error } = await supabase
        .from('lead_tracking')
        .update({
          page_views: supabase.sql`array_append(page_views, ${JSON.stringify({
            path,
            timestamp: new Date().toISOString(),
            referrer: document.referrer
          })})`
        })
        .eq('id', sessionRef.current);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const trackInteraction = async (type: string, metadata: any = {}) => {
    if (!sessionRef.current) return;

    try {
      const { error } = await supabase
        .from('lead_tracking')
        .update({
          interactions: supabase.sql`array_append(interactions, ${JSON.stringify({
            type,
            timestamp: new Date().toISOString(),
            metadata
          })})`
        })
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

      // Calculate and update total time spent
      const sessionDuration = new Date().getTime() - startTimeRef.current.getTime();
      await supabase.rpc('update_lead_time_spent', { 
        p_lead_id: leadId,
        p_duration: Math.floor(sessionDuration / 1000) // Convert to seconds
      });

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