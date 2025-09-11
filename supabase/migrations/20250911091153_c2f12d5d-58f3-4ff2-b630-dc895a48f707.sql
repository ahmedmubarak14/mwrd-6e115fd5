-- Create sample categories for vendors if they don't exist (handle slug conflicts)
INSERT INTO categories (id, name_en, name_ar, slug, is_active, sort_order)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Construction & Building', 'البناء والتشييد', 'construction-building', true, 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Safety Equipment', 'معدات السلامة', 'safety-equipment-vendor', true, 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'Technology & Software', 'التكنولوجيا والبرمجيات', 'technology-software', true, 3)
ON CONFLICT (slug) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_ar = EXCLUDED.name_ar,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

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
DROP POLICY IF EXISTS "Anyone can view vendor categories" ON vendor_categories;
CREATE POLICY "Anyone can view vendor categories" ON vendor_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Vendors can manage their own categories" ON vendor_categories;
CREATE POLICY "Vendors can manage their own categories" ON vendor_categories FOR ALL USING (
  vendor_id IN (
    SELECT id FROM user_profiles 
    WHERE user_id = auth.uid() AND role = 'vendor'
  )
);

DROP POLICY IF EXISTS "Admins can manage all vendor categories" ON vendor_categories;
CREATE POLICY "Admins can manage all vendor categories" ON vendor_categories FOR ALL USING (
  get_user_role(auth.uid()) = 'admin'
);

-- Get existing category IDs for assignment
INSERT INTO vendor_categories (vendor_id, category_id)
SELECT 'ec08e293-82f1-45fd-844e-9162691ec58a', c.id
FROM categories c
WHERE c.slug IN ('construction-building', 'safety-equipment-vendor', 'technology-software')
ON CONFLICT (vendor_id, category_id) DO NOTHING;