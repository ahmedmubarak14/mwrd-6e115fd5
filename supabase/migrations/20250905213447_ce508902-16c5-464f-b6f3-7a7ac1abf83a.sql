-- =====================================================
-- CRITICAL SECURITY FIX: Prevent Privilege Escalation (Fixed)
-- =====================================================

-- Drop existing broad UPDATE policies that allow role changes
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.user_profiles;

-- Create restrictive policy for user profile updates (excluding sensitive fields)
CREATE POLICY "Users can update profile data only" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (
  auth.uid() = user_id 
  AND (
    -- Only allow updates to non-sensitive fields
    -- Role, status, verification_status are protected
    SELECT 
      up_old.role = up_new.role 
      AND up_old.status = up_new.status 
      AND up_old.verification_status = up_new.verification_status
      AND up_old.user_id = up_new.user_id
    FROM 
      (SELECT role, status, verification_status, user_id FROM user_profiles WHERE id = user_profiles.id) up_old,
      (SELECT NEW.role, NEW.status, NEW.verification_status, NEW.user_id) up_new
  )
);

-- Create admin-only policy for sensitive field updates
CREATE POLICY "Admins can modify user roles and status" 
ON public.user_profiles 
FOR UPDATE 
USING (get_user_role(auth.uid()) = 'admin'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create audit function for privilege changes
CREATE OR REPLACE FUNCTION public.audit_user_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any role, status, or verification changes
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
      reason,
      created_at
    ) VALUES (
      COALESCE(auth.uid(), NEW.user_id),
      'privilege_change_attempt',
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
      'User privilege or status change detected',
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS audit_user_privilege_changes ON public.user_profiles;
CREATE TRIGGER audit_user_privilege_changes
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_user_role_changes();

-- Log this security fix
INSERT INTO public.audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  auth.uid(),
  'critical_security_fix_applied',
  'user_profiles',
  gen_random_uuid(),
  jsonb_build_object(
    'fix_type', 'privilege_escalation_prevention',
    'changes', ARRAY[
      'Prevented users from changing their own roles',
      'Added admin-only policy for sensitive field modifications',
      'Added audit trigger for privilege change attempts',
      'Enhanced security for user profile updates'
    ],
    'security_level', 'CRITICAL',
    'timestamp', NOW()
  ),
  NOW()
);