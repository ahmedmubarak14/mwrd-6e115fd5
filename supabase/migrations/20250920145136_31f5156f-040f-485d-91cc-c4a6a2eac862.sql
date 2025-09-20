-- Add sample RFQs and bids for testing with proper UUIDs
-- Insert sample user profiles (will create UUIDs automatically)
INSERT INTO user_profiles (user_id, email, full_name, company_name, role, status, verification_status) VALUES
  (gen_random_uuid(), 'client@example.com', 'John Client', 'Client Corp', 'client', 'approved', 'approved'),
  (gen_random_uuid(), 'vendor1@example.com', 'Ahmad Supplier', 'Tech Solutions LLC', 'vendor', 'approved', 'approved'),
  (gen_random_uuid(), 'vendor2@example.com', 'Sarah Vendor', 'Quality Services Inc', 'vendor', 'approved', 'approved')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_name = EXCLUDED.company_name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  verification_status = EXCLUDED.verification_status;

-- Get the client and vendor IDs for inserting sample data
WITH sample_users AS (
  SELECT 
    user_id,
    email,
    role,
    ROW_NUMBER() OVER (PARTITION BY role ORDER BY created_at) as rn
  FROM user_profiles 
  WHERE email IN ('client@example.com', 'vendor1@example.com', 'vendor2@example.com')
),
client_user AS (
  SELECT user_id as client_id FROM sample_users WHERE role = 'client' AND rn = 1
),
vendor1_user AS (
  SELECT user_id as vendor1_id FROM sample_users WHERE role = 'vendor' AND email = 'vendor1@example.com'
),
vendor2_user AS (
  SELECT user_id as vendor2_id FROM sample_users WHERE role = 'vendor' AND email = 'vendor2@example.com'
),
-- Insert sample RFQs
rfq_inserts AS (
  INSERT INTO rfqs (id, client_id, title, description, category, budget_min, budget_max, currency, status, priority, submission_deadline, project_start_date, project_end_date, delivery_location, terms_and_conditions, requirements, evaluation_criteria)
  SELECT 
    gen_random_uuid() as id,
    c.client_id,
    'Office IT Equipment Procurement' as title,
    'We need to procure modern IT equipment including laptops, monitors, and networking hardware for our new office branch.' as description,
    'IT Equipment' as category,
    50000 as budget_min,
    100000 as budget_max,
    'SAR' as currency,
    'published' as status,
    'high' as priority,
    now() + interval '7 days' as submission_deadline,
    now() + interval '14 days' as project_start_date,
    now() + interval '45 days' as project_end_date,
    'Riyadh, Saudi Arabia - King Fahd District, Office Complex B' as delivery_location,
    'Standard procurement terms apply. Equipment must come with manufacturer warranty. Installation support required.' as terms_and_conditions,
    '{"description": "Required items: 25 laptops (i7, 16GB RAM, 512GB SSD), 25 monitors (24 inch, 1080p), 2 network switches (24-port), 1 router (enterprise grade), 50 ethernet cables (CAT6, 3m)", "specifications": {"laptops": {"cpu": "Intel i7 or equivalent", "ram": "16GB minimum", "storage": "512GB SSD minimum"}, "monitors": {"size": "24 inch", "resolution": "1920x1080 minimum"}}}' as requirements,
    '{"description": "Evaluation will be based on: 40% price competitiveness, 30% delivery timeline, 20% product quality and warranty, 10% vendor experience and certifications"}' as evaluation_criteria
  FROM client_user c
  RETURNING id, client_id
)
-- Insert sample bids
INSERT INTO bids (id, rfq_id, vendor_id, total_price, currency, delivery_timeline_days, proposal, technical_specifications, warranty_period_months, payment_terms, status, submitted_at)
SELECT 
  gen_random_uuid(),
  rfq.id,
  v1.vendor1_id,
  85000,
  'SAR',
  21,
  'We are pleased to submit our comprehensive proposal for your IT equipment needs. Our proposal includes premium laptops with Intel i7 processors, high-quality monitors, and enterprise-grade networking equipment. All items come with 3-year manufacturer warranty and we provide free installation and setup service. Our team has 10+ years of experience in corporate IT solutions.',
  '{"laptops": {"brand": "Dell Latitude", "model": "7420", "cpu": "Intel i7-1165G7", "ram": "16GB DDR4", "storage": "512GB NVMe SSD", "warranty": "3 years"}, "monitors": {"brand": "Dell", "model": "P2422H", "size": "24 inch", "resolution": "1920x1080", "warranty": "3 years"}, "networking": {"switch_brand": "Cisco", "router_brand": "Cisco", "warranty": "5 years"}}',
  36,
  '30% advance payment, 70% on delivery and installation completion',
  'submitted',
  now() - interval '2 hours'
FROM rfq_inserts rfq, vendor1_user v1
UNION ALL
SELECT 
  gen_random_uuid(),
  rfq.id,
  v2.vendor2_id,
  78000,
  'SAR',
  18,
  'Our competitive proposal offers excellent value for your IT equipment procurement. We specialize in corporate technology solutions and have partnerships with major manufacturers ensuring authentic products and competitive pricing. Free technical support for first 6 months included.',
  '{"laptops": {"brand": "HP EliteBook", "model": "850 G8", "cpu": "Intel i7-1165G7", "ram": "16GB DDR4", "storage": "512GB SSD", "warranty": "3 years"}, "monitors": {"brand": "HP", "model": "E24 G5", "size": "24 inch", "resolution": "1920x1080", "warranty": "3 years"}, "networking": {"switch_brand": "HP Aruba", "router_brand": "HP Aruba", "warranty": "3 years"}}',
  24,
  '50% advance payment, 50% on delivery',
  'submitted',
  now() - interval '4 hours'
FROM rfq_inserts rfq, vendor2_user v2;