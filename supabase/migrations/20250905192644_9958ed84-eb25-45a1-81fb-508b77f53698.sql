-- =====================================================
-- FIX: Remove SECURITY DEFINER from table-returning functions where possible
-- =====================================================

-- The linter flags table-returning functions with SECURITY DEFINER as "security definer views"
-- We'll remove SECURITY DEFINER from functions that can rely on RLS, 
-- but keep it for analytics functions that need elevated permissions

-- 1. Fix get_safe_user_display_info - remove SECURITY DEFINER, rely on RLS
CREATE OR REPLACE FUNCTION public.get_safe_user_display_info(target_user_id uuid)
RETURNS TABLE(display_name text, company_name text, avatar_url text)
LANGUAGE plpgsql
STABLE -- Removed SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return data if it's the user's own profile, admin, or approved vendor
  IF auth.uid() = target_user_id OR get_user_role(auth.uid()) = 'admin'::user_role THEN
    RETURN QUERY
    SELECT up.full_name, up.company_name, up.avatar_url
    FROM public.user_profiles up
    WHERE up.user_id = target_user_id;
  ELSIF EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.user_id = target_user_id 
      AND up.role = 'vendor' 
      AND up.status = 'approved'
      AND up.verification_status = 'approved'
  ) THEN
    RETURN QUERY
    SELECT up.full_name, up.company_name, up.avatar_url
    FROM public.user_profiles up
    WHERE up.user_id = target_user_id;
  END IF;
END;
$$;

-- 2. Fix get_safe_vendor_info - remove SECURITY DEFINER, rely on RLS  
CREATE OR REPLACE FUNCTION public.get_safe_vendor_info(vendor_user_id uuid)
RETURNS TABLE(id uuid, full_name text, company_name text, bio text, avatar_url text, portfolio_url text, categories text[], verification_status text)
LANGUAGE plpgsql
STABLE -- Removed SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return business info, NO sensitive data (email, phone, address, documents)
  RETURN QUERY
  SELECT 
    up.id,
    up.full_name,
    up.company_name,
    up.bio,
    up.avatar_url,
    up.portfolio_url,
    up.categories,
    up.verification_status
  FROM user_profiles up
  WHERE up.user_id = vendor_user_id
    AND up.role = 'vendor'
    AND up.status = 'approved'
    AND up.verification_status = 'approved';
END;
$$;

-- 3. Fix get_user_display_info - remove SECURITY DEFINER, rely on RLS
CREATE OR REPLACE FUNCTION public.get_user_display_info(user_profile_id uuid)
RETURNS TABLE(id uuid, display_name text, company_name text, avatar_url text, verification_status text)
LANGUAGE plpgsql
STABLE -- Removed SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.full_name as display_name,
    up.company_name,
    up.avatar_url,
    up.verification_status::TEXT
  FROM user_profiles up
  WHERE up.id = user_profile_id
    AND up.status = 'approved'
    AND (
      -- Only approved vendors or own profile or admin access
      (up.role = 'vendor' AND up.verification_status = 'approved')
      OR auth.uid() = up.user_id 
      OR get_user_role(auth.uid()) = 'admin'::user_role
    );
END;
$$;

-- 4. Fix get_vendor_public_info - remove SECURITY DEFINER, rely on RLS
CREATE OR REPLACE FUNCTION public.get_vendor_public_info(vendor_user_id uuid)
RETURNS TABLE(id uuid, full_name text, company_name text, bio text, avatar_url text, portfolio_url text, categories text[], verification_status text, created_at timestamp with time zone)
LANGUAGE plpgsql
STABLE -- Removed SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return data from the safe public table instead of user_profiles directly
  RETURN QUERY
  SELECT 
    vpi.id,
    vpi.full_name,
    vpi.company_name,
    vpi.bio,
    vpi.avatar_url,
    vpi.portfolio_url,
    vpi.categories,
    vpi.verification_status,
    vpi.created_at
  FROM vendor_public_info vpi
  JOIN user_profiles up ON vpi.id = up.id
  WHERE up.user_id = vendor_user_id
    AND vpi.verification_status = 'approved';
END;
$$;

-- 5. Log this security fix
INSERT INTO audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  auth.uid(),
  'security_fix_functions_definer',
  'functions',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed SECURITY DEFINER from user info functions',
    'security_level', 'ERROR_FIX',
    'functions_fixed', ARRAY[
      'get_safe_user_display_info',
      'get_safe_vendor_info', 
      'get_user_display_info',
      'get_vendor_public_info'
    ],
    'approach', 'Functions now rely on RLS policies for security instead of SECURITY DEFINER',
    'timestamp', NOW()
  ),
  NOW()
);