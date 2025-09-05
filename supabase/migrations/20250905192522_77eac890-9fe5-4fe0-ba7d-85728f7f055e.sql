-- =====================================================
-- FIX: Remove security definer properties from views (corrected approach)
-- =====================================================

-- 1. Drop the existing vendor_business_info view to remove any security definer properties
DROP VIEW IF EXISTS public.vendor_business_info;

-- 2. Recreate the view as a standard view (no security definer, no RLS needed - RLS comes from underlying table)
CREATE VIEW public.vendor_business_info AS
SELECT 
  id,
  user_id,
  full_name,
  company_name,
  bio,
  avatar_url,
  portfolio_url,
  categories,
  verification_status,
  created_at
FROM user_profiles 
WHERE role = 'vendor'
  AND status = 'approved'
  AND verification_status = 'approved';

-- 3. Grant SELECT access to authenticated users (standard view permissions)
GRANT SELECT ON public.vendor_business_info TO authenticated;

-- 4. Add security comment explaining the approach
COMMENT ON VIEW public.vendor_business_info IS 
'Public view of approved vendor business information. Security is enforced through RLS policies on the underlying user_profiles table.';

-- 5. Log this security fix in audit log
INSERT INTO audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  auth.uid(),
  'security_fix_view_definer',
  'vendor_business_info',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed SECURITY DEFINER from vendor_business_info view',
    'security_level', 'ERROR_FIX',
    'approach', 'Standard view with RLS enforcement from underlying table',
    'timestamp', NOW()
  ),
  NOW()
);