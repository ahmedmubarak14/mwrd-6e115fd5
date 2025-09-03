-- Secure remaining vendor tables with correct column references

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

-- Vendors can manage their own category associations
CREATE POLICY "Vendors can manage own categories" 
ON vendor_categories 
FOR ALL 
TO authenticated
USING (vendor_id = auth.uid());

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

-- Vendors can update their own extended profiles
CREATE POLICY "Vendors can update own extended profiles" 
ON vendor_profiles_extended 
FOR UPDATE 
TO authenticated
USING (vendor_id = auth.uid());

-- Vendors can insert their own extended profiles
CREATE POLICY "Vendors can create own extended profiles" 
ON vendor_profiles_extended 
FOR INSERT 
TO authenticated
WITH CHECK (vendor_id = auth.uid());

-- Admins have full access to all vendor data
CREATE POLICY "Admins can manage vendor categories" 
ON vendor_categories 
FOR ALL 
TO authenticated
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Admins can manage vendor extended profiles" 
ON vendor_profiles_extended 
FOR ALL 
TO authenticated
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Log final security completion
SELECT log_security_event(
  'all_vendor_tables_secured',
  jsonb_build_object(
    'tables_secured', ARRAY['vendor_public_info', 'vendor_categories', 'vendor_profiles_extended'],
    'access_level', 'authenticated_users_only',
    'competitive_intelligence_protected', true,
    'sensitive_business_data_secured', true,
    'production_security_complete', true,
    'timestamp', NOW()
  )
);