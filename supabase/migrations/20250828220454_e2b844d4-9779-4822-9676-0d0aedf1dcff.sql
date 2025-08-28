-- Fix the security issue with the logging function by setting proper search path
DROP FUNCTION IF EXISTS log_document_access_attempt(TEXT, TEXT, BOOLEAN, TEXT);

CREATE OR REPLACE FUNCTION log_document_access_attempt(
  file_path TEXT,
  user_role TEXT,
  success BOOLEAN,
  error_message TEXT DEFAULT NULL
) RETURNS VOID 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    entity_type,
    entity_id,
    new_values,
    created_at
  ) VALUES (
    auth.uid(),
    'document_access_attempt',
    'storage_object',
    gen_random_uuid(),
    jsonb_build_object(
      'file_path', file_path,
      'user_role', user_role,
      'success', success,
      'error_message', error_message,
      'timestamp', NOW()
    ),
    NOW()
  );
END;
$$;