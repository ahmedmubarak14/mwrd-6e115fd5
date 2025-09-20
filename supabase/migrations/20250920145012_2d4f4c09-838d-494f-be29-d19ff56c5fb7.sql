-- Add sample RFQs and bids for testing
-- Insert sample users (clients and vendors)
INSERT INTO auth.users (id, email, created_at) VALUES 
  ('client-1', 'client@example.com', now()),
  ('vendor-1', 'vendor1@example.com', now()),
  ('vendor-2', 'vendor2@example.com', now())
ON CONFLICT (id) DO NOTHING;

-- Insert user profiles
INSERT INTO user_profiles (user_id, email, full_name, company_name, role, status, verification_status) VALUES
  ('client-1', 'client@example.com', 'John Client', 'Client Corp', 'client', 'approved', 'approved'),
  ('vendor-1', 'vendor1@example.com', 'Ahmad Supplier', 'Tech Solutions LLC', 'vendor', 'approved', 'approved'),
  ('vendor-2', 'vendor2@example.com', 'Sarah Vendor', 'Quality Services Inc', 'vendor', 'approved', 'approved')
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_name = EXCLUDED.company_name,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  verification_status = EXCLUDED.verification_status;

-- Insert sample RFQs
INSERT INTO rfqs (id, client_id, title, description, category, budget_min, budget_max, currency, status, priority, submission_deadline, project_start_date, project_end_date, delivery_location, terms_and_conditions, requirements, evaluation_criteria) VALUES
  (
    'rfq-sample-1',
    'client-1',
    'Office IT Equipment Procurement',
    'We need to procure modern IT equipment including laptops, monitors, and networking hardware for our new office branch.',
    'IT Equipment',
    50000,
    100000,
    'SAR',
    'published',
    'high',
    now() + interval '7 days',
    now() + interval '14 days',
    now() + interval '45 days',
    'Riyadh, Saudi Arabia - King Fahd District, Office Complex B',
    'Standard procurement terms apply. Equipment must come with manufacturer warranty. Installation support required.',
    '{"description": "Required items: 25 laptops (i7, 16GB RAM, 512GB SSD), 25 monitors (24 inch, 1080p), 2 network switches (24-port), 1 router (enterprise grade), 50 ethernet cables (CAT6, 3m)", "specifications": {"laptops": {"cpu": "Intel i7 or equivalent", "ram": "16GB minimum", "storage": "512GB SSD minimum"}, "monitors": {"size": "24 inch", "resolution": "1920x1080 minimum"}}}'::jsonb,
    '{"description": "Evaluation will be based on: 40% price competitiveness, 30% delivery timeline, 20% product quality and warranty, 10% vendor experience and certifications"}'::jsonb
  ),
  (
    'rfq-sample-2', 
    'client-1',
    'Marketing Campaign Management',
    'Looking for a digital marketing agency to manage our Q1 2024 campaign including social media, content creation, and advertising.',
    'Marketing Services',
    25000,
    50000,
    'SAR',
    'published',
    'medium',
    now() + interval '5 days',
    now() + interval '10 days', 
    now() + interval '90 days',
    'Remote work acceptable, monthly meetings in Jeddah',
    'Performance-based contract with KPI tracking. Monthly reporting required.',
    '{"description": "Services needed: Social media management (Instagram, Twitter, LinkedIn), Content creation (blog posts, graphics), Google Ads management, SEO optimization, Monthly analytics reports", "deliverables": ["Content calendar", "Monthly reports", "Campaign performance analysis"]}'::jsonb,
    '{"description": "Selection criteria: 35% portfolio quality, 25% pricing, 20% timeline adherence, 20% team expertise"}'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  budget_min = EXCLUDED.budget_min,
  budget_max = EXCLUDED.budget_max,
  status = EXCLUDED.status,
  priority = EXCLUDED.priority,
  submission_deadline = EXCLUDED.submission_deadline,
  project_start_date = EXCLUDED.project_start_date,
  project_end_date = EXCLUDED.project_end_date,
  delivery_location = EXCLUDED.delivery_location,
  terms_and_conditions = EXCLUDED.terms_and_conditions,
  requirements = EXCLUDED.requirements,
  evaluation_criteria = EXCLUDED.evaluation_criteria;

-- Insert sample bids
INSERT INTO bids (id, rfq_id, vendor_id, total_price, currency, delivery_timeline_days, proposal, technical_specifications, warranty_period_months, payment_terms, status, submitted_at) VALUES
  (
    'bid-sample-1',
    'rfq-sample-1',
    'vendor-1', 
    85000,
    'SAR',
    21,
    'We are pleased to submit our comprehensive proposal for your IT equipment needs. Our proposal includes premium laptops with Intel i7 processors, high-quality monitors, and enterprise-grade networking equipment. All items come with 3-year manufacturer warranty and we provide free installation and setup service. Our team has 10+ years of experience in corporate IT solutions.',
    '{"laptops": {"brand": "Dell Latitude", "model": "7420", "cpu": "Intel i7-1165G7", "ram": "16GB DDR4", "storage": "512GB NVMe SSD", "warranty": "3 years"}, "monitors": {"brand": "Dell", "model": "P2422H", "size": "24 inch", "resolution": "1920x1080", "warranty": "3 years"}, "networking": {"switch_brand": "Cisco", "router_brand": "Cisco", "warranty": "5 years"}}'::jsonb,
    36,
    '30% advance payment, 70% on delivery and installation completion',
    'submitted',
    now() - interval '2 hours'
  ),
  (
    'bid-sample-2',
    'rfq-sample-1',
    'vendor-2',
    78000,
    'SAR',
    18,
    'Our competitive proposal offers excellent value for your IT equipment procurement. We specialize in corporate technology solutions and have partnerships with major manufacturers ensuring authentic products and competitive pricing. Free technical support for first 6 months included.',
    '{"laptops": {"brand": "HP EliteBook", "model": "850 G8", "cpu": "Intel i7-1165G7", "ram": "16GB DDR4", "storage": "512GB SSD", "warranty": "3 years"}, "monitors": {"brand": "HP", "model": "E24 G5", "size": "24 inch", "resolution": "1920x1080", "warranty": "3 years"}, "networking": {"switch_brand": "HP Aruba", "router_brand": "HP Aruba", "warranty": "3 years"}}'::jsonb,
    24,
    '50% advance payment, 50% on delivery',
    'submitted',
    now() - interval '4 hours'
  ),
  (
    'bid-sample-3',
    'rfq-sample-2',
    'vendor-1',
    35000,
    'SAR',
    7,
    'We are a full-service digital marketing agency with proven track record in B2B marketing campaigns. Our team includes certified Google Ads specialists, creative content creators, and social media experts. We guarantee measurable results with detailed monthly reporting and transparent KPI tracking.',
    '{"services": {"social_media": "Instagram, Twitter, LinkedIn management", "content": "Blog posts, infographics, video content", "advertising": "Google Ads, LinkedIn Ads", "seo": "On-page and technical SEO"}, "team": {"project_manager": 1, "content_creators": 2, "ad_specialists": 1, "analysts": 1}}'::jsonb,
    null,
    'Monthly payments based on milestones',
    'submitted',
    now() - interval '1 hour'
  ),
  (
    'bid-sample-4',
    'rfq-sample-2',
    'vendor-2',
    42000,
    'SAR',
    5,
    'Premium digital marketing services with dedicated account management. Our agency has managed campaigns for Fortune 500 companies and achieved average 150% ROI for clients. We offer comprehensive campaign management with AI-powered analytics and real-time optimization.',
    '{"services": {"social_media": "Full social media management with AI scheduling", "content": "Professional content creation with graphic design", "advertising": "Multi-platform advertising management", "analytics": "Advanced analytics and reporting dashboard"}, "guarantees": {"roi": "Minimum 120% ROI or money back", "engagement": "25% increase in engagement within 30 days"}}'::jsonb,
    null,
    '40% upfront, 60% split over campaign duration',
    'submitted',
    now() - interval '30 minutes'
  )
ON CONFLICT (id) DO UPDATE SET
  total_price = EXCLUDED.total_price,
  delivery_timeline_days = EXCLUDED.delivery_timeline_days,
  proposal = EXCLUDED.proposal,
  technical_specifications = EXCLUDED.technical_specifications,
  warranty_period_months = EXCLUDED.warranty_period_months,
  payment_terms = EXCLUDED.payment_terms,
  status = EXCLUDED.status,
  submitted_at = EXCLUDED.submitted_at;