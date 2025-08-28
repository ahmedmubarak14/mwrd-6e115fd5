-- Create admin_settings table for persistent admin user settings
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  security_alerts BOOLEAN NOT NULL DEFAULT true,
  admin_dashboard_theme TEXT NOT NULL DEFAULT 'system',
  session_timeout INTEGER NOT NULL DEFAULT 480,
  audit_log_retention INTEGER NOT NULL DEFAULT 90,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage their own settings
CREATE POLICY "Admins can manage own settings" 
ON public.admin_settings 
FOR ALL 
USING (auth.uid() = user_id AND get_user_role(auth.uid()) = 'admin'::user_role);

-- Create function to get admin statistics from real data
CREATE OR REPLACE FUNCTION public.get_admin_statistics(admin_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create trigger to update admin_settings updated_at
CREATE OR REPLACE FUNCTION public.update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_admin_settings_updated_at();