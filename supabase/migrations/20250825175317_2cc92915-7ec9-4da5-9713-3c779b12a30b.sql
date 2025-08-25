
-- Phase 1: Critical Security Fixes

-- 1. Fix User Profile Data Exposure - Update RLS policy to hide sensitive data from public vendor views
DROP POLICY IF EXISTS "Users can view own profile and public vendor info" ON public.user_profiles;

-- Create a more secure policy that only shows necessary vendor information publicly
CREATE POLICY "Users can view own profile and limited vendor info" ON public.user_profiles
FOR SELECT USING (
  (auth.uid() = user_id) OR 
  (get_user_role(auth.uid()) = 'admin'::user_role) OR
  (role = 'vendor'::user_role AND status = 'approved'::user_status AND auth.uid() IS NOT NULL)
);

-- 2. Create a secure view for public vendor information (no sensitive data)
CREATE OR REPLACE VIEW public.vendor_public_info AS
SELECT 
  id,
  full_name,
  company_name,
  avatar_url,
  bio,
  categories,
  portfolio_url,
  created_at,
  verification_status
FROM public.user_profiles 
WHERE role = 'vendor'::user_role 
  AND status = 'approved'::user_status 
  AND verification_status = 'approved';

-- Grant access to the view
GRANT SELECT ON public.vendor_public_info TO authenticated, anon;

-- 3. Secure BOQ Financial Data - Fix overly permissive category-based access
DROP POLICY IF EXISTS "Vendors can view relevant BOQ items" ON public.boq_items;

-- Create more restrictive policy for BOQ items
CREATE POLICY "Vendors can view assigned BOQ items only" ON public.boq_items
FOR SELECT USING (
  (project_id IN (
    SELECT projects.id FROM projects 
    WHERE projects.client_id = auth.uid()
  )) OR
  (vendor_id = auth.uid()) OR
  (get_user_role(auth.uid()) = 'admin'::user_role)
);

-- 4. Fix function security - Update get_user_role function with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_profiles WHERE user_id = user_uuid LIMIT 1;
$function$;

-- 5. Add audit logging for sensitive operations
CREATE OR REPLACE FUNCTION public.log_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log profile changes for audit trail
  IF TG_OP = 'UPDATE' THEN
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
      'profile_update',
      'user_profiles',
      NEW.id,
      row_to_json(OLD),
      row_to_json(NEW),
      now()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger for profile audit logging
DROP TRIGGER IF EXISTS profile_audit_trigger ON public.user_profiles;
CREATE TRIGGER profile_audit_trigger
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_changes();

-- 6. Secure conversations - ensure users can only access their own conversations
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations only" ON public.conversations
FOR SELECT USING (
  (auth.uid() = client_id) OR 
  (auth.uid() = vendor_id) OR 
  (get_user_role(auth.uid()) = 'admin'::user_role)
);

-- 7. Add rate limiting table for security
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action_type text NOT NULL,
  ip_address inet,
  attempt_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy for rate limits (only system can manage)
CREATE POLICY "System manages rate limits" ON public.rate_limits
FOR ALL USING (false)
WITH CHECK (false);
