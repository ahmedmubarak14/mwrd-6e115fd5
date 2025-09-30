-- ====================================================================
-- CRITICAL SECURITY FIXES (IDEMPOTENT VERSION)
-- ====================================================================

-- 1. DROP DANGEROUS PUBLIC POLICY IF IT EXISTS
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public can view approved vendor profiles" ON user_profiles;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 2. CREATE OR REPLACE SAFE PUBLIC ACCESS POLICY
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public can view safe vendor business info" ON user_profiles;
  
  CREATE POLICY "Public can view safe vendor business info"
  ON user_profiles
  FOR SELECT
  USING (
    role = 'vendor'::user_role 
    AND status = 'approved'::user_status 
    AND verification_status = 'approved'
  );
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- 3. ENHANCE PRIVILEGE ESCALATION PROTECTION
CREATE OR REPLACE FUNCTION prevent_privilege_escalation_enhanced()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF get_user_role(auth.uid()) != 'admin'::user_role THEN
    IF OLD.role IS DISTINCT FROM NEW.role THEN
      INSERT INTO audit_log (
        user_id, action, entity_type, entity_id, old_values, new_values, reason
      ) VALUES (
        auth.uid(), 'SECURITY_VIOLATION_BLOCKED', 'user_profiles', NEW.id,
        jsonb_build_object('role', OLD.role, 'attacker_id', auth.uid()),
        jsonb_build_object('attempted_role', NEW.role),
        'BLOCKED: Non-admin attempted role change from ' || OLD.role || ' to ' || NEW.role
      );
      RAISE EXCEPTION 'SECURITY VIOLATION: Unauthorized role modification blocked';
    END IF;
    
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
  
  IF OLD.role IS DISTINCT FROM NEW.role OR OLD.status IS DISTINCT FROM NEW.status 
     OR OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    INSERT INTO audit_log (
      user_id, action, entity_type, entity_id, old_values, new_values, reason
    ) VALUES (
      auth.uid(), 'PRIVILEGE_CHANGE', 'user_profiles', NEW.id,
      jsonb_build_object('role', OLD.role, 'status', OLD.status, 'verification_status', OLD.verification_status),
      jsonb_build_object('role', NEW.role, 'status', NEW.status, 'verification_status', NEW.verification_status),
      'Admin privilege modification'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_privilege_escalation_trigger ON user_profiles;
DROP TRIGGER IF EXISTS validate_profile_update_trigger ON user_profiles;

CREATE TRIGGER prevent_privilege_escalation_trigger
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_privilege_escalation_enhanced();

-- 4. FINANCIAL DATA ACCESS LOGGING
CREATE OR REPLACE FUNCTION log_financial_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (NEW.bank_account_number IS DISTINCT FROM OLD.bank_account_number)
     OR (NEW.iban IS DISTINCT FROM OLD.iban)
     OR (NEW.bank_name IS DISTINCT FROM OLD.bank_name) THEN
    INSERT INTO audit_log (
      user_id, action, entity_type, entity_id, old_values, new_values, reason
    ) VALUES (
      auth.uid(), 'financial_data_modified', 'user_profiles', NEW.id,
      jsonb_build_object('bank_name', OLD.bank_name, 'has_account', OLD.bank_account_number IS NOT NULL),
      jsonb_build_object('bank_name', NEW.bank_name, 'has_account', NEW.bank_account_number IS NOT NULL),
      'Financial data modification logged'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS log_financial_data_trigger ON user_profiles;
CREATE TRIGGER log_financial_data_trigger
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION log_financial_data_access();

-- 5. SECURITY ALERT FUNCTION
CREATE OR REPLACE FUNCTION create_security_alert(
  alert_title TEXT,
  alert_description TEXT,
  severity_level TEXT DEFAULT 'high'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO security_incidents (title, description, severity, status, category, reported_by)
  VALUES (alert_title, alert_description, severity_level, 'open', 'security_breach', 'system_automated');
END;
$$;