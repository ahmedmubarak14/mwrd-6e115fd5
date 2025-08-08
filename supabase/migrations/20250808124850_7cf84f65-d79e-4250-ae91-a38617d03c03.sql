DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'offers' AND policyname = 'Request owners can update offer approvals'
  ) THEN
    CREATE POLICY "Request owners can update offer approvals"
    ON public.offers
    FOR UPDATE
    USING (
      auth.uid() IN (
        SELECT user_id FROM public.requests WHERE id = offers.request_id
      )
    )
    WITH CHECK (
      auth.uid() IN (
        SELECT user_id FROM public.requests WHERE id = offers.request_id
      )
    );
  END IF;
END $$;

-- Validation trigger to restrict which columns request owners can modify
CREATE OR REPLACE FUNCTION public.validate_offer_update()
RETURNS trigger AS $$
DECLARE
  req_owner uuid;
BEGIN
  -- Admins can do anything
  IF is_admin() THEN
    RETURN NEW;
  END IF;

  -- Supplier can freely update their own offer
  IF auth.uid() = OLD.supplier_id THEN
    RETURN NEW;
  END IF;

  -- Determine request owner
  SELECT user_id INTO req_owner FROM public.requests WHERE id = OLD.request_id;

  -- If request owner is updating, only allow client approval fields
  IF auth.uid() = req_owner THEN
    IF COALESCE(NEW.title, '') IS DISTINCT FROM COALESCE(OLD.title, '') OR
       COALESCE(NEW.description, '') IS DISTINCT FROM COALESCE(OLD.description, '') OR
       COALESCE(NEW.price, -1) IS DISTINCT FROM COALESCE(OLD.price, -1) OR
       COALESCE(NEW.currency, '') IS DISTINCT FROM COALESCE(OLD.currency, '') OR
       COALESCE(NEW.delivery_time_days, -1) IS DISTINCT FROM COALESCE(OLD.delivery_time_days, -1) OR
       COALESCE(NEW.status, '') IS DISTINCT FROM COALESCE(OLD.status, '') OR
       COALESCE(NEW.request_id::text, '') IS DISTINCT FROM COALESCE(OLD.request_id::text, '') OR
       COALESCE(NEW.supplier_id::text, '') IS DISTINCT FROM COALESCE(OLD.supplier_id::text, '') OR
       COALESCE(NEW.created_at, NOW()) IS DISTINCT FROM COALESCE(OLD.created_at, NOW()) OR
       COALESCE(NEW.updated_at, NOW()) IS DISTINCT FROM COALESCE(OLD.updated_at, NOW()) THEN
      RAISE EXCEPTION 'Only approval fields can be updated by request owner';
    END IF;

    -- Auto-set approval date when status changes
    IF NEW.client_approval_status IS DISTINCT FROM OLD.client_approval_status THEN
      NEW.client_approval_date := now();
    END IF;

    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Not authorized to update this offer';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Attach the validation trigger
DROP TRIGGER IF EXISTS trg_validate_offer_update ON public.offers;
CREATE TRIGGER trg_validate_offer_update
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.validate_offer_update();

-- Trigger: notify on offer creation
DROP TRIGGER IF EXISTS trg_offer_after_insert ON public.offers;
CREATE TRIGGER trg_offer_after_insert
AFTER INSERT ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_offer_creation();

-- Trigger: notify supplier when client approval status changes
DROP TRIGGER IF EXISTS trg_offer_status_change ON public.offers;
CREATE TRIGGER trg_offer_status_change
AFTER UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_offer_status_change();

-- Trigger: update conversation last message timestamp when new message arrives
DROP TRIGGER IF EXISTS trg_messages_update_conversation_last_message ON public.messages;
CREATE TRIGGER trg_messages_update_conversation_last_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_message();