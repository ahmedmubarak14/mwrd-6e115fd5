-- Enhanced subscription management tables
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  currency TEXT DEFAULT 'SAR',
  features JSONB DEFAULT '[]',
  max_users INTEGER,
  max_projects INTEGER,
  max_storage_gb INTEGER,
  is_active BOOLEAN DEFAULT true,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced subscription tracking
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id),
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due', 'trialing')),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform analytics and metrics
CREATE TABLE public.platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_type TEXT DEFAULT 'counter' CHECK (metric_type IN ('counter', 'gauge', 'histogram')),
  dimensions JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System activity logs
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial transactions
CREATE TABLE public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subscription_id UUID REFERENCES public.user_subscriptions(id),
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  transaction_type TEXT DEFAULT 'payment' CHECK (transaction_type IN ('payment', 'refund', 'chargeback')),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced notifications with categories
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general' CHECK (category IN ('general', 'system', 'billing', 'security', 'marketing')),
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS action_url TEXT,
ADD COLUMN IF NOT EXISTS action_label TEXT;

-- Enable RLS on new tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans
CREATE POLICY "Anyone can view active plans" ON public.subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage plans" ON public.subscription_plans
  FOR ALL USING (is_admin());

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can manage all subscriptions" ON public.user_subscriptions
  FOR ALL USING (is_admin());

-- RLS Policies for platform_analytics
CREATE POLICY "Admins can manage analytics" ON public.platform_analytics
  FOR ALL USING (is_admin());

-- RLS Policies for activity_logs
CREATE POLICY "Users can view own activity" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "System can insert logs" ON public.activity_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all logs" ON public.activity_logs
  FOR SELECT USING (is_admin());

-- RLS Policies for financial_transactions
CREATE POLICY "Users can view own transactions" ON public.financial_transactions
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "System can create transactions" ON public.financial_transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all transactions" ON public.financial_transactions
  FOR ALL USING (is_admin());

-- Create default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, max_users, max_projects, max_storage_gb) VALUES
('Free', 'Basic plan for getting started', 0, 0, '["Basic support", "5 projects", "1GB storage"]', 1, 5, 1),
('Pro', 'Professional plan for growing businesses', 29.99, 299.99, '["Priority support", "Unlimited projects", "50GB storage", "Advanced analytics"]', 10, -1, 50),
('Enterprise', 'Enterprise plan for large organizations', 99.99, 999.99, '["24/7 dedicated support", "Unlimited everything", "500GB storage", "Custom integrations", "SLA guarantee"]', -1, -1, 500);

-- Create triggers for updated_at columns
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get comprehensive platform statistics
CREATE OR REPLACE FUNCTION public.get_platform_statistics()
RETURNS TABLE(
  total_users BIGINT,
  active_subscriptions BIGINT,
  monthly_revenue NUMERIC,
  total_requests BIGINT,
  total_offers BIGINT,
  total_transactions BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.user_profiles) as total_users,
    (SELECT COUNT(*) FROM public.user_subscriptions WHERE status = 'active') as active_subscriptions,
    (SELECT COALESCE(SUM(amount), 0) FROM public.financial_transactions 
     WHERE status = 'succeeded' AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())) as monthly_revenue,
    (SELECT COUNT(*) FROM public.requests) as total_requests,
    (SELECT COUNT(*) FROM public.offers) as total_offers,
    (SELECT COUNT(*) FROM public.financial_transactions) as total_transactions;
END;
$$;