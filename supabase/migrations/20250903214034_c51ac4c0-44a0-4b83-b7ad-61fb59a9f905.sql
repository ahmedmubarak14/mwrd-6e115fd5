-- Fix security vulnerabilities in vendor tables by removing public access
-- Keep vendor business information restricted to authenticated users only

-- Remove public access policies that allow unauthenticated users to view vendor data
DROP POLICY IF EXISTS "Anyone can view vendor categories" ON public.vendor_categories;
DROP POLICY IF EXISTS "Anyone can view vendor extended profiles" ON public.vendor_profiles_extended;
DROP POLICY IF EXISTS "Anyone can view approved vendor info" ON public.vendor_public_info;

-- Remove redundant vendor management policies for public role (should be authenticated only)
DROP POLICY IF EXISTS "Vendors can manage own categories" ON public.vendor_categories;
DROP POLICY IF EXISTS "Vendors can manage own extended profile" ON public.vendor_profiles_extended;
DROP POLICY IF EXISTS "Vendors can manage own public info" ON public.vendor_public_info;

-- Create secure vendor category policies (authenticated users only)
CREATE POLICY "Authenticated vendors can manage own categories" 
ON public.vendor_categories 
FOR ALL 
TO authenticated
USING (
  (vendor_id IN ( SELECT user_profiles.id FROM user_profiles WHERE user_profiles.user_id = auth.uid())) OR 
  (get_user_role(auth.uid()) = 'admin'::user_role)
);

-- Create secure vendor extended profile policies (authenticated users only)  
CREATE POLICY "Authenticated vendors can manage own extended profile" 
ON public.vendor_profiles_extended 
FOR ALL 
TO authenticated
USING (
  (vendor_id IN ( SELECT user_profiles.id FROM user_profiles WHERE user_profiles.user_id = auth.uid() AND user_profiles.role = 'vendor'::user_role)) OR 
  (get_user_role(auth.uid()) = 'admin'::user_role)
);

-- Create secure vendor public info policies (authenticated users only)
CREATE POLICY "Authenticated vendors can manage own public info" 
ON public.vendor_public_info 
FOR ALL 
TO authenticated
USING (
  (id IN ( SELECT up.id FROM user_profiles up WHERE up.user_id = auth.uid() AND up.role = 'vendor'::user_role)) OR 
  (get_user_role(auth.uid()) = 'admin'::user_role)
);

-- Log the security enhancement
INSERT INTO public.audit_log (
  action,
  entity_type, 
  entity_id,
  new_values,
  created_at
) VALUES (
  'security_enhancement_vendor_tables',
  'rls_policies',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'removed_public_access',
    'tables', ARRAY['vendor_categories', 'vendor_profiles_extended', 'vendor_public_info'],
    'security_level', 'authenticated_users_only',
    'impact', 'prevents_competitor_scraping',
    'timestamp', NOW()
  ),
  NOW()
);