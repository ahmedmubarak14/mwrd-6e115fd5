-- =====================================================  
-- SECURITY FIX: Remove problematic vendor_business_info view
-- =====================================================

-- The vendor_business_info view directly accesses user_profiles table 
-- which contains sensitive data and bypasses our security model
-- Remove it and ensure all vendor business info access goes through vendor_public_info

DROP VIEW IF EXISTS public.vendor_business_info;

-- Log the security fix
INSERT INTO public.audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  auth.uid(),
  'security_fix_remove_unsafe_view',
  'vendor_business_info_view',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed vendor_business_info view that exposed user_profiles data',
    'security_level', 'CRITICAL_FIX',
    'reason', 'View provided direct access to user_profiles bypassing security model',
    'replacement', 'Use vendor_public_info table or safe_vendor_profiles view instead',
    'timestamp', NOW()
  ),
  NOW()
);