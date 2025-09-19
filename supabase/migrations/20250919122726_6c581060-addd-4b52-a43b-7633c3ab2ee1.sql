-- Fix insert error caused by SELECT DISTINCT with json (no equality operator)
-- Update notify_request_created() to use jsonb_build_object instead of json_build_object
-- This prevents "could not identify an equality operator for type json" during request inserts

CREATE OR REPLACE FUNCTION public.notify_request_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Notify admins about new requests needing approval (use JSONB)
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
    'A new procurement request ' || quote_literal(NEW.title) || ' has been created and needs admin approval.',
    'requests',
    'medium',
    jsonb_build_object(
      'request_id', NEW.id,
      'title', NEW.title,
      'category', NEW.category
    )
  FROM user_profiles up
  WHERE up.role = 'admin';

  -- Notify vendors in matching categories (DISTINCT with JSONB is safe)
  INSERT INTO notifications (
    user_id,
    type,
    title, 
    message,
    category,
    priority,
    data
  )
  SELECT DISTINCT
    up.user_id,
    'new_request_available',
    'New Request Available',
    'A new request in your category ' || quote_literal(NEW.category) || ' is now available for offers.',
    'opportunities',
    'medium',
    jsonb_build_object(
      'request_id', NEW.id,
      'title', NEW.title,
      'category', NEW.category,
      'budget_max', NEW.budget_max,
      'deadline', NEW.deadline
    )
  FROM user_profiles up
  WHERE up.role = 'vendor' 
    AND up.status = 'approved'
    AND (up.categories IS NULL OR NEW.category = ANY(up.categories));
    
  RETURN NEW;
END;
$$;