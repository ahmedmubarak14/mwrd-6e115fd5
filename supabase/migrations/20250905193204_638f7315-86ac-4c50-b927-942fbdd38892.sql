-- =====================================================
-- SECURITY FIX: Restrict access to customer email and personal data
-- =====================================================

-- Remove overly permissive policies that expose personal contact information
DROP POLICY IF EXISTS "Authenticated users can view vendor business info" ON public.user_profiles;
DROP POLICY IF EXISTS "Vendors can view approved business profiles" ON public.user_profiles;

-- Add secure policy that only allows viewing business information via the vendor_public_info table
-- Users should access vendor business info through vendor_public_info table, not user_profiles directly

-- Create a view that provides safe vendor business information without personal contact details
CREATE OR REPLACE VIEW public.safe_vendor_profiles AS
SELECT 
  vpi.id,
  vpi.full_name,
  vpi.company_name,
  vpi.bio,
  vpi.avatar_url,
  vpi.portfolio_url,
  vpi.categories,
  vpi.verification_status,
  vpi.created_at,
  vpi.updated_at
FROM public.vendor_public_info vpi
WHERE vpi.verification_status = 'approved';

-- Enable RLS on the view
ALTER VIEW public.safe_vendor_profiles SET (security_barrier = true);

-- Create policy for the safe vendor profiles view  
CREATE POLICY "Anyone can view safe vendor profiles"
ON public.vendor_public_info
FOR SELECT
USING (verification_status = 'approved');

-- Log this critical security fix
INSERT INTO public.audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  auth.uid(),
  'security_fix_email_protection',
  'user_profiles_policies',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed overly permissive policies exposing customer emails and personal data',
    'security_level', 'CRITICAL_FIX',
    'removed_policies', ARRAY[
      'Authenticated users can view vendor business info',
      'Vendors can view approved business profiles'
    ],
    'solution', 'Users now access vendor business info through vendor_public_info table only',
    'protected_fields', ARRAY['email', 'phone', 'address', 'verification_documents'],
    'timestamp', NOW()
  ),
  NOW()
);