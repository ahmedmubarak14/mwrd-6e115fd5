/**
 * Admin Dashboard - Arabic Translations  
 * Structured namespace for all admin-related translations in Arabic
 */

export const adminTranslationsAR = {
  // Core Navigation & Layout
  dashboard: {
    title: "لوحة تحكم المشرف",
    description: "إدارة شاملة للمنصة والإشراف",
    welcome: "مرحباً بك في لوحة تحكم المشرف",
    overview: "نظرة عامة"
  },

  navigation: {
    users: "المستخدمون",
    requests: "الطلبات", 
    offers: "العروض",
    orders: "الطلبيات",
    projects: "المشاريع",
    communications: "التواصل",
    analytics: "التحليلات",
    financial: "المالية",
    subscriptions: "الاشتراكات",
    support: "الدعم",
    verificationQueue: "قائمة التحقق",
    categoryManagement: "إدارة الفئات",
    expertConsultations: "استشارات الخبراء",
    security: "الأمان",
    settings: "الإعدادات",
    profile: "الملف الشخصي",
    workflowAutomation: "أتمتة سير العمل"
  },

  // Breadcrumbs
  breadcrumbs: {
    admin: "المشرف",
    dashboard: "لوحة التحكم",
    userManagement: "إدارة المستخدمين",
    requestsManagement: "إدارة الطلبات", 
    offersManagement: "إدارة العروض",
    ordersManagement: "إدارة الطلبيات",
    projectsManagement: "إدارة المشاريع",
    platformAnalytics: "تحليلات المنصة",
    subscriptionManagement: "إدارة الاشتراكات",
    supportCenter: "مركز الدعم",
    verificationQueue: "قائمة التحقق",
    categoryManagement: "إدارة الفئات",
    expertConsultations: "استشارات الخبراء",
    financialTransactions: "المعاملات المالية",
    securityMonitoring: "مراقبة الأمان",
    communicationCenter: "مركز التواصل",
    unknown: "صفحة غير معروفة"
  },

  // Command Palette
  commandPalette: {
    placeholder: "البحث في المستخدمين والطلبات والعروض...",
    goToUsers: "الذهاب إلى المستخدمين",
    createNewUser: "إنشاء مستخدم جديد",
    reviewRequests: "مراجعة الطلبات", 
    manageOffers: "إدارة العروض",
    viewAnalytics: "عرض التحليلات",
    financialTransactions: "المعاملات المالية",
    quickActions: "الإجراءات السريعة",
    searchingFor: "البحث عن",
    searchTips: "استخدم ↑↓ للتنقل، Enter للاختيار",
    noResults: "لا توجد نتائج"
  },

  // User Management
  users: {
    title: "إدارة المستخدمين",
    description: "إدارة مستخدمي المنصة وصلاحياتهم",
    addUser: "إضافة مستخدم",
    addUserDescription: "إنشاء حساب مستخدم جديد",
    editUser: "تعديل المستخدم",
    deleteUser: "حذف المستخدم",
    userDetails: "تفاصيل المستخدم",
    userProfile: "الملف الشخصي للمستخدم",
    userActivity: "نشاط المستخدم",
    userPermissions: "صلاحيات المستخدم",
    
    // User Fields
    fullName: "الاسم الكامل", 
    email: "عنوان البريد الإلكتروني",
    companyName: "اسم الشركة",
    phone: "رقم الهاتف",
    role: "دور المستخدم",
    status: "الحالة",
    createdAt: "تاريخ الإنشاء",
    lastLogin: "آخر تسجيل دخول",
    
    // User Roles
    admin: "مشرف",
    client: "عميل",
    vendor: "مورد", 
    moderator: "مشرف",
    
    // User Status
    userActive: "نشط",
    userInactive: "غير نشط",
    userPending: "في الانتظار",
    userSuspended: "معلق",
    userBlocked: "محظور",
    
    // Actions
    selectRole: "اختيار الدور",
    selectStatus: "اختيار الحالة",
    searchUsers: "البحث في المستخدمين...",
    filterByRole: "تصفية حسب الدور",
    filterByStatus: "تصفية حسب الحالة",
    exportUsers: "تصدير المستخدمين",
    bulkActions: "الإجراءات المجمعة",
    
    // Messages
    userCreated: "تم إنشاء المستخدم بنجاح",
    userUpdated: "تم تحديث المستخدم بنجاح", 
    userDeleted: "تم حذف المستخدم بنجاح",
    fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",
    deleteConfirmation: "هل أنت متأكد من رغبتك في حذف هذا المستخدم؟",
    noUsersFound: "لم يتم العثور على مستخدمين",
    loadingUsers: "جاري تحميل المستخدمين..."
  },

  // Request Management
  requests: {
    title: "إدارة الطلبات",
    description: "إدارة والموافقة على طلبات المنصة",
    viewRequest: "عرض الطلب",
    approveRequest: "الموافقة على الطلب", 
    rejectRequest: "رفض الطلب",
    requestDetails: "تفاصيل الطلب",
    requestHistory: "تاريخ الطلب",
    
    // Request Fields
    requestId: "معرف الطلب",
    requestTitle: "العنوان",
    requestDescription: "الوصف",
    category: "الفئة",
    budget: "الميزانية",
    deadline: "الموعد النهائي",
    priority: "الأولوية",
    submittedBy: "مقدم من قبل",
    submittedAt: "تاريخ التقديم",
    
    // Request Status
    requestPending: "في الانتظار",
    requestApproved: "مُوافق عليه", 
    requestRejected: "مرفوض",
    requestInProgress: "قيد التنفيذ",
    requestCompleted: "مُكتمل",
    requestCancelled: "ملغي",
    
    // Priority Levels
    low: "منخفضة",
    medium: "متوسطة",
    high: "عالية", 
    urgent: "عاجلة",
    
    // Actions
    searchRequests: "البحث في الطلبات...",
    filterByStatus: "تصفية حسب الحالة",
    filterByCategory: "تصفية حسب الفئة",
    filterByPriority: "تصفية حسب الأولوية",
    
    // Messages
    requestApprovedMessage: "تمت الموافقة على الطلب بنجاح",
    requestRejectedMessage: "تم رفض الطلب بنجاح", 
    noRequestsFound: "لم يتم العثور على طلبات",
    loadingRequests: "جاري تحميل الطلبات..."
  },

  // Offer Management
  offers: {
    title: "إدارة العروض",
    description: "إدارة عروض الموردين والمقترحات",
    viewOffer: "عرض العرض",
    approveOffer: "الموافقة على العرض",
    rejectOffer: "رفض العرض", 
    offerDetails: "تفاصيل العرض",
    offerHistory: "تاريخ العرض",
    
    // Offer Fields
    offerId: "معرف العرض",
    offerTitle: "العنوان",
    price: "السعر",
    deliveryTime: "وقت التسليم",
    offerDescription: "الوصف",
    vendorName: "اسم المورد",
    submittedAt: "تاريخ التقديم",
    validUntil: "صالح حتى",
    
    // Offer Status
    pending: "في الانتظار",
    approved: "مُوافق عليه",
    rejected: "مرفوض", 
    accepted: "مقبول",
    expired: "منتهي الصلاحية",
    cancelled: "ملغي",
    
    // Actions
    searchOffers: "البحث في العروض...",
    compareOffers: "مقارنة العروض",
    
    // Messages
    offerApproved: "تمت الموافقة على العرض بنجاح",
    offerRejected: "تم رفض العرض بنجاح",
    noOffersFound: "لم يتم العثور على عروض",
    loadingOffers: "جاري تحميل العروض..."
  },

  // Communication Center
  communication: {
    title: "مركز التواصل", 
    description: "إدارة تواصل المنصة والرسائل",
    
    // Tabs
    notifications: "الإشعارات",
    broadcast: "الرسائل المرسلة",
    templates: "قوالب البريد الإلكتروني",
    chat: "الدردشة المباشرة",
    settings: "الإعدادات",
    
    // Notification Types
    allUsers: "جميع المستخدمين",
    clientsOnly: "العملاء فقط", 
    vendorsOnly: "الموردين فقط",
    pendingVerification: "في انتظار التحقق",
    inactiveUsers: "المستخدمون غير النشطين",
    
    // Priority Levels
    lowPriority: "أولوية منخفضة",
    mediumPriority: "أولوية متوسطة",
    highPriority: "أولوية عالية", 
    urgentPriority: "أولوية عاجلة",
    
    // Status
    sent: "مُرسل", 
    draft: "مسودة",
    scheduled: "مجدول",
    failed: "فشل",
    delivered: "تم التسليم",
    read: "مقروء",
    unread: "غير مقروء",
    
    // Priority Badges
    urgent: "عاجل",
    high: "عالي",
    medium: "متوسط",
    low: "منخفض",
    
    // Actions
    sendBroadcast: "إرسال رسالة جماعية",
    createTemplate: "إنشاء قالب",
    scheduleMessage: "جدولة الرسالة",
    markAllRead: "تمييز الكل كمقروء",
    
    // Messages
    broadcastCreated: "تم إنشاء الرسالة الجماعية بنجاح",
    broadcastFailed: "فشل في إنشاء الرسالة الجماعية", 
    allMarkedRead: "تم تمييز جميع الإشعارات كمقروءة",
    unknownUser: "مستخدم غير معروف"
  },

  // Financial Management
  financial: {
    title: "المعاملات المالية",
    description: "مراقبة وإدارة مالية المنصة",
    
    // Transaction Types
    payment: "دفع",
    refund: "استرداد",
    fee: "رسوم المنصة", 
    commission: "عمولة",
    withdrawal: "سحب",
    
    // Transaction Status
    pending: "في الانتظار",
    completed: "مُكتمل",
    failed: "فشل",
    cancelled: "ملغي",
    processing: "قيد المعالجة",
    
    // Fields
    transactionId: "معرف المعاملة",
    amount: "المبلغ", 
    currency: "العملة",
    paymentMethod: "طريقة الدفع",
    processedAt: "تاريخ المعالجة",
    reference: "المرجع",
    
    // Actions
    searchTransactions: "البحث في المعاملات...",
    exportTransactions: "تصدير المعاملات",
    viewDetails: "عرض التفاصيل",
    processRefund: "معالجة الاسترداد",
    
    // Stats
    totalRevenue: "إجمالي الإيرادات",
    pendingAmount: "المبلغ المعلق",
    completedTransactions: "المعاملات المُكتملة",
    failedTransactions: "المعاملات الفاشلة"
  },

  // Verification Workflow  
  verification: {
    title: "سير عمل التحقق",
    description: "مراجعة والموافقة على تحقق المستخدمين",
    
    // Status
    pending: "في الانتظار",
    underReview: "قيد المراجعة",
    approved: "مُوافق عليه", 
    rejected: "مرفوض",
    
    // Content
    allCaughtUp: "تم الانتهاء من كل شيء!",
    noPendingVerifications: "لا توجد تحقيقات معلقة في الوقت الحالي",
    verificationQueue: "قائمة التحقق", 
    verificationDetails: "تفاصيل التحقق",
    reviewAndApprove: "مراجعة والموافقة على تحقق المستخدم",
    selectUser: "اختيار مستخدم",
    chooseUserFromQueue: "اختر مستخدماً من القائمة لمراجعة تحققه",
    reviewNotes: "ملاحظات المراجعة",
    
    // Actions
    markUnderReview: "تمييز قيد المراجعة", 
    approve: "الموافقة",
    reject: "الرفض",
    refresh: "تحديث",
    
    // Info
    usersAwaiting: "مستخدمون في انتظار التحقق",
    submitted: "مُقدم",
    documents: "مستندات", 
    verificationDocuments: "مستندات التحقق",
    noDocumentsUploaded: "لم يتم رفع مستندات",
    view: "عرض",
    registered: "مسجل",
    
    // Messages
    statusUpdated: "تم تحديث الحالة",
    markedUnderReview: "تم تمييز التحقق قيد المراجعة", 
    approvedSuccessfully: "تمت الموافقة على تحقق المستخدم بنجاح",
    rejectedSuccessfully: "تم رفض تحقق المستخدم بنجاح",
    errorUpdatingStatus: "فشل في تحديث حالة التحقق",
    errorFetchingVerifications: "فشل في جلب التحقيقات المعلقة",
    
    // User Types
    vendor: "مورد", 
    client: "عميل"
  },

  // Analytics
  analytics: {
    title: "تحليلات المنصة",
    description: "رؤى ومقاييس لأداء المنصة",
    
    // Time Periods
    last7Days: "آخر ٧ أيام",
    last30Days: "آخر ٣٠ يوماً", 
    last90Days: "آخر ٩٠ يوماً",
    lastYear: "السنة الماضية",
    
    // Metrics
    totalUsers: "إجمالي المستخدمين",
    activeUsers: "المستخدمون النشطون",
    newRegistrations: "التسجيلات الجديدة",
    totalRequests: "إجمالي الطلبات", 
    completedRequests: "الطلبات المُكتملة",
    totalRevenue: "إجمالي الإيرادات",
    conversionRate: "معدل التحويل",
    
    // Actions
    exportData: "تصدير البيانات",
    generateReport: "إنشاء تقرير",
    viewDetails: "عرض التفاصيل"
  },

  // System Health & Performance
  system: {
    title: "صحة النظام",
    description: "مراقبة أداء النظام وحالته",
    
    // Status
    healthy: "صحي",
    warning: "تحذير", 
    critical: "حرج",
    offline: "غير متصل",
    
    // Components
    database: "قاعدة البيانات",
    api: "خدمات API",
    storage: "التخزين", 
    cache: "التخزين المؤقت",
    queue: "نظام الطوابير",
    
    // Metrics
    uptime: "وقت التشغيل",
    responseTime: "وقت الاستجابة",
    cpuUsage: "استخدام المعالج", 
    memoryUsage: "استخدام الذاكرة",
    diskUsage: "استخدام القرص",
    
    // Actions
    restartService: "إعادة تشغيل الخدمة",
    viewLogs: "عرض السجلات",
    refreshStatus: "تحديث الحالة"
  },

  // Security
  security: {
    title: "مركز الأمان",
    description: "مراقبة وإدارة أمان المنصة",
    
    // Incident Types
    loginAttempt: "محاولة تسجيل دخول فاشلة",
    suspiciousActivity: "نشاط مشبوه", 
    dataAccess: "وصول غير مصرح به للبيانات",
    systemBreach: "اختراق النظام",
    
    // Severity
    low: "منخفض",
    medium: "متوسط", 
    high: "عالي",
    critical: "حرج",
    
    // Status
    open: "مفتوح",
    investigating: "قيد التحقيق",
    resolved: "محلول", 
    closed: "مغلق",
    
    // Actions
    investigateIncident: "تحقيق في الحادثة",
    blockUser: "حظر المستخدم",
    viewLogs: "عرض سجلات الأمان", 
    generateReport: "إنشاء تقرير أمني"
  },

  // Workflow Automation
  workflowAutomation: {
    title: 'أتمتة سير العمل',
    description: 'أتمتة المهام المتكررة وتبسيط العمليات',
    automationCenter: 'مركز الأتمتة',
    automationDescription: 'إنشاء وإدارة ومراقبة سير العمل المؤتمت',
    createWorkflow: 'إنشاء سير عمل',
    overview: {
      activeWorkflows: 'سير العمل النشطة',
      totalExecutions: 'إجمالي التنفيذات',
      pendingTasks: 'المهام المعلقة',
      successRate: 'معدل النجاح'
    },
    tabs: {
      workflows: 'سير العمل',
      executionHistory: 'تاريخ التنفيذ',
      tasks: 'المهام'
    },
    workflowForm: {
      createTitle: 'إنشاء سير عمل جديد',
      workflowName: 'اسم سير العمل',
      workflowNamePlaceholder: 'أدخل اسم سير العمل',
      description: 'الوصف',
      descriptionPlaceholder: 'صف ما يفعله هذا سير العمل',
      triggerType: 'نوع المشغل',
      triggerPlaceholder: 'يدوي، مجدول، حدث',
      priority: 'الأولوية (1-10)',
      cancel: 'إلغاء',
      createButton: 'إنشاء سير عمل'
    },
    workflowCard: {
      trigger: 'المشغل',
      priority: 'الأولوية',
      created: 'تم الإنشاء',
      execute: 'تنفيذ'
    },
    executions: {
      title: 'التنفيذات الأخيرة',
      workflowId: 'معرف سير العمل: ',
      duration: 'المدة:',
      noExecutions: 'لا توجد تنفيذات'
    },
    tasks: {
      pendingTitle: 'المهام المعلقة',
      overdueTitle: 'المهام المتأخرة',
      complete: 'إكمال',
      priorityLabel: 'الأولوية:',
      dueLabel: 'الاستحقاق:',
      noDueDate: 'لا يوجد تاريخ استحقاق',
      noPendingTasks: 'لا توجد مهام معلقة',
      noOverdueTasks: 'لا توجد مهام متأخرة',
      overdueBy: 'متأخرة بـ',
      days: 'أيام'
    },
    messages: {
      loading: 'جاري تحميل بيانات الأتمتة...',
      nameRequired: 'اسم سير العمل مطلوب',
      created: 'تم إنشاء سير العمل بنجاح',
      createError: 'فشل في إنشاء سير العمل',
      enabled: 'تم التفعيل',
      disabled: 'تم التعطيل',
      toggleError: 'فشل في تبديل حالة سير العمل',
      deleted: 'تم حذف سير العمل بنجاح',
      deleteError: 'فشل في حذف سير العمل'
    }
  },
  
  // Data Tables
  table: {
    searchPlaceholder: 'بحث...',
    clearSearch: 'مسح البحث',
    filters: 'المرشحات',
    filterBy: 'تصفية حسب',
    allItems: 'الكل',
    exportData: 'تصدير',
    bulkActions: 'العمليات المجمعة',
    refreshData: 'تحديث',
    actions: 'الإجراءات',
    noResults: 'لا توجد نتائج',
    showingResults: 'عرض النتائج',
    showing: 'عرض',
    to: 'إلى',
    of: 'من',
    results: 'نتيجة',
    previous: 'السابق',
    next: 'التالي'
  },

  // Error Messages
  errors: {
    title: 'حدث خطأ ما',
    description: 'حدث خطأ في لوحة إدارة النظام. يرجى محاولة تحديث الصفحة.',
    details: 'تفاصيل الخطأ:',
    stackTrace: 'تتبع الخطأ:',
    tryAgain: 'حاول مرة أخرى',
    refreshPage: 'تحديث الصفحة'
  },

  // Approval Dashboard
  approvals: {
    title: 'مركز الموافقات',
    description: 'إدارة الموافقات المركزية مع سير العمل الآلي',
    loading: 'جاري تحميل لوحة الموافقات...',
    exportReport: 'تصدير التقرير',
    advancedFilters: 'مرشحات متقدمة',
    pendingItems: 'العناصر المعلقة',
    approvalRate: 'معدل الموافقة',
    avgProcessing: 'متوسط المعالجة',
    avgResponseTime: 'متوسط وقت الاستجابة',
    totalProcessed: 'إجمالي المعالج',
    totalProcessedDesc: 'جميع الموافقات/الرفض على الإطلاق',
    progressTitle: 'تقدم الموافقة',
    requests: 'الطلبات',
    offers: 'العروض',
    requestsLabel: 'طلبات',
    offersLabel: 'عروض',
    thisWeek: 'هذا الأسبوع',
    pending: 'معلقة',
    approved: 'موافق عليها',
    rejected: 'مرفوضة'
  },

  // Audit Trail
  auditTrail: {
    noLogsFound: 'لا توجد سجلات تدقيق',
    adjustFilters: 'حاول تعديل المرشحات',
    noActivities: 'لا توجد أنشطة تدقيق للعرض',
    on: 'على',
    id: 'المعرف:'
  },

  // Common Actions & Messages
  actions: {
    create: "إنشاء",
    edit: "تحرير", 
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    submit: "إرسال",
    approve: "الموافقة", 
    reject: "الرفض",
    view: "عرض",
    download: "تحميل",
    export: "تصدير",
    import: "استيراد", 
    refresh: "تحديث",
    search: "بحث",
    filter: "تصفية",
    sort: "ترتيب",
    reset: "إعادة تعيين",
    back: "رجوع", 
    next: "التالي",
    previous: "السابق",
    close: "إغلاق"
  },

  // Status Messages
  messages: {
    loading: "جاري التحميل...",
    saving: "جاري الحفظ...", 
    success: "نجح!",
    error: "حدث خطأ",
    noData: "لا توجد بيانات متاحة",
    noResults: "لم يتم العثور على نتائج",
    selectOption: "اختر خياراً", 
    fillRequired: "يرجى ملء جميع الحقول المطلوبة",
    confirmDelete: "هل أنت متأكد من رغبتك في حذف هذا العنصر؟",
    operationComplete: "تمت العملية بنجاح",
    operationFailed: "فشلت العملية. يرجى المحاولة مرة أخرى"
  },

  // Form Labels & Placeholders  
  forms: {
    placeholders: {
      search: "بحث...",
      email: "أدخل عنوان البريد الإلكتروني",
      name: "أدخل الاسم الكامل", 
      company: "أدخل اسم الشركة",
      phone: "أدخل رقم الهاتف",
      message: "أدخل الرسالة...",
      notes: "إضافة ملاحظات...",
      title: "أدخل العنوان", 
      description: "أدخل الوصف",
      amount: "أدخل المبلغ",
      date: "اختر التاريخ",
      category: "اختر الفئة"
    },
    
    labels: {
      required: "حقل مطلوب",
      optional: "اختياري", 
      characters: "حرف",
      maxLength: "الطول الأقصى",
      minLength: "الطول الأدنى"
    },
    
    validation: {
      emailInvalid: "يرجى إدخال عنوان بريد إلكتروني صحيح",
      phoneInvalid: "يرجى إدخال رقم هاتف صحيح", 
      amountInvalid: "يرجى إدخال مبلغ صحيح",
      dateInvalid: "يرجى اختيار تاريخ صحيح",
      fieldRequired: "هذا الحقل مطلوب"
    }
  }
};