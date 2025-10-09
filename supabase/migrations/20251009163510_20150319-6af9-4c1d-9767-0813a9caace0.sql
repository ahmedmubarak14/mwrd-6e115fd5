-- =====================================================
-- PHASE 2: FINANCE MODULE - INVOICING SYSTEM
-- =====================================================

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  
  -- Relationships
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE SET NULL,
  client_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  
  -- Dates
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  paid_date DATE,
  
  -- Financial details
  subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(15,2) DEFAULT 0,
  total_amount NUMERIC(15,2) NOT NULL,
  paid_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  balance_due NUMERIC(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'SAR',
  
  -- Status and metadata
  status TEXT NOT NULL DEFAULT 'draft',
  payment_terms TEXT,
  notes TEXT,
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled')),
  CONSTRAINT valid_amounts CHECK (total_amount >= 0 AND paid_amount >= 0 AND balance_due >= 0),
  CONSTRAINT valid_dates CHECK (due_date >= issue_date)
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  
  -- Item details
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(15,2) NOT NULL,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  
  -- Calculated amounts
  subtotal NUMERIC(15,2) NOT NULL,
  tax_amount NUMERIC(15,2) NOT NULL,
  total NUMERIC(15,2) NOT NULL,
  
  -- Metadata
  sort_order INTEGER DEFAULT 0,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_quantity CHECK (quantity > 0),
  CONSTRAINT valid_unit_price CHECK (unit_price >= 0),
  CONSTRAINT valid_totals CHECK (subtotal >= 0 AND tax_amount >= 0 AND total >= 0)
);

-- Create invoice_payments table
CREATE TABLE IF NOT EXISTS public.invoice_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  
  -- Payment details
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(15,2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_reference TEXT,
  
  -- Status and metadata
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  recorded_by UUID,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_amount CHECK (amount > 0),
  CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

-- Create indexes for performance
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_invoices_vendor_id ON public.invoices(vendor_id);
CREATE INDEX idx_invoices_order_id ON public.invoices(order_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX idx_invoice_payments_invoice_id ON public.invoice_payments(invoice_id);

-- Enable Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
CREATE POLICY "Clients can view own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = client_id OR get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Vendors can view own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = vendor_id OR get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Vendors can create invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (auth.uid() = vendor_id OR get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Vendors can update own invoices"
  ON public.invoices FOR UPDATE
  USING (auth.uid() = vendor_id OR get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Admins can manage all invoices"
  ON public.invoices FOR ALL
  USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- RLS Policies for invoice_items
CREATE POLICY "Users can view invoice items"
  ON public.invoice_items FOR SELECT
  USING (
    invoice_id IN (
      SELECT id FROM public.invoices 
      WHERE client_id = auth.uid() 
         OR vendor_id = auth.uid()
         OR get_user_role(auth.uid()) = 'admin'::user_role
    )
  );

CREATE POLICY "Vendors can manage invoice items"
  ON public.invoice_items FOR ALL
  USING (
    invoice_id IN (
      SELECT id FROM public.invoices 
      WHERE vendor_id = auth.uid() OR get_user_role(auth.uid()) = 'admin'::user_role
    )
  );

-- RLS Policies for invoice_payments
CREATE POLICY "Users can view invoice payments"
  ON public.invoice_payments FOR SELECT
  USING (
    invoice_id IN (
      SELECT id FROM public.invoices 
      WHERE client_id = auth.uid() 
         OR vendor_id = auth.uid()
         OR get_user_role(auth.uid()) = 'admin'::user_role
    )
  );

CREATE POLICY "Authorized users can record payments"
  ON public.invoice_payments FOR INSERT
  WITH CHECK (
    invoice_id IN (
      SELECT id FROM public.invoices 
      WHERE client_id = auth.uid() 
         OR vendor_id = auth.uid()
         OR get_user_role(auth.uid()) = 'admin'::user_role
    )
  );

CREATE POLICY "Admins can manage payments"
  ON public.invoice_payments FOR ALL
  USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Trigger to auto-update invoice timestamps
CREATE OR REPLACE FUNCTION update_invoice_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invoices_updated_at_trigger
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_updated_at();

-- Trigger to recalculate invoice totals when items change
CREATE OR REPLACE FUNCTION recalculate_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
  invoice_subtotal NUMERIC(15,2);
  invoice_tax NUMERIC(15,2);
  invoice_total NUMERIC(15,2);
BEGIN
  -- Calculate totals from all items
  SELECT 
    COALESCE(SUM(subtotal), 0),
    COALESCE(SUM(tax_amount), 0),
    COALESCE(SUM(total), 0)
  INTO invoice_subtotal, invoice_tax, invoice_total
  FROM public.invoice_items
  WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Update the invoice
  UPDATE public.invoices
  SET 
    subtotal = invoice_subtotal,
    tax_amount = invoice_tax,
    total_amount = invoice_total,
    balance_due = invoice_total - paid_amount,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER recalculate_invoice_on_item_change
  AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_invoice_totals();

-- Trigger to update balance when payment is recorded
CREATE OR REPLACE FUNCTION update_invoice_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    UPDATE public.invoices
    SET 
      paid_amount = paid_amount + NEW.amount,
      balance_due = total_amount - (paid_amount + NEW.amount),
      status = CASE 
        WHEN (total_amount - (paid_amount + NEW.amount)) <= 0 THEN 'paid'
        WHEN (paid_amount + NEW.amount) > 0 THEN 'partial'
        ELSE status
      END,
      paid_date = CASE 
        WHEN (total_amount - (paid_amount + NEW.amount)) <= 0 THEN CURRENT_DATE
        ELSE paid_date
      END,
      updated_at = NOW()
    WHERE id = NEW.invoice_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_invoice_on_payment_trigger
  AFTER INSERT ON public.invoice_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_on_payment();

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  invoice_num TEXT;
BEGIN
  -- Get the next sequential number
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-(\d+)') AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.invoices
  WHERE invoice_number ~ '^INV-\d+$';
  
  -- Format as INV-00001
  invoice_num := 'INV-' || LPAD(next_number::TEXT, 5, '0');
  
  RETURN invoice_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Comment on tables
COMMENT ON TABLE public.invoices IS 'Invoices for orders and services';
COMMENT ON TABLE public.invoice_items IS 'Line items for each invoice';
COMMENT ON TABLE public.invoice_payments IS 'Payment records for invoices';