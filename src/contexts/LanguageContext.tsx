import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Language
    'language': 'en',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.requests': 'Service Requests',
    'nav.offers': 'My Offers',
    'nav.suppliers': 'Suppliers',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin Panel',
    
    // Common
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.pending': 'Pending',
    'common.accepted': 'Accepted',
    'common.rejected': 'Rejected',
    'common.completed': 'Completed',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.company': 'Company Name',
    'auth.role': 'Role',
    'auth.client': 'Client',
    'auth.supplier': 'Supplier',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to Supplify',
    'dashboard.subtitle': 'Connect with vetted service providers for your events',
    'dashboard.createRequest': 'Create Service Request',
    'dashboard.viewRequests': 'View My Requests',
    'dashboard.browseSuppliers': 'Browse Suppliers',
    
    // Requests
    'request.create': 'Create New Request',
    'request.title': 'Service Request',
    'request.category': 'Service Category',
    'request.description': 'Description',
    'request.budget': 'Budget Range',
    'request.deadline': 'Event Date',
    'request.city': 'City',
    
    // Categories
    'category.booth': 'Booth Stands',
    'category.printing': 'Printing',
    'category.furniture': 'Furniture',
    'category.equipment': 'Equipment',
    'category.giveaways': 'Giveaways',
    'category.logistics': 'Logistics',
    'category.avl': 'AVL (Audio-Visual-Lighting)',
    'category.hospitality': 'Hospitality',
    'category.manpower': 'Manpower',
    'category.portacabin': 'Porta Cabin (WC/Office)',
    'category.registration': 'Registration',
    'category.media': 'Media (Photo/Video/Drone)',
    'category.carpets': 'Carpets',
    'category.flowers': 'Flowers',
  },
  ar: {
    // Language
    'language': 'ar',
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.requests': 'طلبات الخدمة',
    'nav.offers': 'عروضي',
    'nav.suppliers': 'مقدمو الخدمات',
    'nav.profile': 'الملف الشخصي',
    'nav.admin': 'لوحة الإدارة',
    
    // Common
    'common.submit': 'إرسال',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.view': 'عرض',
    'common.pending': 'قيد الانتظار',
    'common.accepted': 'مقبول',
    'common.rejected': 'مرفوض',
    'common.completed': 'مكتمل',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب',
    'auth.logout': 'تسجيل الخروج',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.company': 'اسم الشركة',
    'auth.role': 'الدور',
    'auth.client': 'عميل',
    'auth.supplier': 'مقدم خدمة',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بك في سبلايفي',
    'dashboard.subtitle': 'تواصل مع مقدمي الخدمات المعتمدين لفعالياتك',
    'dashboard.createRequest': 'إنشاء طلب خدمة',
    'dashboard.viewRequests': 'عرض طلباتي',
    'dashboard.browseSuppliers': 'تصفح مقدمي الخدمات',
    
    // Requests
    'request.create': 'إنشاء طلب جديد',
    'request.title': 'طلب الخدمة',
    'request.category': 'فئة الخدمة',
    'request.description': 'الوصف',
    'request.budget': 'نطاق الميزانية',
    'request.deadline': 'تاريخ الفعالية',
    'request.city': 'المدينة',
    
    // Categories
    'category.booth': 'أكشاك العرض',
    'category.printing': 'الطباعة',
    'category.furniture': 'الأثاث',
    'category.equipment': 'المعدات',
    'category.giveaways': 'الهدايا الترويجية',
    'category.logistics': 'اللوجستيات',
    'category.avl': 'الصوت والصورة والإضاءة',
    'category.hospitality': 'الضيافة',
    'category.manpower': 'العمالة',
    'category.portacabin': 'المقاصف المحمولة (دورات مياه/مكاتب)',
    'category.registration': 'التسجيل',
    'category.media': 'الإعلام (تصوير/فيديو/طائرة مسيرة)',
    'category.carpets': 'السجاد',
    'category.flowers': 'الزهور',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};