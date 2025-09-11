-- Create sample categories for vendors if they don't exist
INSERT INTO categories (id, name_en, name_ar, slug, is_active, sort_order)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Construction & Building', 'البناء والتشييد', 'construction-building', true, 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Safety Equipment', 'معدات السلامة', 'safety-equipment', true, 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'Technology & Software', 'التكنولوجيا والبرمجيات', 'technology-software', true, 3)
ON CONFLICT (id) DO NOTHING;

-- Create vendor_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS vendor_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(vendor_id, category_id)
);

-- Enable RLS on vendor_categories
ALTER TABLE vendor_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for vendor_categories
CREATE POLICY "Anyone can view vendor categories" ON vendor_categories FOR SELECT USING (true);
CREATE POLICY "Vendors can manage their own categories" ON vendor_categories FOR ALL USING (
  vendor_id IN (
    SELECT id FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'vendor'
  )
);
CREATE POLICY "Admins can manage all vendor categories" ON vendor_categories FOR ALL USING (
  get_user_role(auth.uid()) = 'admin'
);

-- Assign categories to the sample vendor
INSERT INTO vendor_categories (vendor_id, category_id)
VALUES 
  ('ec08e293-82f1-45fd-844e-9162691ec58a', '550e8400-e29b-41d4-a716-446655440001'),
  ('ec08e293-82f1-45fd-844e-9162691ec58a', '550e8400-e29b-41d4-a716-446655440002'),
  ('ec08e293-82f1-45fd-844e-9162691ec58a', '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (vendor_id, category_id) DO NOTHING;