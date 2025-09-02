-- Seed data for procurement categories with proper UUIDs
WITH category_data AS (
  INSERT INTO procurement_categories (name, name_ar, description, description_ar, is_active, created_at, updated_at) VALUES
  ('Construction & Infrastructure', 'البناء والبنية التحتية', 'Building construction, civil works, infrastructure development', 'أعمال البناء والأشغال المدنية وتطوير البنية التحتية', true, now(), now()),
  ('Engineering Services', 'الخدمات الهندسية', 'Design, consulting, technical services', 'التصميم والاستشارات والخدمات التقنية', true, now(), now()),
  ('Information Technology', 'تكنولوجيا المعلومات', 'Software development, IT consulting, system integration', 'تطوير البرمجيات واستشارات تكنولوجيا المعلومات وتكامل الأنظمة', true, now(), now()),
  ('Healthcare & Medical', 'الرعاية الصحية والطبية', 'Medical equipment, healthcare services, pharmaceuticals', 'المعدات الطبية وخدمات الرعاية الصحية والأدوية', true, now(), now()),
  ('Manufacturing & Production', 'التصنيع والإنتاج', 'Industrial manufacturing, production services', 'التصنيع الصناعي وخدمات الإنتاج', true, now(), now()),
  ('Marketing & Advertising', 'التسويق والإعلان', 'Digital marketing, branding, advertising campaigns', 'التسويق الرقمي والعلامات التجارية والحملات الإعلانية', true, now(), now()),
  ('Logistics & Transportation', 'اللوجستيات والنقل', 'Supply chain, transportation, warehousing', 'سلسلة التوريد والنقل والتخزين', true, now(), now()),
  ('Financial Services', 'الخدمات المالية', 'Accounting, financial consulting, auditing', 'المحاسبة والاستشارات المالية والتدقيق', true, now(), now())
  RETURNING id, name
),
construction_id AS (SELECT id FROM category_data WHERE name = 'Construction & Infrastructure'),
engineering_id AS (SELECT id FROM category_data WHERE name = 'Engineering Services'),  
technology_id AS (SELECT id FROM category_data WHERE name = 'Information Technology')

-- Insert subcategories
INSERT INTO procurement_categories (parent_id, name, name_ar, description, description_ar, is_active, created_at, updated_at)
SELECT 
  (SELECT id FROM construction_id), 'Residential Construction', 'البناء السكني', 'Houses, apartments, residential complexes', 'المنازل والشقق والمجمعات السكنية', true, now(), now()
UNION ALL SELECT
  (SELECT id FROM construction_id), 'Commercial Construction', 'البناء التجاري', 'Office buildings, retail spaces, commercial complexes', 'المباني المكتبية والمساحات التجارية والمجمعات التجارية', true, now(), now()
UNION ALL SELECT
  (SELECT id FROM construction_id), 'Infrastructure', 'البنية التحتية', 'Roads, bridges, utilities, public works', 'الطرق والجسور والمرافق والأشغال العامة', true, now(), now()
UNION ALL SELECT
  (SELECT id FROM engineering_id), 'Structural Engineering', 'الهندسة الإنشائية', 'Building and infrastructure design', 'تصميم المباني والبنية التحتية', true, now(), now()
UNION ALL SELECT
  (SELECT id FROM engineering_id), 'Mechanical Engineering', 'الهندسة الميكانيكية', 'HVAC, machinery, mechanical systems', 'التكييف والآلات والأنظمة الميكانيكية', true, now(), now()
UNION ALL SELECT
  (SELECT id FROM engineering_id), 'Electrical Engineering', 'الهندسة الكهربائية', 'Power systems, electrical design', 'أنظمة الطاقة والتصميم الكهربائي', true, now(), now()
UNION ALL SELECT
  (SELECT id FROM technology_id), 'Software Development', 'تطوير البرمجيات', 'Web apps, mobile apps, enterprise software', 'تطبيقات الويب والهاتف المحمول وبرمجيات المؤسسات', true, now(), now()
UNION ALL SELECT
  (SELECT id FROM technology_id), 'Cybersecurity', 'الأمن السيبراني', 'Security consulting, penetration testing', 'استشارات الأمان واختبار الاختراق', true, now(), now()
UNION ALL SELECT
  (SELECT id FROM technology_id), 'Cloud Services', 'الخدمات السحابية', 'Cloud migration, infrastructure, DevOps', 'الانتقال السحابي والبنية التحتية وDevOps', true, now(), now();