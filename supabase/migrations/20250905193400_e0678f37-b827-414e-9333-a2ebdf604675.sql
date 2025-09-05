-- =====================================================
-- SECURITY FIX: Remove SECURITY DEFINER from get_vendor_business_info function
-- =====================================================

-- The get_vendor_business_info function returns table data with SECURITY DEFINER
-- This bypasses RLS policies and is flagged as a security risk
-- Remove SECURITY DEFINER and let RLS policies handle the security

CREATE OR REPLACE FUNCTION public.get_vendor_business_info()
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
STABLE -- Removed SECURITY DEFINER
SET search_path = public
AS $$
  -- Access vendor business info through the secure vendor_public_info table
  -- This table only contains safe business information, no personal contact details
  SELECT 
    id,
    full_name,
    company_name,
    bio,
    avatar_url,
    portfolio_url,
    categories,
    verification_status,
    created_at
  FROM public.vendor_public_info
  WHERE verification_status = 'approved';
$$;

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
  'security_fix_remove_definer_function',
  'get_vendor_business_info',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed SECURITY DEFINER from get_vendor_business_info function',
    'security_level', 'CRITICAL_FIX',
    'function_name', 'get_vendor_business_info',
    'approach', 'Function now accesses vendor_public_info table instead of user_profiles',
    'protected_data', 'email, phone, address, verification_documents no longer accessible',
    'timestamp', NOW()
  ),
  NOW()
);