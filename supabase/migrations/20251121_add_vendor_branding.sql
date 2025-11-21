-- Create vendor branding table for PDF quote generator
-- PRD Section 4.2: SaaS-lite Toolkit for Suppliers
-- Allows vendors to store their company branding for professional PDF quotes

CREATE TABLE IF NOT EXISTS vendor_branding (
  vendor_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  tax_id TEXT,
  payment_terms TEXT DEFAULT 'Payment due within 30 days of invoice date',
  terms_conditions TEXT DEFAULT 'This quote is valid for 30 days from the date of issue.',
  primary_color TEXT DEFAULT '#2563eb',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for vendor logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-logos', 'vendor-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE vendor_branding ENABLE ROW LEVEL SECURITY;

-- Policies: Vendors can only manage their own branding
CREATE POLICY "Vendors can view own branding"
  ON vendor_branding
  FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can insert own branding"
  ON vendor_branding
  FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update own branding"
  ON vendor_branding
  FOR UPDATE
  USING (auth.uid() = vendor_id)
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete own branding"
  ON vendor_branding
  FOR DELETE
  USING (auth.uid() = vendor_id);

-- Storage policies for vendor logos
CREATE POLICY "Vendors can upload own logos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'vendor-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view vendor logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'vendor-logos');

CREATE POLICY "Vendors can update own logos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'vendor-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Vendors can delete own logos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'vendor-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vendor_branding_vendor_id ON vendor_branding(vendor_id);

-- Add comment
COMMENT ON TABLE vendor_branding IS
'Stores vendor company branding information for generating professional PDF quotes. Part of PRD Section 4.2 SaaS-lite Toolkit.';
