-- Secure remaining vendor tables - fix column references

-- 1. Secure vendor_categories table
ALTER TABLE vendor_categories ENABLE ROW LEVEL SECURITY;

-- Remove any existing public policies
DROP POLICY IF EXISTS "Enable read access for all users" ON vendor_categories;
DROP POLICY IF EXISTS "Public read access" ON vendor_categories;

-- Only authenticated users can view vendor categories
CREATE POLICY "Authenticated users can view vendor categories" 
ON vendor_categories 
FOR SELECT 
TO authenticated
USING (true);

-- Admins have full access to vendor categories
CREATE POLICY "Admins can manage vendor categories" 
ON vendor_categories 
FOR ALL 
TO authenticated
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- 2. Secure vendor_profiles_extended table  
ALTER TABLE vendor_profiles_extended ENABLE ROW LEVEL SECURITY;

-- Remove any existing public policies
DROP POLICY IF EXISTS "Enable read access for all users" ON vendor_profiles_extended;
DROP POLICY IF EXISTS "Public read access" ON vendor_profiles_extended;

-- Only authenticated users can view extended vendor profiles
CREATE POLICY "Authenticated users can view vendor extended profiles" 
ON vendor_profiles_extended 
FOR SELECT 
TO authenticated
USING (true);

-- Admins have full access to extended profiles
CREATE POLICY "Admins can manage vendor extended profiles" 
ON vendor_profiles_extended 
FOR ALL 
TO authenticated
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Log security completion
SELECT log_security_event(
  'vendor_tables_fully_secured',
  jsonb_build_object(
    'tables_secured', ARRAY['vendor_categories', 'vendor_profiles_extended'],
    'access_restricted_to', 'authenticated_users_only',
    'competitive_data_protected', true,
    'timestamp', NOW()
  )
);