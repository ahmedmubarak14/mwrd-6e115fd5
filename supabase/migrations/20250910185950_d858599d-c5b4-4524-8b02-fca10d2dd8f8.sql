-- Create vendor_products table for e-commerce product catalog
CREATE TABLE IF NOT EXISTS public.vendor_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(15,2) NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  sku TEXT,
  stock_quantity INTEGER DEFAULT 0,
  min_order_quantity INTEGER DEFAULT 1,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
  currency TEXT NOT NULL DEFAULT 'SAR',
  unit TEXT DEFAULT 'piece',
  weight_kg NUMERIC(10,3),
  dimensions_cm TEXT, -- "length x width x height"
  warranty_months INTEGER,
  delivery_time_days INTEGER DEFAULT 7,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint (vendor_id references user_profiles.id)
ALTER TABLE public.vendor_products 
ADD CONSTRAINT fk_vendor_products_vendor_id 
FOREIGN KEY (vendor_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor_id ON public.vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_category ON public.vendor_products(category);
CREATE INDEX IF NOT EXISTS idx_vendor_products_status ON public.vendor_products(status);
CREATE INDEX IF NOT EXISTS idx_vendor_products_featured ON public.vendor_products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_vendor_products_name_search ON public.vendor_products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Enable Row Level Security
ALTER TABLE public.vendor_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Vendors can manage their own products" 
ON public.vendor_products 
FOR ALL 
USING (vendor_id IN (
  SELECT id FROM public.user_profiles 
  WHERE user_id = auth.uid() AND role = 'vendor'
))
WITH CHECK (vendor_id IN (
  SELECT id FROM public.user_profiles 
  WHERE user_id = auth.uid() AND role = 'vendor'
));

CREATE POLICY "Anyone can view active products from approved vendors" 
ON public.vendor_products 
FOR SELECT 
USING (
  status = 'active' AND 
  vendor_id IN (
    SELECT id FROM public.user_profiles 
    WHERE role = 'vendor' 
    AND status = 'approved' 
    AND verification_status = 'approved'
  )
);

CREATE POLICY "Admins can manage all products" 
ON public.vendor_products 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_vendor_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vendor_products_updated_at
BEFORE UPDATE ON public.vendor_products
FOR EACH ROW
EXECUTE FUNCTION public.update_vendor_products_updated_at();

-- Create product categories table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  parent_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for product categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active product categories" 
ON public.product_categories 
FOR SELECT 
USING (is_active = true OR get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Admins can manage product categories" 
ON public.product_categories 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role);

-- Insert default product categories
INSERT INTO public.product_categories (name_en, name_ar, icon, sort_order) VALUES
('Electronics', 'الإلكترونيات', 'laptop', 1),
('Construction Materials', 'مواد البناء', 'hammer', 2),
('Industrial Equipment', 'المعدات الصناعية', 'settings', 3),
('Office Supplies', 'اللوازم المكتبية', 'briefcase', 4),
('Medical Equipment', 'المعدات الطبية', 'heart', 5),
('Automotive Parts', 'قطع غيار السيارات', 'car', 6),
('Food & Beverages', 'الأغذية والمشروبات', 'coffee', 7),
('Textiles & Clothing', 'النسيج والملابس', 'shirt', 8),
('Furniture', 'الأثاث', 'chair', 9),
('Safety Equipment', 'معدات السلامة', 'shield', 10)
ON CONFLICT DO NOTHING;