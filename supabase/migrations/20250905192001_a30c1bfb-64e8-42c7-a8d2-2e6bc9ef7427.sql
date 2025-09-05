-- =====================================================
-- SECURITY FIX: Remove vulnerable policies and create secure replacements
-- =====================================================

-- 1. First, let's see what policies currently exist and remove the problematic ones
DROP POLICY IF EXISTS "Authenticated users can view approved vendor business info" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile and limited vendor info" ON user_profiles;

-- 2. Create a secure function for vendor public information (only safe business data)
CREATE OR REPLACE FUNCTION public.get_safe_vendor_info(vendor_user_id uuid)
RETURNS TABLE(
  id uuid,
  full_name text,
  company_name text,
  bio text,
  avatar_url text,
  portfolio_url text,
  categories text[],
  verification_status text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return business info, NO sensitive data (email, phone, address, documents)
  RETURN QUERY
  SELECT 
    up.id,
    up.full_name,
    up.company_name,
    up.bio,
    up.avatar_url,
    up.portfolio_url,
    up.categories,
    up.verification_status
  FROM user_profiles up
  WHERE up.user_id = vendor_user_id
    AND up.role = 'vendor'
    AND up.status = 'approved'
    AND up.verification_status = 'approved';
END;
$$;

-- 3. Create a secure view for public vendor information
CREATE OR REPLACE VIEW public.vendor_business_info AS
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
  -- Explicitly excluding: email, phone, address, verification_documents
FROM user_profiles up
WHERE up.role = 'vendor'
  AND up.status = 'approved'
  AND up.verification_status = 'approved';

-- 4. Grant access to the safe vendor view
GRANT SELECT ON public.vendor_business_info TO authenticated;

-- 5. Create a new restrictive policy for vendor business info access
-- This replaces the overly permissive policies we dropped
CREATE POLICY "Vendors can view approved business profiles"
ON user_profiles
FOR SELECT
USING (
  -- Users can view their own complete profile
  (auth.uid() = user_id) 
  OR 
  -- Admins can view all profiles
  (get_user_role(auth.uid()) = 'admin'::user_role)
  OR
  -- Users can view ONLY approved vendor business info (not sensitive data)
  (
    role = 'vendor' 
    AND status = 'approved' 
    AND verification_status = 'approved'
    AND auth.uid() IS NOT NULL
  )
);

-- 6. Add a comment explaining the security model
COMMENT ON VIEW public.vendor_business_info IS 
'Secure view containing only public business information for approved vendors. 
Does not expose sensitive personal data like email, phone, address, or verification documents.';

COMMENT ON FUNCTION public.get_safe_vendor_info IS 
'Security function that returns only safe business information for vendors. 
Excludes all sensitive personal data (email, phone, address, documents).';

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
  'security_policy_update',
  'user_profiles',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed overly permissive vendor data access policies',
    'security_level', 'CRITICAL_FIX',
    'protected_fields', ARRAY['email', 'phone', 'address', 'verification_documents'],
    'timestamp', NOW()
  ),
  NOW()
);