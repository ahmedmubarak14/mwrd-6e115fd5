-- Create push_notifications table
CREATE TABLE public.push_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_audience TEXT NOT NULL DEFAULT 'all_users',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  delivery_stats JSONB DEFAULT '{}'::jsonb
);

-- Create device_registrations table for push notification targeting
CREATE TABLE public.device_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL, -- 'ios', 'android', 'web'
  device_info JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create communication_metrics table
CREATE TABLE public.communication_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL, -- 'email_campaign', 'push_notification', 'sms_campaign'
  campaign_id UUID,
  metric_name TEXT NOT NULL, -- 'sent', 'delivered', 'opened', 'clicked', 'bounced'
  metric_value INTEGER NOT NULL DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on all tables
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for push_notifications
CREATE POLICY "Admins can manage all push notifications" 
ON public.push_notifications 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- RLS Policies for device_registrations  
CREATE POLICY "Users can manage own device registrations" 
ON public.device_registrations 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all device registrations" 
ON public.device_registrations 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- RLS Policies for communication_metrics
CREATE POLICY "Admins can view communication metrics" 
ON public.communication_metrics 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "System can insert communication metrics" 
ON public.communication_metrics 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_push_notifications_updated_at
    BEFORE UPDATE ON public.push_notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_push_notifications_status ON public.push_notifications(status);
CREATE INDEX idx_push_notifications_scheduled_for ON public.push_notifications(scheduled_for);
CREATE INDEX idx_device_registrations_user_id ON public.device_registrations(user_id);
CREATE INDEX idx_device_registrations_active ON public.device_registrations(is_active);
CREATE INDEX idx_communication_metrics_type_date ON public.communication_metrics(metric_type, recorded_at);