-- =====================================================
-- FIX: Remove any security definer properties from views
-- =====================================================

-- 1. Drop the existing vendor_business_info view to remove any security definer properties
DROP VIEW IF EXISTS public.vendor_business_info;

-- 2. Recreate the view as a standard view (no security definer)
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

-- 3. Enable RLS on the view (this is the secure approach)
ALTER VIEW public.vendor_business_info ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policy for the view (authenticated users can view approved vendor info)
CREATE POLICY "Authenticated users can view approved vendor business info"
ON public.vendor_business_info
FOR SELECT
USING (true); -- View already filters to approved vendors only

-- 5. Grant SELECT access to authenticated users
GRANT SELECT ON public.vendor_business_info TO authenticated;

-- 6. Add security comment
COMMENT ON VIEW public.vendor_business_info IS 
'Public view of approved vendor business information. Uses RLS instead of SECURITY DEFINER for proper security isolation.';

-- 7. Log this security fix
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
    'approach', 'Replaced with RLS policy for proper security isolation',
    'timestamp', NOW()
  ),
  NOW()
);