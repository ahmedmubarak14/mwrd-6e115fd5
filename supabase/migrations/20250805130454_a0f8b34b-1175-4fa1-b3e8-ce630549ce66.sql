-- Enable real-time for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Add approval-related fields to requests table
ALTER TABLE public.requests 
ADD COLUMN admin_approval_status TEXT DEFAULT 'pending' CHECK (admin_approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN admin_approved_by UUID REFERENCES auth.users(id),
ADD COLUMN admin_approval_notes TEXT,
ADD COLUMN admin_approval_date TIMESTAMPTZ;

-- Add approval fields to offers table  
ALTER TABLE public.offers
ADD COLUMN client_approval_status TEXT DEFAULT 'pending' CHECK (client_approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN client_approval_date TIMESTAMPTZ,
ADD COLUMN client_approval_notes TEXT;

-- Create function to automatically create notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_reference_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, reference_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_reference_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create trigger function for new offer notifications
CREATE OR REPLACE FUNCTION public.notify_on_offer_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    'offer',
    'New Offer Received',
    'You received a new offer for: ' || request_title,
    NEW.id
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for offer notifications
CREATE TRIGGER trigger_notify_offer_creation
  AFTER INSERT ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_offer_creation();

-- Create trigger function for offer status updates
CREATE OR REPLACE FUNCTION public.notify_on_offer_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Only notify if client_approval_status changed
  IF OLD.client_approval_status IS DISTINCT FROM NEW.client_approval_status THEN
    CASE NEW.client_approval_status
      WHEN 'approved' THEN
        notification_title := 'Offer Approved';
        notification_message := 'Your offer has been approved by the client';
      WHEN 'rejected' THEN
        notification_title := 'Offer Rejected';
        notification_message := 'Your offer has been rejected by the client';
      ELSE
        RETURN NEW;
    END CASE;
    
    -- Notify supplier
    PERFORM public.create_notification(
      NEW.supplier_id,
      'offer_status',
      notification_title,
      notification_message,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for offer status changes
CREATE TRIGGER trigger_notify_offer_status_change
  AFTER UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_offer_status_change();

-- Create trigger function for request approval notifications
CREATE OR REPLACE FUNCTION public.notify_on_request_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Only notify if admin_approval_status changed
  IF OLD.admin_approval_status IS DISTINCT FROM NEW.admin_approval_status THEN
    CASE NEW.admin_approval_status
      WHEN 'approved' THEN
        notification_title := 'Request Approved';
        notification_message := 'Your service request has been approved and is now visible to suppliers';
      WHEN 'rejected' THEN
        notification_title := 'Request Rejected';
        notification_message := 'Your service request requires modifications before approval';
      ELSE
        RETURN NEW;
    END CASE;
    
    -- Notify request owner
    PERFORM public.create_notification(
      NEW.user_id,
      'request_approval',
      notification_title,
      notification_message,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for request approval notifications
CREATE TRIGGER trigger_notify_request_approval
  AFTER UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_request_approval();