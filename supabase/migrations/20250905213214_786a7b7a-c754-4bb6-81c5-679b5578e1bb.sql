-- =====================================================
-- CRITICAL SECURITY FIX: Prevent Privilege Escalation
-- =====================================================

-- First, let's check current RLS policies on user_profiles
-- And fix the privilege escalation vulnerability

-- Drop existing UPDATE policy that allows users to update their own profiles (including role)
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.user_profiles;

-- Create separate policies for regular profile updates vs role changes
-- 1. Allow users to update their profile data EXCEPT role and sensitive fields
CREATE POLICY "Users can update own profile data" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (
  auth.uid() = user_id 
  AND OLD.role = NEW.role  -- Prevent role changes
  AND OLD.user_id = NEW.user_id  -- Prevent user_id changes
  AND OLD.status = NEW.status  -- Prevent status changes (admin only)
  AND OLD.verification_status = NEW.verification_status  -- Prevent verification changes (admin only)
);

-- 2. Allow only admins to modify roles, status, and verification
CREATE POLICY "Only admins can modify user roles and status" 
ON public.user_profiles 
FOR UPDATE 
USING (get_user_role(auth.uid()) = 'admin'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create audit trigger for role changes
CREATE OR REPLACE FUNCTION public.audit_user_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log any role, status, or verification changes
  IF OLD.role != NEW.role OR OLD.status != NEW.status OR OLD.verification_status != NEW.verification_status THEN
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
      'User privilege or status change detected',
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for user_profiles
DROP TRIGGER IF EXISTS audit_user_privilege_changes ON public.user_profiles;
CREATE TRIGGER audit_user_privilege_changes
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_user_role_changes();

-- Enhanced RLS for other sensitive tables
-- Ensure expert_consultations can only be accessed by owners and admins
DROP POLICY IF EXISTS "Users can view own consultations only" ON public.expert_consultations;
CREATE POLICY "Users can view own consultations only" 
ON public.expert_consultations 
FOR SELECT 
USING (auth.uid() = user_id OR get_user_role(auth.uid()) = 'admin'::user_role);

-- Ensure financial_transactions are properly secured
DROP POLICY IF EXISTS "Users can view own transactions" ON public.financial_transactions;
CREATE POLICY "Users can view own transactions" 
ON public.financial_transactions 
FOR SELECT 
USING (auth.uid() = user_id OR get_user_role(auth.uid()) = 'admin'::user_role);

-- Ensure messages are properly secured to conversation participants
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
CREATE POLICY "Users can view their messages" 
ON public.messages 
FOR SELECT 
USING (
  auth.uid() = sender_id 
  OR auth.uid() = recipient_id 
  OR get_user_role(auth.uid()) = 'admin'::user_role
);

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
  'critical_security_fix',
  'user_profiles',
  gen_random_uuid(),
  jsonb_build_object(
    'fix_type', 'privilege_escalation_prevention',
    'changes', ARRAY[
      'Prevented users from changing their own roles',
      'Added admin-only policy for role modifications',
      'Added audit trigger for privilege changes',
      'Enhanced RLS policies for sensitive data tables'
    ],
    'security_level', 'CRITICAL',
    'timestamp', NOW()
  ),
  NOW()
);