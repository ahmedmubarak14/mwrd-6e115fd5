/**
 * Admin Translations - Arabic (Saudi Arabia)
 * Clean, focused translation keys for admin interface
 */

export const adminTranslationsAR = {
  // Header interface (Arabic)
  openMobileMenu: "فتح القائمة المحمولة",
  collapseSidebar: "طي الشريط الجانبي",
  expandSidebar: "توسيع الشريط الجانبي",
  goToAdminDashboard: "الذهاب إلى لوحة الإدارة",
  logoAlt: "شعار MWRD",
  managementPortal: "بوابة الإدارة",
  viewNotifications: "عرض الإشعارات",
  languageEnglish: "English",
  languageArabic: "العربية",

  // مفاتيح الإدارة الجذرية للتنقل
  dashboard: "لوحة تحكم الإدارة",
  performanceMonitor: "مراقب الأداء",
  offers: "العروض",
  orders: "الطلبيات",
  financialTransactions: "المعاملات المالية",
  subscriptions: "الاشتراكات",
  supportTickets: "تذاكر الدعم",
  communications: "الاتصالات",
  settings: "الإعدادات",
  profile: "الملف الشخصي",
  navigateTo: "الانتقال إلى",
  badgeMax: "99+",

  // لوحة التحكم والنظرة العامة (كائن متداخل)
  dashboardData: {
    title: "لوحة تحكم الإدارة",
    description: "إدارة ومراقبة المنصة الشاملة",
    welcome: "مرحباً بك في لوحة تحكم الإدارة",
    overview: "نظرة عامة على المنصة",
    quickActions: "الإجراءات السريعة",
    quickActionsDesc: "وظائف الإدارة واختصارات الاستخدام الشائع"
  },

  // مفاتيح التحليلات
  analytics: {
    title: "التحليلات",
    totalUsers: "إجمالي المستخدمين",
    totalRevenue: "إجمالي الإيرادات", 
    pendingApprovals: "الموافقات المعلقة",
    platformActivity: "نشاط المنصة",
    platformActivityDesc: "نظرة عامة على استخدام المنصة واتجاهات النشاط",
    recentActivity: "النشاط الحديث",
    recentActivityDescription: "أحدث أنشطة وتغييرات النظام",
    activityOn: "على",
    noRecentActivity: "لا يوجد نشاط حديث"
  },

  // مفاتيح إدارة المستخدمين
  users: {
    title: "المستخدمون",
    activeThisMonth: "نشط هذا الشهر"
  },

  // مفاتيح إدارة الطلبات  
  requests: {
    title: "الطلبات",
    requiresAdminReview: "يتطلب مراجعة المدير"
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
    automationDescription: "أتمتة سير العمل والقواعد",
    projects: "المشاريع",
    verificationQueue: "قائمة التحقق",
    workflowAutomation: "أتمتة سير العمل",
    categoryManagement: "إدارة الفئات"
  },

  // مسار التنقل
  breadcrumbs: {
    admin: "الإدارة",
    dashboardOverview: "نظرة عامة على لوحة التحكم",
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
    expertConsultations: "الاستشارات الخبيرة",
    financialTransactions: "المعاملات المالية",
    securityMonitoring: "مراقبة الأمان",
    communicationCenter: "مركز الاتصالات",
    unknown: "غير معروف",
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
    automation: "الأتمتة"
  },

  // لوحة الأوامر
  commandPalette: {
    placeholder: "اكتب أمراً أو ابحث...",
    noResults: "لم يتم العثور على نتائج",
    recent: "حديث",
    suggestions: "اقتراحات"
  },

  // إدارة المستخدمين (كائن مفصل)
  usersManagement: {
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

  // إدارة الطلبات (كائن مفصل)  
  requestsManagement: {
    title: "إدارة الطلبات",
    description: "مراقبة وإدارة طلبات المشتريات",
    searchPlaceholder: "البحث في الطلبات...",
    exportRequests: "تصدير الطلبات"
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
  }
};