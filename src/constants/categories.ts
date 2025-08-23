export type SubCategory = {
  value: string;
  labelEn: string;
  labelAr: string;
  requirements: string[];
  priceRangeMin: number;
  priceRangeMax: number;
  tags: string[];
};

export type Category = {
  value: string;
  labelEn: string;
  labelAr: string;
  subcategories: SubCategory[];
  icon: string;
  description: {
    en: string;
    ar: string;
  };
};

export const CATEGORIES: Category[] = [
  { 
    value: 'avl', 
    labelEn: 'Audio, Visual & Lighting', 
    labelAr: 'الصوت والإضاءة والمرئيات',
    icon: 'speaker',
    description: {
      en: 'Professional audio, visual, and lighting solutions for events',
      ar: 'حلول صوتية ومرئية وإضاءة احترافية للفعاليات'
    },
    subcategories: [
      {
        value: 'sound_systems',
        labelEn: 'Sound Systems',
        labelAr: 'أنظمة الصوت',
        requirements: ['Power requirements', 'Venue size', 'Equipment specifications'],
        priceRangeMin: 5000,
        priceRangeMax: 50000,
        tags: ['speakers', 'microphones', 'mixing', 'amplifiers']
      },
      {
        value: 'lighting',
        labelEn: 'Event Lighting',
        labelAr: 'إضاءة الفعاليات',
        requirements: ['Lighting design', 'Power consumption', 'Setup requirements'],
        priceRangeMin: 3000,
        priceRangeMax: 40000,
        tags: ['led', 'stage-lighting', 'decorative', 'smart-lighting']
      },
      {
        value: 'screens_displays',
        labelEn: 'Screens & Displays',
        labelAr: 'الشاشات والعروض',
        requirements: ['Screen size', 'Resolution', 'Content type'],
        priceRangeMin: 2000,
        priceRangeMax: 30000,
        tags: ['led-wall', 'projectors', 'interactive', 'outdoor']
      }
    ]
  },
  { 
    value: 'catering', 
    labelEn: 'Catering Services', 
    labelAr: 'خدمات الطعام',
    icon: 'utensils',
    description: {
      en: 'Professional catering and food services for all types of events',
      ar: 'خدمات طعام احترافية لجميع أنواع الفعاليات'
    },
    subcategories: [
      {
        value: 'buffet',
        labelEn: 'Buffet Service',
        labelAr: 'خدمة البوفيه',
        requirements: ['Guest count', 'Dietary restrictions', 'Service duration'],
        priceRangeMin: 50,
        priceRangeMax: 300,
        tags: ['buffet', 'self-service', 'variety', 'cost-effective']
      },
      {
        value: 'plated_service',
        labelEn: 'Plated Service',
        labelAr: 'الخدمة المطبقة',
        requirements: ['Menu selection', 'Service staff', 'Table setup'],
        priceRangeMin: 80,
        priceRangeMax: 500,
        tags: ['formal', 'seated', 'waitstaff', 'premium']
      },
      {
        value: 'specialty_cuisine',
        labelEn: 'Specialty Cuisine',
        labelAr: 'المأكولات المتخصصة',
        requirements: ['Cuisine type', 'Special equipment', 'Chef expertise'],
        priceRangeMin: 100,
        priceRangeMax: 600,
        tags: ['international', 'gourmet', 'chef', 'unique']
      }
    ]
  },
  { 
    value: 'decoration', 
    labelEn: 'Decoration & Design', 
    labelAr: 'الديكور والتزيين',
    icon: 'palette',
    description: {
      en: 'Creative decoration and design services to transform your event space',
      ar: 'خدمات ديكور وتصميم إبداعية لتحويل مساحة الفعالية'
    },
    subcategories: [
      {
        value: 'floral',
        labelEn: 'Floral Arrangements',
        labelAr: 'التنسيقات الزهرية',
        requirements: ['Flower types', 'Color scheme', 'Arrangement style'],
        priceRangeMin: 1000,
        priceRangeMax: 15000,
        tags: ['flowers', 'centerpieces', 'bouquets', 'natural']
      },
      {
        value: 'theme_decoration',
        labelEn: 'Theme Decoration',
        labelAr: 'ديكور موضوعي',
        requirements: ['Theme concept', 'Color palette', 'Decoration items'],
        priceRangeMin: 2000,
        priceRangeMax: 25000,
        tags: ['themed', 'custom', 'props', 'backdrops']
      },
      {
        value: 'balloon_decoration',
        labelEn: 'Balloon Decoration',
        labelAr: 'ديكور البالونات',
        requirements: ['Design concept', 'Balloon types', 'Installation method'],
        priceRangeMin: 500,
        priceRangeMax: 8000,
        tags: ['balloons', 'arches', 'sculptures', 'colorful']
      }
    ]
  },
  { 
    value: 'furniture', 
    labelEn: 'Furniture & Equipment', 
    labelAr: 'الأثاث والمعدات',
    icon: 'chair',
    description: {
      en: 'Furniture rental and equipment solutions for comfortable event experiences',
      ar: 'تأجير الأثاث وحلول المعدات لتجارب فعاليات مريحة'
    },
    subcategories: [
      {
        value: 'seating',
        labelEn: 'Seating Solutions',
        labelAr: 'حلول الجلوس',
        requirements: ['Guest capacity', 'Seating style', 'Comfort level'],
        priceRangeMin: 10,
        priceRangeMax: 100,
        tags: ['chairs', 'sofas', 'benches', 'premium']
      },
      {
        value: 'tables',
        labelEn: 'Tables & Surfaces',
        labelAr: 'الطاولات والأسطح',
        requirements: ['Table size', 'Table type', 'Setup configuration'],
        priceRangeMin: 15,
        priceRangeMax: 150,
        tags: ['dining-tables', 'cocktail-tables', 'work-surfaces', 'display']
      },
      {
        value: 'staging',
        labelEn: 'Staging & Platforms',
        labelAr: 'المنصات والأسطح',
        requirements: ['Stage size', 'Height requirements', 'Load capacity'],
        priceRangeMin: 500,
        priceRangeMax: 5000,
        tags: ['stage', 'platform', 'riser', 'modular']
      }
    ]
  },
  { 
    value: 'security', 
    labelEn: 'Security Services', 
    labelAr: 'خدمات الأمن',
    icon: 'shield',
    description: {
      en: 'Professional security services to ensure safe and secure events',
      ar: 'خدمات أمنية احترافية لضمان فعاليات آمنة ومحمية'
    },
    subcategories: [
      {
        value: 'personnel',
        labelEn: 'Security Personnel',
        labelAr: 'الأفراد الأمنيون',
        requirements: ['Number of guards', 'Security level', 'Shift duration'],
        priceRangeMin: 200,
        priceRangeMax: 800,
        tags: ['guards', 'officers', 'surveillance', 'crowd-control']
      },
      {
        value: 'surveillance',
        labelEn: 'Surveillance Systems',
        labelAr: 'أنظمة المراقبة',
        requirements: ['Camera count', 'Coverage area', 'Recording requirements'],
        priceRangeMin: 1000,
        priceRangeMax: 10000,
        tags: ['cctv', 'monitoring', 'recording', 'real-time']
      },
      {
        value: 'access_control',
        labelEn: 'Access Control',
        labelAr: 'مراقبة الدخول',
        requirements: ['Entry points', 'Credential type', 'Integration needs'],
        priceRangeMin: 500,
        priceRangeMax: 5000,
        tags: ['entry', 'credentials', 'gates', 'tracking']
      }
    ]
  },
  { 
    value: 'transportation', 
    labelEn: 'Transportation Services', 
    labelAr: 'خدمات النقل',
    icon: 'car',
    description: {
      en: 'Reliable transportation solutions for guests and event logistics',
      ar: 'حلول نقل موثوقة للضيوف ولوجستيات الفعاليات'
    },
    subcategories: [
      {
        value: 'guest_transport',
        labelEn: 'Guest Transportation',
        labelAr: 'نقل الضيوف',
        requirements: ['Passenger count', 'Distance', 'Service level'],
        priceRangeMin: 300,
        priceRangeMax: 2000,
        tags: ['shuttle', 'luxury', 'group', 'individual']
      },
      {
        value: 'logistics',
        labelEn: 'Event Logistics',
        labelAr: 'لوجستيات الفعاليات',
        requirements: ['Equipment type', 'Load capacity', 'Delivery schedule'],
        priceRangeMin: 500,
        priceRangeMax: 3000,
        tags: ['delivery', 'setup', 'equipment', 'coordination']
      },
      {
        value: 'vip_services',
        labelEn: 'VIP Transportation',
        labelAr: 'نقل كبار الشخصيات',
        requirements: ['Vehicle type', 'Security level', 'Special requirements'],
        priceRangeMin: 800,
        priceRangeMax: 5000,
        tags: ['luxury', 'premium', 'executive', 'private']
      }
    ]
  },
];

export const getCategoryLabel = (value: string, language: 'en' | 'ar' = 'en') => {
  const item = CATEGORIES.find(c => c.value === value);
  if (!item) return value;
  return language === 'ar' ? item.labelAr : item.labelEn;
};
