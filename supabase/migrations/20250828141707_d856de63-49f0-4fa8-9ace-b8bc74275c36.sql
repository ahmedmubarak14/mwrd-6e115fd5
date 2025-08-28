-- Fix security definer function to include search_path setting
CREATE OR REPLACE FUNCTION public.get_admin_statistics(admin_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  total_logins INTEGER := 0;
  failed_attempts INTEGER := 0;
  sessions_active INTEGER := 1;
  last_login TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if user is admin
  IF get_user_role(admin_user_id) != 'admin'::user_role THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Get audit log data for login statistics
  SELECT 
    COUNT(*) FILTER (WHERE action = 'login_success'),
    COUNT(*) FILTER (WHERE action = 'login_failed'),
    MAX(created_at) FILTER (WHERE action = 'login_success')
  INTO total_logins, failed_attempts, last_login
  FROM audit_log 
  WHERE user_id = admin_user_id;

  -- Build result JSON
  result := json_build_object(
    'total_logins', COALESCE(total_logins, 0),
    'failed_attempts', COALESCE(failed_attempts, 0),
    'sessions_active', sessions_active,
    'last_login', COALESCE(last_login, now()),
    'permissions_granted', ARRAY[
      'users:read', 'users:write', 'users:delete',
      'analytics:read', 'reports:generate', 
      'system:admin', 'security:manage',
      'communications:send', 'verification:approve'
    ]
  );

  RETURN result;
END;
$$;

-- Also fix the other function
CREATE OR REPLACE FUNCTION public.update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;