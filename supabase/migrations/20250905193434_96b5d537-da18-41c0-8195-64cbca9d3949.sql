-- =====================================================
-- SECURITY FIX: Remove remaining vendor_business_info view
-- =====================================================

-- There's still a vendor_business_info VIEW that needs to be removed
-- This view was accessing user_profiles table directly
DROP VIEW IF EXISTS public.vendor_business_info CASCADE;

-- Log this final security cleanup
INSERT INTO public.audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  auth.uid(),
  'security_fix_final_view_cleanup',
  'vendor_business_info_view',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed remaining vendor_business_info view',
    'security_level', 'CRITICAL_FIX',
    'reason', 'View was directly accessing user_profiles with sensitive data',
    'replacement', 'Use vendor_public_info table or get_safe_vendor_info function',
    'timestamp', NOW()
  ),
  NOW()
);