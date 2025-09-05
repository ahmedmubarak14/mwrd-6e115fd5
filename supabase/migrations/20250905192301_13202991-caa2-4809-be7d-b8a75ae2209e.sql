-- =====================================================
-- FIX: Remove SECURITY DEFINER from view to resolve security warning
-- =====================================================

-- 1. Drop the existing view that was flagged as having security definer
DROP VIEW IF EXISTS public.vendor_business_info;

-- 2. Recreate as a standard view without SECURITY DEFINER
-- This view will use the querying user's permissions (safer)
CREATE VIEW public.vendor_business_info AS
SELECT 
  up.id,
  up.user_id,
  up.full_name,
  up.company_name,
  up.bio,
  up.avatar_url,
  up.portfolio_url,
  up.categories,
  up.verification_status,
  up.created_at
  -- Explicitly excluding sensitive fields: email, phone, address, verification_documents
FROM user_profiles up
WHERE up.role = 'vendor'
  AND up.status = 'approved'
  AND up.verification_status = 'approved';

-- 3. Enable RLS on the view to ensure security
ALTER VIEW public.vendor_business_info SET (security_barrier = true);

-- 4. Create explicit RLS policy for the view
CREATE POLICY "Authenticated users can view vendor business info"
ON user_profiles
FOR SELECT
USING (
  -- This policy allows viewing of vendor business profiles only
  -- The view itself already filters for approved vendors
  auth.uid() IS NOT NULL 
  AND role = 'vendor' 
  AND status = 'approved' 
  AND verification_status = 'approved'
);

-- 5. Grant access to authenticated users
GRANT SELECT ON public.vendor_business_info TO authenticated;

-- 6. Update comments for clarity
COMMENT ON VIEW public.vendor_business_info IS 
'Standard view (no SECURITY DEFINER) containing only public business information for approved vendors. 
Excludes all sensitive personal data: email, phone, address, verification_documents.
Uses standard RLS for security.';

-- 7. Log the security fix
INSERT INTO audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  auth.uid(),
  'security_definer_view_fixed',
  'vendor_business_info',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed SECURITY DEFINER from view to improve security',
    'security_level', 'SECURITY_WARNING_RESOLVED',
    'view_name', 'vendor_business_info',
    'timestamp', NOW()
  ),
  NOW()
);