-- CRITICAL SECURITY FIX: Remove public access to user_profiles table
-- Drop the dangerous policy that exposes ALL columns including PII
DROP POLICY IF EXISTS "Public can view safe vendor business info" ON public.user_profiles;

-- Ensure vendor_public_info table has proper public access
-- This table only contains safe business information (no email, phone, address, bank details)
DROP POLICY IF EXISTS "public_can_view_approved_vendors" ON public.vendor_public_info;

CREATE POLICY "public_can_view_approved_vendors"
ON public.vendor_public_info
FOR SELECT
TO public
USING (verification_status = 'approved');

-- Add helpful comment
COMMENT ON TABLE public.vendor_public_info IS 'Public-safe vendor business information only. Use this table for public vendor listings. Never expose user_profiles table publicly as it contains PII.';

-- Log this security fix
INSERT INTO public.audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  reason,
  created_at
) VALUES (
  NULL,
  'SECURITY_FIX_PUBLIC_PII_EXPOSURE',
  'user_profiles',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Dropped public SELECT policy on user_profiles',
    'reason', 'Policy exposed sensitive PII (email, phone, address, bank details) to unauthenticated users',
    'fix', 'Public vendor listings now use vendor_public_info table with only safe business data',
    'timestamp', NOW()
  ),
  'CRITICAL: Removed public access to PII in user_profiles table',
  NOW()
);