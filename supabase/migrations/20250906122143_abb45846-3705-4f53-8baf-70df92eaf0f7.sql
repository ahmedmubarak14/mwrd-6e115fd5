-- Fix workflow trigger function parameter casting
CREATE OR REPLACE FUNCTION public.notify_request_created_with_workflow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Execute workflow rules with proper parameter casting
  PERFORM execute_workflow_rules(
    'request_created'::workflow_trigger_type,
    jsonb_build_object(
      'request_id', NEW.id,
      'category', NEW.category,
      'client_id', NEW.client_id,
      'budget_max', NEW.budget_max,
      'deadline', NEW.deadline,
      'urgency', NEW.urgency
    )
  );
  
  -- Keep existing notification logic for backward compatibility
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    category,
    priority,
    data
  )
  SELECT 
    up.user_id,
    'request_created',
    'New Request Needs Review',
    'A new procurement request "' || NEW.title || '" has been created and needs admin approval.',
    'requests',
    'medium',
    jsonb_build_object(
      'request_id', NEW.id,
      'title', NEW.title,
      'category', NEW.category
    )
  FROM user_profiles up
  WHERE up.role = 'admin';

  RETURN NEW;
END;
$function$;