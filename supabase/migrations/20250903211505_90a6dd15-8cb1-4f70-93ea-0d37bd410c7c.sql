-- Fix remaining critical security vulnerabilities

-- 1. Fix vendor_public_info - ensure no public access
-- Drop all existing policies and create secure ones
DROP POLICY IF EXISTS "Vendor public info is publicly readable" ON vendor_public_info;
DROP POLICY IF EXISTS "Authenticated users can view vendor public info" ON vendor_public_info;

-- Only allow authenticated users to see approved vendors
CREATE POLICY "Authenticated users can view approved vendors only" 
ON vendor_public_info 
FOR SELECT 
TO authenticated
USING (verification_status = 'approved');

-- 2. Fix expert_consultations - ensure strict access control
-- Drop existing policies and create secure ones
DROP POLICY IF EXISTS "Authenticated consultation submissions with limits" ON expert_consultations;
DROP POLICY IF EXISTS "Users can view own consultations" ON expert_consultations;
DROP POLICY IF EXISTS "Admins can manage all consultations" ON expert_consultations;

-- Users can only view their own consultations
CREATE POLICY "Users can view own consultations only" 
ON expert_consultations 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Users can create consultations with rate limiting
CREATE POLICY "Users can create own consultations with limits" 
ON expert_consultations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND check_consultation_rate_limit(auth.uid()));

-- Only admins can update consultation status
CREATE POLICY "Admins can update consultation status" 
ON expert_consultations 
FOR UPDATE 
TO authenticated
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Log security policy updates
SELECT log_security_event(
  'final_production_security_policies_updated',
  jsonb_build_object(
    'tables_secured', ARRAY['vendor_public_info', 'expert_consultations'],
    'access_level', 'strict_authenticated_only',
    'sensitive_data_protected', true,
    'timestamp', NOW()
  )
);