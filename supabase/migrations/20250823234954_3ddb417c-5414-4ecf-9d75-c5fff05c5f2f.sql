
-- Create procurement category taxonomy tables
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor-category junction table
CREATE TABLE public.vendor_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, category_id)
);

-- Create request-category junction table  
CREATE TABLE public.request_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(request_id, category_id)
);

-- Add legacy category field to preserve old data
ALTER TABLE public.user_profiles ADD COLUMN legacy_category TEXT;
ALTER TABLE public.requests ADD COLUMN legacy_category TEXT;

-- Enable RLS on new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for categories (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true OR get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- RLS policies for vendor_categories
CREATE POLICY "Anyone can view vendor categories" ON public.vendor_categories
  FOR SELECT USING (true);

CREATE POLICY "Vendors can manage own categories" ON public.vendor_categories
  FOR ALL USING (
    vendor_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid()) 
    OR get_user_role(auth.uid()) = 'admin'::user_role
  );

-- RLS policies for request_categories
CREATE POLICY "Users can view relevant request categories" ON public.request_categories
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM public.requests 
      WHERE client_id = auth.uid() OR get_user_role(auth.uid()) = 'admin'::user_role
    )
  );

CREATE POLICY "Request owners can manage request categories" ON public.request_categories
  FOR ALL USING (
    request_id IN (SELECT id FROM public.requests WHERE client_id = auth.uid())
    OR get_user_role(auth.uid()) = 'admin'::user_role
  );

-- Add indexes for performance
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);
CREATE INDEX idx_vendor_categories_vendor_id ON public.vendor_categories(vendor_id);
CREATE INDEX idx_vendor_categories_category_id ON public.vendor_categories(category_id);
CREATE INDEX idx_request_categories_request_id ON public.request_categories(request_id);
CREATE INDEX idx_request_categories_category_id ON public.request_categories(category_id);

-- Insert procurement taxonomy (6 main categories + subcategories)
INSERT INTO public.categories (slug, name_en, name_ar, sort_order) VALUES
-- Main categories
('direct-procurement', 'Direct Procurement', 'المشتريات المباشرة', 1),
('indirect-procurement', 'Indirect Procurement', 'المشتريات غير المباشرة', 2),
('logistics-supply-chain', 'Logistics & Supply Chain', 'اللوجستيات وسلسلة التوريد', 3),
('professional-business-services', 'Professional & Business Services', 'الخدمات المهنية والتجارية', 4),
('construction-infrastructure', 'Construction & Infrastructure', 'البناء والبنية التحتية', 5),
('mro-maintenance-repair-operations', 'MRO (Maintenance, Repair & Operations)', 'الصيانة والإصلاح والعمليات', 6);

-- Get parent IDs for subcategories
DO $$
DECLARE
    direct_id UUID;
    indirect_id UUID;
    logistics_id UUID;
    professional_id UUID;
    construction_id UUID;
    mro_id UUID;
