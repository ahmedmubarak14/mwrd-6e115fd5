import { useActivityFeed } from './useActivityFeed';

export const useEngagementTracking = () => {
  const { addActivity } = useActivityFeed();

  const trackUserAction = async (action: string, metadata?: any) => {
    await addActivity({
      user_id: 'current-user',
      activity_type: action,
      description: `User performed: ${action}`,
      metadata
    });
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