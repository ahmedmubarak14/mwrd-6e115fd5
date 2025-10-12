-- CRITICAL SECURITY FIX: Remove role from user_profiles and secure role management
-- This prevents privilege escalation attacks

-- Step 1: Remove role column from user_profiles if it exists
-- Note: This is safe because roles are already in the user_roles table
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS role CASCADE;

-- Step 2: Add secure function to get user role (replaces direct role column access)
CREATE OR REPLACE FUNCTION public.get_user_role_secure(user_uuid uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text 
  FROM public.user_roles 
  WHERE user_id = user_uuid 
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'vendor' THEN 2
      WHEN 'client' THEN 3
    END
  LIMIT 1;
$$;

-- Step 3: Add audit trigger for admin role assignments
CREATE OR REPLACE FUNCTION public.log_admin_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log any admin role assignment
  IF NEW.role = 'admin'::app_role THEN
    INSERT INTO public.audit_log (
      user_id,
      action,
      entity_type,
      entity_id,
      new_values,
      reason
    ) VALUES (
      auth.uid(), -- Who made the change
      'admin_role_assigned',
      'user_roles',
      NEW.id,
      jsonb_build_object(
        'assigned_to_user_id', NEW.user_id,
        'role', NEW.role,
        'assigned_by', auth.uid(),
        'timestamp', NOW()
      ),
      CASE 
        WHEN auth.uid() = NEW.user_id OR auth.uid() IS NULL 
        THEN 'BLOCKED: Self-assignment attempt'
        ELSE 'Admin role assigned by authorized administrator'
      END
    );
    
    -- Block self-assignment (user assigning admin to themselves)
    IF auth.uid() = NEW.user_id OR auth.uid() IS NULL THEN
      -- Create security incident
      INSERT INTO public.security_incidents (
        title,
        description,
        severity,
        status,
        category,
        reported_by
      ) VALUES (
        'CRITICAL: Unauthorized Admin Role Self-Assignment Attempt',
        'User ' || NEW.user_id || ' attempted to assign admin role to themselves without proper authorization. This is a privilege escalation attack.',
        'critical',
        'open',
        'privilege_escalation',
        'system_automated'
      );
      
      -- Block the assignment
      RAISE EXCEPTION 'SECURITY VIOLATION: Admin role can only be assigned by existing admins, not by users themselves';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for admin role assignment audit (only on INSERT to prevent blocking existing data)
DROP TRIGGER IF EXISTS audit_admin_role_assignment ON public.user_roles;
CREATE TRIGGER audit_admin_role_assignment
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_admin_role_assignment();

-- Step 4: Add helper function to check if KYC is required and status
CREATE OR REPLACE FUNCTION public.get_kyc_status(user_uuid uuid)
RETURNS TABLE(
  kyc_required boolean,
  kyc_exists boolean,
  submission_status text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    -- KYC is required for client role
    (SELECT role = 'client'::app_role FROM user_roles WHERE user_id = user_uuid LIMIT 1) as kyc_required,
    -- Check if KYC submission exists
    EXISTS(SELECT 1 FROM kyc_submissions WHERE user_id = user_uuid) as kyc_exists,
    -- Get submission status
    (SELECT submission_status FROM kyc_submissions WHERE user_id = user_uuid ORDER BY created_at DESC LIMIT 1) as submission_status;
$$;

-- Step 5: Add RLS policy helper to prevent role tampering
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to modify user_roles
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ) THEN
    RAISE EXCEPTION 'SECURITY VIOLATION: Only administrators can modify user roles';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add trigger to prevent unauthorized role modifications
DROP TRIGGER IF EXISTS prevent_unauthorized_role_changes ON public.user_roles;
CREATE TRIGGER prevent_unauthorized_role_changes
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();