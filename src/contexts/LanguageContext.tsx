import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.requests': 'Requests',
    'nav.offers': 'Offers',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.vendors': 'Vendors',
    'nav.projects': 'Projects',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.support': 'Support',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.browseRequests': 'Browse Requests',
    'nav.suppliers': 'Suppliers',
    'nav.orders': 'Orders',
    'nav.manageSubscription': 'Manage Subscription',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    'common.start': 'Start',
    'common.stop': 'Stop',
    'common.pause': 'Pause',
    'common.resume': 'Resume',
    'common.reset': 'Reset',
    'common.clear': 'Clear',
    'common.refresh': 'Refresh',
    'common.reload': 'Reload',
    'common.copy': 'Copy',
    'common.paste': 'Paste',
    'common.cut': 'Cut',
    'common.select': 'Select',
    'common.deselect': 'Deselect',
    'common.selectAll': 'Select All',
    'common.deselectAll': 'Deselect All',
    'common.profile': 'Profile',
    'common.signOut': 'Sign Out',
    'common.settings': 'Settings',
    'common.viewAll': 'View All',
    'common.filterByStatus': 'Filter by Status',
    'common.all': 'All',
    'common.pending': 'Pending',
    'common.succeeded': 'Succeeded',
    'common.failed': 'Failed',
    'common.type': 'Type',
    
    // App
    'app.name': 'MWRD',
    'app.tagline': 'Smart B2B Procurement Platform',
    'app.description': 'Connect with vetted service providers for your procurement needs',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.loginSuccess': 'Logged in successfully',
    'auth.loginError': 'Login failed',
    'auth.registerSuccess': 'Account created successfully',
    'auth.registerError': 'Registration failed',
    'auth.logoutSuccess': 'Logged out successfully',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome to MWRD',
    'dashboard.overview': 'Overview',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.statistics': 'Statistics',
    'dashboard.search': 'Search...',
    'dashboard.findOpportunities': 'Find Business Opportunities',
    'dashboard.completedProjects': 'Completed Projects',
    
    // Vendor
    'vendor.welcome': 'Welcome to your Vendor Dashboard',
    'vendor.subtitle': 'Manage your offers, browse requests, and grow your business',
    'vendor.totalOffers': 'Total Offers',
    'vendor.acceptedOffers': 'Accepted Offers',
    'vendor.pendingOffers': 'Pending Offers',
    'vendor.searchRequests': 'Search available requests...',
    'vendor.filterByCategory': 'Filter by category',
    'vendor.availableRequests': 'Available Requests',
    'vendor.submitOffer': 'Submit Offer',
    'vendor.viewDetails': 'View Details',
    
    // Browse Requests
    'browseRequests.title': 'Browse Requests',
    'browseRequests.subtitle': 'Find and submit offers for procurement requests',
    'browseRequests.searchAndFilter': 'Search & Filter',
    'browseRequests.searchPlaceholder': 'Search requests...',
    'browseRequests.filterByCategory': 'Filter by category',
    'browseRequests.filterDescription': 'Find the perfect opportunities for your business',
    'browseRequests.noResults': 'No requests found',
    'browseRequests.noResultsDesc': 'Try adjusting your search criteria',
    'browseRequests.budget': 'Budget',
    'browseRequests.deadline': 'Deadline',
    'browseRequests.posted': 'Posted',
    'browseRequests.submitOffer': 'Submit Offer',
    'browseRequests.viewDetails': 'View Details',
    
    // Requests
    'requests.title': 'Requests',
    'requests.create': 'Create Request',
    'requests.myRequests': 'My Requests',
    'requests.allRequests': 'All Requests',
    'requests.pending': 'Pending',
    'requests.approved': 'Approved',
    'requests.rejected': 'Rejected',
    'requests.inProgress': 'In Progress',
    'requests.completed': 'Completed',
    
    // Offers
    'offers.title': 'Offers',
    'offers.create': 'Create Offer',
    'offers.myOffers': 'My Offers',
    'offers.allOffers': 'All Offers',
    'offers.received': 'Received',
    'offers.sent': 'Sent',
    
    // Messages
    'messages.title': 'Messages',
    'messages.newMessage': 'New Message',
    'messages.compose': 'Compose',
    'messages.inbox': 'Inbox',
    'messages.sent': 'Sent',
    'messages.drafts': 'Drafts',
    'messages.trash': 'Trash',
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.settings': 'Profile Settings',
    'profile.personalInfo': 'Personal Information',
    'profile.companyInfo': 'Company Information',
    'profile.contactInfo': 'Contact Information',
    
    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    
    // Admin Panel
    'admin.panel': 'Admin Panel',
    'admin.managementDashboard': 'Management Dashboard',
    'admin.adminVersion': 'Admin Version',
    'admin.adminUser': 'Admin User',
    'admin.searchPlaceholder': 'Search admin panel...',
    'admin.notificationsDemo': 'Demo notifications',
    'searching': 'Searching',
    
    // Admin Menu Items
    'admin.menu.dashboard': 'Dashboard',
    'admin.menu.userManagement': 'User Management',
    'admin.menu.allUsers': 'All Users',
    'admin.menu.advancedManagement': 'Advanced Management',
    'admin.menu.userProfiles': 'User Profiles',
    'admin.menu.financial': 'Financial',
    'admin.menu.financialDashboard': 'Financial Dashboard',
    'admin.menu.transactions': 'Transactions',
    'admin.menu.subscriptions': 'Subscriptions',
    'admin.menu.analytics': 'Analytics',
    'admin.menu.platformAnalytics': 'Platform Analytics',
    'admin.menu.userActivity': 'User Activity',
    'admin.menu.reports': 'Reports',
    'admin.menu.contentManagement': 'Content Management',
    'admin.menu.requestsApproval': 'Requests Approval',
    'admin.menu.offersManagement': 'Offers Management',
    'admin.menu.expertConsultations': 'Expert Consultations',
    'admin.menu.system': 'System',
    'admin.menu.settings': 'Settings',
    'admin.menu.themeDesign': 'Theme Design',
    'admin.menu.database': 'Database',
    
    // Orders
    'orders.title': 'Orders',
    'orders.subtitle': 'Track and manage your orders',
    
    // Footer
    'footer.aboutUs': 'About Us',
    'footer.contactUs': 'Contact Us',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
    'footer.support': 'Support',
    'footer.help': 'Help',
    'footer.copyright': '© 2024 MWRD. All rights reserved.',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.requests': 'الطلبات',
    'nav.offers': 'العروض',
    'nav.messages': 'الرسائل',
    'nav.profile': 'الملف الشخصي',
    'nav.admin': 'الإدارة',
    'nav.vendors': 'الموردين',
    'nav.projects': 'المشاريع',
    'nav.analytics': 'التحليلات',
    'nav.settings': 'الإعدادات',
    'nav.support': 'الدعم',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'التسجيل',
    'nav.browseRequests': 'تصفح الطلبات',
    'nav.suppliers': 'الموردين',
    'nav.orders': 'الطلبيات',
    'nav.manageSubscription': 'إدارة الاشتراك',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.create': 'إنشاء',
    'common.update': 'تحديث',
    'common.submit': 'إرسال',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.download': 'تحميل',
    'common.upload': 'رفع',
    'common.close': 'إغلاق',
    'common.open': 'فتح',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.confirm': 'تأكيد',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.finish': 'إنهاء',
    'common.start': 'بدء',
    'common.stop': 'إيقاف',
    'common.pause': 'إيقاف مؤقت',
    'common.resume': 'استئناف',
    'common.reset': 'إعادة تعيين',
    'common.clear': 'مسح',
    'common.refresh': 'تحديث',
    'common.reload': 'إعادة تحميل',
    'common.copy': 'نسخ',
    'common.paste': 'لصق',
    'common.cut': 'قص',
    'common.select': 'اختيار',
    'common.deselect': 'إلغاء الاختيار',
    'common.selectAll': 'اختيار الكل',
    'common.deselectAll': 'إلغاء اختيار الكل',
    'common.profile': 'الملف الشخصي',
    'common.signOut': 'تسجيل الخروج',
    'common.settings': 'الإعدادات',
    'common.viewAll': 'عرض الكل',
    'common.filterByStatus': 'تصفية حسب الحالة',
    'common.all': 'الكل',
    'common.pending': 'قيد الانتظار',
    'common.succeeded': 'نجح',
    'common.failed': 'فشل',
    'common.type': 'النوع',
    
    // App
    'app.name': 'مورد',
    'app.tagline': 'منصة المشتريات التجارية الذكية',
    'app.description': 'تواصل مع موردي الخدمات المعتمدين لاحتياجات المشتريات الخاصة بك',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'التسجيل',
    'auth.logout': 'تسجيل الخروج',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.rememberMe': 'تذكرني',
    'auth.loginSuccess': 'تم تسجيل الدخول بنجاح',
    'auth.loginError': 'فشل في تسجيل الدخول',
    'auth.registerSuccess': 'تم إنشاء الحساب بنجاح',
    'auth.registerError': 'فشل في التسجيل',
    'auth.logoutSuccess': 'تم تسجيل الخروج بنجاح',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحباً بك في مورد',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.recentActivity': 'النشاط الأخير',
    'dashboard.quickActions': 'إجراءات سريعة',
    'dashboard.statistics': 'الإحصائيات',
    'dashboard.search': 'بحث...',
    'dashboard.findOpportunities': 'ابحث عن الفرص التجارية',
    'dashboard.completedProjects': 'المشاريع المكتملة',
    
    // Vendor
    'vendor.welcome': 'مرحباً بك في لوحة المورد',
    'vendor.subtitle': 'إدارة عروضك وتصفح الطلبات وتنمية أعمالك',
    'vendor.totalOffers': 'إجمالي العروض',
    'vendor.acceptedOffers': 'العروض المقبولة',
    'vendor.pendingOffers': 'العروض المعلقة',
    'vendor.searchRequests': 'البحث في الطلبات المتاحة...',
    'vendor.filterByCategory': 'تصفية حسب الفئة',
    'vendor.availableRequests': 'الطلبات المتاحة',
    'vendor.submitOffer': 'تقديم عرض',
    'vendor.viewDetails': 'عرض التفاصيل',
    
    // Browse Requests
    'browseRequests.title': 'تصفح الطلبات',
    'browseRequests.subtitle': 'البحث عن طلبات المشتريات وتقديم العروض',
    'browseRequests.searchAndFilter': 'البحث والتصفية',
    'browseRequests.searchPlaceholder': 'البحث في الطلبات...',
    'browseRequests.filterByCategory': 'تصفية حسب الفئة',
    'browseRequests.filterDescription': 'ابحث عن الفرص المثالية لعملك',
    'browseRequests.noResults': 'لم يتم العثور على طلبات',
    'browseRequests.noResultsDesc': 'حاول تعديل معايير البحث',
    'browseRequests.budget': 'الميزانية',
    'browseRequests.deadline': 'الموعد النهائي',
    'browseRequests.posted': 'تاريخ النشر',
    'browseRequests.submitOffer': 'تقديم عرض',
    'browseRequests.viewDetails': 'عرض التفاصيل',
    
    // Requests
    'requests.title': 'الطلبات',
    'requests.create': 'إنشاء طلب',
    'requests.myRequests': 'طلباتي',
    'requests.allRequests': 'جميع الطلبات',
    'requests.pending': 'قيد الانتظار',
    'requests.approved': 'معتمد',
    'requests.rejected': 'مرفوض',
    'requests.inProgress': 'قيد التنفيذ',
    'requests.completed': 'مكتمل',
    
    // Offers
    'offers.title': 'العروض',
    'offers.create': 'إنشاء عرض',
    'offers.myOffers': 'عروضي',
    'offers.allOffers': 'جميع العروض',
    'offers.received': 'مستلمة',
    'offers.sent': 'مرسلة',
    
    // Messages
    'messages.title': 'الرسائل',
    'messages.newMessage': 'رسالة جديدة',
    'messages.compose': 'إنشاء',
    'messages.inbox': 'صندوق الوارد',
    'messages.sent': 'مرسلة',
    'messages.drafts': 'المسودات',
    'messages.trash': 'سلة المهملات',
    
    // Profile
    'profile.title': 'الملف الشخصي',
    'profile.edit': 'تعديل الملف الشخصي',
    'profile.settings': 'إعدادات الملف الشخصي',
    'profile.personalInfo': 'المعلومات الشخصية',
    'profile.companyInfo': 'معلومات الشركة',
    'profile.contactInfo': 'معلومات الاتصال',
    
    // Theme
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.system': 'النظام',
    
    // Admin Panel
    'admin.panel': 'لوحة الإدارة',
    'admin.managementDashboard': 'لوحة إدارة النظام',
    'admin.adminVersion': 'نسخة الإدارة',
    'admin.adminUser': 'مستخدم إداري',
    'admin.searchPlaceholder': 'البحث في لوحة الإدارة...',
    'admin.notificationsDemo': 'إشعارات تجريبية',
    'searching': 'جاري البحث',
    
    // Admin Menu Items
    'admin.menu.dashboard': 'لوحة التحكم',
    'admin.menu.userManagement': 'إدارة المستخدمين',
    'admin.menu.allUsers': 'جميع المستخدمين',
    'admin.menu.advancedManagement': 'الإدارة المتقدمة',
    'admin.menu.userProfiles': 'ملفات المستخدمين',
    'admin.menu.financial': 'المالية',
    'admin.menu.financialDashboard': 'لوحة المالية',
    'admin.menu.transactions': 'المعاملات',
    'admin.menu.subscriptions': 'الاشتراكات',
    'admin.menu.analytics': 'التحليلات',
    'admin.menu.platformAnalytics': 'تحليلات المنصة',
    'admin.menu.userActivity': 'نشاط المستخدمين',
    'admin.menu.reports': 'التقارير',
    'admin.menu.contentManagement': 'إدارة المحتوى',
    'admin.menu.requestsApproval': 'اعتماد الطلبات',
    'admin.menu.offersManagement': 'إدارة العروض',
    'admin.menu.expertConsultations': 'الاستشارات الخبيرة',
    'admin.menu.system': 'النظام',
    'admin.menu.settings': 'الإعدادات',
    'admin.menu.themeDesign': 'تصميم النسق',
    'admin.menu.database': 'قاعدة البيانات',
    
    // Orders
    'orders.title': 'الطلبيات',
    'orders.subtitle': 'تتبع وإدارة طلبياتك',
    
    // Footer
    'footer.aboutUs': 'من نحن',
    'footer.contactUs': 'اتصل بنا',
    'footer.privacyPolicy': 'سياسة الخصوصية',
    'footer.termsOfService': 'شروط الخدمة',
    'footer.support': 'الدعم',
    'footer.help': 'المساعدة',
    'footer.copyright': '© 2024 مورد. جميع الحقوق محفوظة.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
