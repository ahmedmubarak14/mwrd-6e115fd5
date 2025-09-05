-- =====================================================
-- CRITICAL SECURITY FIX: Prevent Privilege Escalation (Fixed)
-- =====================================================

-- Drop existing broad UPDATE policies that allow role changes
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.user_profiles;

-- Create a restrictive policy for user profile updates
-- Users can update their profile but NOT role, status, or verification fields
CREATE POLICY "Users can update profile data only" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create admin-only policy for role/status changes
CREATE POLICY "Admins can modify user privileges" 
ON public.user_profiles 
FOR UPDATE 
USING (get_user_role(auth.uid()) = 'admin'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create function to validate profile updates (prevents role changes by non-admins)
CREATE OR REPLACE FUNCTION public.validate_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If user is not admin and tries to change sensitive fields, block it
  IF get_user_role(auth.uid()) != 'admin'::user_role THEN
    -- Prevent non-admins from changing role, status, verification
    IF OLD.role != NEW.role THEN
      RAISE EXCEPTION 'Only administrators can modify user roles';
    END IF;
    
    IF OLD.status != NEW.status THEN
      RAISE EXCEPTION 'Only administrators can modify user status';
    END IF;
    
    IF OLD.verification_status != NEW.verification_status THEN
      RAISE EXCEPTION 'Only administrators can modify verification status';
    END IF;
    
    IF OLD.user_id != NEW.user_id THEN
      RAISE EXCEPTION 'User ID cannot be modified';
    END IF;
  END IF;
  
  -- Log privilege changes for audit
  IF OLD.role != NEW.role OR OLD.status != NEW.status OR OLD.verification_status != NEW.verification_status THEN
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
      'privilege_change',
      'user_profiles',
      NEW.id,
      jsonb_build_object(
        'role', OLD.role,
        'status', OLD.status,
        'verification_status', OLD.verification_status
      ),
      jsonb_build_object(
        'role', NEW.role,
        'status', NEW.status,
        'verification_status', NEW.verification_status
      ),
      'User privilege modification by ' || COALESCE(get_user_role(auth.uid())::text, 'unknown')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to enforce validation
DROP TRIGGER IF EXISTS validate_user_profile_changes ON public.user_profiles;
CREATE TRIGGER validate_user_profile_changes
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_update();

-- Log this critical security fix
INSERT INTO public.audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values
) VALUES (
  auth.uid(),
  'critical_security_fix_applied',
  'user_profiles',
  gen_random_uuid(),
  jsonb_build_object(
    'fix_type', 'privilege_escalation_prevention',
    'security_level', 'CRITICAL',
    'changes_applied', ARRAY[
      'Prevented non-admin users from changing roles',
      'Added trigger validation for sensitive field changes',
      'Enhanced audit logging for privilege modifications',
      'Separated user data updates from admin privilege changes'
    ],
    'timestamp', NOW()
  )
);