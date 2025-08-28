-- Create platform_settings table for global platform configuration
CREATE TABLE public.platform_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  setting_type TEXT NOT NULL CHECK (setting_type IN ('general', 'security', 'system', 'integration')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage platform settings
CREATE POLICY "Admins can manage platform settings" 
ON public.platform_settings 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Insert default platform settings
INSERT INTO public.platform_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', '{"value": "MWRD Platform"}', 'general', 'Platform name displayed across the site'),
('site_description', '{"value": "Professional procurement and vendor management platform"}', 'general', 'Platform description for SEO and branding'),
('registration_open', '{"value": true}', 'general', 'Whether new user registration is allowed'),
('email_verification_required', '{"value": false}', 'security', 'Require email verification for new accounts'),
('default_user_role', '{"value": "client"}', 'general', 'Default role assigned to new users'),
('session_timeout', '{"value": 480}', 'security', 'Session timeout in minutes'),
('max_login_attempts', '{"value": 5}', 'security', 'Maximum failed login attempts before lockout'),
('password_min_length', '{"value": 8}', 'security', 'Minimum password length requirement'),
('require_password_symbols', '{"value": true}', 'security', 'Require symbols in passwords'),
('enable_two_factor', '{"value": false}', 'security', 'Enable two-factor authentication requirement'),
('api_rate_limit', '{"value": 1000}', 'system', 'API requests per hour per user'),
('file_upload_max_size', '{"value": 10}', 'system', 'Maximum file upload size in MB'),
('maintenance_mode', '{"value": false}', 'system', 'Enable maintenance mode'),
('default_timezone', '{"value": "Asia/Riyadh"}', 'general', 'Default platform timezone'),
('default_currency', '{"value": "SAR"}', 'general', 'Default platform currency');

-- Create trigger to update updated_at
CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();