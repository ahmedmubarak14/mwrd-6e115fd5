-- Add product_id to RFQs table to support product-specific quote requests
ALTER TABLE public.rfqs 
ADD COLUMN product_id uuid REFERENCES public.vendor_products(id);

-- Add index for performance
CREATE INDEX idx_rfqs_product_id ON public.rfqs(product_id);

-- Add index for vendor queries
CREATE INDEX idx_rfqs_vendor_product ON public.rfqs(product_id, client_id);