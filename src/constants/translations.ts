
export const translations = {
  en: {
    // Navigation
    nav: {
      platform: "Platform",
      whyStartWithUs: "Why Start With Us",
      whatMakesUsUnique: "What Makes Us Unique", 
      whyMoveToUs: "Why Move To Us",
      services: "Services",
      pricing: "Pricing",
      dashboard: "Dashboard",
      suppliers: "Suppliers", 
      requests: "Requests",
      browseRequests: "Browse Requests",
      offers: "My Offers",
      messages: "Messages",
      analytics: "Analytics",
      orders: "Orders",
      manageSubscription: "Manage Subscription",
      support: "Support",
      admin: "Admin Panel"
    },
    
    // Authentication
    auth: {
      login: "Login",
      register: "Register", 
      startFree: "Start Free",
      signIn: "Sign In",
      signUp: "Sign Up",
      forgotPassword: "Forgot Password?",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      companyName: "Company Name",
      role: "Role",
      client: "Client",
      vendor: "Vendor"
    },

    // Common
    common: {
      settings: "Settings",
      profile: "Profile",
      logout: "Logout",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      error: "Error",
      success: "Success"
    },

    // Admin specific
    admin: {
      title: "Admin Panel",
      dashboard: "Dashboard",
      users: "Users",
      requests: "Requests", 
      offers: "Offers",
      projects: "Projects",
      orders: "Orders",
      financialTransactions: "Financial Transactions",
      subscriptions: "Subscriptions",
      supportTickets: "Support Tickets",
      expertConsultations: "Expert Consultations",
      categoryManagement: "Category Management",
      verificationQueue: "Verification Queue",
      analytics: "Analytics"
    }
  },
  ar: {
    // Navigation
    nav: {
      platform: "المنصة",
      whyStartWithUs: "لماذا تبدأ معنا",
      whatMakesUsUnique: "ما يميزنا",
      whyMoveToUs: "لماذا تنتقل إلينا", 
      services: "الخدمات",
      pricing: "الأسعار",
      dashboard: "لوحة التحكم",
      suppliers: "الموردين",
      requests: "الطلبات",
      browseRequests: "تصفح الطلبات",
      offers: "عروضي",
      messages: "الرسائل",
      analytics: "التحليلات",
      orders: "الطلبات",
      manageSubscription: "إدارة الاشتراك",
      support: "الدعم",
      admin: "لوحة الإدارة"
    },
    
    // Authentication
    auth: {
      login: "تسجيل الدخول",
      register: "التسجيل",
      startFree: "ابدأ مجاناً",
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      forgotPassword: "نسيت كلمة المرور؟",
      createAccount: "إنشاء حساب",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      dontHaveAccount: "ليس لديك حساب؟",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      fullName: "الاسم الكامل",
      companyName: "اسم الشركة",
      role: "الدور",
      client: "عميل",
      vendor: "مورد"
    },

    // Common
    common: {
      settings: "الإعدادات",
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",
      save: "حفظ",
      cancel: "إلغاء",
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح"
    },

    // Admin specific
    admin: {
      title: "لوحة الإدارة",
      dashboard: "لوحة التحكم",
      users: "المستخدمين",
      requests: "الطلبات",
      offers: "العروض", 
      projects: "المشاريع",
      orders: "الطلبات",
      financialTransactions: "المعاملات المالية",
      subscriptions: "الاشتراكات",
      supportTickets: "تذاكر الدعم",
      expertConsultations: "الاستشارات الخبيرة",
      categoryManagement: "إدارة الفئات",
      verificationQueue: "قائمة التحقق",
      analytics: "التحليلات"
    }
  }
};

export const getTranslation = (key: string, language: 'en' | 'ar'): string => {
  const keys = key.split('.');
  let translation: any = translations[language];
  
  for (const k of keys) {
    if (translation && typeof translation === 'object' && k in translation) {
      translation = translation[k];
    } else {
      // Fallback to English if Arabic translation is missing
      translation = translations.en;
      for (const fallbackKey of keys) {
        if (translation && typeof translation === 'object' && fallbackKey in translation) {
          translation = translation[fallbackKey];
        } else {
          return key; // Return the key if no translation found
        }
      }
      break;
    }
  }
  
  return typeof translation === 'string' ? translation : key;
};
