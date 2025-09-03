-- Fix critical security vulnerabilities for production readiness

-- 1. Secure vendor_public_info table - restrict public access
DROP POLICY IF EXISTS "Vendor public info is publicly readable" ON vendor_public_info;

-- Only authenticated users can view vendor public info
CREATE POLICY "Authenticated users can view vendor public info" 
ON vendor_public_info 
FOR SELECT 
TO authenticated
USING (verification_status = 'approved');

-- 2. Secure categories table - restrict to authenticated users only
DROP POLICY IF EXISTS "Anyone can view active categories" ON categories;

CREATE POLICY "Authenticated users can view active categories" 
ON categories 
FOR SELECT 
TO authenticated
USING ((is_active = true) OR (get_user_role(auth.uid()) = 'admin'::user_role));

-- 3. Secure procurement_categories table - restrict to authenticated users only  
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON procurement_categories;

CREATE POLICY "Authenticated users can view active procurement categories" 
ON procurement_categories 
FOR SELECT 
TO authenticated
USING ((is_active = true) OR (get_user_role(auth.uid()) = 'admin'::user_role));

-- Log security policy updates
SELECT log_security_event(
  'production_security_policies_updated',
  jsonb_build_object(
    'tables_secured', ARRAY['vendor_public_info', 'categories', 'procurement_categories'],
    'access_restricted_to', 'authenticated_users_only',
    'timestamp', NOW()
  )
);