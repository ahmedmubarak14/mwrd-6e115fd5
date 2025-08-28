-- Create communication_settings table for admin communication configuration
CREATE TABLE public.communication_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  settings_type TEXT NOT NULL CHECK (settings_type IN ('email', 'sms', 'notifications', 'integrations')),
  settings_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, settings_type)
);

-- Enable RLS
ALTER TABLE public.communication_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage communication settings
CREATE POLICY "Admins can manage communication settings" 
ON public.communication_settings 
FOR ALL 
USING (auth.uid() = user_id AND get_user_role(auth.uid()) = 'admin'::user_role);

-- Create user_notification_settings table for individual user notification preferences
CREATE TABLE public.user_notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_notifications BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_notification_settings ENABLE ROW LEVEL SECURITY;

-- Users can manage their own notification settings
CREATE POLICY "Users can manage own notification settings" 
ON public.user_notification_settings 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger to update updated_at for both tables
CREATE TRIGGER update_communication_settings_updated_at
  BEFORE UPDATE ON public.communication_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_notification_settings_updated_at
  BEFORE UPDATE ON public.user_notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();