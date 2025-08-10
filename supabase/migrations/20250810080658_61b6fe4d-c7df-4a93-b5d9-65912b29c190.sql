-- Tighten supplier update constraints: prevent suppliers from modifying client approval fields
CREATE OR REPLACE FUNCTION public.validate_offer_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  req_owner uuid;
BEGIN
  -- Admins can do anything
  IF is_admin() THEN
    RETURN NEW;
  END IF;

  -- Supplier can update only their own offer, but NOT client approval fields
  IF auth.uid() = OLD.supplier_id THEN
    IF COALESCE(NEW.client_approval_status, OLD.client_approval_status) IS DISTINCT FROM COALESCE(OLD.client_approval_status, NEW.client_approval_status)
       OR COALESCE(NEW.client_approval_notes, OLD.client_approval_notes) IS DISTINCT FROM COALESCE(OLD.client_approval_notes, NEW.client_approval_notes)
       OR COALESCE(NEW.client_approval_date, OLD.client_approval_date) IS DISTINCT FROM COALESCE(OLD.client_approval_date, NEW.client_approval_date) THEN
      RAISE EXCEPTION 'Suppliers cannot modify client approval fields' USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;

  -- Determine request owner
  SELECT user_id INTO req_owner FROM public.requests WHERE id = OLD.request_id;

  -- If request owner is updating, only allow client approval fields
  IF auth.uid() = req_owner THEN
    IF COALESCE(NEW.title, OLD.title)           IS DISTINCT FROM COALESCE(OLD.title, NEW.title) OR
       COALESCE(NEW.description, OLD.description) IS DISTINCT FROM COALESCE(OLD.description, NEW.description) OR
       COALESCE(NEW.price, OLD.price)           IS DISTINCT FROM COALESCE(OLD.price, NEW.price) OR
       COALESCE(NEW.currency, OLD.currency)     IS DISTINCT FROM COALESCE(OLD.currency, NEW.currency) OR
       COALESCE(NEW.delivery_time_days, OLD.delivery_time_days) IS DISTINCT FROM COALESCE(OLD.delivery_time_days, NEW.delivery_time_days) OR
       COALESCE(NEW.status, OLD.status)         IS DISTINCT FROM COALESCE(OLD.status, NEW.status) OR
       COALESCE(NEW.request_id::text, OLD.request_id::text) IS DISTINCT FROM COALESCE(OLD.request_id::text, NEW.request_id::text) OR
       COALESCE(NEW.supplier_id::text, OLD.supplier_id::text) IS DISTINCT FROM COALESCE(OLD.supplier_id::text, NEW.supplier_id::text) OR
       COALESCE(NEW.created_at, OLD.created_at) IS DISTINCT FROM COALESCE(OLD.created_at, NEW.created_at) OR
       COALESCE(NEW.updated_at, OLD.updated_at) IS DISTINCT FROM COALESCE(OLD.updated_at, NEW.updated_at) THEN
      RAISE EXCEPTION 'Only approval fields can be updated by request owner' USING ERRCODE = '42501';
    END IF;

    -- Auto-set approval date when status changes
    IF NEW.client_approval_status IS DISTINCT FROM OLD.client_approval_status THEN
      NEW.client_approval_date := now();
    END IF;

    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Not authorized to update this offer' USING ERRCODE = '42501';
END;
$function$;