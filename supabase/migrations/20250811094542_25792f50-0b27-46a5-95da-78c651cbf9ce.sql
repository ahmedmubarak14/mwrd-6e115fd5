-- Ensure triggers exist for offers validation, notifications, and updated_at
-- Update the updated_at column automatically
DROP TRIGGER IF EXISTS trg_offers_updated_at ON public.offers;
CREATE TRIGGER trg_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Validate updates based on role (request owner/admin vs supplier)
DROP TRIGGER IF EXISTS trg_offers_validate ON public.offers;
CREATE TRIGGER trg_offers_validate
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.validate_offer_update();

-- Notify supplier on client approval status changes
DROP TRIGGER IF EXISTS trg_offers_notify_status ON public.offers;
CREATE TRIGGER trg_offers_notify_status
AFTER UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_offer_status_change();