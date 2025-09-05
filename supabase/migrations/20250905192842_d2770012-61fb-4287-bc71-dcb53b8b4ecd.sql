-- =====================================================
-- FINAL FIX: Remove SECURITY DEFINER from get_current_user_profile
-- =====================================================

-- The get_current_user_profile function returns SETOF user_profiles with SECURITY DEFINER
-- This is being flagged by the linter as a "security definer view"
-- We'll remove SECURITY DEFINER and rely on RLS policies instead

CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS SETOF user_profiles
LANGUAGE sql
STABLE -- Removed SECURITY DEFINER
SET search_path = public
AS $$
  -- Return user's own profile - RLS policies will enforce security
  SELECT * FROM public.user_profiles WHERE user_id = auth.uid();
$$;

-- Log this final security fix
INSERT INTO audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  auth.uid(),
  'security_fix_final_definer',
  'get_current_user_profile',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed SECURITY DEFINER from get_current_user_profile function',
    'security_level', 'ERROR_FIX',
    'function_name', 'get_current_user_profile',
    'approach', 'Function now relies on RLS policies for security enforcement',
    'return_type', 'SETOF user_profiles',
    'timestamp', NOW()
  ),
  NOW()
);