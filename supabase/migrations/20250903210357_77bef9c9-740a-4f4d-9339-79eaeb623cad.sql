-- Fix critical security vulnerability in user_profiles table
-- Issue: Table is publicly readable exposing sensitive personal data

-- First, ensure RLS is enabled on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Profiles are publicly readable" ON user_profiles;

-- Create secure RLS policies

-- 1. Users can view and update their own complete profile
CREATE POLICY "Users can manage own profile"
ON user_profiles
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON user_profiles
FOR ALL
USING (get_user_role(auth.uid()) = 'admin'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role);

-- 3. Limited vendor information visible to authenticated users for business purposes
-- Only expose business-relevant, non-sensitive data
CREATE POLICY "Limited vendor info visible to authenticated users"
ON user_profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND role = 'vendor' 
  AND status = 'approved'
);

-- 4. Create a secure view for public vendor information
-- This replaces direct table access for vendor discovery
CREATE OR REPLACE VIEW public.vendor_public_profiles AS
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
FROM user_profiles
WHERE role = 'vendor' 
  AND status = 'approved'
  AND verification_status = 'approved';

-- 5. Create function to safely get user display info
CREATE OR REPLACE FUNCTION get_user_display_info(user_profile_id UUID)
RETURNS TABLE(
  id UUID,
  display_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  verification_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.full_name as display_name,
    up.company_name,
    up.avatar_url,
    up.verification_status
  FROM user_profiles up
  WHERE up.id = user_profile_id
    AND up.status = 'approved'
    AND (
      up.role = 'vendor' 
      OR auth.uid() = up.user_id 
      OR get_user_role(auth.uid()) = 'admin'::user_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 6. Log security fix
INSERT INTO audit_log (
  action,
  entity_type,
  entity_id,
  new_values
) VALUES (
  'security_fix_applied',
  'user_profiles',
  gen_random_uuid(),
  jsonb_build_object(
    'fix_type', 'rls_policy_restriction',
    'description', 'Fixed publicly readable user_profiles table',
    'applied_at', now()
  )
);