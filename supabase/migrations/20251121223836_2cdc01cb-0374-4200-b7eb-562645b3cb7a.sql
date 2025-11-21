-- Create vendor_branding table
CREATE TABLE IF NOT EXISTS vendor_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL UNIQUE,
  company_name TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  tax_id TEXT,
  payment_terms TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#666666',
  footer_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE vendor_branding ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Vendors can manage own branding"
  ON vendor_branding
  FOR ALL
  USING (auth.uid() = vendor_id)
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Admins can manage all branding"
  ON vendor_branding
  FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

-- Create index
CREATE INDEX idx_vendor_branding_vendor_id ON vendor_branding(vendor_id);

-- Add updated_at trigger
CREATE TRIGGER update_vendor_branding_updated_at
  BEFORE UPDATE ON vendor_branding
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();