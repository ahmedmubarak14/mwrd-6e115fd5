-- Create phone verification table
CREATE TABLE public.phone_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  otp_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT phone_format_check CHECK (phone_number ~ '^\+966[0-9]{9}$')
);

CREATE INDEX idx_phone_verifications_user_id ON public.phone_verifications(user_id);
CREATE INDEX idx_phone_verifications_phone ON public.phone_verifications(phone_number);
CREATE INDEX idx_phone_verifications_expires ON public.phone_verifications(otp_expires_at);

-- RLS Policies
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own phone verifications"
  ON public.phone_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own phone verifications"
  ON public.phone_verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all phone verifications"
  ON public.phone_verifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create comprehensive KYC submissions table
CREATE TABLE public.kyc_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Focal Contact Person
  focal_first_name TEXT NOT NULL,
  focal_last_name TEXT NOT NULL,
  focal_designation TEXT NOT NULL,
  focal_email TEXT NOT NULL,
  focal_phone TEXT NOT NULL,
  focal_phone_verified BOOLEAN DEFAULT FALSE,
  
  -- Company Legal Info
  company_legal_name TEXT NOT NULL,
  cr_number TEXT NOT NULL,
  cr_issuing_date DATE NOT NULL,
  cr_issuing_city TEXT NOT NULL,
  cr_validity_date DATE NOT NULL,
  cr_document_url TEXT NOT NULL,
  
  -- Tax Information
  vat_number TEXT NOT NULL,
  vat_certificate_url TEXT NOT NULL,
  
  -- National Address / SPL
  address_city TEXT NOT NULL,
  address_area TEXT NOT NULL,
  address_postal_code TEXT NOT NULL,
  address_street_name TEXT NOT NULL,
  address_building_number TEXT NOT NULL,
  address_unit_number TEXT,
  address_certificate_url TEXT NOT NULL,
  
  -- Organization Details
  organization_type TEXT NOT NULL,
  nature_of_business TEXT NOT NULL,
  
  -- Authorized Signatory (Agreement Signer)
  signatory_first_name TEXT NOT NULL,
  signatory_last_name TEXT NOT NULL,
  signatory_designation TEXT NOT NULL,
  signatory_email TEXT NOT NULL,
  signatory_phone TEXT NOT NULL,
  
  -- Account & Credit
  account_type TEXT NOT NULL DEFAULT 'cash' CHECK (account_type IN ('cash', 'credit')),
  credit_ceiling DECIMAL(15,2),
  payment_period_days INTEGER,
  
  -- Services/Products
  service_categories TEXT[] NOT NULL DEFAULT '{}',
  
  -- Submission Status
  submission_status TEXT DEFAULT 'draft' CHECK (submission_status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewer_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Validation Constraints
  CONSTRAINT cr_validity_future CHECK (cr_validity_date >= CURRENT_DATE),
  CONSTRAINT cr_issuing_past CHECK (cr_issuing_date <= CURRENT_DATE),
  CONSTRAINT vat_format CHECK (vat_number ~ '^[0-9]{15}$'),
  CONSTRAINT credit_requirements CHECK (
    (account_type = 'cash') OR 
    (account_type = 'credit' AND credit_ceiling > 0 AND payment_period_days > 0)
  )
);

CREATE INDEX idx_kyc_submissions_user ON public.kyc_submissions(user_id);
CREATE INDEX idx_kyc_submissions_status ON public.kyc_submissions(submission_status);
CREATE INDEX idx_kyc_submissions_cr ON public.kyc_submissions(cr_number);
CREATE INDEX idx_kyc_submissions_vat ON public.kyc_submissions(vat_number);

-- RLS Policies
ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own KYC submissions"
  ON public.kyc_submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own KYC submissions"
  ON public.kyc_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own draft/rejected submissions"
  ON public.kyc_submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND submission_status IN ('draft', 'rejected'));

CREATE POLICY "Admins can view all KYC submissions"
  ON public.kyc_submissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create client credit accounts table
CREATE TABLE public.client_credit_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  kyc_submission_id UUID REFERENCES public.kyc_submissions(id),
  
  -- Credit Terms
  credit_ceiling DECIMAL(15,2) NOT NULL DEFAULT 0,
  payment_period_days INTEGER NOT NULL DEFAULT 0,
  credit_utilization DECIMAL(15,2) NOT NULL DEFAULT 0,
  available_credit DECIMAL(15,2) GENERATED ALWAYS AS (credit_ceiling - credit_utilization) STORED,
  
  -- Status
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'on_hold', 'closed')),
  on_hold_reason TEXT,
  
  -- Aging & Overdue
  days_overdue INTEGER DEFAULT 0,
  overdue_amount DECIMAL(15,2) DEFAULT 0,
  
  -- Timestamps
  activated_at TIMESTAMP WITH TIME ZONE,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_credit_accounts_user ON public.client_credit_accounts(user_id);
CREATE INDEX idx_credit_accounts_status ON public.client_credit_accounts(account_status);

-- RLS Policies
ALTER TABLE public.client_credit_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit account"
  ON public.client_credit_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all credit accounts"
  ON public.client_credit_accounts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Track all credit-affecting transactions
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_account_id UUID NOT NULL REFERENCES public.client_credit_accounts(id) ON DELETE CASCADE,
  
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('order_placed', 'payment_received', 'credit_adjustment', 'hold_applied', 'hold_released')),
  amount DECIMAL(15,2) NOT NULL,
  
  -- Before/After snapshots
  utilization_before DECIMAL(15,2) NOT NULL,
  utilization_after DECIMAL(15,2) NOT NULL,
  
  -- Reference
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_account ON public.credit_transactions(credit_account_id);
CREATE INDEX idx_credit_transactions_type ON public.credit_transactions(transaction_type);
CREATE INDEX idx_credit_transactions_date ON public.credit_transactions(created_at DESC);

-- RLS Policies
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit transactions"
  ON public.credit_transactions FOR SELECT
  TO authenticated
  USING (credit_account_id IN (
    SELECT id FROM public.client_credit_accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all credit transactions"
  ON public.credit_transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "System can insert credit transactions"
  ON public.credit_transactions FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);