-- Fix vendor_public_info security - handle existing policies properly

-- First check current policies and drop them
DROP POLICY IF EXISTS "Authenticated users can view approved vendor public info" ON vendor_public_info;
DROP POLICY IF EXISTS "Vendors can update own public info" ON vendor_public_info;  
DROP POLICY IF EXISTS "Admins can manage all vendor public info" ON vendor_public_info;

-- Create secure policies for vendor_public_info
-- Only authenticated users can view approved vendors
CREATE POLICY "Secure vendor public info access" 
ON vendor_public_info 
FOR SELECT 
TO authenticated
USING (verification_status = 'approved');

-- Vendors can update their own info
CREATE POLICY "Vendors update own info" 
ON vendor_public_info 
FOR UPDATE 
TO authenticated
USING (id IN (
  SELECT up.id 
  FROM user_profiles up 
  WHERE up.user_id = auth.uid() 
  AND up.role = 'vendor'
));

-- Admins have full access
CREATE POLICY "Admin vendor info access" 
ON vendor_public_info 
FOR ALL 
TO authenticated
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Log security completion
SELECT log_security_event(
  'final_vendor_security_completed',
  jsonb_build_object(
    'table', 'vendor_public_info',
    'access_restricted_to', 'authenticated_users_only',
    'competitive_data_protected', true,
    'timestamp', NOW()
  )
);