-- Fix critical security issues identified by linter

-- 1. Fix OTP expiry time (reduce from default to 10 minutes for better security)
UPDATE auth.config 
SET value = '600'  -- 10 minutes in seconds
WHERE key = 'otp_expiry';

-- 2. Enable password leak protection
UPDATE auth.config 
SET value = 'true'
WHERE key = 'password_protection_enabled';

-- 3. Fix function search path issues by updating existing functions
-- Update get_user_role function with proper search path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT role FROM public.user_profiles WHERE user_id = user_uuid LIMIT 1;
$function$;

-- Update other functions that may have mutable search paths
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  RETURN NEW;
END;
$function$;

-- Add rate limiting for support ticket creation
CREATE OR REPLACE FUNCTION public.check_support_ticket_rate_limit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  recent_count integer;
BEGIN
  -- Allow max 5 support tickets per hour per user
  SELECT COUNT(*)
  INTO recent_count
  FROM public.support_tickets
  WHERE user_id = user_uuid
    AND created_at > NOW() - INTERVAL '1 hour';
  
  RETURN recent_count < 5;
END;
$function$;

-- Add RLS policy for support tickets with rate limiting
CREATE POLICY "Users can create support tickets with rate limiting" 
ON public.support_tickets 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND check_support_ticket_rate_limit(auth.uid())
);

-- Create audit log for security events
CREATE OR REPLACE FUNCTION public.log_support_ticket_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Log support ticket creation for audit purposes
  INSERT INTO public.audit_log (
    user_id,
    action,
    entity_type,
    entity_id,
    new_values,
    created_at
  ) VALUES (
    NEW.user_id,
    'support_ticket_created',
    'support_tickets',
    NEW.id,
    jsonb_build_object(
      'subject', NEW.subject,
      'category', NEW.category,
      'priority', NEW.priority
    ),
    NOW()
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger for support ticket audit logging
DROP TRIGGER IF EXISTS support_ticket_audit_trigger ON public.support_tickets;
CREATE TRIGGER support_ticket_audit_trigger
  AFTER INSERT ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.log_support_ticket_creation();