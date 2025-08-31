/**
 * Admin Translations - Arabic (Saudi Arabia)
 * Clean, focused translation keys for admin interface
 */

export const adminTranslationsAR = {
  admin: {
    // لوحة التحكم والنظرة العامة
    dashboard: {
      title: "لوحة تحكم الإدارة",
      description: "إدارة ومراقبة المنصة الشاملة",
      welcome: "مرحباً بك في لوحة تحكم الإدارة",
      overview: "نظرة عامة على المنصة",
      quickActions: "الإجراءات السريعة",
      quickActionsDesc: "وظائف الإدارة واختصارات الاستخدام الشائع"
    },

    // مجموعات التنقل
    groups: {
      overview: "نظرة عامة",
      management: "الإدارة",
      business: "الأعمال",
      system: "النظام"
    },

    // أوصاف التنقل للنظرة العامة الشاملة
    navigation: {
      userManagement: "إدارة المستخدمين",
      userManagementDescription: "إدارة حسابات المستخدمين والصلاحيات",
      approvalQueue: "قائمة الموافقات", 
      approvalQueueDescription: "مراجعة الطلبات والعروض المعلقة",
      financialOverview: "النظرة المالية العامة",
      financialOverviewDescription: "مراقبة المعاملات والإيرادات",
      systemHealth: "صحة النظام",
      systemHealthDescription: "فحص حالة الخادم والنظام",
      securityCenter: "مركز الأمان",
      securityCenterDescription: "مراقبة الأمان والامتثال",
      communications: "الاتصالات", 
      communicationsDescription: "إدارة الإشعارات والرسائل",
      analytics: "التحليلات",
      analyticsDescription: "عرض رؤى ومقاييس المنصة",
      automation: "الأتمتة",
      automationDescription: "أتمتة سير العمل والقواعد"
    },

    // مسار التنقل
    breadcrumbs: {
      dashboard: "لوحة التحكم",
      users: "المستخدمون",
      requests: "الطلبات",
      offers: "العروض",
      orders: "الطلبيات",
      transactions: "المعاملات",
      analytics: "التحليلات",
      settings: "الإعدادات",
      communications: "الاتصالات",
      security: "الأمان",
      verification: "التحقق",
      automation: "الأتمتة",
      expertConsultations: "الاستشارات الخبيرة"
    },

    // لوحة الأوامر
    commandPalette: {
      placeholder: "اكتب أمراً أو ابحث...",
      noResults: "لم يتم العثور على نتائج",
      recent: "حديث",
      suggestions: "اقتراحات"
    },

    // إدارة المستخدمين
    users: {
      title: "إدارة المستخدمين",
      description: "إدارة مستخدمي المنصة وصلاحياتهم",
      searchPlaceholder: "البحث في المستخدمين...",
      filterByRole: "تصفية حسب الدور",
      filterByStatus: "تصفية حسب الحالة",
      allRoles: "جميع الأدوار",
      allStatuses: "جميع الحالات",
      exportUsers: "تصدير المستخدمين",
      bulkActions: "إجراءات مجمعة",
      selectedUsers: "مستخدمون محددون",
      userDetails: {
        personalInfo: "المعلومات الشخصية",
        accountSettings: "إعدادات الحساب",
        activityHistory: "تاريخ النشاط",
        role: "الدور",
        status: "الحالة",
        client: "عميل",
        vendor: "مورد",
        admin: "مدير",
        active: "نشط",
        suspended: "معلق",
        pending: "في الانتظار",
        selectRole: "اختر الدور",
        addUserError: "فشل في إضافة المستخدم"
      }
    },

    // إدارة الطلبات  
    requests: {
      title: "إدارة الطلبات",
      description: "مراقبة وإدارة طلبات المشتريات",
      searchPlaceholder: "البحث في الطلبات...",
      exportRequests: "تصدير الطلبات"
    },

    // إدارة العروض
    offersManagement: {
      title: "إدارة العروض", 
      description: "مراجعة وإدارة عروض الموردين",
      searchPlaceholder: "البحث في العروض...",
      exportOffers: "تصدير العروض",
      pendingApprovalSince: "في انتظار موافقة الإدارة منذ",
      requiresAttention: "يتطلب اهتماماً", 
      approvedAndActive: "موافق عليه ونشط",
      supplier: "المورد",
      request: "الطلب",
      price: "السعر",
      daysDelivery: "أيام التسليم",
      created: "تم الإنشاء",
      noOffersFound: "لم يتم العثور على عروض",
      noOffersDesc: "لا توجد عروض تطابق معايير البحث الحالية."
    },

    // إدارة الطلبات المحددة
    requestsManagement: {
      statusPlaceholder: "الحالة",
      approvalStatusPlaceholder: "حالة الموافقة", 
      urgencyPlaceholder: "الأولوية"
    },

    // إدارة الطلبيات
    ordersManagement: {
      title: "إدارة الطلبيات",
      description: "تتبع وإدارة طلبيات العملاء",
      searchPlaceholder: "البحث في الطلبيات...",
      exportOrders: "تصدير الطلبيات",
      csvOrderId: "رقم الطلبية",
      csvClient: "العميل",
      csvSupplier: "المورد", 
      csvAmount: "المبلغ",
      csvStatus: "الحالة",
      csvDate: "التاريخ"
    },

    // الإدارة المالية
    financial: {
      title: "لوحة التحكم المالية",
      description: "مراقبة المعاملات والإيرادات والأداء المالي",
      transactionHistory: "تاريخ المعاملات",
      revenue: "الإيرادات",
      expenses: "المصروفات",
      balance: "الرصيد",
      totalRevenue: "إجمالي الإيرادات",
      pendingAmount: "المبلغ المعلق",
      failedTransactions: "المعاملات الفاشلة",
      avgTransaction: "متوسط المعاملة",
      perCompletedTransaction: "لكل معاملة مكتملة",
      awaitingProcessing: "في انتظار المعالجة",
      needsAttention: "يحتاج اهتمام",
      monthlyGrowth: "+12.5% هذا الشهر",
      revenueTrend: "اتجاه الإيرادات",
      financialPerformance: "الأداء المالي خلال الفترة المحددة",
      recentTransactions: "المعاملات الحديثة",
      viewAndManage: "عرض وإدارة المعاملات المالية",
      searchTransactions: "البحث في المعاملات...",
      filterByStatus: "تصفية حسب الحالة",
      filterByType: "تصفية حسب النوع",
      allStatus: "جميع الحالات",
      completed: "مكتمل",
      pending: "معلق",
      failed: "فاشل",
      allTypes: "جميع الأنواع",
      payment: "دفع",
      refund: "استرداد",
      noTransactionsFound: "لم يتم العثور على معاملات",
      adjustFilters: "جرب تعديل البحث أو الفلاتر",
      export: "تصدير",
      refresh: "تحديث",
      loadingDashboard: "تحميل لوحة التحكم المالية...",
      exportSuccess: "تم تصدير المعاملات بنجاح",
      exportError: "فشل في تصدير المعاملات",
      fetchError: "فشل في جلب المعاملات",
      csvTransactionId: "رقم المعاملة",
      csvUser: "المستخدم",
      csvAmount: "المبلغ",
      csvType: "النوع",
      csvStatus: "الحالة",
      csvDate: "التاريخ",
      bulkProcessTransactions: "معالجة المحدد",
      bulkProcessing: "جاري معالجة المعاملات...",
      transactionsSelected: "معاملات محددة"
    },

    // إدارة التحقق
    verification: {
      title: "قائمة التحقق",
      description: "مراجعة تحققات المستخدمين المعلقة",
      documentReview: "مراجعة الوثائق",
      approveVerification: "موافقة",
      rejectVerification: "رفض",
      verificationStatus: "حالة التحقق"
    },

    // التحليلات
    analytics: {
      title: "تحليلات المنصة",
      description: "رؤى ومقاييس الأداء",
      totalUsers: "إجمالي المستخدمين",
      totalRevenue: "إجمالي الإيرادات", 
      pendingApprovals: "الموافقات المعلقة",
      platformActivity: "نشاط المنصة",
      platformActivityDesc: "مقاييس النشاط اليومي عبر المنصة",
      recentActivity: "النشاط الحديث",
      recentActivityDescription: "أحدث أنشطة النظام وإجراءات المستخدمين",
      activityOn: "في",
      noRecentActivity: "لا يوجد نشاط حديث"
    },

    // إدارة النظام
    system: {
      title: "إدارة النظام",
      description: "صحة النظام والتكوين",
      alerts: "تنبيهات النظام",
      activeSystemAlerts: "تنبيهات النظام النشطة",
      requireAttention: "تتطلب اهتماماً",
      health: "صحة النظام",
      healthy: "سليم",
      warning: "تحذير",
      critical: "حرج",
      allSystemsOperational: "جميع الأنظمة تعمل بشكل طبيعي",
      database: "قاعدة البيانات",
      cpuUsage: "استخدام المعالج",
      memoryUsage: "استخدام الذاكرة",
      activeConnections: "الاتصالات النشطة",
      status: "حالة النظام",
      statusDescription: "صحة النظام الحالية ومقاييس الأداء",
      metricsError: "فشل في تحميل مقاييس النظام"
    },

    // مركز الأمان
    security: {
      title: "مركز الأمان",
      description: "مراقبة وإدارة الأمان الشاملة",
      liveMonitor: "المراقبة المباشرة",
      overview: "نظرة عامة", 
      incidents: "الحوادث",
      auditTrail: "سجل التدقيق",
      systemHealth: "الصحة",
      compliance: "الامتثال"
    },

    // إدارة الاستشارات الخبيرة
    expertConsultations: {
      title: "الاستشارات الخبيرة",
      description: "إدارة طلبات الاستشارة والجدولة",
      table: "عرض الجدول",
      cards: "عرض البطاقات",
      totalConsultations: "إجمالي الاستشارات", 
      allTime: "على الإطلاق",
      awaitingResponse: "في انتظار الرد",
      activeBookings: "الحجوزات النشطة",
      successfullyFinished: "انتهت بنجاح",
      avgResponseTime: "متوسط وقت الاستجابة",
      hoursUnit: "س",
      responseTime: "متوسط وقت الاستجابة",
      conversionRate: "معدل التحويل",
      completionRate: "معدل الإنجاز",
      consultationManagement: "إدارة الاستشارات",
      exportBtn: "تصدير",
      refresh: "تحديث",
      searchPlaceholder: "البحث في الاستشارات...",
      status: "الحالة",
      allStatus: "جميع الحالات",
      pending: "معلق",
      scheduled: "مجدول", 
      completed: "مكتمل",
      cancelled: "ملغي",
      eventType: "نوع الحدث",
      allEvents: "جميع الأحداث",
      consultation: "استشارة",
      meeting: "اجتماع",
      presentation: "عرض تقديمي",
      workshop: "ورشة عمل",
      sortBy: "ترتيب حسب",
      dateCreated: "تاريخ الإنشاء",
      name: "الاسم",
      asc: "تصاعدي",
      desc: "تنازلي",
      consultationsSelected: "استشارات محددة",
      consultationSelected: "استشارة محددة", 
      changeStatus: "تغيير الحالة",
      deleteBtn: "حذف",
      deleteConsultations: "حذف الاستشارات",
      deleteConsultationConfirm: "هل أنت متأكد من رغبتك في حذف",
      cannotUndo: "لا يمكن التراجع عن هذا الإجراء.",
      cancelBtn: "إلغاء",
      fullName: "الاسم الكامل",
      company: "الشركة",
      createdAt: "تاريخ الإنشاء",
      actions: "الإجراءات",
      notProvided: "غير مقدم",
      viewDetails: "عرض التفاصيل",
      schedule: "جدولة",
      complete: "إنجاز",
      deleteConsultationTitle: "حذف الاستشارة",
      deleteConsultationMessage: "هل أنت متأكد من رغبتك في حذف هذه الاستشارة؟",
      noConsultationsFoundMessage: "لم يتم العثور على استشارات. حاول تعديل معايير البحث الخاصة بك.",
      allTab: "الكل",
      noConsultationsFoundCard: "لم يتم العثور على استشارات بالمرشحات الحالية.",
      consultationScheduled: "تم جدولة الاستشارة بنجاح",
      bulkUpdateSuccess: "تم تحديث {count} استشارة بنجاح",
      bulkUpdateFailed: "فشل في تحديث الاستشارات",
      bulkDeleteSuccess: "تم حذف {count} استشارة بنجاح",
      bulkDeleteFailed: "فشل في حذف الاستشارات",
      csvName: "الاسم",
      csvEmail: "البريد الإلكتروني",
      csvCompany: "الشركة", 
      csvEventType: "نوع الحدث",
      csvStatus: "الحالة",
      csvCreatedDate: "تاريخ الإنشاء",
      csvMessage: "الرسالة"
    },

    // إدارة الاتصالات
    communication: {
      title: "مركز الاتصالات",
      description: "إدارة اتصالات المنصة",
      emailCampaigns: "حملات البريد الإلكتروني",
      notifications: "الإشعارات",
      messaging: "المراسلة"
    },

    // الإجراءات الشائعة
    actions: {
      viewDetails: "عرض التفاصيل",
      export: "تصدير",
      import: "استيراد",
      delete: "حذف",
      edit: "تحرير",
      create: "إنشاء",
      save: "حفظ",
      cancel: "إلغاء",
      approve: "موافقة",
      reject: "رفض",
      suspend: "تعليق",
      activate: "تفعيل"
    },

    // الرسائل والإشعارات
    messages: {
      success: "نجح",
      error: "خطأ",
      warning: "تحذير",  
      info: "معلومات",
      loading: "جاري التحميل...",
      saved: "تم الحفظ بنجاح",
      deleted: "تم الحذف بنجاح", 
      updated: "تم التحديث بنجاح",
      created: "تم الإنشاء بنجاح"
    },

    // عناصر النموذج
    forms: {
      placeholders: {
        search: "بحث...",
        email: "أدخل عنوان البريد الإلكتروني",
        name: "أدخل الاسم الكامل",
        company: "أدخل اسم الشركة",
        phone: "أدخل رقم الهاتف",
        message: "أدخل الرسالة"
      },
      labels: {
        email: "عنوان البريد الإلكتروني",
        name: "الاسم الكامل", 
        company: "اسم الشركة",
        phone: "رقم الهاتف",
        role: "الدور",
        status: "الحالة",
        dateRange: "نطاق التاريخ"
      },
      validation: {
        required: "هذا الحقل مطلوب",
        invalidEmail: "يرجى إدخال بريد إلكتروني صحيح",
        invalidPhone: "يرجى إدخال رقم هاتف صحيح",
        minLength: "الحد الأدنى {count} أحرف مطلوب",
        maxLength: "الحد الأقصى {count} حرف مسموح"
      }
    },

    // البحث والتصفية
    searchFilter: "البحث والتصفية",
    searchByTitle: "البحث بالعنوان أو المورد أو الطلب...",
    allStatuses: "جميع الحالات",
    filterByStatus: "تصفية حسب الحالة"
  },

  // Header and Navigation - الرأسية والتنقل
  openMobileMenu: "فتح القائمة المحمولة",
  collapseSidebar: "طي الشريط الجانبي",
  expandSidebar: "توسيع الشريط الجانبي", 
  goToAdminDashboard: "الذهاب إلى لوحة الإدارة",
  dashboard: "لوحة الإدارة",
  managementPortal: "بوابة الإدارة",
  viewNotifications: "عرض الإشعارات",
  logoAlt: "شعار MWRD",
  adminUser: "مستخدم الإدارة",
  
  // Language Selection - اختيار اللغة
  languageEnglish: "English",
  languageArabic: "العربية",
  
  // Search functionality - وظائف البحث
  search: "بحث",
  searchPlaceholder: "البحث في لوحة الإدارة...",
  searchAdvancedPlaceholder: "البحث في المستخدمين والطلبات والعروض...",
  searchingFor: "البحث عن",
  searchResults: "نتائج البحث",
  noSearchResults: "لم يتم العثور على نتائج",
  tryDifferentSearch: "جرب مصطلح بحث مختلف",
  recentSearches: "عمليات البحث الأخيرة",
  tryAgain: "حاول مرة أخرى",
  searchFailed: "فشل البحث. يرجى المحاولة مرة أخرى.",

  // Breadcrumbs - مسار التنقل
  breadcrumbs: {
    admin: "الإدارة",
    dashboardOverview: "نظرة عامة على لوحة المعلومات",
    userManagement: "إدارة المستخدمين",
    requestsManagement: "إدارة الطلبات",
    offersManagement: "إدارة العروض",
    ordersManagement: "إدارة الطلبيات",
    projectsManagement: "إدارة المشاريع",
    platformAnalytics: "تحليلات المنصة",
    subscriptionManagement: "إدارة الاشتراكات",
    supportCenter: "مركز الدعم",
    verificationQueue: "قائمة انتظار التحقق",
    categoryManagement: "إدارة الفئات",
    expertConsultations: "الاستشارات المتخصصة",
    financialTransactions: "المعاملات المالية",
    securityMonitoring: "مراقبة الأمان",
    communicationCenter: "مركز الاتصالات",
    unknown: "صفحة غير معروفة"
  },

  // عناصر واجهة المستخدم الشائعة  
  users: {
    addUser: "إضافة مستخدم",
    addUserDescription: "إنشاء حساب مستخدم جديد",
    email: "البريد الإلكتروني",
    fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",
    userCreated: "تم إنشاء المستخدم بنجاح",
    createUserError: "فشل في إنشاء المستخدم",
    activeThisMonth: "نشط هذا الشهر"
  },

  requests: {
    requiresAdminReview: "يتطلب مراجعة الإدارة" 
  },

  // المصطلحات الشائعة المستخدمة عبر واجهة الإدارة
  common: {
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    warning: "تحذير",
    info: "معلومات",
    search: "بحث",
    filter: "تصفية",
    export: "تصدير",
    import: "استيراد",
    delete: "حذف",
    edit: "تحرير",
    view: "عرض",
    create: "إنشاء",
    update: "تحديث",
    save: "حفظ",
    cancel: "إلغاء",
    confirm: "تأكيد",
    yes: "نعم",
    no: "لا",
    ok: "موافق",
    close: "إغلاق",
    next: "التالي",
    previous: "السابق",
    finish: "إنهاء",
    retry: "إعادة المحاولة",
    refresh: "تحديث",
    clear: "مسح",
    select: "اختيار",
    selectAll: "اختيار الكل",
    deselectAll: "إلغاء اختيار الكل",
    actions: "الإجراءات",
    options: "الخيارات",
    settings: "الإعدادات",
    preferences: "التفضيلات",
    account: "الحساب",
    profile: "الملف الشخصي",
    dashboard: "لوحة التحكم",
    home: "الرئيسية",
    back: "رجوع",
    forward: "إلى الأمام",
    active: "نشط",
    inactive: "غير نشط",
    enabled: "مفعل",
    disabled: "معطل",
    online: "متصل",
    offline: "غير متصل",
    available: "متاح",
    unavailable: "غير متاح",
    pending: "معلق",
    approved: "موافق عليه",
    rejected: "مرفوض",
    cancelled: "ملغي",
    completed: "مكتمل",
    failed: "فشل",
    scheduled: "مجدول",
    draft: "مسودة",
    published: "منشور",
    archived: "مؤرشف",
    deleted: "محذوف",
    new: "جديد",
    updated: "محدث",
    modified: "معدل",
    created: "تم إنشاؤه",
    date: "التاريخ",
    time: "الوقت",
    datetime: "التاريخ والوقت",
    today: "اليوم",
    yesterday: "أمس",
    tomorrow: "غداً",
    thisWeek: "هذا الأسبوع",
    lastWeek: "الأسبوع الماضي",
    nextWeek: "الأسبوع القادم",
    thisMonth: "هذا الشهر",
    lastMonth: "الشهر الماضي",
    nextMonth: "الشهر القادم",
    thisYear: "هذا العام",
    lastYear: "العام الماضي",
    nextYear: "العام القادم",
    all: "الكل",
    none: "لا شيء",
    other: "أخرى",
    unknown: "غير معروف",
    total: "الإجمالي",
    subtotal: "المجموع الفرعي",
    quantity: "الكمية",
    price: "السعر",
    amount: "المبلغ",
    discount: "الخصم",
    tax: "الضريبة",
    shipping: "الشحن",
    currency: "العملة",
    language: "اللغة",
    timezone: "المنطقة الزمنية",
    country: "البلد",
    region: "المنطقة",
    city: "المدينة",
    address: "العنوان",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    website: "الموقع الإلكتروني",
    company: "الشركة",
    organization: "المؤسسة",
    department: "القسم",
    position: "المنصب",
    title: "العنوان",
    description: "الوصف",
    notes: "الملاحظات",
    comments: "التعليقات",
    tags: "العلامات",
    categories: "الفئات",
    type: "النوع",
    status: "الحالة",
    priority: "الأولوية",
    level: "المستوى",
    role: "الدور"
  }
};