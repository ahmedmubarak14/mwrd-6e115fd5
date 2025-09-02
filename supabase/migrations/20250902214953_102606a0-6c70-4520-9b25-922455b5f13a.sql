-- Seed data for procurement categories
INSERT INTO procurement_categories (id, name, name_ar, description, description_ar, is_active, created_at, updated_at) VALUES
('cat_construction', 'Construction & Infrastructure', 'البناء والبنية التحتية', 'Building construction, civil works, infrastructure development', 'أعمال البناء والأشغال المدنية وتطوير البنية التحتية', true, now(), now()),
('cat_engineering', 'Engineering Services', 'الخدمات الهندسية', 'Design, consulting, technical services', 'التصميم والاستشارات والخدمات التقنية', true, now(), now()),
('cat_technology', 'Information Technology', 'تكنولوجيا المعلومات', 'Software development, IT consulting, system integration', 'تطوير البرمجيات واستشارات تكنولوجيا المعلومات وتكامل الأنظمة', true, now(), now()),
('cat_healthcare', 'Healthcare & Medical', 'الرعاية الصحية والطبية', 'Medical equipment, healthcare services, pharmaceuticals', 'المعدات الطبية وخدمات الرعاية الصحية والأدوية', true, now(), now()),
('cat_manufacturing', 'Manufacturing & Production', 'التصنيع والإنتاج', 'Industrial manufacturing, production services', 'التصنيع الصناعي وخدمات الإنتاج', true, now(), now()),
('cat_marketing', 'Marketing & Advertising', 'التسويق والإعلان', 'Digital marketing, branding, advertising campaigns', 'التسويق الرقمي والعلامات التجارية والحملات الإعلانية', true, now(), now()),
('cat_logistics', 'Logistics & Transportation', 'اللوجستيات والنقل', 'Supply chain, transportation, warehousing', 'سلسلة التوريد والنقل والتخزين', true, now(), now()),
('cat_finance', 'Financial Services', 'الخدمات المالية', 'Accounting, financial consulting, auditing', 'المحاسبة والاستشارات المالية والتدقيق', true, now(), now());

-- Seed subcategories
INSERT INTO procurement_categories (id, parent_id, name, name_ar, description, description_ar, is_active, created_at, updated_at) VALUES
-- Construction subcategories
('sub_residential', 'cat_construction', 'Residential Construction', 'البناء السكني', 'Houses, apartments, residential complexes', 'المنازل والشقق والمجمعات السكنية', true, now(), now()),
('sub_commercial', 'cat_construction', 'Commercial Construction', 'البناء التجاري', 'Office buildings, retail spaces, commercial complexes', 'المباني المكتبية والمساحات التجارية والمجمعات التجارية', true, now(), now()),
('sub_infrastructure', 'cat_construction', 'Infrastructure', 'البنية التحتية', 'Roads, bridges, utilities, public works', 'الطرق والجسور والمرافق والأشغال العامة', true, now(), now()),

-- Engineering subcategories  
('sub_structural', 'cat_engineering', 'Structural Engineering', 'الهندسة الإنشائية', 'Building and infrastructure design', 'تصميم المباني والبنية التحتية', true, now(), now()),
('sub_mechanical', 'cat_engineering', 'Mechanical Engineering', 'الهندسة الميكانيكية', 'HVAC, machinery, mechanical systems', 'التكييف والآلات والأنظمة الميكانيكية', true, now(), now()),
('sub_electrical', 'cat_engineering', 'Electrical Engineering', 'الهندسة الكهربائية', 'Power systems, electrical design', 'أنظمة الطاقة والتصميم الكهربائي', true, now(), now()),

-- Technology subcategories
('sub_software', 'cat_technology', 'Software Development', 'تطوير البرمجيات', 'Web apps, mobile apps, enterprise software', 'تطبيقات الويب والهاتف المحمول وبرمجيات المؤسسات', true, now(), now()),
('sub_cybersecurity', 'cat_technology', 'Cybersecurity', 'الأمن السيبراني', 'Security consulting, penetration testing', 'استشارات الأمان واختبار الاختراق', true, now(), now()),
('sub_cloud', 'cat_technology', 'Cloud Services', 'الخدمات السحابية', 'Cloud migration, infrastructure, DevOps', 'الانتقال السحابي والبنية التحتية وDevOps', true, now(), now());