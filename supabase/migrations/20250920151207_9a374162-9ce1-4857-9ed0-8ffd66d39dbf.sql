-- Add sample RFQs and bids for testing
-- Generate sample users and store their IDs in variables
DO $$
DECLARE
    client_uuid UUID := gen_random_uuid();
    vendor1_uuid UUID := gen_random_uuid();
    vendor2_uuid UUID := gen_random_uuid();
    rfq_uuid UUID := gen_random_uuid();
BEGIN
    -- Insert sample user profiles
    INSERT INTO user_profiles (user_id, email, full_name, company_name, role, status, verification_status) VALUES
      (client_uuid, 'client-demo@example.com', 'John Client', 'Client Corp', 'client', 'approved', 'approved'),
      (vendor1_uuid, 'vendor1-demo@example.com', 'Ahmad Supplier', 'Tech Solutions LLC', 'vendor', 'approved', 'approved'),
      (vendor2_uuid, 'vendor2-demo@example.com', 'Sarah Vendor', 'Quality Services Inc', 'vendor', 'approved', 'approved');

    -- Insert sample RFQ
    INSERT INTO rfqs (id, client_id, title, description, category, budget_min, budget_max, currency, status, priority, submission_deadline, project_start_date, project_end_date, delivery_location, terms_and_conditions, requirements, evaluation_criteria) VALUES
      (
        rfq_uuid,
        client_uuid,
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
      );

    -- Insert sample bids
    INSERT INTO bids (id, rfq_id, vendor_id, total_price, currency, delivery_timeline_days, proposal, technical_specifications, warranty_period_months, payment_terms, status, submitted_at) VALUES
      (
        gen_random_uuid(),
        rfq_uuid,
        vendor1_uuid, 
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
        gen_random_uuid(),
        rfq_uuid,
        vendor2_uuid,
        78000,
        'SAR',
        18,
        'Our competitive proposal offers excellent value for your IT equipment procurement. We specialize in corporate technology solutions and have partnerships with major manufacturers ensuring authentic products and competitive pricing. Free technical support for first 6 months included.',
        '{"laptops": {"brand": "HP EliteBook", "model": "850 G8", "cpu": "Intel i7-1165G7", "ram": "16GB DDR4", "storage": "512GB SSD", "warranty": "3 years"}, "monitors": {"brand": "HP", "model": "E24 G5", "size": "24 inch", "resolution": "1920x1080", "warranty": "3 years"}, "networking": {"switch_brand": "HP Aruba", "router_brand": "HP Aruba", "warranty": "3 years"}}'::jsonb,
        24,
        '50% advance payment, 50% on delivery',
        'submitted',
        now() - interval '4 hours'
      );
END $$;