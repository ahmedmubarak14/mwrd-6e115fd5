-- Create activity_feed table for tracking user actions
CREATE TABLE public.activity_feed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  title TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- Create policies for activity_feed
CREATE POLICY "Users can view their own activities" 
ON public.activity_feed 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activities" 
ON public.activity_feed 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "System can insert activities" 
ON public.activity_feed 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_activity_feed_updated_at
BEFORE UPDATE ON public.activity_feed
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create analytics function for real-time data
CREATE OR REPLACE FUNCTION public.get_analytics_data()
RETURNS TABLE(
  total_users BIGINT,
  total_requests BIGINT,
  total_offers BIGINT,
  total_orders BIGINT,
  active_users BIGINT,
  total_revenue NUMERIC,
  success_rate NUMERIC
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    (SELECT COUNT(*) FROM public.user_profiles) as total_users,
    (SELECT COUNT(*) FROM public.requests) as total_requests,
    (SELECT COUNT(*) FROM public.offers) as total_offers,
    (SELECT COUNT(*) FROM public.orders) as total_orders,
    (SELECT COUNT(*) FROM public.user_profiles WHERE updated_at > now() - interval '30 days') as active_users,
    (SELECT COALESCE(SUM(amount), 0) FROM public.financial_transactions WHERE status = 'completed') as total_revenue,
    (SELECT 
      CASE 
        WHEN COUNT(*) > 0 THEN 
          ROUND((COUNT(*) FILTER (WHERE status = 'completed')::numeric / COUNT(*)::numeric) * 100, 2)
        ELSE 0 
      END 
     FROM public.orders) as success_rate;
$function$;