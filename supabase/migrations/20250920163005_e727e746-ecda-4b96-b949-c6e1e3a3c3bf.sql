-- Add missing triggers for offers table to ensure proper workflow automation

-- Trigger for notifying client when new offer is created
DROP TRIGGER IF EXISTS trigger_notify_offer_created ON offers;
CREATE TRIGGER trigger_notify_offer_created
    AFTER INSERT ON offers
    FOR EACH ROW
    EXECUTE FUNCTION notify_offer_created();

-- Trigger for creating order when offer is accepted
DROP TRIGGER IF EXISTS trigger_create_order_from_accepted_offer ON offers;
CREATE TRIGGER trigger_create_order_from_accepted_offer
    BEFORE UPDATE ON offers
    FOR EACH ROW
    EXECUTE FUNCTION create_order_from_accepted_offer();

-- Trigger for notifying about offer status changes
DROP TRIGGER IF EXISTS trigger_notify_offer_status_change ON offers;
CREATE TRIGGER trigger_notify_offer_status_change
    AFTER UPDATE ON offers
    FOR EACH ROW
    EXECUTE FUNCTION notify_offer_status_change();

-- Trigger for auto-approving offers from admin perspective
DROP TRIGGER IF EXISTS trigger_auto_approve_offers ON offers;
CREATE TRIGGER trigger_auto_approve_offers
    BEFORE INSERT ON offers
    FOR EACH ROW
    EXECUTE FUNCTION auto_approve_offers();