-- Delete old event-related categories if they exist
DELETE FROM categories WHERE slug IN (
  'avl', 'sound_systems', 'lighting', 'screens_displays',
  'catering', 'buffet', 'plated_service', 'specialty_cuisine',
  'decoration', 'floral', 'theme_decoration', 'balloon_decoration',
  'furniture', 'seating', 'tables', 'staging',
  'security', 'personnel', 'surveillance', 'access_control',
  'transportation', 'guest_transport', 'logistics', 'vip_services'
);

-- Ensure we have proper procurement categories (if not already present)
INSERT INTO categories (name_en, name_ar, slug, is_active, sort_order, parent_id) VALUES
-- Main Categories
('Construction & Infrastructure', 'البناء والبنية التحتية', 'construction-infrastructure', true, 1, null),
('Industrial Equipment & Machinery', 'المعدات والآلات الصناعية', 'industrial-equipment-machinery', true, 2, null),
('Office Supplies & Furniture', 'اللوازم المكتبية والأثاث', 'office-supplies-furniture', true, 3, null),
('IT & Technology', 'تكنولوجيا المعلومات والتقنية', 'it-technology', true, 4, null),
('Raw Materials & Components', 'المواد الخام والمكونات', 'raw-materials-components', true, 5, null),
('Professional Services', 'الخدمات المهنية', 'professional-services', true, 6, null),
('Logistics & Transportation', 'اللوجستيات والنقل', 'logistics-transportation', true, 7, null),
('Maintenance & Repair Operations', 'عمليات الصيانة والإصلاح', 'maintenance-repair-operations', true, 8, null)

ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for subcategories
WITH category_ids AS (
  SELECT id, slug FROM categories WHERE parent_id IS NULL
)

-- Insert subcategories
INSERT INTO categories (name_en, name_ar, slug, is_active, sort_order, parent_id) 
SELECT 
  subcategory.name_en,
  subcategory.name_ar,
  subcategory.slug,
  true,
  subcategory.sort_order,
  category_ids.id
FROM category_ids
CROSS JOIN (VALUES
  -- Construction & Infrastructure subcategories
  ('Building Materials', 'مواد البناء', 'building-materials', 1, 'construction-infrastructure'),
  ('Civil Engineering', 'الهندسة المدنية', 'civil-engineering', 2, 'construction-infrastructure'),
  ('Electrical Installation', 'التركيبات الكهربائية', 'electrical-installation', 3, 'construction-infrastructure'),
  ('Plumbing & HVAC', 'السباكة والتكييف', 'plumbing-hvac', 4, 'construction-infrastructure'),
  
  -- Industrial Equipment & Machinery subcategories  
  ('Manufacturing Equipment', 'معدات التصنيع', 'manufacturing-equipment', 1, 'industrial-equipment-machinery'),
  ('Power Generation', 'توليد الطاقة', 'power-generation', 2, 'industrial-equipment-machinery'),
  ('Automation Systems', 'أنظمة الأتمتة', 'automation-systems', 3, 'industrial-equipment-machinery'),
  ('Safety Equipment', 'معدات السلامة', 'safety-equipment', 4, 'industrial-equipment-machinery'),
  
  -- Office Supplies & Furniture subcategories
  ('Office Furniture', 'الأثاث المكتبي', 'office-furniture', 1, 'office-supplies-furniture'),
  ('Stationery & Supplies', 'القرطاسية واللوازم', 'stationery-supplies', 2, 'office-supplies-furniture'),
  ('Office Equipment', 'المعدات المكتبية', 'office-equipment', 3, 'office-supplies-furniture'),
  
  -- IT & Technology subcategories
  ('Hardware & Infrastructure', 'الأجهزة والبنية التحتية', 'hardware-infrastructure', 1, 'it-technology'),
  ('Software & Licenses', 'البرمجيات والتراخيص', 'software-licenses', 2, 'it-technology'),
  ('Networking Equipment', 'معدات الشبكات', 'networking-equipment', 3, 'it-technology'),
  ('Security Systems', 'أنظمة الأمان', 'security-systems', 4, 'it-technology'),
  
  -- Raw Materials & Components subcategories
  ('Metal & Steel', 'المعادن والصلب', 'metal-steel', 1, 'raw-materials-components'),
  ('Chemical Products', 'المنتجات الكيميائية', 'chemical-products', 2, 'raw-materials-components'),
  ('Electronic Components', 'المكونات الإلكترونية', 'electronic-components', 3, 'raw-materials-components'),
  ('Textiles & Fabrics', 'المنسوجات والأقمشة', 'textiles-fabrics', 4, 'raw-materials-components'),
  
  -- Professional Services subcategories
  ('Consulting Services', 'خدمات الاستشارات', 'consulting-services', 1, 'professional-services'),
  ('Legal Services', 'الخدمات القانونية', 'legal-services', 2, 'professional-services'),
  ('Financial Services', 'الخدمات المالية', 'financial-services', 3, 'professional-services'),
  ('Training & Development', 'التدريب والتطوير', 'training-development', 4, 'professional-services'),
  
  -- Logistics & Transportation subcategories
  ('Freight Services', 'خدمات الشحن', 'freight-services', 1, 'logistics-transportation'),
  ('Warehousing', 'التخزين', 'warehousing', 2, 'logistics-transportation'),
  ('Fleet Management', 'إدارة الأساطيل', 'fleet-management', 3, 'logistics-transportation'),
  
  -- Maintenance & Repair Operations subcategories
  ('Equipment Maintenance', 'صيانة المعدات', 'equipment-maintenance', 1, 'maintenance-repair-operations'),
  ('Facility Management', 'إدارة المرافق', 'facility-management', 2, 'maintenance-repair-operations'),
  ('Spare Parts', 'قطع الغيار', 'spare-parts', 3, 'maintenance-repair-operations')
) AS subcategory(name_en, name_ar, slug, sort_order, parent_slug)
WHERE category_ids.slug = subcategory.parent_slug
ON CONFLICT (slug) DO NOTHING;