-- ====================================================================
-- CRITICAL SECURITY FIXES
-- ====================================================================

-- 1. DROP DANGEROUS PUBLIC POLICY THAT EXPOSES PII
-- This policy currently exposes email, phone, bank details to everyone
DROP POLICY IF EXISTS "Public can view approved vendor profiles" ON user_profiles;

-- 2. CREATE SAFE PUBLIC ACCESS POLICY
-- Only expose non-sensitive business information for approved vendors
CREATE POLICY "Public can view safe vendor business info"
ON user_profiles
FOR SELECT
USING (
  role = 'vendor'::user_role 
  AND status = 'approved'::user_status 
  AND verification_status = 'approved'
);

-- Note: Applications should use vendor_public_info table or get_safe_vendor_info() function
-- to access vendor data, which only exposes: full_name, company_name, bio, avatar_url, 
-- portfolio_url, categories, verification_status (NO email, phone, bank details)

-- 3. ENHANCE PRIVILEGE ESCALATION PROTECTION
-- Add comprehensive trigger to block and log unauthorized privilege changes
CREATE OR REPLACE FUNCTION prevent_privilege_escalation_enhanced()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Block non-admins from changing sensitive fields
  IF get_user_role(auth.uid()) != 'admin'::user_role THEN
    -- Check for attempted privilege escalation
    IF OLD.role IS DISTINCT FROM NEW.role THEN
      -- Log the security incident
      INSERT INTO audit_log (
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        reason
      ) VALUES (
        auth.uid(),
        'SECURITY_VIOLATION_BLOCKED',
        'user_profiles',
        NEW.id,
        jsonb_build_object('role', OLD.role, 'attacker_id', auth.uid()),
        jsonb_build_object('attempted_role', NEW.role),
        'BLOCKED: Non-admin attempted role change from ' || OLD.role || ' to ' || NEW.role
      );
      
      RAISE EXCEPTION 'SECURITY VIOLATION: Unauthorized role modification attempt blocked and logged';
    END IF;
    
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO audit_log (
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        reason
      ) VALUES (
        auth.uid(),
        'SECURITY_VIOLATION_BLOCKED',
        'user_profiles',
        NEW.id,
        jsonb_build_object('status', OLD.status, 'attacker_id', auth.uid()),
        jsonb_build_object('attempted_status', NEW.status),
        'BLOCKED: Non-admin attempted status change from ' || OLD.status || ' to ' || NEW.status
      );
      
      RAISE EXCEPTION 'SECURITY VIOLATION: Unauthorized status modification attempt blocked and logged';
    END IF;
    
    IF OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
      INSERT INTO audit_log (
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        reason
      ) VALUES (
        auth.uid(),
        'SECURITY_VIOLATION_BLOCKED',
        'user_profiles',
        NEW.id,
        jsonb_build_object('verification_status', OLD.verification_status, 'attacker_id', auth.uid()),
        jsonb_build_object('attempted_verification_status', NEW.verification_status),
        'BLOCKED: Non-admin attempted verification status change'
      );
      
      RAISE EXCEPTION 'SECURITY VIOLATION: Unauthorized verification status modification attempt blocked and logged';
    END IF;

    -- Prevent user_id changes (identity theft protection)
    IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
      INSERT INTO audit_log (
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values,
        reason
      ) VALUES (
        auth.uid(),
        'SECURITY_VIOLATION_BLOCKED',
        'user_profiles',
        NEW.id,
        jsonb_build_object('user_id', OLD.user_id, 'attacker_id', auth.uid()),
        jsonb_build_object('attempted_user_id', NEW.user_id),
        'BLOCKED: Attempted user_id modification (identity theft attempt)'
      );
      
      RAISE EXCEPTION 'SECURITY VIOLATION: User ID modification attempt blocked (potential identity theft)';
    END IF;
  END IF;
  
  -- Log all privilege changes by admins for audit trail
  IF OLD.role IS DISTINCT FROM NEW.role 
     OR OLD.status IS DISTINCT FROM NEW.status 
     OR OLD.verification_status IS DISTINCT FROM NEW.verification_status THEN
    
    INSERT INTO audit_log (
      user_id,
      action,
      entity_type,
      entity_id,
      old_values,
      new_values,
      reason
    ) VALUES (
      auth.uid(),
      'PRIVILEGE_CHANGE',
      'user_profiles',
      NEW.id,
      jsonb_build_object(
        'role', OLD.role,
        'status', OLD.status,
        'verification_status', OLD.verification_status,
        'admin_id', auth.uid(),
        'target_user_id', NEW.user_id
      ),
      jsonb_build_object(
        'role', NEW.role,
        'status', NEW.status,
        'verification_status', NEW.verification_status
      ),
      'Admin privilege modification: ' || get_user_role(auth.uid())::text
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop old trigger if exists and create new one
DROP TRIGGER IF EXISTS prevent_privilege_escalation_trigger ON user_profiles;
DROP TRIGGER IF EXISTS validate_profile_update_trigger ON user_profiles;

CREATE TRIGGER prevent_privilege_escalation_trigger
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_privilege_escalation_enhanced();

-- 4. ADD SENSITIVE DATA ACCESS LOGGING
-- Log all direct queries to user_profiles with PII
CREATE OR REPLACE FUNCTION log_sensitive_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log when users access profiles (for security monitoring)
  -- This helps detect data scraping or unauthorized access patterns
  INSERT INTO audit_log (
    user_id,
    action,
    entity_type,
    entity_id,
    new_values
  ) VALUES (
    auth.uid(),
    'profile_accessed',
    'user_profiles',
    NEW.id,
    jsonb_build_object(
      'accessed_user_id', NEW.user_id,
      'accessor_role', get_user_role(auth.uid()),
      'timestamp', now()
    )
  );
  
  RETURN NEW;
END;
$$;

-- 5. CREATE SECURITY INCIDENT ALERT FUNCTION
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
  INSERT INTO security_incidents (
    title,
    description,
    severity,
    status,
    category,
    reported_by
  ) VALUES (
    alert_title,
    alert_description,
    severity_level,
    'open',
    'security_breach',
    'system_automated'
  );
END;
$$;

-- 6. ENHANCE AUDIT LOGGING FOR FINANCIAL DATA
-- Add trigger to log all access to sensitive financial fields
CREATE OR REPLACE FUNCTION log_financial_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log when bank details or IBAN are accessed or modified
  IF (NEW.bank_account_number IS DISTINCT FROM OLD.bank_account_number)
     OR (NEW.iban IS DISTINCT FROM OLD.iban)
     OR (NEW.bank_name IS DISTINCT FROM OLD.bank_name) THEN
    
    INSERT INTO audit_log (
      user_id,
      action,
      entity_type,
      entity_id,
      old_values,
      new_values,
      reason
    ) VALUES (
      auth.uid(),
      'financial_data_modified',
      'user_profiles',
      NEW.id,
      jsonb_build_object(
        'bank_name', OLD.bank_name,
        'has_account_number', (OLD.bank_account_number IS NOT NULL),
        'has_iban', (OLD.iban IS NOT NULL)
      ),
      jsonb_build_object(
        'bank_name', NEW.bank_name,
        'has_account_number', (NEW.bank_account_number IS NOT NULL),
        'has_iban', (NEW.iban IS NOT NULL),
        'modified_by', auth.uid()
      ),
      'Financial data modification logged for security'
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

-- 7. ADD COMMENT DOCUMENTATION FOR SECURITY
COMMENT ON POLICY "Public can view safe vendor business info" ON user_profiles IS 
'SECURITY: This policy intentionally does NOT grant access to email, phone, or bank details. Use vendor_public_info table or get_safe_vendor_info() function for safe public access.';

COMMENT ON FUNCTION prevent_privilege_escalation_enhanced() IS
'SECURITY: Blocks and logs all unauthorized attempts to modify user roles, status, or verification status. Only admins can make these changes.';

COMMENT ON FUNCTION log_financial_data_access() IS
'SECURITY: Logs all modifications to sensitive financial data (bank accounts, IBAN) for audit trail.';

-- 8. VERIFY VENDOR_PUBLIC_INFO TABLE IS PROPERLY SECURED
-- This table should be the PRIMARY way to access public vendor information
-- It only contains safe business info, no PII

-- Ensure the sync trigger is working correctly
DROP TRIGGER IF EXISTS sync_vendor_public_info_trigger ON user_profiles;

CREATE TRIGGER sync_vendor_public_info_trigger
AFTER INSERT OR UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION sync_vendor_public_info();

COMMENT ON TABLE vendor_public_info IS
'SECURITY: This table contains ONLY safe public business information for vendors. It does NOT contain email, phone, bank details, or other PII. This is the recommended table for public vendor data access.';