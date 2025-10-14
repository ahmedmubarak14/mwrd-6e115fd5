-- Create KYV (Know Your Vendor) submissions table
CREATE TABLE public.kyv_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Link to main KYC submission (for shared fields)
  kyc_submission_id UUID REFERENCES public.kyc_submissions(id),
  
  -- Section 1: Basic Info (additional to KYC)
  trade_name TEXT,
  number_of_employees TEXT NOT NULL,
  
  -- Section 2: Tax & Legal (additional documents)
  zakat_certificate_url TEXT,
  chamber_commerce_certificate_url TEXT,
  company_logo_url TEXT,
  
  -- Section 4: Banking Details
  bank_name TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  iban_number TEXT NOT NULL,
  bank_branch TEXT,
  bank_confirmation_letter_url TEXT NOT NULL,
  
  -- Section 5: Product & Service Details
  product_catalog_url TEXT,
  price_list_url TEXT,
  minimum_order_value DECIMAL(15,2),
  delivery_sla_days INTEGER NOT NULL,
  payment_terms TEXT NOT NULL,
  
  -- Section 6: Compliance & Certification
  quality_certificates_urls TEXT[],
  safety_certificates_urls TEXT[],
  insurance_license_urls TEXT[],
  
  -- Section 8: Declaration
  vendor_signature_url TEXT,
  company_stamp_url TEXT,
  declaration_accepted BOOLEAN NOT NULL DEFAULT false,
  declaration_date TIMESTAMP WITH TIME ZONE,
  
  -- Submission tracking
  submission_status TEXT NOT NULL DEFAULT 'draft' 
    CHECK (submission_status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  reviewer_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT iban_format CHECK (iban_number ~ '^SA[0-9]{22}$'),
  CONSTRAINT declaration_required CHECK (
    submission_status != 'submitted' OR declaration_accepted = true
  )
);

-- Create indexes
CREATE INDEX idx_kyv_submissions_user ON public.kyv_submissions(user_id);
CREATE INDEX idx_kyv_submissions_status ON public.kyv_submissions(submission_status);
CREATE INDEX idx_kyv_submissions_kyc ON public.kyv_submissions(kyc_submission_id);

-- Enable RLS
ALTER TABLE public.kyv_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Vendors can view own KYV submissions"
  ON public.kyv_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Vendors can insert own KYV submissions"
  ON public.kyv_submissions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'vendor')
  );

CREATE POLICY "Vendors can update own draft/rejected KYV"
  ON public.kyv_submissions FOR UPDATE
  USING (
    auth.uid() = user_id AND 
    submission_status IN ('draft', 'rejected')
  );

CREATE POLICY "Admins can manage all KYV submissions"
  ON public.kyv_submissions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Add trigger for updated_at
CREATE TRIGGER update_kyv_submissions_updated_at
  BEFORE UPDATE ON public.kyv_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();