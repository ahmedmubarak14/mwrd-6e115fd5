
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useEngagementTracking = () => {
  const { user } = useAuth();

  const trackUserAction = async (action: string, metadata?: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activity_feed')
        .insert({
          user_id: user.id,
          activity_type: action,
          description: `User performed: ${action}`,
          title: action.replace('_', ' ').toUpperCase(),
          metadata
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  const trackPageView = async (page: string) => {
    await trackUserAction('page_view', { page });
  };

  const trackFeatureUsage = async (feature: string) => {
    await trackUserAction('feature_usage', { feature });
  };

  const trackOfferInteraction = async (offerId: string, action: string) => {
    await trackUserAction('offer_interaction', { offerId, action });
  };

  const trackRequestInteraction = async (requestId: string, action: string) => {
    await trackUserAction('request_interaction', { requestId, action });
  };

  return {
    trackUserAction,
    trackPageView,
    trackFeatureUsage,
    trackOfferInteraction,
    trackRequestInteraction
  };
};
