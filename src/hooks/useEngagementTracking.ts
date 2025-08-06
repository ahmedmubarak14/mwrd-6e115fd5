import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface EngagementEvent {
  user_id: string;
  event_type: 'page_view' | 'button_click' | 'form_submit' | 'search' | 'chat_start' | 'profile_update';
  event_data: Record<string, any>;
  timestamp: string;
}

export const useEngagementTracking = () => {
  const { user } = useAuth();

  const trackEvent = useCallback(async (
    eventType: EngagementEvent['event_type'],
    eventData: Record<string, any> = {}
  ) => {
    if (!user) return;

    try {
      // For now, we'll log to console. In production, you'd send to analytics service
      console.log('📊 Engagement Event:', {
        user_id: user.id,
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      });

      // Optional: Store in Supabase for basic analytics
      // await supabase.from('user_engagement').insert({
      //   user_id: user.id,
      //   event_type: eventType,
      //   event_data: eventData,
      //   page_url: window.location.pathname
      // });
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  }, [user]);

  const trackPageView = useCallback((pageName?: string) => {
    trackEvent('page_view', {
      page: pageName || window.location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent
    });
  }, [trackEvent]);

  const trackButtonClick = useCallback((buttonName: string, context?: string) => {
    trackEvent('button_click', {
      button_name: buttonName,
      context,
      page: window.location.pathname
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, success: boolean) => {
    trackEvent('form_submit', {
      form_name: formName,
      success,
      page: window.location.pathname
    });
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, resultsCount?: number) => {
    trackEvent('search', {
      query,
      results_count: resultsCount,
      page: window.location.pathname
    });
  }, [trackEvent]);

  const trackChatStart = useCallback((supplierId?: string, context?: string) => {
    trackEvent('chat_start', {
      supplier_id: supplierId,
      context,
      page: window.location.pathname
    });
  }, [trackEvent]);

  // Auto-track page views
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return {
    trackEvent,
    trackPageView,
    trackButtonClick,
    trackFormSubmit,
    trackSearch,
    trackChatStart
  };
};