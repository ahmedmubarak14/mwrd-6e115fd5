-- Enable realtime for key tables to support workflow notifications
ALTER TABLE requests REPLICA IDENTITY FULL;
ALTER TABLE offers REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- Add realtime publication for workflow tables
ALTER PUBLICATION supabase_realtime ADD TABLE requests;
ALTER PUBLICATION supabase_realtime ADD TABLE offers;  
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Create notification triggers for workflow events
CREATE OR REPLACE FUNCTION notify_request_created()
RETURNS trigger AS $$
BEGIN
  -- Notify admins about new requests needing approval
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
    json_build_object(
      'request_id', NEW.id,
      'title', NEW.title,
      'category', NEW.category
    )
  FROM user_profiles up
  WHERE up.role = 'admin';

  -- Notify vendors in matching categories
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
    'A new request in your category "' || NEW.category || '" is now available for offers.',
    'opportunities',
    'medium',
    json_build_object(
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION notify_offer_created() 
RETURNS trigger AS $$
BEGIN
  -- Notify client about new offer
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
    'offer_received',
    'New Offer Received',
    'You have received a new offer for your request "' || r.title || '".',
    'offers',
    'high',
    json_build_object(
      'offer_id', NEW.id,
      'request_id', NEW.request_id,
      'vendor_id', NEW.vendor_id,
      'price', NEW.price,
      'delivery_time_days', NEW.delivery_time_days
    )
  FROM requests r
  WHERE r.id = NEW.request_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_notify_request_created ON requests;
CREATE TRIGGER trigger_notify_request_created
  AFTER INSERT ON requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_request_created();

DROP TRIGGER IF EXISTS trigger_notify_offer_created ON offers;  
CREATE TRIGGER trigger_notify_offer_created
  AFTER INSERT ON offers
  FOR EACH ROW
  EXECUTE FUNCTION notify_offer_created();