-- Create sample client and vendor users with correct column names
DO $$
DECLARE
  client1_id UUID := gen_random_uuid();
  client2_id UUID := gen_random_uuid();
  client3_id UUID := gen_random_uuid();
  vendor1_id UUID := gen_random_uuid();
  vendor2_id UUID := gen_random_uuid();
  vendor3_id UUID := gen_random_uuid();
  vendor4_id UUID := gen_random_uuid();
  vendor5_id UUID := gen_random_uuid();
  
  construction_cat_id UUID;
  engineering_cat_id UUID;
  technology_cat_id UUID;
  residential_sub_id UUID;
  commercial_sub_id UUID;
  software_sub_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO construction_cat_id FROM procurement_categories WHERE name = 'Construction & Infrastructure' AND parent_id IS NULL;
  SELECT id INTO engineering_cat_id FROM procurement_categories WHERE name = 'Engineering Services' AND parent_id IS NULL;
  SELECT id INTO technology_cat_id FROM procurement_categories WHERE name = 'Information Technology' AND parent_id IS NULL;
  
  SELECT id INTO residential_sub_id FROM procurement_categories WHERE name = 'Residential Construction';
  SELECT id INTO commercial_sub_id FROM procurement_categories WHERE name = 'Commercial Construction';
  SELECT id INTO software_sub_id FROM procurement_categories WHERE name = 'Software Development';

  -- Insert sample client profiles (using address instead of location)
  INSERT INTO user_profiles (user_id, email, full_name, role, company_name, phone, address, status, verification_status, created_at, updated_at) VALUES
  (client1_id, 'client1@mwrd.com', 'Ahmed Al-Rashid', 'client', 'Al-Rashid Construction Group', '+966501234001', 'Riyadh, Saudi Arabia', 'approved', 'approved', now(), now()),
  (client2_id, 'client2@mwrd.com', 'Fatima Al-Zahra', 'client', 'Modern Tech Solutions', '+966501234002', 'Jeddah, Saudi Arabia', 'approved', 'approved', now(), now()),
  (client3_id, 'client3@mwrd.com', 'Mohammed Al-Saud', 'client', 'Kingdom Healthcare Systems', '+966501234003', 'Dammam, Saudi Arabia', 'approved', 'approved', now(), now());

  -- Insert sample vendor profiles (without rating column for now)
  INSERT INTO user_profiles (user_id, email, full_name, role, company_name, phone, address, categories, status, verification_status, created_at, updated_at) VALUES
  (vendor1_id, 'vendor1@mwrd.com', 'Omar Construction Co.', 'vendor', 'Omar Elite Builders', '+966502234001', 'Riyadh, Saudi Arabia', ARRAY[construction_cat_id::text, residential_sub_id::text], 'approved', 'approved', now(), now()),
  (vendor2_id, 'vendor2@mwrd.com', 'Nadia Engineering', 'vendor', 'Advanced Engineering Solutions', '+966502234002', 'Jeddah, Saudi Arabia', ARRAY[engineering_cat_id::text], 'approved', 'approved', now(), now()),
  (vendor3_id, 'vendor3@mwrd.com', 'TechPro Arabia', 'vendor', 'TechPro Software Development', '+966502234003', 'Riyadh, Saudi Arabia', ARRAY[technology_cat_id::text, software_sub_id::text], 'approved', 'approved', now(), now()),
  (vendor4_id, 'vendor4@mwrd.com', 'Gulf Contractors', 'vendor', 'Gulf Commercial Builders', '+966502234004', 'Dammam, Saudi Arabia', ARRAY[construction_cat_id::text, commercial_sub_id::text], 'approved', 'approved', now(), now()),
  (vendor5_id, 'vendor5@mwrd.com', 'Digital Solutions KSA', 'vendor', 'Digital Transformation Experts', '+966502234005', 'Jeddah, Saudi Arabia', ARRAY[technology_cat_id::text], 'approved', 'approved', now(), now());

  -- Create sample RFQs
  INSERT INTO rfqs (id, client_id, title, description, category_id, budget_min, budget_max, currency, delivery_location, submission_deadline, project_start_date, project_end_date, priority, is_public, status, requirements, evaluation_criteria, created_at, updated_at) VALUES
  
  -- Construction RFQ 1
  (gen_random_uuid(), client1_id, 'Luxury Residential Complex - Phase 1', 
   'We are seeking qualified contractors to build a 50-unit luxury residential complex in North Riyadh. The project includes modern amenities, landscaping, and underground parking.',
   construction_cat_id, 2500000, 3500000, 'SAR', 'North Riyadh, Saudi Arabia',
   now() + interval '25 days', now() + interval '45 days', now() + interval '180 days',
   'high', true, 'published',
   '{"technical_specs": ["50 residential units", "Underground parking", "Modern amenities", "Landscaping"], "requirements": ["Valid construction license", "Previous residential experience", "Insurance coverage", "Local presence"]}',
   '{"criteria": ["Technical capability", "Timeline feasibility", "Cost effectiveness", "Past performance"]}',
   now() - interval '3 days', now()),

  -- Technology RFQ 1  
  (gen_random_uuid(), client2_id, 'Enterprise ERP System Development',
   'Looking for experienced software development team to build a comprehensive ERP system for our manufacturing operations. Must include inventory, HR, finance, and reporting modules.',
   technology_cat_id, 450000, 650000, 'SAR', 'Jeddah, Saudi Arabia',
   now() + interval '20 days', now() + interval '30 days', now() + interval '120 days',
   'urgent', true, 'published',
   '{"technical_specs": ["Web-based application", "Mobile responsive", "Multi-language support", "API integration"], "requirements": ["5+ years ERP experience", "Saudi localization", "Cloud deployment", "Ongoing support"]}',
   '{"criteria": ["Technical expertise", "Development methodology", "Support quality", "Cost structure"]}',
   now() - interval '2 days', now()),

  -- Construction RFQ 2
  (gen_random_uuid(), client1_id, 'Commercial Office Tower - Engineering Services',
   'Seeking structural and MEP engineering services for a 25-story commercial office tower in Riyadh CBD. Project requires innovative design and sustainable solutions.',
   engineering_cat_id, 800000, 1200000, 'SAR', 'Riyadh CBD, Saudi Arabia',
   now() + interval '18 days', now() + interval '60 days', now() + interval '200 days',
   'medium', true, 'published',
   '{"technical_specs": ["25-story tower", "Sustainable design", "LEED certification", "Advanced MEP systems"], "requirements": ["Licensed engineers", "High-rise experience", "LEED certification", "BIM modeling"]}',
   '{"criteria": ["Design innovation", "Sustainability approach", "Project timeline", "Professional qualifications"]}',
   now() - interval '1 day', now()),

  -- Healthcare RFQ
  (gen_random_uuid(), client3_id, 'Hospital Management System Integration',
   'Need to integrate and upgrade our hospital management system with latest healthcare technologies. Must comply with Saudi healthcare regulations.',
   technology_cat_id, 300000, 500000, 'SAR', 'Dammam, Saudi Arabia',
   now() + interval '15 days', now() + interval '40 days', now() + interval '90 days',
   'high', true, 'published',
   '{"technical_specs": ["Healthcare compliance", "Patient management", "Billing integration", "Reporting dashboard"], "requirements": ["Healthcare IT experience", "MOH compliance", "Data security", "Staff training"]}',
   '{"criteria": ["Healthcare expertise", "Compliance knowledge", "Implementation plan", "Support structure"]}',
   now() - interval '4 hours', now());

  -- Create performance metrics for vendors
  INSERT INTO vendor_performance_metrics (vendor_id, category, response_time_avg_hours, completion_rate, quality_score, total_completed_orders, total_earnings, last_updated) VALUES
  (vendor1_id, construction_cat_id::text, 12.5, 95.0, 4.8, 15, 5250000.00, now()),
  (vendor2_id, engineering_cat_id::text, 8.0, 92.0, 4.6, 12, 3800000.00, now()),
  (vendor3_id, technology_cat_id::text, 6.0, 98.0, 4.9, 28, 2100000.00, now()),
  (vendor4_id, construction_cat_id::text, 18.0, 88.0, 4.4, 8, 6500000.00, now()),
  (vendor5_id, technology_cat_id::text, 10.0, 94.0, 4.7, 22, 1950000.00, now());

END $$;