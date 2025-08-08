-- Update the notify_on_offer_creation function to use the correct notification type
CREATE OR REPLACE FUNCTION public.notify_on_offer_creation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  request_owner_id UUID;
  request_title TEXT;
BEGIN
  -- Get request owner and title
  SELECT user_id, title INTO request_owner_id, request_title
  FROM public.requests 
  WHERE id = NEW.request_id;
  
  -- Notify request owner of new offer
  PERFORM public.create_notification(
    request_owner_id,
    'new_offer',
    'New Offer Received',
    'You received a new offer for: ' || request_title,
    NEW.id
  );
  
  RETURN NEW;
END;
$function$