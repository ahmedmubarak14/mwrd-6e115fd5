
-- 1) Supplier moderation fields and safe read access

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS moderation_reason text,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid;

-- Allow authenticated users to view approved supplier profiles
CREATE POLICY "Authenticated can view approved suppliers"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (role = 'supplier' AND moderation_status = 'approved');

-- Allow users to view profiles of their chat participants (client <-> supplier)
CREATE POLICY "Users can view profiles of their chat participants"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE (c.client_id = auth.uid() AND c.supplier_id = user_profiles.id)
         OR (c.supplier_id = auth.uid() AND c.client_id = user_profiles.id)
    )
    OR is_admin()
  );

-- Prevent non-admin users from changing role or company_name
CREATE OR REPLACE FUNCTION public.prevent_non_admin_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NOT is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role OR NEW.company_name IS DISTINCT FROM OLD.company_name THEN
      RAISE EXCEPTION 'Only admins can change role and company name' USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_non_admin_profile_changes ON public.user_profiles;
CREATE TRIGGER trg_prevent_non_admin_profile_changes
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_non_admin_profile_changes();

-- Audit admin changes to role/company_name into activity_logs
CREATE OR REPLACE FUNCTION public.audit_admin_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF is_admin() AND (
    NEW.role IS DISTINCT FROM OLD.role OR
    NEW.company_name IS DISTINCT FROM OLD.company_name
  ) THEN
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, metadata)
    VALUES (
      auth.uid(),
      'admin_profile_update',
      'user_profiles',
      NEW.id,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'old_company_name', OLD.company_name,
        'new_company_name', NEW.company_name,
        'target_user_id', NEW.id
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_admin_profile_changes ON public.user_profiles;
CREATE TRIGGER trg_audit_admin_profile_changes
AFTER UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.audit_admin_profile_changes();


-- 2) Supplier details table for filters (category, city, price range, rating, availability)

CREATE TABLE IF NOT EXISTS public.supplier_details (
  user_id uuid PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  city text,
  categories text[],
  min_price numeric,
  max_price numeric,
  rating numeric,
  availability boolean NOT NULL DEFAULT true,
  languages text[],
  response_time text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.supplier_details ENABLE ROW LEVEL SECURITY;

-- Helpers to check approved suppliers (avoid RLS recursion via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_approved_supplier(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles p
    WHERE p.id = _user_id
      AND p.role = 'supplier'
      AND p.moderation_status = 'approved'
  );
$$;

-- RLS policies
CREATE POLICY "Suppliers manage their own details"
  ON public.supplier_details
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Suppliers update their own details"
  ON public.supplier_details
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage supplier details"
  ON public.supplier_details
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone authenticated can view approved supplier details"
  ON public.supplier_details
  FOR SELECT
  TO authenticated
  USING (public.is_approved_supplier(user_id) OR is_admin());

-- Keep updated_at fresh
DROP TRIGGER IF EXISTS trg_supplier_details_updated_at ON public.supplier_details;
CREATE TRIGGER trg_supplier_details_updated_at
BEFORE UPDATE ON public.supplier_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- 3) Admin access and performance for requests/offers

-- Admin can view/update any request (for moderation)
CREATE POLICY "Admins can view all requests"
  ON public.requests
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update any request"
  ON public.requests
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin can view/update any offer (for moderation)
CREATE POLICY "Admins can view all offers"
  ON public.offers
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update any offer"
  ON public.offers
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Helpful indexes for filters/pagination on requests
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_category ON public.requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_location ON public.requests(location);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.requests(created_at);


-- 4) Invoices (for billing history and admin transactions)

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  offer_id uuid REFERENCES public.offers(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'SAR',
  status text NOT NULL DEFAULT 'issued', -- issued | paid | void
  file_path text, -- storage path in 'documents' bucket
  issued_at timestamptz NOT NULL DEFAULT now(),
  due_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
  ON public.invoices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can manage invoices"
  ON public.invoices
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.invoices;
CREATE TRIGGER trg_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


-- 5) Orders: link to offers and enforce allowed transitions

ALTER TABLE public.orders
  ALTER COLUMN status SET DEFAULT 'draft';

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS offer_id uuid REFERENCES public.offers(id) ON DELETE SET NULL;

-- Validate allowed states and transitions
CREATE OR REPLACE FUNCTION public.validate_order_status_transition()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  allowed_statuses text[] := ARRAY[
    'draft','offer_accepted','deposit_paid','in_progress','delivered','completed'
  ];
  from_status text;
  to_status text;
BEGIN
  from_status := COALESCE(OLD.status, 'draft');
  to_status := COALESCE(NEW.status, 'draft');

  -- Ensure the new status is allowed
  IF NOT (to_status = ANY(allowed_statuses)) THEN
    RAISE EXCEPTION 'Invalid order status: %', to_status;
  END IF;

  -- Allow no-op updates
  IF from_status = to_status THEN
    RETURN NEW;
  END IF;

  -- Enforce forward-only valid transitions
  IF NOT (
    (from_status = 'draft'          AND to_status = 'offer_accepted') OR
    (from_status = 'offer_accepted' AND to_status = 'deposit_paid') OR
    (from_status = 'deposit_paid'   AND to_status = 'in_progress') OR
    (from_status = 'in_progress'    AND to_status = 'delivered') OR
    (from_status = 'delivered'      AND to_status = 'completed')
  ) THEN
    RAISE EXCEPTION 'Invalid order status transition: % -> %', from_status, to_status;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_order_status_transition ON public.orders;
CREATE TRIGGER trg_validate_order_status_transition
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.validate_order_status_transition();


-- 6) Admin pending counters (for sidebar badges)

CREATE OR REPLACE FUNCTION public.get_admin_pending_counts()
RETURNS TABLE(
  pending_suppliers bigint,
  pending_requests bigint,
  pending_offers bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.user_profiles WHERE role = 'supplier' AND moderation_status = 'pending') AS pending_suppliers,
    (SELECT COUNT(*) FROM public.requests WHERE admin_approval_status = 'pending') AS pending_requests,
    (SELECT COUNT(*) FROM public.offers WHERE status = 'pending' OR client_approval_status = 'pending') AS pending_offers;
END;
$$;


-- 7) Keep updated_at fresh on key tables (if not already added)
DROP TRIGGER IF EXISTS trg_requests_updated_at ON public.requests;
CREATE TRIGGER trg_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_offers_updated_at ON public.offers;
CREATE TRIGGER trg_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER trg_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
