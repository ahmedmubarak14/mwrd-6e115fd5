
-- Add missing columns to orders table for better tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS offer_id uuid REFERENCES offers(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency text DEFAULT 'SAR';

-- Add client approval tracking columns to offers table
ALTER TABLE offers ADD COLUMN IF NOT EXISTS client_approval_date timestamp with time zone;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS client_approval_notes text;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS currency text DEFAULT 'SAR';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS delivery_time_days integer;

-- Create function to automatically create order when offer is accepted
CREATE OR REPLACE FUNCTION create_order_from_accepted_offer()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create order if client approval status changed to 'approved'
  IF NEW.client_approval_status = 'approved' AND OLD.client_approval_status != 'approved' THEN
    INSERT INTO orders (
      id,
      offer_id,
      request_id,
      client_id,
      vendor_id,
      title,
      description,
      amount,
      currency,
      status,
      delivery_date,
      created_at,
      updated_at
    )
    SELECT 
      gen_random_uuid(),
      NEW.id,
      NEW.request_id,
      r.client_id,
      NEW.vendor_id,
      COALESCE(NEW.title, r.title),
      COALESCE(NEW.description, r.description),
      NEW.price,
      COALESCE(NEW.currency, 'SAR'),
      'pending'::order_status,
      CASE 
        WHEN NEW.delivery_time_days IS NOT NULL THEN 
          NOW() + (NEW.delivery_time_days || ' days')::INTERVAL
        ELSE NULL
      END,
      NOW(),
      NOW()
    FROM requests r
    WHERE r.id = NEW.request_id;
    
    -- Update offer approval date
    NEW.client_approval_date = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic order creation
DROP TRIGGER IF EXISTS create_order_on_offer_approval ON offers;
CREATE TRIGGER create_order_on_offer_approval
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION create_order_from_accepted_offer();

-- Enable realtime for better user experience
ALTER TABLE offers REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE offers;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Create notification function for offer updates
CREATE OR REPLACE FUNCTION notify_offer_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify client when offer status changes
  IF NEW.client_approval_status != OLD.client_approval_status THEN
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
      r.client_id,
      'offer_status_update',
      'Offer Status Updated',
      CASE 
        WHEN NEW.client_approval_status = 'approved' THEN 'Your offer has been approved and an order has been created.'
        WHEN NEW.client_approval_status = 'rejected' THEN 'Your offer has been rejected.'
        ELSE 'Your offer status has been updated to ' || NEW.client_approval_status
      END,
      'offers',
      CASE 
        WHEN NEW.client_approval_status = 'approved' THEN 'high'
        ELSE 'medium'
      END,
      json_build_object(
        'offer_id', NEW.id,
        'request_id', NEW.request_id,
        'new_status', NEW.client_approval_status,
        'old_status', OLD.client_approval_status
      )
    FROM requests r
    WHERE r.id = NEW.request_id;

    -- Notify vendor about status change
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      category,
      priority,
      data
    )
    VALUES (
      NEW.vendor_id,
      'offer_status_update',
      'Offer Status Updated',
      CASE 
        WHEN NEW.client_approval_status = 'approved' THEN 'Your offer has been approved by the client!'
        WHEN NEW.client_approval_status = 'rejected' THEN 'Your offer has been rejected by the client.'
        ELSE 'Your offer status has been updated to ' || NEW.client_approval_status
      END,
      'offers',
      CASE 
        WHEN NEW.client_approval_status = 'approved' THEN 'high'
        ELSE 'medium'
      END,
      json_build_object(
        'offer_id', NEW.id,
        'request_id', NEW.request_id,
        'new_status', NEW.client_approval_status,
        'old_status', OLD.client_approval_status
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications
DROP TRIGGER IF EXISTS notify_on_offer_status_change ON offers;
CREATE TRIGGER notify_on_offer_status_change
  AFTER UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION notify_offer_status_change();
