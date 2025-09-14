-- Create purchase_orders table for formal RFQ workflow
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT NOT NULL UNIQUE,
  rfq_id UUID REFERENCES public.rfqs(id),
  bid_id UUID REFERENCES public.bids(id),
  client_id UUID NOT NULL,
  vendor_id UUID NOT NULL,  
  total_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SAR',
  delivery_date DATE,
  payment_terms TEXT,
  shipping_address TEXT,
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'acknowledged', 'in_progress', 'completed', 'cancelled')),
  terms_and_conditions TEXT,
  technical_specifications JSONB DEFAULT '{}',
  warranty_period_months INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_milestones table for enhanced order tracking
CREATE TABLE IF NOT EXISTS public.order_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
  due_date DATE,
  completed_date TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on purchase_orders
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

-- Enable RLS on order_milestones  
ALTER TABLE public.order_milestones ENABLE ROW LEVEL SECURITY;

-- RLS policies for purchase_orders
CREATE POLICY "Users can view their own purchase orders" ON public.purchase_orders
FOR SELECT USING (client_id = auth.uid() OR vendor_id = auth.uid() OR get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Clients can create purchase orders" ON public.purchase_orders
FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own purchase orders" ON public.purchase_orders
FOR UPDATE USING (client_id = auth.uid() OR vendor_id = auth.uid() OR get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Admins can manage all purchase orders" ON public.purchase_orders
FOR ALL USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- RLS policies for order_milestones
CREATE POLICY "Users can view milestones for their orders" ON public.order_milestones
FOR SELECT USING (
  order_id IN (
    SELECT id FROM public.orders 
    WHERE client_id = auth.uid() OR vendor_id = auth.uid()
  ) OR get_user_role(auth.uid()) = 'admin'::user_role
);

CREATE POLICY "Users can manage milestones for their orders" ON public.order_milestones
FOR ALL USING (
  order_id IN (
    SELECT id FROM public.orders 
    WHERE client_id = auth.uid() OR vendor_id = auth.uid()
  ) OR get_user_role(auth.uid()) = 'admin'::user_role
);

-- Add updated_at triggers
CREATE OR REPLACE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_order_milestones_updated_at
  BEFORE UPDATE ON public.order_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();