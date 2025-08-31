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
  financialTransactionsTitle: "المعاملات المالية",
  financialTransactionsDesc: "إدارة ومراقبة جميع المعاملات المالية",
  subscriptions: "الاشتراكات",
  supportTickets: "تذاكر الدعم",
  communications: "الاتصالات",
  settings: "الإعدادات",
  profile: "الملف الشخصي",
  navigateTo: "الانتقال إلى",
  badgeMax: "99+",
  
  // مفاتيح التنقل المباشرة للشريط الجانبي (تجنب التضارب)
  sidebarAnalytics: "التحليلات",
  sidebarUsers: "المستخدمون", 
  sidebarRequests: "الطلبات",
  sidebarExpertConsultations: "الاستشارات المتخصصة",

  // مفاتيح المرشحات والإجراءات الشائعة للإدارة
  filterByRole: "تصفية حسب الدور",
  allRoles: "جميع الأدوار",
  admin: "مدير",
  vendor: "مورد", 
  client: "عميل",
  filterByStatus: "تصفية حسب الحالة",
  allStatus: "جميع الحالات",
  approved: "معتمد",
  pending: "معلق",
  blocked: "محظور",
  rejected: "مرفوض",
  selectRole: "اختر الدور",
  updateRoleAction: "تحديث الدور",
  bulkActionConfirm: "تأكيد الإجراء المجمع",
  bulkRoleConfirm: "هل أنت متأكد من رغبتك في تغيير دور {count} مستخدم إلى {role}؟",
  selectStatus: "اختر الحالة",
  updateStatusAction: "تحديث الحالة", 
  bulkStatusConfirm: "هل أنت متأكد من رغبتك في تغيير حالة {count} مستخدم إلى {status}؟",
  exportSelectedAction: "تصدير المحدد",
  usersTab: "المستخدمون",
  verificationQueueTab: "قائمة التحقق",
  analyticsTab: "التحليلات",
  noUsersFound: "لم يتم العثور على مستخدمين",
  noUsersMatchFilters: "لا يوجد مستخدمون يطابقون المرشحات الحالية.",
  deleteUserTitle: "حذف المستخدم",
  deleteUserConfirm: "هل أنت متأكد من رغبتك في حذف {name}؟ لا يمكن التراجع عن هذا الإجراء.",
  verificationText: "التحقق: {status}",
  joinedText: "انضم في {date}",
  approvedStatus: "معتمد",
  pendingStatus: "معلق",
  blockedStatus: "محظور", 
  rejectedStatus: "مرفوض",
  newThisMonthAnalytics: "جديد هذا الشهر",
  usersRegisteredAnalytics: "مستخدمون مسجلون",
  activeThisWeekAnalytics: "نشط هذا الأسبوع",
  usersWithActivityAnalytics: "مستخدمون بنشاط",
  growthRateAnalytics: "معدل النمو",
  vsLastMonthAnalytics: "مقارنة بالشهر الماضي",
  totalUsersAnalytics: "إجمالي المستخدمين",
  allTimeAnalytics: "جميع الأوقات",
  userDistributionByRole: "توزيع المستخدمين حسب الدور",
  clients: "العملاء",
  vendors: "الموردون",
  admins: "المديرون", 
  userStatusOverview: "نظرة عامة على حالة المستخدمين",

  // إدارة المستخدمين
  users: {
    // عناوين الصفحة
    userManagement: "إدارة المستخدمين",
    userManagementDescription: "إدارة حسابات المستخدمين والأدوار وأذونات الوصول عبر المنصة.",
    
    // بطاقات المقاييس
    totalUsers: "إجمالي المستخدمين",
    allRegisteredUsers: "جميع المستخدمين المسجلين",
    activeUsers: "المستخدمون النشطون",
    approvedUsers: "المستخدمون المعتمدون",
    pendingUsers: "المستخدمون المعلقون",
    awaitingApproval: "في انتظار الموافقة",
    adminUsers: "مستخدمو الإدارة",
    systemAdministrators: "مديرو النظام",
    
    // المرشحات والإجراءات
    filtersAndSearch: "المرشحات والبحث",
    searchUsers: "البحث في المستخدمين بالاسم أو البريد الإلكتروني أو الشركة...",
    refresh: "تحديث",
    exportUsers: "تصدير المستخدمين",
    addUser: "إضافة مستخدم",
    selectAllUsers: "تحديد الكل ({count} محدد)",
    
    // تسميات حالة المستخدم
    userPending: "معلق",
    userActive: "نشط",
    userBlocked: "محظور",
    userInactive: "غير نشط",
    
    // أدوار المستخدمين
    admin: "مدير",
    vendor: "مورد",
    client: "عميل",
    
    // الإجراءات والرسائل
    fetchUsersError: "فشل في جلب المستخدمين",
    noName: "بلا اسم",
    csvHeaders: "المعرف,الاسم,البريد الإلكتروني,الدور,الحالة,التحقق,الشركة,الهاتف,تاريخ الإنشاء",
    bulkRoleUpdateSuccess: "تم تحديث أدوار {count} مستخدم بنجاح",
    bulkRoleUpdateError: "فشل في تحديث أدوار المستخدمين",
    bulkStatusUpdateSuccess: "تم تحديث حالة {count} مستخدم بنجاح", 
    bulkStatusUpdateError: "فشل في تحديث حالة المستخدمين",
    exportSelectedSuccess: "تم تصدير {count} مستخدم محدد بنجاح",
    fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",
    userExistsError: "مستخدم بهذا البريد الإلكتروني موجود بالفعل",
    userAddedSuccess: "تمت إضافة المستخدم بنجاح",
    userUpdatedSuccess: "تم تحديث المستخدم بنجاح",
    userDeletedSuccess: "تم حذف المستخدم '{name}' بنجاح",
    
    // نافذة إضافة مستخدم
    addNewUser: "إضافة مستخدم جديد",
    addNewUserDescription: "إنشاء حساب مستخدم جديد بالدور والأذونات المحددة.",
    fullNameRequired: "الاسم الكامل *",
    enterFullName: "أدخل الاسم الكامل للمستخدم",
    emailRequired: "البريد الإلكتروني *",
    enterEmailAddress: "أدخل عنوان البريد الإلكتروني",
    roleLabel: "الدور",
    clientRole: "عميل",
    vendorRole: "مورد",
    adminRole: "مدير",
    companyName: "اسم الشركة",
    enterCompanyNameOptional: "أدخل اسم الشركة (اختياري)",
    enterPhoneOptional: "أدخل رقم الهاتف (اختياري)",
    
    // نافذة تحرير المستخدم
    editUser: "تحرير المستخدم",
    editUserDescription: "تحديث معلومات المستخدم والدور والحالة.",
    editFullName: "الاسم الكامل",
    editEmail: "البريد الإلكتروني",
    editRole: "الدور", 
    editStatus: "الحالة",
    editCompanyName: "اسم الشركة",
    editPhone: "الهاتف",
    updateUser: "تحديث المستخدم"
  },

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

  // مفاتيح إدارة الطلبات  
  requests: {
    title: "الطلبات",
    requiresAdminReview: "يتطلب مراجعة المدير"
  },
  requestsManagement: {
    title: "إدارة الطلبات",
    description: "مراقبة وإدارة طلبات المشتريات",
    totalRequests: "إجمالي الطلبات",
    pendingApproval: "في انتظار الموافقة",
    approved: "موافق عليها",
    rejected: "مرفوضة",
    filtersAndSearch: "البحث والفلاتر",
    searchPlaceholder: "البحث في الطلبات...",
    statusPlaceholder: "تصفية حسب الحالة",
    approvalStatusPlaceholder: "تصفية حسب الموافقة",
    urgencyPlaceholder: "تصفية حسب الأولوية",
    refresh: "تحديث",
    allStatuses: "جميع الحالات",
    allApprovals: "جميع الموافقات",
    allUrgencies: "جميع الأولويات",
    allRequests: "جميع الطلبات",
    new: "جديد",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",
    cancelled: "ملغي",
    pending: "معلق",
    urgent: "عاجل",
    high: "عالي",
    medium: "متوسط",
    low: "منخفض",
    budgetRange: "نطاق الميزانية",
    deadline: "الموعد النهائي",
    offersReceived: "العروض المستلمة",
    offers: "عروض",
    created: "تم الإنشاء",
    notSpecified: "غير محدد",
    unknownClient: "عميل غير معروف",
    viewDetails: "عرض التفاصيل",
    contactClient: "الاتصال بالعميل",
    approve: "موافقة",
    reject: "رفض",
    loading: "جاري تحميل الطلبات...",
    noRequestsFound: "لم يتم العثور على طلبات تطابق معاييرك",
    fetchError: "فشل في تحميل الطلبات",
    approveSuccess: "تمت الموافقة على الطلب بنجاح",
    rejectSuccess: "تم رفض الطلب بنجاح",
    updateError: "فشل في تحديث حالة الطلب"
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


  // إدارة الطلبيات
  ordersManagement: {
    // Page headers
    title: "إدارة الطلبات",
    description: "تتبع وإدارة طلبات العملاء عبر المنصة بأكملها",
    
    // Tab navigation
    allOrders: "جميع الطلبات",
    pending: "معلق",
    active: "نشط",
    completed: "مكتمل",
    
    // Analytics cards
    totalOrders: "إجمالي الطلبات",
    completedOrders: "الطلبات المكتملة",
    totalRevenue: "إجمالي الإيرادات",
    inProgress: "قيد التنفيذ",
    thisMonth: "هذا الشهر",
    thisWeek: "هذا الأسبوع",
    average: "متوسط",
    pendingCount: "معلق",
    
    // Filters and search
    filtersActions: "المرشحات والإجراءات",
    searchPlaceholder: "البحث في الطلبات بالمعرف أو العنوان أو العميل أو المورد...",
    filterByStatus: "تصفية حسب الحالة",
    refresh: "تحديث",
    export: "تصدير",
    
    // Status options
    allStatus: "جميع الحالات",
    confirmed: "مؤكد",
    inProgressStatus: "قيد التنفيذ",
    cancelled: "ملغي",
    disputed: "متنازع عليه",
    
    // Bulk operations
    orderSelected: "طلب محدد",
    bulkActionPlaceholder: "اختر إجراء جماعي...",
    markAsConfirmed: "وضع علامة كمؤكد",
    markAsInProgress: "وضع علامة كقيد التنفيذ",
    markAsCompleted: "وضع علامة كمكتمل",
    markAsCancelled: "وضع علامة كملغي",
    markAsDisputed: "وضع علامة كمتنازع عليه",
    deleteOrders: "حذف الطلبات",
    applyAction: "تطبيق الإجراء",
    
    // Bulk confirmations
    confirmBulkAction: "تأكيد الإجراء الجماعي",
    bulkActionConfirm: "هل أنت متأكد من أنك تريد",
    bulkActionDelete: "حذف",
    bulkActionUpdate: "تحديث حالة",
    bulkActionCannotUndo: "لا يمكن التراجع عن هذا الإجراء.",
    confirm: "تأكيد",
    cancel: "إلغاء",
    
    // Order details
    ordersCount: "الطلبات",
    selectAll: "تحديد الكل",
    orderDetails: "تفاصيل الطلب",
    viewAndManage: "عرض وإدارة الطلب",
    orderTitle: "عنوان الطلب",
    status: "الحالة",
    client: "العميل",
    vendor: "المورد",
    amount: "المبلغ",
    created: "تاريخ الإنشاء",
    notes: "الملاحظات",
    unknownClient: "عميل غير معروف",
    unknownVendor: "مورد غير معروف",
    
    // Success/Error messages
    fetchError: "فشل في تحميل الطلبات. يرجى المحاولة مرة أخرى.",
    statusUpdated: "تم تحديث حالة الطلب إلى",
    statusUpdateError: "فشل في تحديث حالة الطلب",
    deleteSuccess: "تم حذف الطلب بنجاح",
    deleteError: "فشل في حذف الطلب",
    bulkDeleteSuccess: "تم حذف الطلبات بنجاح",
    bulkUpdateSuccess: "تم تحديث الطلبات بنجاح",
    bulkActionError: "فشل في تنفيذ الإجراء الجماعي",
    exportSuccess: "تم تصدير الطلبات إلى CSV",
    dataRefreshed: "تم تحديث بيانات الطلبات",
    
    // CSV export
    csvHeaders: "المعرف,العنوان,العميل,المورد,الحالة,المبلغ,العملة,التاريخ",
    
    // Empty states
    noOrdersFound: "لم يتم العثور على طلبات",
    noOrdersMatch: "لا توجد طلبات تطابق المرشحات الحالية.",
    
    // Actions
    deleteOrder: "حذف الطلب",
    deleteConfirmation: "هل أنت متأكد من أنك تريد حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.",
    delete: "حذف"
  },

  // Projects Management translations
  projectsManagement: {
    title: "إدارة المشاريع",
    description: "راقب وأدر مشاريع العملاء، وتتبع التقدم، وأشرف على التسليمات عبر جميع المشاريع النشطة",
    
    overview: {
      totalProjects: "إجمالي المشاريع",
      activeProjects: "المشاريع النشطة",
      completed: "المكتملة",
      projectsDelivered: "المشاريع المسلمة",
      overdue: "المتأخرة",
      requireAttention: "تحتاج اهتمام",
      totalValue: "القيمة الإجمالية",
      combinedProjectValue: "قيمة المشاريع المجمعة"
    },
    
    filters: {
      title: "المرشحات والبحث",
      searchPlaceholder: "ابحث في المشاريع بالعنوان أو الوصف أو العميل...",
      status: "تصفية حسب الحالة",
      priority: "تصفية حسب الأولوية",
      allStatuses: "جميع الحالات",
      allPriorities: "جميع الأولويات",
      refresh: "تحديث"
    },
    
    status: {
      draft: "مسودة",
      active: "نشط",
      completed: "مكتمل",
      onHold: "معلق",
      cancelled: "ملغي"
    },
    
    priority: {
      urgent: "عاجل",
      high: "عالي",
      medium: "متوسط",
      low: "منخفض"
    },
    
    details: {
      client: "العميل",
      noDescription: "لا يوجد وصف متوفر",
      projectProgress: "تقدم المشروع",
      budget: "الميزانية",
      boqItems: "بنود الكميات",
      items: "بنود",
      timeline: "الجدول الزمني",
      notSpecified: "غير محدد",
      requests: "الطلبات",
      relatedRequests: "الطلبات ذات الصلة"
    },
    
    actions: {
      viewDetails: "عرض التفاصيل",
      viewBOQ: "عرض الكميات",
      contactClient: "التواصل مع العميل",
      putOnHold: "تعليق",
      markCompleted: "تمييز كمكتمل",
      reactivate: "إعادة تفعيل"
    },
    
    messages: {
      loading: "جاري تحميل المشاريع...",
      noProjectsFound: "لم يتم العثور على مشاريع تطابق معاييرك",
      fetchError: "فشل في تحميل المشاريع",
      updateError: "فشل في تحديث حالة المشروع",
      updateSuccess: "تم تحديث حالة المشروع بنجاح",
      statusUpdated: "تم تحديث حالة المشروع إلى"
    }
  },

  // الإدارة المالية
  financial: {
    title: "لوحة التحكم المالية",
    description: "مراقبة المعاملات والإيرادات والأداء المالي",
    
    // حالات ورسائل الخطأ
    error: "خطأ",
    completed: "مكتمل",
    pending: "معلق",
    failed: "فاشل",
    cancelled: "ملغي",
    dataUpdated: "تم تحديث البيانات بنجاح",
    fetchError: "فشل في جلب المعاملات",
    updateError: "فشل في تحديث المعاملة",
    deleteError: "فشل في حذف المعاملة",
    transactionDeleted: "تم حذف المعاملة بنجاح",
    exportCompleted: "تم إكمال التصدير بنجاح",
    exportDescription: "تم تصدير {count} معاملة",
    dataRefreshed: "تم تحديث البيانات بنجاح",
    bulkActionFailed: "فشل في العملية المجمعة",
    
    // أنواع المعاملات
    subscription: "اشتراك",
    commission: "عمولة",
    refund: "استرداد",
    payment: "دفع",
    invoice_generated: "فاتورة مُنشأة",
    order_payment: "دفع طلب",
    withdrawal: "سحب",
    fee: "رسوم",
    
    // عناصر واجهة المستخدم
    transaction: "معاملة",
    transactions: "معاملات",
    allTransactions: "جميع المعاملات",
    revenue: "الإيرادات",
    totalRevenue: "إجمالي الإيرادات",
    totalTransactions: "إجمالي المعاملات",
    platformRevenue: "إيرادات المنصة",
    pendingAmount: "المبلغ المعلق",
    avgTransaction: "متوسط المعاملة",
    thisMonth: "هذا الشهر",
    currentMonthRevenue: "إيرادات الشهر الحالي",
    currency: "ريال",
    user: "المستخدم",
    company: "الشركة",
    
    // الفلاتر والإجراءات
    searchPlaceholder: "البحث في المعاملات أو المستخدمين أو أرقام المرجع...",
    filtersActions: "الفلاتر والإجراءات",
    filterByStatus: "تصفية حسب الحالة",
    filterByType: "تصفية حسب النوع",
    allStatus: "جميع الحالات",
    allTypes: "جميع الأنواع",
    bulkActions: "الإجراءات المجمعة",
    selectAll: "تحديد الكل",
    export: "تصدير",
    refresh: "تحديث",
    
    // تفاصيل المعاملة
    notSpecified: "غير محدد",
    noDescription: "لا يوجد وصف",
    notAvailable: "غ/م",
    viewDetails: "عرض التفاصيل",
    editTransaction: "تعديل المعاملة",
    deleteTransaction: "حذف المعاملة",
    
    // عناوين CSV
    csvHeaders: {
      transactionId: "رقم المعاملة",
      user: "المستخدم",
      type: "النوع",
      amount: "المبلغ",
      currency: "العملة",
      status: "الحالة",
      description: "الوصف",
      paymentMethod: "طريقة الدفع",
      created: "تاريخ الإنشاء"
    },
    
    // وضع التجربة والعودة للوضع الافتراضي
    demoMode: "وضع التجربة",
    demoDescription: "عرض بيانات تجريبية - جدول قاعدة البيانات الفعلي غير موجود",
    
    // واجهة مستخدم إضافية
    transactionHistory: "تاريخ المعاملات",
    expenses: "المصروفات",
    balance: "الرصيد",
    failedTransactions: "المعاملات الفاشلة",
    perCompletedTransaction: "لكل معاملة مكتملة",
    awaitingProcessing: "في انتظار المعالجة",
    needsAttention: "يحتاج اهتمام",
    monthlyGrowth: "+12.5% هذا الشهر",
    revenueTrend: "اتجاه الإيرادات",
    financialPerformance: "الأداء المالي خلال الفترة المحددة",
    recentTransactions: "المعاملات الحديثة",
    viewAndManage: "عرض وإدارة المعاملات المالية",
    searchTransactions: "البحث في المعاملات...",
    noTransactionsFound: "لم يتم العثور على معاملات",
    adjustFilters: "جرب تعديل البحث أو الفلاتر",
    loadingDashboard: "تحميل لوحة التحكم المالية...",
    exportSuccess: "تم تصدير المعاملات بنجاح",
    exportError: "فشل في تصدير المعاملات",
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
    verificationStatus: "حالة التحقق",
    tableNotFoundError: "جدول التحقق غير موجود",
    tableNotFoundMessage: "نظام التحقق لم يتم تكوينه بعد", 
    fallbackToDemo: "جاري تحميل البيانات التجريبية",
    documentNotFound: "المستند غير موجود",
    failedAccessDocument: "فشل في الوصول للمستند",
    cannotDownloadMissing: "لا يمكن تحميل المستند المفقود", 
    failedDownloadDocument: "فشل في تحميل المستند",
    requestUpdated: "تم تحديث الطلب:",
    failedUpdateStatus: "فشل في تحديث الحالة",
    demoUser1: "مستخدم تجريبي 1",
    demoCompany1: "شركة تجريبية 1", 
    demoUser2: "مستخدم تجريبي 2",
    demoCompany2: "شركة تجريبية 2"
  },

  verificationQueue: {
    approved: "موافق عليه",
    rejected: "مرفوض", 
    pending: "قيد الانتظار",
    underReview: "قيد المراجعة",
    checking: "جاري التحقق",
    available: "متاح",
    missing: "مفقود", 
    unknown: "غير معروف",
    viewDocument: "عرض المستند",
    download: "تحميل",
    email: "البريد الإلكتروني:",
    submitted: "تم الإرسال",
    documentStatus: "حالة المستند",
    warning: "تحذير!",
    documentMissing: "ملف المستند مفقود من التخزين",
    unknownUser: "مستخدم غير معروف",
    totalCount: "العدد الإجمالي",
    pendingCount: "قيد الانتظار",
    approvedCount: "موافق عليه", 
    rejectedCount: "مرفوض",
    underReviewCount: "قيد المراجعة",
    avgProcessingTime: "متوسط وقت المعالجة",
    approvalRate: "معدل الموافقة",
    addReviewNotesPlaceholder: "إضافة ملاحظات المراجعة (اختياري)...",
    // بطاقات التحليلات
    totalRequests: "إجمالي الطلبات",
    pendingReview: "قيد المراجعة",
    avgProcessing: "متوسط وقت المعالجة",
    // عناصر التحكم والإجراءات
    searchPlaceholder: "البحث في طلبات التحقق...",
    sortByDate: "ترتيب حسب التاريخ",
    sortByName: "ترتيب حسب الاسم",
    sortByStatus: "ترتيب حسب الحالة",
    tableView: "عرض جدولي",
    cardView: "عرض بطاقات",
    refresh: "تحديث",
    // أزرار الإجراءات
    processing: "جاري المعالجة...",
    approve: "موافقة",
    reject: "رفض",
    cannotApproveMessage: "لا يمكن الموافقة على الطلبات التي تحتوي على مستندات مفقودة",
    reviewNotesRequired: "ملاحظات المراجعة مطلوبة للرفض",
    reviewNotes: "ملاحظات المراجعة:",
    // عناوين الجدول
    verificationRequestsTable: "طلبات التحقق",
    comprehensiveView: "عرض شامل لجميع طلبات التحقق",
    vendorInformation: "معلومات المورد",
    document: "الوثيقة",
    status: "الحالة", 
    actions: "الإجراءات",
    // الإجراءات المجمعة
    requestsSelected: "{count} طلبات محددة",
    bulkApprove: "موافقة مجمعة",
    bulkReject: "رفض مجمع",
    bulkApproveTitle: "موافقة مجمعة على الطلبات",
    bulkRejectTitle: "رفض مجمع للطلبات", 
    bulkActionDescription: "أنت على وشك {action} {count} طلبات. يرجى إضافة ملاحظات:",
    bulkNotesPlaceholder: "إضافة ملاحظات لإجراء {action}...",
    cancel: "إلغاء",
    confirmApproval: "تأكيد الموافقة",
    confirmRejection: "تأكيد الرفض",
    // حالات التحميل والفراغ
    loadingRequests: "جاري تحميل طلبات التحقق...",
    noVerificationRequests: "لا توجد طلبات تحقق",
    noRequestsMatch: "لا توجد طلبات تطابق معايير البحث",
    noVerificationRequestsFound: "لم يتم العثور على طلبات تحقق",
    noStatusRequestsFound: "لم يتم العثور على طلبات {status}",
    clearSearch: "مسح البحث",
    // التبويبات
    all: "الكل"
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

  // إدارة العروض
  offersManagement: {
    // رؤوس الصفحات
    title: "إدارة العروض",
    description: "مراقبة وإدارة عروض الموردين لطلبات العملاء",
    
    // بطاقات المقاييس الرئيسية
    totalOffers: "إجمالي العروض",
    pendingApproval: "في انتظار الموافقة",
    conversionRate: "معدل التحويل",
    averagePrice: "متوسط السعر",
    avgResponseTime: "متوسط وقت الاستجابة",
    highPriority: "أولوية عالية",
    requiresAttention: "يتطلب انتباه",
    acrossAllOffers: "عبر جميع العروض",
    offersAcceptedByClients: "العروض المقبولة من العملاء",
    vendorResponseTime: "وقت استجابة المورد",
    averageResponseTime: "2.3 أيام",
    
    // الفلاتر والبحث
    filtersAndSearch: "الفلاتر والبحث",
    searchPlaceholder: "البحث في العروض...",
    clientStatus: "حالة العميل",
    adminApproval: "موافقة المدير",
    priceRange: "نطاق السعر",
    refresh: "تحديث",
    exportReport: "تصدير التقرير",
    
    // خيارات الفلتر
    allClientStatuses: "جميع حالات العملاء",
    allAdminApprovals: "جميع موافقات المدير",
    allPrices: "جميع الأسعار",
    lessThan10k: "أقل من 10,000 ريال",
    between10k50k: "10k - 50k ريال",
    greaterThan50k: "أكثر من 50,000 ريال",
    
    // خيارات الحالة
    pending: "معلق",
    approved: "موافق عليه",
    rejected: "مرفوض",
    
    // تسميات التبويب
    allOffers: "جميع العروض",
    pendingReview: "في انتظار المراجعة",
    urgent: "عاجل",
    
    // تفاصيل العرض
    price: "السعر",
    budgetRange: "نطاق الميزانية",
    deliveryTime: "وقت التسليم",
    days: "أيام",
    created: "تم إنشاؤه",
    status: "الحالة",
    forRequest: "للطلب",
    vendor: "المورد",
    client: "العميل",
    notSpecified: "غير محدد",
    
    // الإجراءات
    viewDetails: "عرض التفاصيل",
    initiateDiscussion: "بدء مناقشة",
    escalateToSupport: "تصعيد للدعم",
    
    // الحالات
    loading: "جارٍ تحميل العروض...",
    noOffersFound: "لا توجد عروض تطابق معاييرك",
    
    // رسائل النجاح
    approveOfferSuccess: "تم الموافقة على العرض بنجاح",
    rejectOfferSuccess: "تم رفض العرض بنجاح",
    escalateSuccess: "تم تصعيد المشكلة للدعم بنجاح",
    conversationSuccess: "تم بدء المحادثة بنجاح",
    
    // رسائل الخطأ
    loadingOffers: "فشل في تحميل العروض",
    updateError: "فشل في تحديث حالة العرض",
    escalateError: "فشل في التصعيد للدعم",
    conversationError: "فشل في بدء المحادثة"
  },

  // أتمتة سير العمل
  workflowAutomation: {
    title: "أتمتة سير العمل",
    description: "إدارة ومراقبة تدفق العمل المؤتمت",
    automationCenter: "مركز الأتمتة",
    automationDescription: "إنشاء وإدارة سير العمل المؤتمت لتبسيط العمليات التجارية",
    createWorkflow: "إنشاء سير عمل",
    
    overview: {
      activeWorkflows: "سير العمل النشط",
      totalExecutions: "إجمالي التنفيذات", 
      pendingTasks: "المهام المعلقة",
      successRate: "معدل النجاح"
    },

    workflowForm: {
      createTitle: "إنشاء سير عمل جديد",
      workflowName: "اسم سير العمل",
      workflowNamePlaceholder: "أدخل اسم سير العمل...",
      description: "الوصف",
      descriptionPlaceholder: "وصف ما يفعله سير العمل هذا...",
      triggerType: "نوع المشغل",
      triggerPlaceholder: "مثل: يدوي، مجدول، حدث",
      priority: "الأولوية",
      cancel: "إلغاء",
      createButton: "إنشاء سير العمل"
    },

    workflowCard: {
      trigger: "المشغل",
      priority: "الأولوية", 
      created: "تم الإنشاء",
      execute: "تنفيذ"
    },

    tabs: {
      workflows: "سير العمل",
      executionHistory: "سجل التنفيذ",
      tasks: "المهام"
    },

    executions: {
      title: "التنفيذات الأخيرة",
      workflowId: "سير العمل #",
      duration: "المدة:",
      noExecutions: "لم يتم العثور على تنفيذات سير العمل"
    },

    tasks: {
      pendingTitle: "المهام المعلقة",
      overdueTitle: "المهام المتأخرة",
      priorityLabel: "الأولوية",
      dueLabel: "موعد الاستحقاق",
      noDueDate: "لا يوجد تاريخ استحقاق",
      complete: "مكتمل",
      overdueBy: "متأخر بـ",
      days: "أيام",
      noPendingTasks: "لا توجد مهام معلقة",
      noOverdueTasks: "لا توجد مهام متأخرة"
    },

    messages: {
      loading: "تحميل سير العمل...",
      nameRequired: "اسم سير العمل مطلوب",
      created: "تم إنشاء سير العمل بنجاح",
      createError: "فشل في إنشاء سير العمل",
      enabled: "مفعل",
      disabled: "معطل", 
      toggleError: "فشل في تبديل حالة سير العمل",
      deleted: "تم حذف سير العمل بنجاح",
      deleteError: "فشل في حذف سير العمل"
    }
  }
};