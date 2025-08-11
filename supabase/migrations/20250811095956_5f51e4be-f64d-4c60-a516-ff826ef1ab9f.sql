-- Fix the notification function to use correct notification types
CREATE OR REPLACE FUNCTION public.notify_on_offer_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
  notification_type TEXT;
BEGIN
  -- Only notify if client_approval_status changed
  IF OLD.client_approval_status IS DISTINCT FROM NEW.client_approval_status THEN
    CASE NEW.client_approval_status
      WHEN 'approved' THEN
        notification_title := 'Offer Approved';
        notification_message := 'Your offer has been approved by the client';
        notification_type := 'offer_accepted';
      WHEN 'rejected' THEN
        notification_title := 'Offer Rejected';
        notification_message := 'Your offer has been rejected by the client';
        notification_type := 'offer_rejected';
      ELSE
        RETURN NEW;
    END CASE;
    
    -- Notify supplier
    PERFORM public.create_notification(
      NEW.supplier_id,
      notification_type,
      notification_title,
      notification_message,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$function$;