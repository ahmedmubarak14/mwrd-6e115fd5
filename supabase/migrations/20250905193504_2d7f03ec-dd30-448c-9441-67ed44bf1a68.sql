-- =====================================================
-- FINAL SECURITY FIX: Remove SECURITY DEFINER from get_vendor_business_info
-- =====================================================

-- The linter is flagging our new function as having SECURITY DEFINER
-- Remove it and ensure security through existing RLS policies and safe functions

-- Replace the SECURITY DEFINER function with a cleaner approach
CREATE OR REPLACE FUNCTION public.get_vendor_business_info(vendor_user_id uuid)
RETURNS TABLE(
  id uuid,
  full_name text,
  company_name text,
  bio text,
  avatar_url text,
  portfolio_url text,
  categories text[],
  verification_status text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE  -- Removed SECURITY DEFINER
SET search_path = public
AS $$
  -- Use the existing vendor_public_info table which already has proper security
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
  WHERE up.user_id = vendor_user_id;
$$;

-- Log this final security cleanup
INSERT INTO audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  auth.uid(),
  'final_security_cleanup_definer',
  'get_vendor_business_info',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed SECURITY DEFINER from get_vendor_business_info function',
    'security_level', 'LINTER_COMPLIANCE',
    'approach', 'Function now uses vendor_public_info table directly',
    'benefit', 'Eliminates linter warning while maintaining security',
    'security_model', 'Relies on existing vendor_public_info table RLS policies',
    'timestamp', NOW()
  ),
  NOW()
);