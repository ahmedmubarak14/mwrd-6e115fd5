
-- Phase 1: Fix Critical RLS Policies

-- 1. Fix user_profiles table RLS - currently allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;

-- Create more restrictive policy for viewing profiles
CREATE POLICY "Users can view own profile and public vendor info" 
ON public.user_profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (role = 'vendor' AND status = 'approved') OR 
  get_user_role(auth.uid()) = 'admin'
);

-- 2. Fix offers table RLS - currently allows viewing all offers
DROP POLICY IF EXISTS "Users can view all offers" ON public.offers;

-- Create restrictive policy for offers
CREATE POLICY "Users can view relevant offers only" 
ON public.offers 
FOR SELECT 
USING (
  auth.uid() = vendor_id OR 
  request_id IN (
    SELECT id FROM requests WHERE client_id = auth.uid()
  ) OR 
  get_user_role(auth.uid()) = 'admin'
);

-- 3. Fix requests table RLS - currently allows viewing all requests  
DROP POLICY IF EXISTS "Users can view all requests" ON public.requests;

-- Create restrictive policy for requests
CREATE POLICY "Users can view relevant requests only" 
ON public.requests 
FOR SELECT 
USING (
  auth.uid() = client_id OR 
  auth.uid() = vendor_id OR 
  get_user_role(auth.uid()) = 'admin' OR
  (admin_approval_status = 'approved' AND get_user_role(auth.uid()) = 'vendor')
);

-- Phase 2: Fix Database Function Security

-- Fix get_user_role function to prevent search path manipulation
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_profiles WHERE user_id = user_uuid;
$function$;

-- Fix get_user_statistics function
CREATE OR REPLACE FUNCTION public.get_user_statistics()
RETURNS TABLE(total_users bigint, total_clients bigint, total_vendors bigint, total_admins bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE role = 'client')::bigint as total_clients,
    COUNT(*) FILTER (WHERE role = 'vendor')::bigint as total_vendors,
    COUNT(*) FILTER (WHERE role = 'admin')::bigint as total_admins
  FROM public.user_profiles;
$function$;

-- Fix get_platform_statistics function
CREATE OR REPLACE FUNCTION public.get_platform_statistics()
RETURNS TABLE(total_users bigint, total_clients bigint, total_vendors bigint, total_admins bigint, total_requests bigint, total_offers bigint, total_orders bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE role = 'client')::bigint as total_clients,
    COUNT(*) FILTER (WHERE role = 'vendor')::bigint as total_vendors,
    COUNT(*) FILTER (WHERE role = 'admin')::bigint as total_admins,
    (SELECT COUNT(*)::bigint FROM public.requests) as total_requests,
    (SELECT COUNT(*)::bigint FROM public.offers) as total_offers,
    (SELECT COUNT(*)::bigint FROM public.orders) as total_orders
  FROM public.user_profiles;
$function$;

-- Fix get_analytics_data function
CREATE OR REPLACE FUNCTION public.get_analytics_data()
RETURNS TABLE(total_users bigint, total_requests bigint, total_offers bigint, total_orders bigint, active_users bigint, total_revenue numeric, success_rate numeric)
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

-- Phase 3: Secure expert_consultations table (currently allows public insertion)
ALTER TABLE public.expert_consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert consultations" ON public.expert_consultations;

-- Only allow authenticated users or specific public forms to insert consultations
CREATE POLICY "Authenticated users can insert consultations" 
ON public.expert_consultations 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL OR 
  (user_id IS NULL AND email IS NOT NULL AND full_name IS NOT NULL)
);

-- Add audit logging for sensitive operations
CREATE OR REPLACE FUNCTION public.log_sensitive_operation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    created_at
  )
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Add audit triggers for sensitive tables
DROP TRIGGER IF EXISTS audit_user_profiles_trigger ON public.user_profiles;
CREATE TRIGGER audit_user_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_operation();

DROP TRIGGER IF EXISTS audit_offers_trigger ON public.offers;  
CREATE TRIGGER audit_offers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_operation();

DROP TRIGGER IF EXISTS audit_requests_trigger ON public.requests;
CREATE TRIGGER audit_requests_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.requests  
  FOR EACH ROW EXECUTE FUNCTION log_sensitive_operation();
