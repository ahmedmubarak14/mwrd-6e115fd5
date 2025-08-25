
-- Create support tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add support fields to conversations table
ALTER TABLE public.conversations 
ADD COLUMN conversation_type TEXT DEFAULT 'business',
ADD COLUMN support_ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE;

-- Enable RLS on support_tickets
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS policies for support_tickets
CREATE POLICY "Users can view own support tickets" 
  ON public.support_tickets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own support tickets" 
  ON public.support_tickets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own support tickets" 
  ON public.support_tickets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all support tickets" 
  ON public.support_tickets 
  FOR ALL 
  USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create enhanced growth statistics function
CREATE OR REPLACE FUNCTION public.get_growth_statistics()
RETURNS TABLE(
  total_users bigint,
  total_clients bigint, 
  total_vendors bigint,
  total_admins bigint,
  total_requests bigint,
  total_offers bigint,
  total_orders bigint,
  total_revenue numeric,
  total_transactions bigint,
  active_subscriptions bigint,
  users_growth numeric,
  requests_growth numeric,
  offers_growth numeric,
  revenue_growth numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH current_stats AS (
    SELECT 
      COUNT(*)::bigint as curr_users,
      COUNT(*) FILTER (WHERE role = 'client')::bigint as curr_clients,
      COUNT(*) FILTER (WHERE role = 'vendor')::bigint as curr_vendors,
      COUNT(*) FILTER (WHERE role = 'admin')::bigint as curr_admins
    FROM public.user_profiles
  ),
  previous_stats AS (
    SELECT 
      COUNT(*)::bigint as prev_users,
      COUNT(*) FILTER (WHERE role = 'client')::bigint as prev_clients,
      COUNT(*) FILTER (WHERE role = 'vendor')::bigint as prev_vendors,
      COUNT(*) FILTER (WHERE role = 'admin')::bigint as prev_admins
    FROM public.user_profiles
    WHERE created_at < date_trunc('month', CURRENT_DATE)
  ),
  request_stats AS (
    SELECT 
      COUNT(*)::bigint as curr_requests,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE))::bigint as curr_month_requests,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                      AND created_at < date_trunc('month', CURRENT_DATE))::bigint as prev_month_requests
    FROM public.requests
  ),
  offer_stats AS (
    SELECT 
      COUNT(*)::bigint as curr_offers,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE))::bigint as curr_month_offers,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                      AND created_at < date_trunc('month', CURRENT_DATE))::bigint as prev_month_offers
    FROM public.offers
  ),
  financial_stats AS (
    SELECT 
      COUNT(*)::bigint as total_trans,
      COALESCE(SUM(amount), 0) as total_rev,
      COALESCE(SUM(amount) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE)), 0) as curr_month_rev,
      COALESCE(SUM(amount) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                                  AND created_at < date_trunc('month', CURRENT_DATE)), 0) as prev_month_rev
    FROM public.financial_transactions
    WHERE status = 'completed'
  ),
  subscription_stats AS (
    SELECT COUNT(*) FILTER (WHERE subscription_status = 'active')::bigint as active_subs
    FROM public.user_profiles
  )
  SELECT 
    cs.curr_users,
    cs.curr_clients,
    cs.curr_vendors, 
    cs.curr_admins,
    rs.curr_requests,
    os.curr_offers,
    (SELECT COUNT(*)::bigint FROM public.orders) as curr_orders,
    fs.total_rev,
    fs.total_trans,
    ss.active_subs,
    CASE 
      WHEN ps.prev_users > 0 THEN ROUND(((cs.curr_users - ps.prev_users)::numeric / ps.prev_users::numeric) * 100, 2)
      ELSE 0
    END as users_growth,
    CASE 
      WHEN rs.prev_month_requests > 0 THEN ROUND(((rs.curr_month_requests - rs.prev_month_requests)::numeric / rs.prev_month_requests::numeric) * 100, 2)
      ELSE 0
    END as requests_growth,
    CASE 
      WHEN os.prev_month_offers > 0 THEN ROUND(((os.curr_month_offers - os.prev_month_offers)::numeric / os.prev_month_offers::numeric) * 100, 2)
      ELSE 0
    END as offers_growth,
    CASE 
      WHEN fs.prev_month_rev > 0 THEN ROUND(((fs.curr_month_rev - fs.prev_month_rev)::numeric / fs.prev_month_rev::numeric) * 100, 2)
      ELSE 0
    END as revenue_growth
  FROM current_stats cs, previous_stats ps, request_stats rs, offer_stats os, financial_stats fs, subscription_stats ss;
$function$;

-- Add sample financial transactions for demonstration
INSERT INTO public.financial_transactions (user_id, type, amount, status, description, created_at) 
SELECT 
  user_id,
  'subscription',
  CASE 
    WHEN subscription_plan = 'premium' THEN 99.00
    WHEN subscription_plan = 'business' THEN 199.00
    ELSE 29.00
  END,
  'completed',
  'Monthly subscription payment',
  created_at + INTERVAL '1 day'
FROM public.user_profiles 
WHERE subscription_status = 'active'
ON CONFLICT DO NOTHING;

-- Add update trigger for support_tickets
CREATE TRIGGER update_support_tickets_updated_at 
  BEFORE UPDATE ON public.support_tickets 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
