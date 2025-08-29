-- Create procurement categories table
CREATE TABLE IF NOT EXISTS public.procurement_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  icon TEXT,
  parent_id UUID REFERENCES public.procurement_categories(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RFQ status enum
CREATE TYPE rfq_status AS ENUM ('draft', 'published', 'in_progress', 'evaluation', 'awarded', 'cancelled', 'completed');

-- Create RFQ priority enum  
CREATE TYPE rfq_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create RFQs table
CREATE TABLE IF NOT EXISTS public.rfqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES public.procurement_categories(id),
  subcategory_id UUID REFERENCES public.procurement_categories(id),
  budget_min DECIMAL(15,2),
  budget_max DECIMAL(15,2),
  currency TEXT NOT NULL DEFAULT 'SAR',
  delivery_location TEXT,
  delivery_location_coordinates POINT,
  submission_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  project_start_date TIMESTAMP WITH TIME ZONE,
  project_end_date TIMESTAMP WITH TIME ZONE,
  status rfq_status NOT NULL DEFAULT 'draft',
  priority rfq_priority NOT NULL DEFAULT 'medium',
  is_public BOOLEAN NOT NULL DEFAULT true,
  invited_vendors UUID[],
  requirements JSONB NOT NULL DEFAULT '{}',
  evaluation_criteria JSONB NOT NULL DEFAULT '{}',
  terms_and_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RFQ attachments table
CREATE TABLE IF NOT EXISTS public.rfq_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SAR',
  delivery_timeline_days INTEGER NOT NULL,
  proposal TEXT NOT NULL,
  technical_specifications JSONB DEFAULT '{}',
  payment_terms TEXT,
  warranty_period_months INTEGER,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'shortlisted', 'rejected', 'awarded')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(rfq_id, vendor_id)
);

-- Create bid attachments table  
CREATE TABLE IF NOT EXISTS public.bid_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bid_id UUID NOT NULL REFERENCES public.bids(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.procurement_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bid_attachments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for procurement categories (public read access)
CREATE POLICY "Categories are viewable by everyone" 
ON public.procurement_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage categories" 
ON public.procurement_categories 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create RLS policies for RFQs
CREATE POLICY "Users can view public RFQs" 
ON public.rfqs 
FOR SELECT 
USING (
  is_public = true 
  OR client_id = auth.uid() 
  OR auth.uid() = ANY(invited_vendors)
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('vendor', 'admin')
  )
);

CREATE POLICY "Clients can create their own RFQs" 
ON public.rfqs 
FOR INSERT 
WITH CHECK (
  auth.uid() = client_id 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('client', 'admin')
  )
);

CREATE POLICY "Clients can update their own RFQs" 
ON public.rfqs 
FOR UPDATE 
USING (
  auth.uid() = client_id 
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create RLS policies for RFQ attachments
CREATE POLICY "RFQ attachment access follows RFQ access" 
ON public.rfq_attachments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.rfqs 
    WHERE rfqs.id = rfq_attachments.rfq_id 
    AND (
      rfqs.is_public = true 
      OR rfqs.client_id = auth.uid() 
      OR auth.uid() = ANY(rfqs.invited_vendors)
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role IN ('vendor', 'admin')
      )
    )
  )
);

CREATE POLICY "Users can upload attachments to their RFQs" 
ON public.rfq_attachments 
FOR INSERT 
WITH CHECK (
  auth.uid() = uploaded_by 
  AND EXISTS (
    SELECT 1 FROM public.rfqs 
    WHERE rfqs.id = rfq_attachments.rfq_id 
    AND rfqs.client_id = auth.uid()
  )
);

-- Create RLS policies for bids
CREATE POLICY "Vendors can view their own bids" 
ON public.bids 
FOR SELECT 
USING (
  vendor_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.rfqs 
    WHERE rfqs.id = bids.rfq_id 
    AND rfqs.client_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Vendors can create bids" 
ON public.bids 
FOR INSERT 
WITH CHECK (
  auth.uid() = vendor_id 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('vendor', 'admin')
  )
  AND EXISTS (
    SELECT 1 FROM public.rfqs 
    WHERE rfqs.id = bids.rfq_id 
    AND rfqs.status IN ('published', 'in_progress')
    AND rfqs.submission_deadline > now()
  )
);

CREATE POLICY "Vendors can update their own bids" 
ON public.bids 
FOR UPDATE 
USING (
  vendor_id = auth.uid() 
  AND status IN ('draft', 'submitted')
  AND EXISTS (
    SELECT 1 FROM public.rfqs 
    WHERE rfqs.id = bids.rfq_id 
    AND rfqs.submission_deadline > now()
  )
);

-- Create RLS policies for bid attachments
CREATE POLICY "Bid attachment access follows bid access" 
ON public.bid_attachments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.bids 
    WHERE bids.id = bid_attachments.bid_id 
    AND (
      bids.vendor_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM public.rfqs 
        WHERE rfqs.id = bids.rfq_id 
        AND rfqs.client_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin'
      )
    )
  )
);

CREATE POLICY "Vendors can upload attachments to their bids" 
ON public.bid_attachments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bids 
    WHERE bids.id = bid_attachments.bid_id 
    AND bids.vendor_id = auth.uid()
  )
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_procurement_categories_updated_at
    BEFORE UPDATE ON public.procurement_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rfqs_updated_at
    BEFORE UPDATE ON public.rfqs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bids_updated_at
    BEFORE UPDATE ON public.bids
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample procurement categories
INSERT INTO public.procurement_categories (name, name_ar, description, description_ar, icon) VALUES
('Construction & Infrastructure', 'البناء والبنية التحتية', 'Building materials, construction services, and infrastructure projects', 'مواد البناء وخدمات البناء ومشاريع البنية التحتية', 'Building2'),
('Information Technology', 'تقنية المعلومات', 'Software, hardware, IT services, and digital solutions', 'البرمجيات والأجهزة وخدمات تقنية المعلومات والحلول الرقمية', 'Laptop'),
('Manufacturing & Industrial', 'التصنيع والصناعة', 'Manufacturing equipment, industrial supplies, and production services', 'معدات التصنيع واللوازم الصناعية وخدمات الإنتاج', 'Factory'),
('Professional Services', 'الخدمات المهنية', 'Consulting, legal, accounting, and other professional services', 'الاستشارات والخدمات القانونية والمحاسبية وغيرها من الخدمات المهنية', 'Briefcase'),
('Healthcare & Medical', 'الرعاية الصحية والطبية', 'Medical equipment, healthcare services, and pharmaceutical supplies', 'المعدات الطبية وخدمات الرعاية الصحية واللوازم الصيدلانية', 'Heart'),
('Transportation & Logistics', 'النقل واللوجستيات', 'Transportation services, logistics, and supply chain management', 'خدمات النقل واللوجستيات وإدارة سلسلة التوريد', 'Truck'),
('Energy & Utilities', 'الطاقة والمرافق', 'Energy systems, utilities, and renewable energy solutions', 'أنظمة الطاقة والمرافق وحلول الطاقة المتجددة', 'Zap'),
('Food & Beverage', 'الأغذية والمشروبات', 'Food products, catering services, and beverage supplies', 'المنتجات الغذائية وخدمات التموين ولوازم المشروبات', 'Coffee');