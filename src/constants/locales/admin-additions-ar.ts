// Complete Admin Dashboard Arabic Translation Additions for ar-SA.ts
// Add these keys to the admin object in src/constants/locales/ar-SA.ts

export const adminTranslationsAR = {
  // المرحلة 1: مراقب الأداء (مجموعة كاملة)
  performance: {
    title: "الأداء",
    description: "مراقبة أداء النظام والتحسين",
    performanceMonitor: "مراقب الأداء",
    realTimeMetrics: "مقاييس الأداء في الوقت الفعلي ومراقبة حالة النظام",
    refreshMetrics: "تحديث المقاييس",
    checking: "جاري الفحص...",
    checkSystemHealth: "فحص صحة النظام",
    analyzing: "جاري التحليل...",
    analyzeBundle: "تحليل الحزمة",
    
    // علامات التبويب
    coreWebVitals: "مؤشرات الويب الأساسية",
    systemHealth: "صحة النظام",
    bundleAnalysis: "تحليل الحزمة",
    network: "الشبكة",
    recommendations: "التوصيات",
    
    // نتيجة الأداء
    performanceScore: "نتيجة الأداء",
    overallAssessment: "التقييم الشامل للأداء بناءً على عدة مقاييس",
    accessibility: "إمكانية الوصول",
    bestPractices: "أفضل الممارسات",
    seo: "تحسين محركات البحث",
    
    // مؤشرات الويب الأساسية
    firstContentfulPaint: "أول رسم محتوى",
    fcpDescription: "يقيس المدة التي يستغرقها ظهور المحتوى الأول",
    largestContentfulPaint: "أكبر رسم محتوى",
    lcpDescription: "يقيس أداء تحميل أكبر عنصر محتوى",
    timeToInteractive: "وقت التفاعل",
    ttiDescription: "الوقت حتى تصبح الصفحة تفاعلية بالكامل",
    domContentLoaded: "تحميل محتوى DOM",
    dclDescription: "وقت تحليل وتحميل وثيقة HTML الأولية",
    memoryUsage: "استخدام الذاكرة",
    memoryDescription: "ذاكرة JavaScript المستخدمة حالياً",
    
    // تسميات الحالة
    good: "جيد",
    needsImprovement: "يحتاج تحسين",
    poor: "ضعيف",
    
    // مراقبة النظام
    realTimeSystemMonitor: "مراقب النظام في الوقت الفعلي",
    lastUpdated: "آخر تحديث",
    systemStatus: "حالة النظام",
    healthy: "صحي",
    operational: "تشغيلي",
    cpuUsage: "استخدام المعالج",
    highLoad: "حمل عالي",
    normal: "عادي",
    database: "قاعدة البيانات",
    activeConnections: "اتصالات نشطة",
    
    // حالة الخدمة
    serviceStatus: "حالة الخدمة",
    corePlatformServicesHealth: "حالة خدمات المنصة الأساسية",
    apiGateway: "بوابة API",
    authentication: "المصادقة",
    realtimeServices: "الخدمات الفورية",
    
    // قدرات الجهاز
    deviceEnvironment: "بيئة الجهاز",
    currentDeviceCapabilities: "ملف أداء الجهاز الحالي والقدرات",
    deviceType: "نوع الجهاز",
    lowEnd: "جهاز منخفض الأداء",
    highPerformance: "أداء عالي",
    cpuCores: "أنوية المعالج",
    memory: "الذاكرة",
    networkSpeed: "سرعة الشبكة",
    animations: "الرسوم المتحركة",
    enabled: "مفعّل",
    disabled: "معطّل",
    
    // تحليل الحزمة
    totalBundleSize: "حجم الحزمة الكلي",
    uncompressed: "غير مضغوط",
    gzippedSize: "الحجم المضغوط",
    compression: "الضغط",
    mobileImpact: "تأثير الهاتف المحمول",
    loadTimeOn3G: "وقت التحميل المقدر على 3G",
    bundleComposition: "تكوين الحزمة",
    optimizationSuggestions: "اقتراحات التحسين",
    
    // التوصيات
    performanceRecommendations: "توصيات الأداء",
    actionableSuggestions: "اقتراحات قابلة للتنفيذ لتحسين أداء التطبيق",
    implementLazyLoading: "تطبيق التحميل الكسول",
    optimizeImages: "تحسين الصور",
    enableCaching: "تفعيل التخزين المؤقت",
    databaseOptimization: "تحسين قاعدة البيانات"
  },
  
  // المرحلة 2: إدارة الفئات
  categoryManagement: {
    title: "إدارة الفئات",
    description: "إدارة فئات المنتجات والخدمات",
    totalCategories: "إجمالي الفئات",
    active: "نشط",
    inactive: "غير نشط",
    parent: "رئيسي",
    parentCategories: "الفئات الرئيسية",
    subcategory: "فئة فرعية",
    subcategories: "فئات فرعية",
    labels: {
      children: "فرع",
      childrenPlural: "فروع"
    },
    
    // الإجراءات
    addCategory: "إضافة فئة",
    editCategory: "تعديل الفئة",
    deleteCategory: "حذف الفئة",
    bulkActions: "إجراءات مجمعة",
    exportCategories: "تصدير",
    
    // البحث والتصفية
    searchPlaceholder: "البحث عن فئات...",
    statusFilter: "الحالة",
    allStatuses: "الكل",
    activeOnly: "النشطة فقط",
    inactiveOnly: "غير النشطة فقط",
    
    // أوضاع العرض
    viewMode: "وضع العرض",
    treeView: "عرض شجري",
    tableView: "عرض جدول",
    expandAll: "توسيع الكل",
    collapseAll: "طي الكل",
    
    // الرسائل
    categoryUpdated: "تم تحديث الفئة بنجاح",
    categoryCreated: "تم إنشاء الفئة بنجاح",
    categoryDeleted: "تم حذف الفئة بنجاح",
    deleteCategoryConfirm: "هل أنت متأكد من حذف هذه الفئة؟",
    loadingCategories: "جاري تحميل الفئات...",
    noCategoriesInTable: "لا توجد فئات في عرض الجدول",
    switchToTreeView: "انتقل إلى العرض الشجري لرؤية الفئات",
    showingCategories: "عرض",
    categoriesSelected: "فئات محددة",
    selected: "محدد",
    bulkActionSuccess: "تم تحديث الفئات بالإجراء",
    
    // رؤوس CSV
    csvHeaders: {
      id: "المعرف",
      englishName: "الاسم بالإنجليزية",
      arabicName: "الاسم بالعربية",
      slug: "الرابط",
      status: "الحالة",
      level: "المستوى"
    },
    
    // رؤوس الجدول
    categoriesTable: "جدول الفئات",
    comprehensiveView: "عرض جدول شامل لجميع الفئات",
    total: "الإجمالي",
    categoryHierarchy: "تسلسل الفئات",
    arabicName: "الاسم بالعربية",
    slug: "الرابط",
    type: "النوع",
    status: "الحالة",
    actions: "الإجراءات",
    
    // التحكم في الوصول
    accessDenied: "الوصول مرفوض",
    needAdminPrivileges: "تحتاج صلاحيات مدير لإدارة الفئات",
    needAdminPrivilegesDelete: "تحتاج صلاحيات مدير لحذف الفئات",
    needAdminPrivilegesEdit: "تحتاج صلاحيات مدير لتعديل الفئات"
  },
  
  // المرحلة 4: مراجعة التحقق من الهوية
  kyc: {
    title: "مراجعة التحقق من الهوية",
    subtitle: "مراجعة والموافقة على طلبات التحقق من هوية العملاء",
    submissionsReview: "مراجعة طلبات التحقق",
    companyName: "اسم الشركة",
    crNumber: "رقم السجل التجاري",
    vatNumber: "الرقم الضريبي",
    accountType: "نوع الحساب",
    submittedAt: "تاريخ التقديم",
    actions: "الإجراءات",
    review: "مراجعة",
    
    // مراجعة الطلب
    reviewSubmission: "مراجعة الطلب",
    multipleSubmissions: "طلبات متعددة",
    multipleSubmissionsDesc: "قدم هذا المستخدم {count} مرات",
    previousRejected: "تم رفض الطلبات السابقة",
    previousApproved: "تمت الموافقة على طلب سابق",
    reviewingLatest: "أنت تراجع أحدث طلب",
    
    // علامات التبويب
    companyTab: "الشركة",
    taxTab: "الضرائب",
    addressTab: "العنوان",
    signatoryTab: "المفوض",
    creditTab: "الائتمان",
    
    // الحقول
    legalName: "الاسم القانوني",
    crIssuingDate: "تاريخ إصدار السجل",
    crValidity: "تاريخ انتهاء السجل",
    viewCRDocument: "عرض وثيقة السجل",
    downloadDocument: "تحميل الوثيقة",
    
    // التحذيرات
    warning: "تحذير",
    warningCRMissing: "وثيقة السجل التجاري مفقودة من التخزين",
    warningVATMissing: "شهادة الضريبة مفقودة من التخزين",
    warningStorageNote: "قد يشير هذا إلى مشكلة في التخزين",
    
    // الرسائل
    fetchError: "خطأ في جلب البيانات",
    fetchErrorDesc: "فشل تحميل طلبات التحقق",
    approveSuccess: "تمت الموافقة",
    approveSuccessDesc: "تمت الموافقة على طلب التحقق بنجاح",
    rejectSuccess: "تم الرفض",
    rejectSuccessDesc: "تم رفض طلب التحقق",
    reviewNotesRequired: "ملاحظات المراجعة مطلوبة",
    reviewNotesRequiredDesc: "يرجى تقديم ملاحظات المراجعة قبل الرفض",
    viewError: "خطأ في العرض",
    viewErrorDesc: "فشل فتح الوثيقة",
    downloadSuccess: "بدأ التحميل",
    downloadSuccessDesc: "بدأ تحميل الوثيقة",
    downloadError: "خطأ في التحميل",
    downloadErrorDesc: "فشل تحميل الوثيقة"
  },
  
  // المرحلة 4: حملات البريد الإلكتروني
  email: {
    campaigns: "الحملات",
    templates: "القوالب",
    analytics: "التحليلات",
    newCampaign: "حملة جديدة",
    createCampaign: "إنشاء حملة",
    campaignName: "اسم الحملة",
    campaignNamePlaceholder: "أدخل اسم الحملة",
    emailSubject: "موضوع البريد",
    subjectPlaceholder: "أدخل موضوع البريد",
    template: "القالب",
    selectTemplate: "اختر قالب",
    targetAudience: "الجمهور المستهدف",
    allUsers: "جميع المستخدمين",
    clientsOnly: "العملاء فقط",
    vendorsOnly: "الموردين فقط",
    activeUsers: "المستخدمون النشطون",
    scheduleOptional: "جدولة (اختياري)",
    
    // القوالب
    newTemplate: "قالب جديد",
    createEmailTemplate: "إنشاء قالب بريد",
    templateName: "اسم القالب",
    templateNamePlaceholder: "أدخل اسم القالب",
    category: "الفئة",
    announcement: "إعلان",
    newsletter: "نشرة إخبارية",
    promotion: "ترويج",
    welcome: "ترحيب",
    defaultSubject: "الموضوع الافتراضي",
    defaultSubjectPlaceholder: "أدخل الموضوع الافتراضي",
    htmlContent: "محتوى HTML",
    htmlContentPlaceholder: "أدخل محتوى HTML",
    createTemplate: "إنشاء قالب",
    
    // الإحصائيات
    totalCampaigns: "إجمالي الحملات",
    allTime: "كل الأوقات",
    sentThisMonth: "المرسل هذا الشهر",
    monthlyGrowth: "+12.5٪ عن الشهر الماضي",
    openRate: "معدل الفتح",
    average: "المتوسط",
    clickRate: "معدل النقر",
    
    // الرسائل
    campaignCreatedSuccess: "تم إنشاء الحملة بنجاح",
    campaignCreateFailed: "فشل إنشاء الحملة",
    templateCreatedSuccess: "تم إنشاء القالب بنجاح",
    templateCreateFailed: "فشل إنشاء القالب",
    campaignSentSuccess: "تم إرسال الحملة بنجاح",
    campaignSendFailed: "فشل إرسال الحملة",
    noCampaignsYet: "لا توجد حملات بعد",
    createFirstCampaign: "أنشئ حملتك الأولى للبدء"
  },
  
  // المرحلة 4: الإشعارات الفورية
  pushNotifications: {
    overview: "نظرة عامة",
    notifications: "الإشعارات",
    analytics: "التحليلات",
    settings: "الإعدادات",
    newPushNotification: "إشعار فوري جديد",
    createPushNotification: "إنشاء إشعار فوري",
    title: "العنوان",
    titlePlaceholder: "أدخل عنوان الإشعار",
    message: "الرسالة",
    messagePlaceholder: "أدخل رسالة الإشعار",
    targetPlatform: "المنصة المستهدفة",
    allPlatforms: "جميع المنصات",
    android: "أندرويد",
    ios: "آيفون",
    web: "الويب",
    targetAudience: "الجمهور المستهدف",
    allUsers: "جميع المستخدمين",
    clients: "العملاء",
    vendors: "الموردين",
    activeUsers: "المستخدمون النشطون",
    actionUrl: "رابط الإجراء (اختياري)",
    actionUrlPlaceholder: "https://example.com/action",
    schedule: "جدولة (اختياري)",
    createAndSend: "إنشاء وإرسال",
    
    // الإعدادات
    pushNotificationSettings: "إعدادات الإشعارات الفورية",
    enablePushNotifications: "تفعيل الإشعارات الفورية",
    enablePushNotificationsDesc: "السماح بإرسال إشعارات فورية للمستخدمين",
    allowPromotional: "السماح بالإشعارات الترويجية",
    allowPromotionalDesc: "تفعيل الإشعارات الترويجية والتسويقية",
    enableQuietHours: "تفعيل ساعات الهدوء",
    enableQuietHoursDesc: "عدم إرسال إشعارات خلال ساعات الهدوء",
    quietHoursStart: "بداية ساعات الهدوء",
    quietHoursEnd: "نهاية ساعات الهدوء",
    maxDailyNotifications: "الحد الأقصى للإشعارات اليومية",
    saveSettings: "حفظ الإعدادات",
    
    // الإحصائيات
    registeredDevices: "الأجهزة المسجلة",
    successfullyDelivered: "تم التسليم بنجاح",
    userEngagement: "تفاعل المستخدم",
    platformDistribution: "توزيع المنصات",
    activeDevicesByPlatform: "الأجهزة النشطة حسب المنصة",
    
    // الرسائل
    success: "نجاح",
    error: "خطأ",
    createSuccess: "تم إنشاء الإشعار الفوري بنجاح",
    createError: "فشل إنشاء الإشعار الفوري",
    settingsUpdated: "تم تحديث الإعدادات بنجاح",
    settingsError: "فشل تحديث الإعدادات"
  },
  
  // المرحلة 4: مراقب الأمان (مفاتيح إضافية)
  security: {
    criticalSecurityAlert: "تنبيه أمني حرج",
    criticalAlertsDetected: "تم اكتشاف تنبيهات حرجة"
  }
};
