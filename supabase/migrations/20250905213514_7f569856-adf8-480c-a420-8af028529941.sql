-- =====================================================
-- CRITICAL SECURITY FIX: Complete Privilege Escalation Prevention
-- =====================================================

-- Get all existing policies for user_profiles and drop them
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END
$$;

-- Create completely new security policies
-- 1. Users can view their own profile and admins can view all
CREATE POLICY "secure_user_profiles_select" 
ON public.user_profiles 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR get_user_role(auth.uid()) = 'admin'::user_role
);

-- 2. Users can insert their own profile during registration
CREATE POLICY "secure_user_profiles_insert" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update ONLY safe fields (no role/status/verification changes)
CREATE POLICY "secure_user_profiles_update_safe" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Only admins can update any profile (including sensitive fields)
CREATE POLICY "secure_admin_profiles_update_all" 
ON public.user_profiles 
FOR UPDATE 
USING (get_user_role(auth.uid()) = 'admin'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role);

-- 5. Only admins can delete profiles
CREATE POLICY "secure_admin_profiles_delete" 
ON public.user_profiles 
FOR DELETE 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create enhanced validation function
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- Block non-admins from changing sensitive fields
  IF get_user_role(auth.uid()) != 'admin'::user_role THEN
    -- Check for attempted privilege escalation
    IF OLD.role IS DISTINCT FROM NEW.role THEN
      RAISE EXCEPTION 'SECURITY VIOLATION: Non-admin attempted to change user role from % to %', 
        OLD.role, NEW.role;
    END IF;
    
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      RAISE EXCEPTION 'SECURITY VIOLATION: Non-admin attempted to change user status from % to %', 
        OLD.status, NEW.status;
    END IF;
    
    IF OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
      RAISE EXCEPTION 'SECURITY VIOLATION: Non-admin attempted to change verification status from % to %', 
        OLD.verification_status, NEW.verification_status;
    END IF;
  END IF;
  
  -- Log any privilege changes for security monitoring
  IF OLD.role IS DISTINCT FROM NEW.role 
     OR OLD.status IS DISTINCT FROM NEW.status 
     OR OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    
    INSERT INTO public.audit_log (
      user_id,
      action,
      entity_type,
      entity_id,
      old_values,
      new_values,
      reason
    ) VALUES (
      auth.uid(),
      'PRIVILEGE_CHANGE_DETECTED',
      'user_profiles',
      NEW.id,
      jsonb_build_object(
        'role', OLD.role,
        'status', OLD.status,
        'verification_status', OLD.verification_status,
        'admin_performing_change', get_user_role(auth.uid()) = 'admin'::user_role
      ),
      jsonb_build_object(
        'role', NEW.role,
        'status', NEW.status,
        'verification_status', NEW.verification_status
      ),
      'Privilege modification detected - performed by: ' || COALESCE(get_user_role(auth.uid())::text, 'unknown')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply the security trigger
DROP TRIGGER IF EXISTS prevent_privilege_escalation_trigger ON public.user_profiles;
CREATE TRIGGER prevent_privilege_escalation_trigger
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_privilege_escalation();

-- Log successful security implementation
INSERT INTO public.audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values
) VALUES (
  auth.uid(),
  'CRITICAL_SECURITY_FIX_COMPLETED',
  'user_profiles',
  gen_random_uuid(),
  jsonb_build_object(
    'security_fix', 'privilege_escalation_prevention',
    'severity', 'CRITICAL',
    'implementation_date', NOW(),
    'protection_level', 'Database trigger + RLS policies',
    'audit_logging', 'Enhanced security event logging enabled'
  )
);