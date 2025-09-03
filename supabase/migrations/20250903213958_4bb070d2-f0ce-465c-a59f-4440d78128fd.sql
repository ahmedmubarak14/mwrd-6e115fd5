-- Fix security vulnerabilities in vendor tables
-- Restrict public access to vendor business information

-- Drop existing public policies for vendor_public_info table
DROP POLICY IF EXISTS "Anyone can view approved vendor info" ON public.vendor_public_info;

-- Create secure policies for vendor_public_info
CREATE POLICY "Authenticated users can view approved vendors" 
ON public.vendor_public_info 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND 
  (verification_status = 'approved')
);

CREATE POLICY "Vendors can view their own info" 
ON public.vendor_public_info 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND 
  (id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()))
);

CREATE POLICY "Admins can manage all vendor info" 
ON public.vendor_public_info 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Drop existing public policies for vendor_profiles_extended table
DROP POLICY IF EXISTS "Anyone can view approved vendor profiles" ON public.vendor_profiles_extended;

-- Create secure policies for vendor_profiles_extended  
CREATE POLICY "Authenticated users can view approved vendor profiles" 
ON public.vendor_profiles_extended 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND 
  (verification_status = 'approved')
);

CREATE POLICY "Vendors can manage their own extended profile" 
ON public.vendor_profiles_extended 
FOR ALL 
USING (
  (auth.uid() IS NOT NULL) AND 
  (vendor_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()))
);

CREATE POLICY "Admins can manage all vendor profiles" 
ON public.vendor_profiles_extended 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Drop existing public policies for vendor_categories table
DROP POLICY IF EXISTS "Anyone can view vendor categories" ON public.vendor_categories;

-- Create secure policies for vendor_categories
CREATE POLICY "Authenticated users can view vendor categories" 
ON public.vendor_categories 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Vendors can manage their own categories" 
ON public.vendor_categories 
FOR ALL 
USING (
  (auth.uid() IS NOT NULL) AND 
  (vendor_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()))
);

CREATE POLICY "Admins can manage all vendor categories" 
ON public.vendor_categories 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Log security policy updates
INSERT INTO public.audit_log (
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  'security_policy_update',
  'rls_policies',
  gen_random_uuid(),
  jsonb_build_object(
    'tables_secured', ARRAY['vendor_public_info', 'vendor_profiles_extended', 'vendor_categories'],
    'security_level', 'authenticated_users_only',
    'timestamp', NOW()
  ),
  NOW()
);