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
    // App name
    'app.name': 'Supplify',
    // Language
    'language': 'en',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.requests': 'Service Requests',
    'nav.offers': 'My Offers',
    'nav.suppliers': 'Suppliers',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin Panel',
    'nav.home': 'Home',
    'nav.pricing': 'Pricing',
    'nav.consultation': 'Expert Consultation',
    
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
    'common.active': 'Active',
    'common.offers': 'offers',
    'common.viewAll': 'View All',
    'common.recent': 'Recent',
    'common.createNew': 'Create New',
    'common.profile': 'Profile',
    'common.settings': 'Settings',
    'common.signOut': 'Sign out',
    'common.notifications': 'Notifications',
    'common.search': 'Search...',
    
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
    'auth.welcomeBack': 'Welcome back!',
    'auth.welcomeToSupplify': 'Welcome to Supplify!',
    'auth.signInDescription': 'Sign in to your account or create a new one',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPassword': 'Enter your password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.enterCompanyName': 'Enter your company name',
    'auth.signInButton': 'Sign In',
    'auth.createAccountButton': 'Create Account',
    'auth.showPassword': 'Show password',
    'auth.hidePassword': 'Hide password',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to Supplify',
    'dashboard.subtitle': 'Connect with vetted service providers for your events',
    'dashboard.createRequest': 'Create Service Request',
    'dashboard.search': 'Search...',
    'dashboard.viewRequests': 'View My Requests',
    'dashboard.browseSuppliers': 'Browse Suppliers',
    'dashboard.createOffer': 'Create New Offer',
    'dashboard.recentOffers': 'Recent Offers',
    'dashboard.recentRequests': 'Recent Service Requests',
    'dashboard.totalRequests': 'Total Requests',
    'dashboard.activeOffers': 'Active Offers',
    'dashboard.completedProjects': 'Completed Projects',
    'dashboard.totalEarnings': 'Total Earnings',
    
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
    // App name
    'app.name': 'سبلايفي',
    // Language
    'language': 'ar',
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.requests': 'طلبات الخدمة',
    'nav.offers': 'عروضي',
    'nav.suppliers': 'مقدمو الخدمات',
    'nav.profile': 'الملف الشخصي',
    'nav.admin': 'لوحة الإدارة',
    'nav.home': 'الرئيسية',
    'nav.pricing': 'الأسعار',
    'nav.consultation': 'استشارة خبير',
    
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
    'common.active': 'نشط',
    'common.offers': 'عروض',
    'common.viewAll': 'عرض الكل',
    'common.recent': 'الحديث',
    'common.createNew': 'إنشاء جديد',
    'common.profile': 'الملف الشخصي',
    'common.settings': 'الإعدادات',
    'common.signOut': 'تسجيل الخروج',
    'common.notifications': 'الإشعارات',
    'common.search': 'بحث...',
    
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
    'auth.welcomeBack': 'مرحباً بك مرة أخرى!',
    'auth.welcomeToSupplify': 'مرحباً بك في سبلايفي!',
    'auth.signInDescription': 'سجل دخولك أو أنشئ حساباً جديداً',
    'auth.enterEmail': 'أدخل بريدك الإلكتروني',
    'auth.enterPassword': 'أدخل كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.enterCompanyName': 'أدخل اسم شركتك',
    'auth.signInButton': 'تسجيل الدخول',
    'auth.createAccountButton': 'إنشاء حساب',
    'auth.showPassword': 'إظهار كلمة المرور',
    'auth.hidePassword': 'إخفاء كلمة المرور',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بك في سبلايفي',
    'dashboard.subtitle': 'تواصل مع مقدمي الخدمات المعتمدين لفعالياتك',
    'dashboard.createRequest': 'إنشاء طلب خدمة',
    'dashboard.search': 'بحث...',
    'dashboard.viewRequests': 'عرض طلباتي',
    'dashboard.browseSuppliers': 'تصفح مقدمي الخدمات',
    'dashboard.createOffer': 'إنشاء عرض جديد',
    'dashboard.recentOffers': 'العروض الحديثة',
    'dashboard.recentRequests': 'طلبات الخدمة الحديثة',
    'dashboard.totalRequests': 'إجمالي الطلبات',
    'dashboard.activeOffers': 'العروض النشطة',
    'dashboard.completedProjects': 'المشاريع المكتملة',
    'dashboard.totalEarnings': 'إجمالي الأرباح',
    
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