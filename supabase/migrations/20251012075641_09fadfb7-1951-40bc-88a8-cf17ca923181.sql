-- Fix triggers that reference NEW.role on user_profiles
-- These triggers need to fetch role from user_roles table instead

-- Fix sync_vendor_public_info function
DROP TRIGGER IF EXISTS sync_vendor_public_info_trigger ON public.user_profiles;
DROP TRIGGER IF EXISTS sync_vendor_public_info_on_insert ON public.user_profiles;
DROP TRIGGER IF EXISTS sync_vendor_public_info_on_update ON public.user_profiles;

CREATE OR REPLACE FUNCTION public.sync_vendor_public_info()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Get user's role from user_roles table
  SELECT role INTO user_role
  FROM user_roles
  WHERE user_id = NEW.user_id
  LIMIT 1;

  IF user_role = 'vendor' AND NEW.status = 'approved' AND NEW.verification_status = 'approved' THEN
    -- Insert or update approved vendor info
    INSERT INTO vendor_public_info (
      id, full_name, company_name, bio, avatar_url, 
      portfolio_url, categories, verification_status, updated_at
    )
    VALUES (
      NEW.id, NEW.full_name, NEW.company_name, NEW.bio, 
      NEW.avatar_url, NEW.portfolio_url, NEW.categories, NEW.verification_status, now()
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = NEW.full_name,
      company_name = NEW.company_name,
      bio = NEW.bio,
      avatar_url = NEW.avatar_url,
      portfolio_url = NEW.portfolio_url,
      categories = NEW.categories,
      verification_status = NEW.verification_status,
      updated_at = now();
  ELSIF user_role = 'vendor' AND (NEW.status != 'approved' OR NEW.verification_status != 'approved') THEN
    -- Remove from public info if vendor is no longer approved
    DELETE FROM vendor_public_info WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_vendor_public_info_trigger
  AFTER INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_vendor_public_info();

-- Fix prevent_privilege_escalation_enhanced function  
DROP TRIGGER IF EXISTS prevent_privilege_escalation_trigger ON public.user_profiles;

CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation_enhanced()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_role app_role;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role
  FROM user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;

  IF current_user_role != 'admin' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO audit_log (
        user_id, action, entity_type, entity_id, old_values, new_values, reason
      ) VALUES (
        auth.uid(), 'SECURITY_VIOLATION_BLOCKED', 'user_profiles', NEW.id,
        jsonb_build_object('status', OLD.status), jsonb_build_object('attempted_status', NEW.status),
        'BLOCKED: Non-admin attempted status change'
      );
      RAISE EXCEPTION 'SECURITY VIOLATION: Unauthorized status modification blocked';
    END IF;
    
    IF OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
      INSERT INTO audit_log (
        user_id, action, entity_type, entity_id, old_values, new_values, reason
      ) VALUES (
        auth.uid(), 'SECURITY_VIOLATION_BLOCKED', 'user_profiles', NEW.id,
        jsonb_build_object('verification_status', OLD.verification_status),
        jsonb_build_object('attempted_verification_status', NEW.verification_status),
        'BLOCKED: Non-admin attempted verification status change'
      );
      RAISE EXCEPTION 'SECURITY VIOLATION: Unauthorized verification status modification blocked';
    END IF;

    IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
      INSERT INTO audit_log (
        user_id, action, entity_type, entity_id, old_values, new_values, reason
      ) VALUES (
        auth.uid(), 'SECURITY_VIOLATION_BLOCKED', 'user_profiles', NEW.id,
        jsonb_build_object('user_id', OLD.user_id), jsonb_build_object('attempted_user_id', NEW.user_id),
        'BLOCKED: Identity theft attempt'
      );
      RAISE EXCEPTION 'SECURITY VIOLATION: User ID modification blocked';
    END IF;
  END IF;
  
  IF OLD.status IS DISTINCT FROM NEW.status 
     OR OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    INSERT INTO audit_log (
      user_id, action, entity_type, entity_id, old_values, new_values, reason
    ) VALUES (
      auth.uid(), 'PRIVILEGE_CHANGE', 'user_profiles', NEW.id,
      jsonb_build_object('status', OLD.status, 'verification_status', OLD.verification_status),
      jsonb_build_object('status', NEW.status, 'verification_status', NEW.verification_status),
      'Admin privilege modification'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_privilege_escalation_trigger
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_privilege_escalation_enhanced();

-- Fix validate_profile_update function
DROP TRIGGER IF EXISTS validate_user_profile_changes ON public.user_profiles;

CREATE OR REPLACE FUNCTION public.validate_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_role app_role;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role
  FROM user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;

  -- If user is not admin, prevent changing sensitive fields
  IF current_user_role != 'admin' THEN
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
  IF OLD.status != NEW.status OR OLD.verification_status != NEW.verification_status THEN
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
        'status', OLD.status,
        'verification_status', OLD.verification_status
      ),
      jsonb_build_object(
        'status', NEW.status,
        'verification_status', NEW.verification_status
      ),
      'Profile privilege modification'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_user_profile_changes
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_update();