BEGIN
    SELECT id INTO direct_id FROM public.categories WHERE slug = 'direct-procurement';
    SELECT id INTO indirect_id FROM public.categories WHERE slug = 'indirect-procurement';
    SELECT id INTO logistics_id FROM public.categories WHERE slug = 'logistics-supply-chain';
    SELECT id INTO professional_id FROM public.categories WHERE slug = 'professional-business-services';
    SELECT id INTO construction_id FROM public.categories WHERE slug = 'construction-infrastructure';
    SELECT id INTO mro_id FROM public.categories WHERE slug = 'mro-maintenance-repair-operations';

    -- Direct Procurement subcategories
    INSERT INTO public.categories (parent_id, slug, name_en, name_ar, sort_order) VALUES
    (direct_id, 'raw-materials-commodities', 'Raw Materials & Commodities', 'المواد الخام والسلع', 1),
    (direct_id, 'packaging-materials', 'Packaging Materials', 'مواد التعبئة والتغليف', 2),
    (direct_id, 'machinery-production-equipment', 'Machinery & Production Equipment', 'الآلات ومعدات الإنتاج', 3),
    (direct_id, 'spare-parts-components', 'Spare Parts & Components', 'قطع الغيار والمكونات', 4),
    (direct_id, 'tools-industrial-supplies', 'Tools & Industrial Supplies', 'الأدوات واللوازم الصناعية', 5);

    -- Indirect Procurement subcategories
    INSERT INTO public.categories (parent_id, slug, name_en, name_ar, sort_order) VALUES
    (indirect_id, 'office-supplies-stationery', 'Office Supplies & Stationery', 'اللوازم المكتبية والقرطاسية', 1),
    (indirect_id, 'it-technology-equipment', 'IT & Technology Equipment', 'معدات تكنولوجيا المعلومات والتقنية', 2),
    (indirect_id, 'software-saas-subscriptions', 'Software & SaaS Subscriptions', 'البرمجيات واشتراكات الخدمات السحابية', 3),
    (indirect_id, 'furniture-fixtures', 'Furniture & Fixtures', 'الأثاث والتجهيزات', 4),
    (indirect_id, 'utilities-electricity-water-gas', 'Utilities (Electricity/Water/Gas)', 'المرافق (كهرباء/مياه/غاز)', 5);

    -- Logistics & Supply Chain subcategories
    INSERT INTO public.categories (parent_id, slug, name_en, name_ar, sort_order) VALUES
    (logistics_id, 'freight-shipping', 'Freight & Shipping (Local/International)', 'الشحن والنقل (محلي/دولي)', 1),
    (logistics_id, 'warehousing-storage', 'Warehousing & Storage', 'التخزين والمستودعات', 2),
    (logistics_id, 'fleet-management-vehicle-leasing', 'Fleet Management & Vehicle Leasing', 'إدارة الأسطول وتأجير المركبات', 3),
    (logistics_id, 'courier-last-mile-delivery', 'Courier & Last-Mile Delivery', 'البريد السريع والتوصيل للميل الأخير', 4),
    (logistics_id, 'customs-clearance-trade-services', 'Customs Clearance & Trade Services', 'التخليص الجمركي وخدمات التجارة', 5);

    -- Professional & Business Services subcategories
    INSERT INTO public.categories (parent_id, slug, name_en, name_ar, sort_order) VALUES
    (professional_id, 'consulting-management-legal-hr-finance', 'Consulting (Management/Legal/HR/Finance)', 'الاستشارات (إدارية/قانونية/موارد بشرية/مالية)', 1),
    (professional_id, 'marketing-advertising', 'Marketing & Advertising', 'التسويق والإعلان', 2),
    (professional_id, 'recruitment-staffing', 'Recruitment & Staffing', 'التوظيف والاستقدام', 3),
    (professional_id, 'facility-management', 'Facility Management (Cleaning/Security/Maintenance)', 'إدارة المرافق (تنظيف/أمن/صيانة)', 4),
    (professional_id, 'training-development', 'Training & Development', 'التدريب والتطوير', 5);

    -- Construction & Infrastructure subcategories
    INSERT INTO public.categories (parent_id, slug, name_en, name_ar, sort_order) VALUES
    (construction_id, 'building-materials', 'Building Materials', 'مواد البناء', 1),
    (construction_id, 'civil-works-contractors', 'Civil Works Contractors', 'مقاولي الأعمال المدنية', 2),
    (construction_id, 'electrical-works-supplies', 'Electrical Works & Supplies', 'الأعمال الكهربائية واللوازم', 3),
    (construction_id, 'mechanical-hvac-systems', 'Mechanical & HVAC Systems', 'الأنظمة الميكانيكية والتكييف', 4),
    (construction_id, 'interior-fitout-renovations', 'Interior Fit-Out & Renovations', 'التشطيبات الداخلية والتجديدات', 5);

    -- MRO subcategories
    INSERT INTO public.categories (parent_id, slug, name_en, name_ar, sort_order) VALUES
    (mro_id, 'industrial-equipment-maintenance', 'Industrial Equipment Maintenance', 'صيانة المعدات الصناعية', 1),
    (mro_id, 'electrical-components', 'Electrical Components (MCCBs/Contactors/Relays/Fuses/VSDs/Power Analyzers/Pilot Lights)', 'المكونات الكهربائية (قواطع/مرحلات/منصهرات/محولات/محللات الطاقة/أضواء التشغيل)', 2),
    (mro_id, 'plumbing-sanitary', 'Plumbing & Sanitary', 'السباكة والصحية', 3),
    (mro_id, 'safety-gear-ppe', 'Safety Gear & PPE', 'معدات السلامة والحماية الشخصية', 4),
    (mro_id, 'fire-safety-security-equipment', 'Fire Safety & Security Equipment', 'معدات السلامة من الحرائق والأمن', 5);
END $$;

-- Update existing vendor profiles with legacy category preservation
UPDATE public.user_profiles 
SET legacy_category = categories[1] 
WHERE role = 'vendor' AND array_length(categories, 1) > 0;

-- Update existing requests with legacy category preservation  
UPDATE public.requests
SET legacy_category = category
WHERE category IS NOT NULL;

-- Create updated_at trigger for categories
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
