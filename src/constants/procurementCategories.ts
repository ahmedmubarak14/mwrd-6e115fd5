
export interface ProcurementCategory {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  subcategories: ProcurementSubcategory[];
  icon: string;
}

export interface ProcurementSubcategory {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  parent_slug: string;
  price_range_min: number;
  price_range_max: number;
  typical_lead_time: number;
  required_certifications: string[];
  common_specifications: string[];
  tags: string[];
}

export const PROCUREMENT_CATEGORIES: ProcurementCategory[] = [
  {
    id: 'direct-procurement',
    slug: 'direct-procurement',
    name_en: 'Direct Procurement',
    name_ar: 'المشتريات المباشرة',
    description_en: 'Raw materials, components, and production-related items directly used in manufacturing',
    description_ar: 'المواد الخام والمكونات والعناصر المتعلقة بالإنتاج المستخدمة مباشرة في التصنيع',
    icon: 'factory',
    subcategories: [
      {
        id: 'raw-materials-commodities',
        slug: 'raw-materials-commodities',
        name_en: 'Raw Materials & Commodities',
        name_ar: 'المواد الخام والسلع',
        description_en: 'Basic materials and commodities for production',
        description_ar: 'المواد الأساسية والسلع للإنتاج',
        parent_slug: 'direct-procurement',
        price_range_min: 1000,
        price_range_max: 1000000,
        typical_lead_time: 14,
        required_certifications: ['ISO 9001', 'SASO'],
        common_specifications: ['Purity grade', 'Chemical composition', 'Physical properties'],
        tags: ['steel', 'aluminum', 'plastic', 'chemicals', 'metals']
      },
      {
        id: 'packaging-materials',
        slug: 'packaging-materials',
        name_en: 'Packaging Materials',
        name_ar: 'مواد التعبئة والتغليف',
        description_en: 'Materials used for product packaging and protection',
        description_ar: 'المواد المستخدمة لتعبئة وحماية المنتجات',
        parent_slug: 'direct-procurement',
        price_range_min: 500,
        price_range_max: 100000,
        typical_lead_time: 7,
        required_certifications: ['Food grade certification', 'Environmental compliance'],
        common_specifications: ['Material type', 'Dimensions', 'Load capacity', 'Barrier properties'],
        tags: ['cardboard', 'plastic', 'glass', 'metal', 'biodegradable']
      },
      {
        id: 'machinery-production-equipment',
        slug: 'machinery-production-equipment',
        name_en: 'Machinery & Production Equipment',
        name_ar: 'الآلات ومعدات الإنتاج',
        description_en: 'Industrial machinery and equipment for manufacturing processes',
        description_ar: 'الآلات والمعدات الصناعية لعمليات التصنيع',
        parent_slug: 'direct-procurement',
        price_range_min: 10000,
        price_range_max: 10000000,
        typical_lead_time: 60,
        required_certifications: ['CE marking', 'ISO standards', 'Safety certifications'],
        common_specifications: ['Power requirements', 'Capacity', 'Automation level', 'Safety features'],
        tags: ['CNC', 'conveyor', 'robotic', 'hydraulic', 'pneumatic']
      },
      {
        id: 'spare-parts-components',
        slug: 'spare-parts-components',
        name_en: 'Spare Parts & Components',
        name_ar: 'قطع الغيار والمكونات',
        description_en: 'Replacement parts and components for maintenance',
        description_ar: 'قطع الغيار والمكونات للصيانة',
        parent_slug: 'direct-procurement',
        price_range_min: 100,
        price_range_max: 500000,
        typical_lead_time: 21,
        required_certifications: ['OEM certification', 'Quality standards'],
        common_specifications: ['Part number', 'Compatibility', 'Material grade', 'Dimensions'],
        tags: ['bearings', 'seals', 'filters', 'belts', 'gaskets']
      },
      {
        id: 'tools-industrial-supplies',
        slug: 'tools-industrial-supplies',
        name_en: 'Tools & Industrial Supplies',
        name_ar: 'الأدوات واللوازم الصناعية',
        description_en: 'Hand tools, power tools, and industrial consumables',
        description_ar: 'الأدوات اليدوية والكهربائية واللوازم الصناعية الاستهلاكية',
        parent_slug: 'direct-procurement',
        price_range_min: 50,
        price_range_max: 50000,
        typical_lead_time: 7,
        required_certifications: ['Safety standards', 'Quality marks'],
        common_specifications: ['Material', 'Size/capacity', 'Power rating', 'Durability grade'],
        tags: ['cutting tools', 'measuring', 'fasteners', 'lubricants', 'abrasives']
      }
    ]
  },
  {
    id: 'indirect-procurement',
    slug: 'indirect-procurement',
    name_en: 'Indirect Procurement',
    name_ar: 'المشتريات غير المباشرة',
    description_en: 'Goods and services that support business operations but are not directly used in production',
    description_ar: 'السلع والخدمات التي تدعم العمليات التجارية ولكنها لا تستخدم مباشرة في الإنتاج',
    icon: 'office',
    subcategories: [
      {
        id: 'office-supplies-stationery',
        slug: 'office-supplies-stationery',
        name_en: 'Office Supplies & Stationery',
        name_ar: 'اللوازم المكتبية والقرطاسية',
        description_en: 'Daily office consumables and stationery items',
        description_ar: 'المستلزمات المكتبية اليومية والقرطاسية',
        parent_slug: 'indirect-procurement',
        price_range_min: 100,
        price_range_max: 50000,
        typical_lead_time: 3,
        required_certifications: ['Environmental standards'],
        common_specifications: ['Quantity', 'Brand preference', 'Quality grade'],
        tags: ['paper', 'pens', 'folders', 'printing', 'desk accessories']
      },
      {
        id: 'it-technology-equipment',
        slug: 'it-technology-equipment',
        name_en: 'IT & Technology Equipment',
        name_ar: 'معدات تكنولوجيا المعلومات والتقنية',
        description_en: 'Computers, servers, networking equipment, and IT hardware',
        description_ar: 'أجهزة الكمبيوتر والخوادم ومعدات الشبكات وأجهزة تكنولوجيا المعلومات',
        parent_slug: 'indirect-procurement',
        price_range_min: 1000,
        price_range_max: 500000,
        typical_lead_time: 14,
        required_certifications: ['FCC', 'CE', 'Energy Star'],
        common_specifications: ['Technical specs', 'Warranty', 'Compatibility', 'Performance requirements'],
        tags: ['laptops', 'servers', 'networking', 'storage', 'peripherals']
      },
      {
        id: 'software-saas-subscriptions',
        slug: 'software-saas-subscriptions',
        name_en: 'Software & SaaS Subscriptions',
        name_ar: 'البرمجيات واشتراكات الخدمات السحابية',
        description_en: 'Software licenses, cloud services, and digital subscriptions',
        description_ar: 'تراخيص البرمجيات والخدمات السحابية والاشتراكات الرقمية',
        parent_slug: 'indirect-procurement',
        price_range_min: 500,
        price_range_max: 1000000,
        typical_lead_time: 1,
        required_certifications: ['Security compliance', 'Data protection'],
        common_specifications: ['User licenses', 'Features', 'Integration capabilities', 'Support level'],
        tags: ['ERP', 'CRM', 'productivity', 'security', 'analytics']
      },
      {
        id: 'furniture-fixtures',
        slug: 'furniture-fixtures',
        name_en: 'Furniture & Fixtures',
        name_ar: 'الأثاث والتجهيزات',
        description_en: 'Office furniture, fixtures, and workspace equipment',
        description_ar: 'أثاث المكاتب والتجهيزات ومعدات مساحة العمل',
        parent_slug: 'indirect-procurement',
        price_range_min: 500,
        price_range_max: 100000,
        typical_lead_time: 21,
        required_certifications: ['Fire safety', 'Ergonomic standards'],
        common_specifications: ['Dimensions', 'Material', 'Design style', 'Ergonomic features'],
        tags: ['desks', 'chairs', 'storage', 'lighting', 'ergonomic']
      },
      {
        id: 'utilities-electricity-water-gas',
        slug: 'utilities-electricity-water-gas',
        name_en: 'Utilities (Electricity/Water/Gas)',
        name_ar: 'المرافق (كهرباء/مياه/غاز)',
        description_en: 'Essential utility services for business operations',
        description_ar: 'خدمات المرافق الأساسية لعمليات الأعمال',
        parent_slug: 'indirect-procurement',
        price_range_min: 1000,
        price_range_max: 500000,
        typical_lead_time: 30,
        required_certifications: ['Utility regulations', 'Safety standards'],
        common_specifications: ['Capacity requirements', 'Service level', 'Contract terms'],
        tags: ['electricity', 'water', 'gas', 'renewable', 'energy efficiency']
      }
    ]
  },
  {
    id: 'logistics-supply-chain',
    slug: 'logistics-supply-chain',
    name_en: 'Logistics & Supply Chain',
    name_ar: 'اللوجستيات وسلسلة التوريد',
    description_en: 'Transportation, warehousing, and supply chain management services',
    description_ar: 'خدمات النقل والتخزين وإدارة سلسلة التوريد',
    icon: 'truck',
    subcategories: [
      {
        id: 'freight-shipping',
        slug: 'freight-shipping',
        name_en: 'Freight & Shipping (Local/International)',
        name_ar: 'الشحن والنقل (محلي/دولي)',
        description_en: 'Cargo transportation services within Saudi Arabia and internationally',
        description_ar: 'خدمات نقل البضائع داخل المملكة العربية السعودية ودولياً',
        parent_slug: 'logistics-supply-chain',
        price_range_min: 500,
        price_range_max: 100000,
        typical_lead_time: 7,
        required_certifications: ['Transportation license', 'Insurance coverage'],
        common_specifications: ['Weight/volume', 'Origin/destination', 'Service type', 'Delivery timeline'],
        tags: ['air freight', 'sea freight', 'land transport', 'express', 'bulk']
      },
      {
        id: 'warehousing-storage',
        slug: 'warehousing-storage',
        name_en: 'Warehousing & Storage',
        name_ar: 'التخزين والمستودعات',
        description_en: 'Storage facilities and warehouse management services',
        description_ar: 'مرافق التخزين وخدمات إدارة المستودعات',
        parent_slug: 'logistics-supply-chain',
        price_range_min: 2000,
        price_range_max: 200000,
        typical_lead_time: 14,
        required_certifications: ['Warehouse standards', 'Security certifications'],
        common_specifications: ['Storage capacity', 'Climate control', 'Security level', 'Location'],
        tags: ['cold storage', 'dry storage', 'hazmat', 'automated', 'cross-docking']
      },
      {
        id: 'fleet-management-vehicle-leasing',
        slug: 'fleet-management-vehicle-leasing',
        name_en: 'Fleet Management & Vehicle Leasing',
        name_ar: 'إدارة الأسطول وتأجير المركبات',
        description_en: 'Vehicle leasing and fleet management services',
        description_ar: 'خدمات تأجير المركبات وإدارة الأسطول',
        parent_slug: 'logistics-supply-chain',
        price_range_min: 5000,
        price_range_max: 500000,
        typical_lead_time: 30,
        required_certifications: ['Vehicle registration', 'Insurance', 'Safety inspections'],
        common_specifications: ['Vehicle type', 'Lease duration', 'Mileage limits', 'Maintenance included'],
        tags: ['commercial vehicles', 'passenger cars', 'maintenance', 'GPS tracking', 'fuel management']
      },
      {
        id: 'courier-last-mile-delivery',
        slug: 'courier-last-mile-delivery',
        name_en: 'Courier & Last-Mile Delivery',
        name_ar: 'البريد السريع والتوصيل للميل الأخير',
        description_en: 'Express delivery and last-mile logistics services',
        description_ar: 'خدمات التوصيل السريع واللوجستيات للميل الأخير',
        parent_slug: 'logistics-supply-chain',
        price_range_min: 100,
        price_range_max: 50000,
        typical_lead_time: 1,
        required_certifications: ['Courier license', 'Tracking systems'],
        common_specifications: ['Delivery speed', 'Coverage area', 'Package size limits', 'Tracking capabilities'],
        tags: ['same day', 'next day', 'express', 'documents', 'e-commerce']
      },
      {
        id: 'customs-clearance-trade-services',
        slug: 'customs-clearance-trade-services',
        name_en: 'Customs Clearance & Trade Services',
        name_ar: 'التخليص الجمركي وخدمات التجارة',
        description_en: 'Import/export documentation and customs clearance services',
        description_ar: 'خدمات وثائق الاستيراد/التصدير والتخليص الجمركي',
        parent_slug: 'logistics-supply-chain',
        price_range_min: 1000,
        price_range_max: 100000,
        typical_lead_time: 5,
        required_certifications: ['Customs broker license', 'Trade compliance'],
        common_specifications: ['Commodity type', 'Origin country', 'Value', 'Documentation requirements'],
        tags: ['import', 'export', 'customs', 'documentation', 'compliance']
      }
    ]
  },
  {
    id: 'professional-business-services',
    slug: 'professional-business-services',
    name_en: 'Professional & Business Services',
    name_ar: 'الخدمات المهنية والتجارية',
    description_en: 'Consulting, legal, HR, marketing, and other professional services',
    description_ar: 'الاستشارات والقانونية والموارد البشرية والتسويق والخدمات المهنية الأخرى',
    icon: 'briefcase',
    subcategories: [
      {
        id: 'consulting-management-legal-hr-finance',
        slug: 'consulting-management-legal-hr-finance',
        name_en: 'Consulting (Management/Legal/HR/Finance)',
        name_ar: 'الاستشارات (إدارية/قانونية/موارد بشرية/مالية)',
        description_en: 'Professional consulting services across various business domains',
        description_ar: 'خدمات الاستشارات المهنية عبر مختلف مجالات الأعمال',
        parent_slug: 'professional-business-services',
        price_range_min: 5000,
        price_range_max: 1000000,
        typical_lead_time: 30,
        required_certifications: ['Professional licenses', 'Industry certifications'],
        common_specifications: ['Expertise area', 'Project scope', 'Duration', 'Deliverables'],
        tags: ['strategy', 'legal advice', 'HR consulting', 'financial advisory', 'compliance']
      },
      {
        id: 'marketing-advertising',
        slug: 'marketing-advertising',
        name_en: 'Marketing & Advertising',
        name_ar: 'التسويق والإعلان',
        description_en: 'Marketing campaigns, branding, and advertising services',
        description_ar: 'حملات التسويق والعلامة التجارية وخدمات الإعلان',
        parent_slug: 'professional-business-services',
        price_range_min: 2000,
        price_range_max: 500000,
        typical_lead_time: 21,
        required_certifications: ['Marketing certifications', 'Creative licenses'],
        common_specifications: ['Campaign type', 'Target audience', 'Budget allocation', 'Success metrics'],
        tags: ['digital marketing', 'branding', 'social media', 'content creation', 'SEO']
      },
      {
        id: 'recruitment-staffing',
        slug: 'recruitment-staffing',
        name_en: 'Recruitment & Staffing',
        name_ar: 'التوظيف والاستقدام',
        description_en: 'Human resources recruitment and staffing solutions',
        description_ar: 'حلول التوظيف واستقدام الموارد البشرية',
        parent_slug: 'professional-business-services',
        price_range_min: 3000,
        price_range_max: 200000,
        typical_lead_time: 45,
        required_certifications: ['Recruitment license', 'Employment compliance'],
        common_specifications: ['Position type', 'Experience level', 'Industry sector', 'Contract type'],
        tags: ['permanent hiring', 'temporary staffing', 'executive search', 'outsourcing', 'talent acquisition']
      },
      {
        id: 'facility-management',
        slug: 'facility-management',
        name_en: 'Facility Management (Cleaning/Security/Maintenance)',
        name_ar: 'إدارة المرافق (تنظيف/أمن/صيانة)',
        description_en: 'Comprehensive facility management and maintenance services',
        description_ar: 'خدمات إدارة وصيانة المرافق الشاملة',
        parent_slug: 'professional-business-services',
        price_range_min: 2000,
        price_range_max: 300000,
        typical_lead_time: 14,
        required_certifications: ['Security licenses', 'Safety certifications', 'Environmental compliance'],
        common_specifications: ['Service scope', 'Facility size', 'Service frequency', 'Quality standards'],
        tags: ['cleaning services', 'security', 'maintenance', 'landscaping', 'pest control']
      },
      {
        id: 'training-development',
        slug: 'training-development',
        name_en: 'Training & Development',
        name_ar: 'التدريب والتطوير',
        description_en: 'Employee training, skill development, and educational programs',
        description_ar: 'تدريب الموظفين وتطوير المهارات والبرامج التعليمية',
        parent_slug: 'professional-business-services',
        price_range_min: 1000,
        price_range_max: 100000,
        typical_lead_time: 21,
        required_certifications: ['Training accreditation', 'Educational licenses'],
        common_specifications: ['Training type', 'Participant count', 'Duration', 'Certification provided'],
        tags: ['corporate training', 'skills development', 'leadership', 'technical training', 'safety training']
      }
    ]
  },
  {
    id: 'construction-infrastructure',
    slug: 'construction-infrastructure',
    name_en: 'Construction & Infrastructure',
    name_ar: 'البناء والبنية التحتية',
    description_en: 'Construction materials, contractors, and infrastructure development services',
    description_ar: 'مواد البناء والمقاولين وخدمات تطوير البنية التحتية',
    icon: 'construction',
    subcategories: [
      {
        id: 'building-materials',
        slug: 'building-materials',
        name_en: 'Building Materials',
        name_ar: 'مواد البناء',
        description_en: 'Construction materials including cement, steel, aggregates, and finishing materials',
        description_ar: 'مواد البناء بما في ذلك الأسمنت والصلب والركام ومواد التشطيب',
        parent_slug: 'construction-infrastructure',
        price_range_min: 1000,
        price_range_max: 5000000,
        typical_lead_time: 14,
        required_certifications: ['SASO standards', 'Quality certifications', 'Environmental compliance'],
        common_specifications: ['Material grade', 'Quantity', 'Specifications', 'Delivery location'],
        tags: ['cement', 'steel', 'concrete', 'aggregates', 'tiles', 'finishing materials']
      },
      {
        id: 'civil-works-contractors',
        slug: 'civil-works-contractors',
        name_en: 'Civil Works Contractors',
        name_ar: 'مقاولي الأعمال المدنية',
        description_en: 'General contracting and civil engineering construction services',
        description_ar: 'خدمات المقاولات العامة وأعمال الهندسة المدنية',
        parent_slug: 'construction-infrastructure',
        price_range_min: 50000,
        price_range_max: 50000000,
        typical_lead_time: 90,
        required_certifications: ['Contractor license', 'Safety certifications', 'Insurance coverage'],
        common_specifications: ['Project scope', 'Timeline', 'Quality standards', 'Safety requirements'],
        tags: ['general contracting', 'civil engineering', 'infrastructure', 'roads', 'foundations']
      },
      {
        id: 'electrical-works-supplies',
        slug: 'electrical-works-supplies',
        name_en: 'Electrical Works & Supplies',
        name_ar: 'الأعمال الكهربائية واللوازم',
        description_en: 'Electrical installation, materials, and maintenance services',
        description_ar: 'خدمات التركيب الكهربائي والمواد والصيانة',
        parent_slug: 'construction-infrastructure',
        price_range_min: 2000,
        price_range_max: 2000000,
        typical_lead_time: 21,
        required_certifications: ['Electrical license', 'Safety standards', 'Code compliance'],
        common_specifications: ['Voltage requirements', 'Load capacity', 'Installation type', 'Safety features'],
        tags: ['wiring', 'panels', 'lighting', 'power distribution', 'automation']
      },
      {
        id: 'mechanical-hvac-systems',
        slug: 'mechanical-hvac-systems',
        name_en: 'Mechanical & HVAC Systems',
        name_ar: 'الأنظمة الميكانيكية والتكييف',
        description_en: 'HVAC installation, mechanical systems, and climate control solutions',
        description_ar: 'تركيب التكييف والأنظمة الميكانيكية وحلول التحكم في المناخ',
        parent_slug: 'construction-infrastructure',
        price_range_min: 5000,
        price_range_max: 3000000,
        typical_lead_time: 30,
        required_certifications: ['HVAC certifications', 'Energy efficiency standards'],
        common_specifications: ['Capacity requirements', 'Energy efficiency', 'System type', 'Control features'],
        tags: ['air conditioning', 'ventilation', 'heating', 'ductwork', 'energy efficiency']
      },
      {
        id: 'interior-fitout-renovations',
        slug: 'interior-fitout-renovations',
        name_en: 'Interior Fit-Out & Renovations',
        name_ar: 'التشطيبات الداخلية والتجديدات',
        description_en: 'Interior design, fit-out, and renovation services',
        description_ar: 'خدمات التصميم الداخلي والتشطيبات والتجديدات',
        parent_slug: 'construction-infrastructure',
        price_range_min: 10000,
        price_range_max: 1000000,
        typical_lead_time: 45,
        required_certifications: ['Interior design license', 'Safety compliance'],
        common_specifications: ['Design style', 'Space area', 'Material preferences', 'Budget range'],
        tags: ['interior design', 'fit-out', 'renovation', 'flooring', 'false ceiling']
      }
    ]
  },
  {
    id: 'mro-maintenance-repair-operations',
    slug: 'mro-maintenance-repair-operations',
    name_en: 'MRO (Maintenance, Repair & Operations)',
    name_ar: 'الصيانة والإصلاح والعمليات',
    description_en: 'Maintenance services, repair operations, and operational supplies',
    description_ar: 'خدمات الصيانة وعمليات الإصلاح واللوازم التشغيلية',
    icon: 'wrench',
    subcategories: [
      {
        id: 'industrial-equipment-maintenance',
        slug: 'industrial-equipment-maintenance',
        name_en: 'Industrial Equipment Maintenance',
        name_ar: 'صيانة المعدات الصناعية',
        description_en: 'Preventive and corrective maintenance for industrial machinery',
        description_ar: 'الصيانة الوقائية والتصحيحية للآلات الصناعية',
        parent_slug: 'mro-maintenance-repair-operations',
        price_range_min: 2000,
        price_range_max: 500000,
        typical_lead_time: 7,
        required_certifications: ['Technical certifications', 'Safety training'],
        common_specifications: ['Equipment type', 'Maintenance schedule', 'Service level', 'Response time'],
        tags: ['preventive maintenance', 'breakdown repair', 'overhaul', 'calibration', 'troubleshooting']
      },
      {
        id: 'electrical-components',
        slug: 'electrical-components',
        name_en: 'Electrical Components (MCCBs/Contactors/Relays/Fuses/VSDs/Power Analyzers/Pilot Lights)',
        name_ar: 'المكونات الكهربائية (قواطع/مرحلات/منصهرات/محولات/محللات الطاقة/أضواء التشغيل)',
        description_en: 'Electrical components and control devices for industrial applications',
        description_ar: 'المكونات الكهربائية وأجهزة التحكم للتطبيقات الصناعية',
        parent_slug: 'mro-maintenance-repair-operations',
        price_range_min: 100,
        price_range_max: 100000,
        typical_lead_time: 14,
        required_certifications: ['IEC standards', 'UL listing', 'CE marking'],
        common_specifications: ['Voltage rating', 'Current rating', 'Breaking capacity', 'Mounting type'],
        tags: ['MCCBs', 'contactors', 'relays', 'fuses', 'VSDs', 'power analyzers', 'pilot lights']
      },
      {
        id: 'plumbing-sanitary',
        slug: 'plumbing-sanitary',
        name_en: 'Plumbing & Sanitary',
        name_ar: 'السباكة والصحية',
        description_en: 'Plumbing systems, fixtures, and sanitary equipment',
        description_ar: 'أنظمة السباكة والتجهيزات والمعدات الصحية',
        parent_slug: 'mro-maintenance-repair-operations',
        price_range_min: 500,
        price_range_max: 200000,
        typical_lead_time: 10,
        required_certifications: ['Plumbing standards', 'Water quality compliance'],
        common_specifications: ['Pipe material', 'Pressure rating', 'Connection type', 'Flow capacity'],
        tags: ['pipes', 'fittings', 'valves', 'pumps', 'fixtures', 'water treatment']
      },
      {
        id: 'safety-gear-ppe',
        slug: 'safety-gear-ppe',
        name_en: 'Safety Gear & PPE',
        name_ar: 'معدات السلامة والحماية الشخصية',
        description_en: 'Personal protective equipment and workplace safety gear',
        description_ar: 'معدات الحماية الشخصية ومعدات السلامة في مكان العمل',
        parent_slug: 'mro-maintenance-repair-operations',
        price_range_min: 50,
        price_range_max: 50000,
        typical_lead_time: 7,
        required_certifications: ['Safety standards', 'ANSI/OSHA compliance'],
        common_specifications: ['Protection level', 'Size range', 'Material type', 'Certification level'],
        tags: ['helmets', 'gloves', 'safety shoes', 'respirators', 'harnesses', 'protective clothing']
      },
      {
        id: 'fire-safety-security-equipment',
        slug: 'fire-safety-security-equipment',
        name_en: 'Fire Safety & Security Equipment',
        name_ar: 'معدات السلامة من الحرائق والأمن',
        description_en: 'Fire protection systems and security equipment',
        description_ar: 'أنظمة الحماية من الحرائق ومعدات الأمن',
        parent_slug: 'mro-maintenance-repair-operations',
        price_range_min: 1000,
        price_range_max: 1000000,
        typical_lead_time: 21,
        required_certifications: ['Fire safety standards', 'Security certifications'],
        common_specifications: ['Detection type', 'Coverage area', 'Response time', 'Integration capabilities'],
        tags: ['fire detectors', 'extinguishers', 'alarm systems', 'CCTV', 'access control']
      }
    ]
  }
];

// Helper functions
export const getCategoryBySlug = (slug: string): ProcurementCategory | undefined => {
  return PROCUREMENT_CATEGORIES.find(cat => cat.slug === slug);
};

export const getSubcategoryBySlug = (slug: string): ProcurementSubcategory | undefined => {
  for (const category of PROCUREMENT_CATEGORIES) {
    const subcategory = category.subcategories.find(sub => sub.slug === slug);
    if (subcategory) return subcategory;
  }
  return undefined;
};

export const getAllSubcategories = (): ProcurementSubcategory[] => {
  return PROCUREMENT_CATEGORIES.flatMap(cat => cat.subcategories);
};

export const getSubcategoriesByCategory = (categorySlug: string): ProcurementSubcategory[] => {
  const category = getCategoryBySlug(categorySlug);
  return category ? category.subcategories : [];
};
