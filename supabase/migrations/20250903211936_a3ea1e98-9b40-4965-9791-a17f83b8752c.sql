-- Complete vendor_public_info security fix
-- This table still allows public access which is a security risk

-- Drop the current policy that allows public access
DROP POLICY IF EXISTS "Authenticated users can view approved vendors only" ON vendor_public_info;

-- Create a more restrictive policy - vendors should only be visible to authenticated users
-- and only when they are approved vendors
CREATE POLICY "Authenticated users can view approved vendor public info" 
ON vendor_public_info 
FOR SELECT 
TO authenticated
USING (verification_status = 'approved');

-- Ensure vendors can update their own public info
CREATE POLICY "Vendors can update own public info" 
ON vendor_public_info 
FOR UPDATE 
TO authenticated
USING (id IN (
  SELECT up.id 
  FROM user_profiles up 
  WHERE up.user_id = auth.uid() 
  AND up.role = 'vendor'
));

-- Allow admins full access
CREATE POLICY "Admins can manage all vendor public info" 
ON vendor_public_info 
FOR ALL 
TO authenticated
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Log final security completion
SELECT log_security_event(
  'vendor_public_info_fully_secured',
  jsonb_build_object(
    'access_level', 'authenticated_only',
    'approved_vendors_only', true,
    'public_access_removed', true,
    'competitive_intelligence_protected', true,
    'timestamp', NOW()
  )
);