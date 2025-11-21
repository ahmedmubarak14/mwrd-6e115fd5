export const arSA = {
  // Client Dashboard
  dashboard: {
    title: "لوحة تحكم العميل",
    welcomeMessage: "مرحباً بك في لوحة تحكم المشتريات",
    overview: "نظرة عامة",
    rfqPerformance: "أداء طلبات التسعير",
    recentActivity: "النشاط الأخير وحالة طلبات التسعير",
    noDataAvailable: "لا توجد بيانات متاحة لأداء طلبات التسعير.",
    
    metrics: {
      totalRequests: {
        title: "إجمالي الطلبات",
        description: "طلبات المشتريات المُنشأة"
      },
      activeRequests: {
        title: "الطلبات النشطة",
        description: "قيد المعالجة حالياً"
      },
      pendingOffers: {
        title: "العروض المعلقة",
        description: "في انتظار مراجعتك"
      },
      completedOrders: {
        title: "الطلبات المكتملة",
        description: "تم التسليم بنجاح"
      },
      totalSpent: {
        title: "إجمالي الإنفاق",
        description: "القيمة الإجمالية للمشتريات"
      },
      successRate: {
        title: "معدل النجاح",
        description: "معدل إتمام الطلبات"
      },
      averageResponse: {
        title: "متوسط الاستجابة",
        description: "وقت استجابة المورد"
      },
      offersReceived: {
        title: "العروض المستلمة",
        description: "إجمالي عروض الموردين"
      }
    },
    
    actions: {
      title: "إجراء مطلوب",
      quickActions: "إجراءات سريعة",
      pendingOfferReviews: "مراجعة العروض المعلقة",
      offersNeedDecision: "عروض تحتاج قرارك",
      review: "مراجعة",
      activeRequests: "الطلبات النشطة",
      requestsInProgress: "طلبات قيد التنفيذ",
      monitor: "مراقبة",
      allCaughtUp: "كل شيء محدث! لا توجد إجراءات معلقة.",
      createNewRequest: "إنشاء طلب جديد",
      createNewRequestDesc: "ابدأ طلب مشتريات جديد",
      browseVendors: "تصفح الموردين",
      browseVendorsDesc: "ابحث عن موردين مؤهلين",
      messages: "الرسائل",
      messagesDesc: "تواصل مع الموردين"
    },
    
    performance: {
      title: "أداء المشتريات",
      description: "نظرة عامة على نشاط المشتريات الخاص بك",
      requestSuccessRate: "معدل نجاح الطلبات",
      offerAcceptanceRate: "معدل قبول العروض",
      orderCompletion: "إتمام الطلبات"
    },
    
    verificationBanner: {
      rejected: {
        title: "تم رفض التحقق من الحساب",
        description: "تم رفض السجل التجاري الخاص بك. يرجى مراجعة الملاحظات وإعادة تقديم المستندات.",
        action: "مراجعة وإعادة التقديم",
        badge: "مرفوض",
        reasonLabel: "سبب الرفض:"
      },
      pending: {
        title: "التحقق من الحساب قيد المراجعة",
        description: "السجل التجاري الخاص بك قيد المراجعة. بعض الميزات محدودة مؤقتاً.",
        action: "عرض الحالة",
        badge: "قيد المراجعة"
      },
      required: {
        title: "التحقق من الحساب مطلوب",
        description: "قم بتحميل السجل التجاري الخاص بك للوصول إلى إنشاء طلبات التسعير والطلبات والتفاعل مع الموردين.",
        action: "تحميل المستندات",
        badge: "معلق"
      }
    }
  },
  
  widgets: {
    kyc: {
      required: {
        title: "التحقق من الهوية مطلوب",
        description: "أكمل التحقق من هويتك للوصول إلى جميع الميزات",
        badge: "غير مكتمل",
        action: "بدء التحقق"
      },
      draft: {
        title: "تم حفظ مسودة التحقق",
        description: "أكمل وأرسل طلب التحقق من هويتك",
        badge: "مسودة",
        action: "إكمال التحقق"
      },
      underReview: {
        title: "التحقق قيد المراجعة",
        description: "طلب التحقق الخاص بك قيد المراجعة. عادة ما يستغرق هذا 24-48 ساعة.",
        badge: "قيد المراجعة"
      },
      approved: {
        title: "تم التحقق من الهوية",
        description: "اكتمل التحقق من هويتك. لديك وصول كامل إلى جميع الميزات.",
        badge: "معتمد"
      },
      rejected: {
        title: "تم رفض التحقق",
        description: "تم رفض طلب التحقق الخاص بك. يرجى مراجعة الملاحظات وإعادة التقديم.",
        badge: "مرفوض",
        action: "إعادة تقديم التحقق"
      },
      unknown: {
        title: "حالة التحقق غير معروفة",
        description: "يرجى الاتصال بالدعم للحصول على المساعدة",
        badge: "غير معروف"
      }
    },
    credit: {
      title: "الحساب الائتماني",
      loading: "جار تحميل معلومات الائتمان...",
      creditLimit: "الحد الائتماني",
      used: "مستخدم",
      available: "متاح",
      paymentPeriod: "فترة السداد",
      days: "يوم",
      approachingLimit: "الاقتراب من الحد الائتماني",
      daysOverdue: "يوم متأخر",
      accountOnHold: "الحساب معلق - اتصل بالدعم للحل"
    }
  },

  // Suppliers
  suppliers: {
    title: "الموردين",
    findManage: "البحث عن وإدارة الموردين المفضلين لديك",
    noSuppliers: "لم يتم العثور على موردين."
  },

  // Analytics
  analytics: {
    fromLastMonth: "من الشهر الماضي",
    fromLastWeek: "من الأسبوع الماضي"
  },

  // Client Groups
  clientGroups: {
    overview: "نظرة عامة",
    workspace: "مساحة العمل", 
    network: "الشبكة",
    account: "الحساب"
  },

  // Navigation
  nav: {
    navigation: "التصفح",
    dashboard: "لوحة التحكم",
    requests: "الطلبات",
    offers: "العروض",
    portfolio: "المحفظة",
    clients: "العملاء",
    transactions: "المعاملات",
    subscriptions: "الاشتراكات",
    notifications: "الإشعارات",
    documents: "المستندات",
    reports: "التقارير",
    projects: "المشاريع",
    analytics: "التحليلات",
    messages: "الرسائل",
    orders: "الطلبات",
    settings: "الإعدادات",
    subscription: "الاشتراك",
    browseRequests: "تصفح الطلبات",
    myOffers: "عروضي",
    rfqs: "طلبات التسعير",
    profile: "الملف الشخصي", 
    support: "الدعم",
    logout: "تسجيل الخروج",
    navigateTo: "انتقل إلى",
    vendors: "الموردين",
    manageSubscription: "إدارة الاشتراك",
    products: "كاتالوج المنتجات"
  },

  // Vendor Header  
  vendorHeader: {
    openMobileMenu: "فتح القائمة المحمولة",
    toggleSidebar: "تبديل الشريط الجانبي",
    goToDashboard: "الذهاب إلى لوحة التحكم", 
    dashboard: "لوحة تحكم المورد",
    portal: "البوابة"
  },

  // Vendor Groups
  vendorGroups: {
    overview: "نظرة عامة",
    workspace: "الأعمال", 
    portfolio: "المحفظة",
    account: "الحساب",
    financial: "المالية",
    businessIntelligence: "ذكاء الأعمال",
    projectManagement: "إدارة المشاريع",
    businessOperations: "العمليات التجارية"
  },

  // Admin Dashboard & Management  
  admin: {
    // Dashboard
    dashboard: "لوحة تحكم المدير",
    totalUsers: "إجمالي المستخدمين",
    activeRequests: "الطلبات النشطة",
    revenue: "الإيرادات",
    dashboardData: {
      description: "نظرة شاملة على مقاييس المنصة وحالة النظام",
      quickActions: "الإجراءات السريعة", 
      quickActionsDesc: "وصول سريع للوظائف الإدارية الأساسية"
    },
    
    // Admin branding
    adminPortal: "إدارة MWRD",
    adminRole: "مسؤول",
    
    // Header actions
    openMobileMenu: "فتح القائمة المحمولة",
    collapseSidebar: "طي الشريط الجانبي",
    expandSidebar: "توسيع الشريط الجانبي",
    goToAdminDashboard: "الانتقال إلى لوحة المدير",
    logoAlt: "شعار MWRD",
    managementPortal: "بوابة الإدارة",
    viewNotifications: "عرض الإشعارات",
    
    // Navigation groups
    groups: {
      overview: "نظرة عامة",
      management: "الإدارة",
      business: "العمليات التجارية",
      system: "النظام والأدوات",
      communication: "التواصل"
    },
    
    // Navigation & Sidebar
    usersTitle: "المستخدمون",
    requestsTitle: "الطلبات",
    offersTitle: "العروض", 
    offers: "العروض",
    ordersTitle: "الطلبيات",
    orders: "الطلبيات",
    communicationsTitle: "الاتصالات",
    communications: "الاتصالات",
    settingsTitle: "الإعدادات",
    settings: "الإعدادات",
    profileTitle: "الملف الشخصي",
    profile: "الملف الشخصي",
    sidebarAnalytics: "التحليلات",
    sidebarUsers: "إدارة المستخدمين",
    sidebarRequests: "إدارة الطلبات",
    sidebarOffers: "إدارة العروض", 
    sidebarOrders: "إدارة الطلبيات",
    sidebarCommunications: "مركز الاتصالات",
    sidebarSettings: "إعدادات النظام",
    sidebarExpertConsultations: "الاستشارات الخبيرة",
    
    // Additional sidebar items
    performanceMonitor: "مراقب الأداء",
    financialTransactions: "المعاملات المالية",
    subscriptions: "الاشتراكات",
    supportTickets: "تذاكر الدعم",
    messagesNav: "الرسائل",
    notificationsNav: "الإشعارات",
    emailCampaigns: "حملات البريد الإلكتروني",
    expertConsultations: "الاستشارات الخبيرة",
    securityNav: "مركز الأمان",
    systemHealthNav: "صحة النظام",
    supportNav: "الدعم",
    projectsNav: "المشاريع",
    categoryManagementNav: "إدارة الفئات",
    kycReview: "مراجعة التحقق من هوية العملاء",
    kyvReview: "مراجعة التحقق من هوية الموردين",
    
    // Breadcrumbs
    breadcrumbs: {
      admin: "المدير",
      userManagement: "إدارة المستخدمين", 
      requestsManagement: "إدارة الطلبات",
      offersManagement: "إدارة العروض",
      ordersManagement: "إدارة الطلبيات",
      communicationCenter: "مركز الاتصالات",
      unknown: "الصفحة"
    },
    
    // Command Palette
    commandPalette: {
      goToUsers: "الذهاب للمستخدمين",
      createNewUser: "إنشاء مستخدم جديد",
      reviewRequests: "مراجعة الطلبات", 
      manageOffers: "إدارة العروض",
      viewAnalytics: "عرض التحليلات",
      financialTransactions: "المعاملات المالية",
      searchUsersRequestsOffers: "البحث في المستخدمين والطلبات والعروض..."
    },
    
    // Quick Actions
    quickActions: "الإجراءات السريعة",
    
    // Analytics & Metrics
    analytics: {
      totalUsers: "إجمالي المستخدمين",
      totalRevenue: "إجمالي الإيرادات", 
      pendingApprovals: "الموافقات المعلقة",
      platformActivity: "نشاط المنصة",
      platformActivityDesc: "نشاط المستخدمين واتجاهات المعاملات عبر الوقت",
      recentActivity: "النشاط الأخير",
      recentActivityDescription: "أحدث أنشطة المنصة وإجراءات المستخدمين",
      activityOn: "على"
    },
    
    // System Health & Status
    system: {
      health: "حالة النظام",
      status: "حالة النظام", 
      statusDescription: "الحالة الحالية لجميع مكونات النظام",
      database: "قاعدة البيانات",
      cpuUsage: "استخدام المعالج",
      memoryUsage: "استخدام الذاكرة", 
      healthy: "سليم",
      warning: "تحذير",
      critical: "حرج",
      alerts: "تنبيهات النظام",
      activeSystemAlerts: "تنبيهات نظام نشطة",
      requireAttention: "تتطلب انتباه",
      allSystemsOperational: "جميع الأنظمة تعمل بشكل طبيعي"
    },

    // Performance Dashboard
    performance: {
      title: "لوحة معلومات الأداء",
      subtitle: "راقب مقاييس الأداء في الوقت الفعلي لتطبيقك",
      loading: "جار تحميل مقاييس الأداء...",
      autoRefresh: "التحديث التلقائي",
      on: "تشغيل",
      off: "إيقاف",
      refresh: "تحديث",
      overallScore: "درجة الأداء الإجمالية",
      excellent: "ممتاز",
      good: "جيد",
      needsImprovement: "يحتاج إلى تحسين",
      largestContentfulPaint: "أكبر رسم للمحتوى",
      firstInputDelay: "تأخير الإدخال الأول",
      cumulativeLayoutShift: "التحول التراكمي للتخطيط",
      targetLcp: "الهدف: < 2.5 ثانية",
      targetFid: "الهدف: < 100 مللي ثانية",
      targetCls: "الهدف: < 0.1",
      loadTime: "وقت التحميل",
      totalPageLoadTime: "إجمالي وقت تحميل الصفحة",
      bundleSize: "حجم الحزمة",
      jsCssSize: "JavaScript + CSS",
      memoryUsage: "استخدام الذاكرة",
      cacheHitRate: "معدل إصابة الذاكرة المؤقتة",
      recommendations: "توصيات الأداء",
      optimizeLcp: "قم بتحسين تحميل الصور وتقليل أوقات استجابة الخادم لتحسين LCP",
      reduceFid: "قلل وقت تنفيذ JavaScript لتحسين FID",
      fixCls: "أضف سمات الحجم للصور واحتفظ بمساحة للمحتوى الديناميكي",
      reduceBundleSize: "فكر في تقسيم الكود لتقليل حجم الحزمة",
      fixMemoryLeaks: "راقب تسريبات الذاكرة وقم بتحسين إعادة عرض المكونات",
      excellentPerformance: "عمل رائع! تطبيقك يعمل بشكل ممتاز.",
      
      // إضافات مراقب الأداء
      performanceMonitor: "مراقب الأداء",
      realTimeMetrics: "مقاييس الأداء في الوقت الفعلي ومراقبة حالة النظام",
      refreshMetrics: "تحديث المقاييس",
      checking: "جاري الفحص...",
      checkSystemHealth: "فحص صحة النظام",
      analyzing: "جاري التحليل...",
      analyzeBundle: "تحليل الحزمة",
      coreWebVitals: "مؤشرات الويب الأساسية",
      systemHealth: "صحة النظام",
      bundleAnalysis: "تحليل الحزمة",
      network: "الشبكة",
      performanceScore: "نتيجة الأداء",
      overallAssessment: "التقييم الشامل للأداء بناءً على عدة مقاييس",
      accessibility: "إمكانية الوصول",
      bestPractices: "أفضل الممارسات",
      seo: "تحسين محركات البحث",
      firstContentfulPaint: "أول رسم محتوى",
      fcpDescription: "يقيس المدة التي يستغرقها ظهور المحتوى الأول",
      lcpDescription: "يقيس أداء تحميل أكبر عنصر محتوى",
      timeToInteractive: "وقت التفاعل",
      ttiDescription: "الوقت حتى تصبح الصفحة تفاعلية بالكامل",
      domContentLoaded: "تحميل محتوى DOM",
      dclDescription: "وقت تحليل وتحميل وثيقة HTML الأولية",
      memoryDescription: "ذاكرة JavaScript المستخدمة حالياً",
      poor: "ضعيف",
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
      systemAlerts: "تنبيهات النظام",
      realTimeSystemAlerts: "مراقبة فورية لصحة النظام ومشاكل الأداء",
      systemAlert: "تنبيه النظام",
      allSystemsOperational: "جميع الأنظمة تعمل. لا توجد تنبيهات في الوقت الحالي.",
      serviceStatus: "حالة الخدمة",
      corePlatformServicesHealth: "حالة صحة خدمات المنصة الأساسية",
      apiGateway: "بوابة API",
      authentication: "المصادقة",
      realtimeServices: "الخدمات الفورية",
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
      gpuAcceleration: "تسريع GPU",
      transitionDuration: "مدة الانتقال",
      maxAnimations: "الحد الأقصى للرسوم المتحركة",
      debounceTime: "وقت التأخير",
      totalBundleSize: "حجم الحزمة الكلي",
      uncompressed: "غير مضغوط",
      gzippedSize: "الحجم المضغوط",
      compression: "الضغط",
      mobileImpact: "تأثير الهاتف المحمول",
      loadTimeOn3G: "وقت التحميل المقدر على 3G",
      bundleComposition: "تكوين الحزمة",
      bundleBreakdownDescription: "تفصيل حجم حزم التطبيق والأصول",
      optimizationSuggestions: "اقتراحات التحسين",
      bundleAnalysisTitle: "تحليل الحزمة",
      bundleAnalysisDescription: "حلل حجم حزمة التطبيق واحصل على توصيات التحسين",
      startAnalysis: "بدء التحليل",
      networkPerformanceTitle: "أداء الشبكة",
      networkPerformanceDesc: "تحليل زمن الاستجابة والإنتاجية للشبكة",
      networkAnalysisComingSoon: "ميزات تحليل الشبكة قريباً",
      performanceRecommendations: "توصيات الأداء",
      actionableSuggestions: "اقتراحات قابلة للتنفيذ لتحسين أداء التطبيق",
      implementLazyLoading: "تطبيق التحميل الكسول",
      lazyLoadingDescription: "تحميل المكونات والمسارات عند الطلب لتقليل حجم الحزمة الأولية",
      optimizeImages: "تحسين الصور",
      optimizeImagesDescription: "استخدم تنسيقات حديثة مثل WebP ونفذ صور متجاوبة",
      enableCaching: "تفعيل التخزين المؤقت",
      enableCachingDescription: "نفذ استراتيجيات التخزين المؤقت للمتصفح وCDN",
      databaseOptimization: "تحسين قاعدة البيانات",
      databaseOptimizationDescription: "أضف فهارس مناسبة وحسّن أنماط الاستعلام"
    },

    // Approvals Management
    approvals: {
      budget: "الميزانية:",
      deadline: "الموعد النهائي:",
      created: "تم الإنشاء:",
      approvalNotes: "ملاحظات الموافقة",
      notesPlaceholder: "أضف ملاحظات...",
      approve: "موافقة",
      reject: "رفض",
      processedOn: "تمت المعالجة في:",
      notes: "الملاحظات:",
      forRequest: "للطلب:",
      days: "أيام",
      acceptOffer: "قبول العرض",
      rejectOffer: "رفض العرض"
    },

    // Testing Suite
    testing: {
      title: "اختبار ضمان الجودة",
      subtitle: "مجموعة اختبار تلقائية للتحقق من صحة MVP",
      runAllTests: "تشغيل جميع الاختبارات",
      runningTests: "جار تشغيل الاختبارات...",
      runTests: "تشغيل الاختبارات",
      overallProgress: "التقدم الإجمالي",
      mobileResponsiveness: "الاستجابة للجوال",
      mobileResponsivenessDesc: "اختبار منفذ عرض الجوال وأهداف اللمس والتصميم المستجيب",
      pwaFunctionality: "وظائف PWA",
      pwaFunctionalityDesc: "اختبار ميزات تطبيق الويب التقدمي وعامل الخدمة",
      performance: "الأداء",
      performanceDesc: "اختبار Core Web Vitals وأداء التحميل",
      accessibility: "إمكانية الوصول",
      accessibilityDesc: "اختبار توافق WCAG وميزات إمكانية الوصول",
      completed: "مكتمل",
      running: "قيد التشغيل",
      failed: "فشل",
      pending: "قيد الانتظار",
      totalTests: "إجمالي الاختبارات",
      passed: "نجح",
      warnings: "تحذيرات",
      overview: "نظرة عامة",
      mobile: "جوال",
      pwa: "PWA",
      noTestsRun: "لم يتم تشغيل اختبارات بعد. انقر على \"تشغيل الاختبارات\" للبدء.",
      tests: "اختبارات",
      complete: "مكتمل",
      testResults: "نتائج الاختبار"
    },

    // Testing Dashboard
    testingDashboard: {
      title: "الاختبار وضمان الجودة",
      subtitle: "مجموعة اختبار شاملة لتحسين الجوال وسطح المكتب",
      currentDevice: "الجهاز الحالي",
      deviceType: "نوع الجهاز",
      mobile: "جوال",
      tablet: "جهاز لوحي",
      desktop: "سطح المكتب",
      screenSize: "حجم الشاشة",
      orientation: "الاتجاه",
      overallScore: "الدرجة الإجمالية",
      testSummary: "ملخص الاختبار",
      quickActions: "إجراءات سريعة",
      testMobileLayout: "اختبار تخطيط الجوال",
      performanceCheck: "فحص الأداء",
      securityScan: "فحص الأمان",
      progress: "التقدم",
      lastTestRun: "آخر تشغيل للاختبار:",
      overallScoreLabel: "الدرجة الإجمالية:",
      mobileResponsiveness: "الاستجابة للجوال",
      mobileResponsivenessDesc: "اختبارات للتصميم الملائم للجوال وتفاعلات اللمس",
      progressiveWebApp: "تطبيق ويب تقدمي",
      pwaDesc: "ميزات PWA مثل البيان وعامل الخدمة وقابلية التثبيت",
      performanceMetrics: "مقاييس الأداء",
      performanceMetricsDesc: "قياسات Core Web Vitals وأداء التحميل",
      accessibility: "إمكانية الوصول",
      accessibilityDesc: "توافق WCAG وتوافق قارئ الشاشة",
      a11y: "إمكانية الوصول",
      noTestsMessage: "لم يتم تشغيل اختبارات بعد. انقر على \"تشغيل جميع الاختبارات\" للبدء."
    },
    
    // User Management
    users: {
      activeThisMonth: "نشط هذا الشهر",
      unknownAdmin: "مسؤول غير معروف",
      admin: "مسؤول",
      adminOnline: "مسؤول (متصل)"
    },
    
    // Request Management  
    requests: {
      requiresAdminReview: "يتطلب مراجعة المدير"
    },
    
    // Financial
    financial: {
      monthlyGrowth: "النمو الشهري",
      currency: "ريال",
      demoMode: "الوضع التجريبي",
      demoDescription: "عرض البيانات التجريبية - لم يتم إنشاء جدول financial_transactions بعد",
      transaction: "المعاملة",
      notAvailable: "غير متوفر",
      ref: "المرجع",
      user: "المستخدم",
      company: "الشركة",
      demoData: {
        paymentForConstruction: "الدفع مقابل مواد البناء",
        platformCommission: "عمولة المنصة (5٪)",
        refundForCancelledOrder: "استرداد المبلغ للطلب الملغى"
      },
      error: "خطأ",
      fetchError: "فشل في جلب المعاملات",
      updateError: "فشل في تحديث المعاملة",
      deleteError: "فشل في حذف المعاملة",
      bulkActionFailed: "فشلت العملية المجمعة",
      searchTransactions: "البحث بالمعرف، الوصف، المستخدم...",
      searchPlaceholder: "البحث في المعاملات...",
      status: "الحالة",
      allStatus: "جميع الحالات",
      failed: "فشل",
      cancelled: "ملغى",
      pending: "قيد الانتظار",
      completed: "مكتمل",
      type: "النوع",
      allTypes: "جميع الأنواع",
      payment: "دفع",
      refund: "استرداد",
      fee: "رسوم",
      commission: "عمولة",
      withdrawal: "سحب",
      subscription: "اشتراك",
      invoice_generated: "فاتورة",
      order_payment: "دفع طلب",
      refresh: "تحديث",
      export: "تصدير",
      all: "الكل",
      totalTransactions: "إجمالي المعاملات",
      totalVolume: "الحجم الكلي",
      platformRevenue: "إيرادات المنصة",
      noTransactionsFound: "لم يتم العثور على معاملات",
      noTransactionsMatch: "لا توجد معاملات تطابق معايير البحث الخاصة بك",
      noTransactionsAvailable: "لا توجد معاملات متاحة",
      transactionCsvHeaders: "المعرف،النوع،الحالة،المبلغ،العملة،الوصف،المرجع،تاريخ الإنشاء،المستخدم",
      notSpecified: "غير محدد",
      noDescription: "لا يوجد وصف",
      revenue: "الإيرادات",
      thisMonth: "هذا الشهر",
      currentMonthRevenue: "إيرادات الشهر الحالي",
      pendingAmount: "المبلغ المعلق",
      avgTransaction: "متوسط المعاملة",
      totalRevenue: "إجمالي الإيرادات",
      filtersActions: "الفلاتر والإجراءات",
      filterByStatus: "تصفية حسب الحالة",
      filterByType: "تصفية حسب النوع",
      allTransactions: "جميع المعاملات",
      selectedTransactions: "محدد",
      bulkActions: "إجراءات مجمعة",
      selectAction: "اختر إجراء",
      deleteTransactions: "حذف المحدد",
      apply: "تطبيق",
      transactionList: "قائمة المعاملات ({count})",
      noTransactions: "لم يتم العثور على معاملات",
      noTransactionsDesc: "حاول ضبط الفلاتر الخاصة بك",
      details: "التفاصيل",
      close: "إغلاق",
      transactionDetails: "تفاصيل المعاملة",
      transactionId: "معرف المعاملة",
      userName: "اسم المستخدم",
      email: "البريد الإلكتروني",
      description: "الوصف",
      paymentMethod: "طريقة الدفع",
      reference: "المرجع",
      orderId: "معرف الطلب",
      createdAt: "تاريخ الإنشاء",
      updatedAt: "تاريخ التحديث",
      actions: "الإجراءات",
      updateStatus: "تحديث الحالة",
      viewOrder: "عرض الطلب",
      csvHeaders: {
        transactionId: "معرف المعاملة",
        user: "المستخدم",
        type: "النوع",
        amount: "المبلغ",
        currency: "العملة",
        status: "الحالة",
        description: "الوصف",
        paymentMethod: "طريقة الدفع",
        created: "تاريخ الإنشاء"
      },
      exportCompleted: "اكتمل التصدير",
      exportDescription: "تم تصدير {count} معاملة",
      dataRefreshed: "تم تحديث البيانات",
      dataUpdated: "تم تحديث البيانات بنجاح",
      transactionDeleted: "تم حذف المعاملة بنجاح"
    },
    
    // Actions
    actions: {
      viewDetails: "عرض التفاصيل"
    },
    
    // Messages
    messages: {
      error: "خطأ"
    },
    
    // User Details
    userDetails: {
      role: "الدور",
      selectRole: "اختر الدور", 
      client: "عميل",
      vendor: "مورد", 
      admin: "مدير"
    },
    
    // Communication
    communication: {
      center: "مركز الاتصالات",
      centerDescription: "إدارة جميع اتصالات المنصة والإشعارات",
      allUsers: "جميع المستخدمين",
      clientsOnly: "العملاء فقط",
      vendorsOnly: "الموردين فقط", 
      pendingVerification: "التحقق المعلق",
      inactiveUsers: "المستخدمين غير النشطين",
      lowPriority: "منخفض",
      mediumPriority: "متوسط",
      highPriority: "عالي", 
      urgentPriority: "عاجل",
      loadingCenter: "جار تحميل مركز الاتصالات...",
      notifications: "الإشعارات",
      broadcastMessages: "رسائل البث",
      emailTemplates: "قوالب البريد الإلكتروني",
      totalSent: "إجمالي المرسل",
      unread: "غير مقروء",
      activeUsers: "المستخدمون النشطون",
      readRate: "معدل القراءة",
      searchNotifications: "البحث في الإشعارات...",
      allTypes: "جميع الأنواع",
      offerReceived: "عرض مستلم",
      requestCreated: "طلب تم إنشاؤه",
      orderUpdate: "تحديث الطلب",
      system: "النظام",
      markAllRead: "تحديد الكل كمقروء",
      unknownUser: "مستخدم غير معروف",
      noNotificationsFound: "لم يتم العثور على إشعارات",
      adjustSearchCriteria: "جرب تعديل معايير البحث الخاصة بك",
      notificationsWillAppear: "ستظهر الإشعارات هنا عند إرسالها",
      sendBroadcastMessage: "إرسال رسالة بث",
      sendMessageToGroups: "إرسال رسالة إلى مجموعات مستخدمين محددة",
      messageTitle: "عنوان الرسالة",
      titlePlaceholder: "أدخل عنوان الرسالة...",
      targetAudience: "الجمهور المستهدف",
      priority: "الأولوية",
      messageContent: "محتوى الرسالة",
      messagePlaceholder: "أدخل رسالتك...",
      sendMessage: "إرسال الرسالة",
      success: "نجح", 
      broadcastCreated: "تم إنشاء رسالة البث بنجاح",
      error: "خطأ",
      broadcastFailed: "فشل في إنشاء رسالة البث",
      allMarkedRead: "تم تحديد جميع الإشعارات كمقروءة",
      urgent: "عاجل",
      high: "عالي",
      medium: "متوسط", 
      low: "منخفض",
      sent: "مرسل",
      draft: "مسودة",
      scheduled: "مجدول",
      failed: "فشل",
      recentBroadcasts: "رسائل البث الأخيرة",
      recipients: "المستلمون",
      openRate: "معدل الفتح",
      sentAt: "تم الإرسال في",
      noBroadcastsFound: "لم يتم العثور على رسائل بث",
      noBroadcastsAvailable: "لم يتم إرسال رسائل بث بعد",
      templateLibrary: "مكتبة قوالب البريد الإلكتروني",
      manageReusable: "إدارة قوالب البريد الإلكتروني القابلة لإعادة الاستخدام",
      createTemplate: "إنشاء قالب",
      templateName: "اسم القالب",
      subject: "الموضوع",
      viewTemplate: "عرض",
      editTemplate: "تعديل",
      deleteTemplate: "حذف",
      noTemplatesFound: "لم يتم العثور على قوالب",
      createFirstTemplate: "أنشئ أول قالب بريد إلكتروني للبدء"
    },
    
    // Verification
    verification: {
      allCaughtUp: "كل شيء محدث!",
      noPendingVerifications: "لا توجد عمليات تحقق معلقة في الوقت الحالي",
      verificationQueue: "قائمة انتظار التحقق",
      approvedSuccessfully: "تمت الموافقة بنجاح", 
      rejectedSuccessfully: "تم الرفض بنجاح"
    },
    
    // KYC Review
    kyc: {
      title: "مراجعة التحقق من الهوية",
      subtitle: "مراجعة والموافقة على طلبات التحقق من العملاء",
      submissionsReview: "مراجعة طلبات التحقق",
      reviewSubmission: "مراجعة طلب التحقق",
      companyName: "اسم الشركة",
      multipleSubmissions: "تم اكتشاف طلبات متعددة",
      multipleSubmissionsDesc: "لدى هذا المستخدم {count} طلب إجمالي",
      previousRejected: "تم رفض الطلبات السابقة",
      previousApproved: "تمت الموافقة على الطلبات السابقة",
      reviewingLatest: "أنت تراجع أحدث طلب",
      companyTab: "الشركة",
      taxTab: "الضريبة",
      addressTab: "العنوان",
      signatoryTab: "المفوض بالتوقيع",
      creditTab: "الائتمان",
      legalName: "الاسم القانوني",
      crNumber: "رقم السجل التجاري",
      crIssuingDate: "تاريخ إصدار السجل التجاري",
      crValidity: "صلاحية السجل التجاري",
      vatNumber: "الرقم الضريبي",
      city: "المدينة",
      area: "المنطقة",
      postalCode: "الرمز البريدي",
      buildingNumber: "رقم المبنى",
      businessAddress: "عنوان العمل",
      signatoryName: "الاسم",
      signatoryDesignation: "المنصب",
      signatoryEmail: "البريد الإلكتروني",
      signatoryPhone: "الهاتف",
      creditCeiling: "سقف الائتمان",
      paymentPeriod: "فترة السداد",
      days: "يوم",
      viewDocument: "عرض",
      downloadDocument: "تحميل",
      viewCRDocument: "عرض وثيقة السجل التجاري",
      viewVATDocument: "عرض وثيقة الضريبة",
      viewAddressDocument: "عرض وثيقة العنوان",
      documentAvailable: "متوفر",
      documentMissing: "مفقود",
      documentChecking: "جاري التحقق...",
      warning: "تحذير",
      warningCRMissing: "ملف السجل التجاري مفقود من التخزين",
      warningVATMissing: "ملف شهادة الضريبة مفقود من التخزين",
      warningAddressMissing: "ملف إثبات العنوان مفقود من التخزين",
      warningStorageNote: "المسار موجود في قاعدة البيانات ولكن قد يكون الملف محذوفًا أو فشل التحميل",
      reviewNotes: "ملاحظات المراجعة",
      reviewNotesPlaceholder: "ملاحظات المراجعة (مطلوبة للرفض)",
      approveKYC: "الموافقة على التحقق",
      rejectKYC: "رفض التحقق",
      approveSuccess: "تمت الموافقة على التحقق",
      approveSuccessDesc: "تمت الموافقة على التحقق بنجاح!",
      rejectSuccess: "تم رفض التحقق",
      rejectSuccessDesc: "تم رفض طلب التحقق",
      approveError: "فشلت الموافقة",
      approveErrorDesc: "فشل في الموافقة على طلب التحقق",
      rejectError: "فشل الرفض",
      rejectErrorDesc: "فشل في رفض طلب التحقق. يرجى المحاولة مرة أخرى",
      reviewNotesRequired: "خطأ",
      reviewNotesRequiredDesc: "يرجى تقديم سبب الرفض",
      fetchError: "خطأ",
      fetchErrorDesc: "فشل في جلب طلبات التحقق",
      downloadSuccess: "نجح",
      downloadSuccessDesc: "بدأ تحميل الوثيقة",
      downloadError: "خطأ",
      downloadErrorDesc: "فشل في تحميل الوثيقة",
      viewError: "خطأ",
      viewErrorDesc: "فشل في عرض الوثيقة",
      noSubmissions: "لا توجد طلبات",
      noSubmissionsDesc: "لا توجد طلبات تحقق معلقة في الوقت الحالي",
      submittedAt: "تم التقديم في",
      accountType: "نوع الحساب",
      actions: "الإجراءات",
      review: "مراجعة",
      creditAccount: "حساب ائتماني",
      creditAccountCreated: "تم إنشاء حساب ائتماني للعميل المعتمد",
      signatoryDocument: "وثيقة المفوض بالتوقيع"
    },
    
    // KYV Review (Vendor Verification)
    kyv: {
      title: "التحقق من الموردين (KYV)",
      subtitle: "أكمل ملف الموّرد الخاص بك لبدء تلقي الفرص",
      basicInfo: {
        title: "معلومات العمل الإضافية",
        description: "قدم تفاصيل إضافية عن عملك",
        tradeName: "الاسم التجاري",
        tradeNameDescription: "الاسم الذي تمارس به العمل",
        numberOfEmployees: "عدد الموظفين",
        selectCompanySize: "اختر حجم الشركة",
        zakatCertificate: "شهادة الزكاة",
        zakatDescription: "قم بتحميل شهادة هيئة الزكاة والضريبة والجمارك",
        chamberCertificate: "شهادة الغرفة التجارية",
        chamberDescription: "قم بتحميل شهادة عضوية الغرفة التجارية",
        companyLogo: "شعار الشركة",
        logoDescription: "قم بتحميل شعار شركتك الرسمي"
      },
      banking: {
        title: "التفاصيل المصرفية",
        description: "قدم معلوماتك المصرفية لمعالجة الدفع",
        bankName: "اسم البنك",
        selectBank: "اختر البنك",
        accountHolderName: "اسم صاحب الحساب",
        accountHolderDescription: "كما هو موضح في سجلات البنك",
        ibanNumber: "رقم الآيبان",
        ibanPlaceholder: "SA0000000000000000000000",
        ibanDescription: "أدخل رقم الآيبان المكون من 24 حرفًا يبدأ بـ SA",
        bankBranch: "فرع البنك",
        bankBranchDescription: "اسم أو رمز الفرع",
        confirmationLetter: "خطاب تأكيد البنك",
        confirmationDescription: "قم بتحميل خطاب رسمي من البنك يؤكد تفاصيل الحساب"
      },
      products: {
        title: "تفاصيل المنتجات والخدمات",
        description: "أخبرنا عن منتجاتك وخدماتك وشروط عملك",
        catalog: "كتالوج المنتجات",
        catalogDescription: "قم بتحميل كتالوج المنتجات أو الخدمات الكامل",
        priceList: "قائمة الأسعار",
        priceListDescription: "قم بتحميل قائمة الأسعار الحالية لجميع المنتجات/الخدمات",
        minimumOrderValue: "الحد الأدنى لقيمة الطلب (ريال)",
        deliverySLA: "مدة التسليم (أيام)",
        deliverySLAPlaceholder: "مثال: 7",
        paymentTerms: "شروط الدفع",
        selectPaymentTerms: "اختر شروط الدفع",
        cash: "نقدًا عند التسليم",
        net30: "صافي 30 يومًا",
        net60: "صافي 60 يومًا",
        net90: "صافي 90 يومًا",
        consignment: "أمانة"
      },
      compliance: {
        title: "الامتثال والشهادات",
        description: "قم بتحميل شهادات الجودة والسلامة والتنظيمية",
        qualityCertificates: "شهادات الجودة (ISO/SASO/GSO)",
        qualityDescription: "قم بتحميل شهادات ISO 9001 أو SASO أو GSO أو شهادات الجودة الأخرى",
        safetyCertificates: "شهادات سلامة المنتج / الحلال",
        safetyDescription: "قم بتحميل شهادات سلامة المنتج أو شهادات الحلال أو مستندات الامتثال",
        insuranceLicenses: "التأمين / GOSI / الرخصة البلدية",
        insuranceDescription: "قم بتحميل تأمين الأعمال أو تسجيل GOSI أو الرخصة البلدية أو تصاريح التجارة"
      },
      declaration: {
        title: "إقرار الموّرد",
        description: "أكد دقة جميع المعلومات المقدمة",
        statement: "بيان الإقرار",
        statementText: "أنا، الموقع أدناه، أؤكد أن جميع المعلومات المقدمة في نموذج التحقق من الموّرد هذا صحيحة وكاملة ودقيقة على حد علمي. أفهم أن:",
        point1: "تقديم معلومات كاذبة أو مضللة قد يؤدي إلى الاستبعاد الفوري من برنامج الموردين",
        point2: "تحتفظ NGS بالحق في التحقق من جميع المعلومات والمستندات المقدمة",
        point3: "يجب إبلاغ أي تغييرات في المعلومات المقدمة على الفور",
        point4: "القبول كمورّد يخضع لموافقة NGS والامتثال المستمر",
        signature: "التوقيع المعتمد",
        signatureDescription: "قم بتحميل مستند يحمل توقيع المفوض بالتوقيع",
        companyStamp: "ختم الشركة",
        stampDescription: "قم بتحميل صورة واضحة لختم شركتك الرسمي",
        accept: "أقر بموجب هذا أن: جميع المعلومات المقدمة في هذا النموذج صحيحة ودقيقة. أقبل الشروط والأحكام الموضحة أعلاه وأفوض NGS بالتحقق من المعلومات المقدمة."
      },
      steps: {
        basicInfo: "المعلومات الأساسية",
        banking: "التفاصيل المصرفية",
        products: "المنتجات والخدمات",
        compliance: "الامتثال",
        declaration: "الإقرار",
        complete: "إكمال"
      },
      progress: {
        step: "الخطوة",
        of: "من"
      },
      buttons: {
        back: "رجوع",
        next: "التالي",
        submit: "إرسال التحقق",
        submitting: "جاري الإرسال...",
        goToDashboard: "الذهاب إلى لوحة التحكم"
      },
      success: {
        title: "تم إرسال التحقق من الموّرد!",
        description: "تم إرسال التحقق من الموّرد بنجاح",
        message: "سيقوم فريقنا بمراجعة طلبك والرد عليك خلال 3-5 أيام عمل. ستتلقى إشعارًا عبر البريد الإلكتروني بمجرد تحديث حالة التحقق."
      },
      validation: {
        incomplete: "معلومات غير مكتملة",
        incompleteDescription: "يرجى ملء جميع الحقول المطلوبة قبل المتابعة",
        cannotSubmit: "لا يمكن الإرسال",
        completeRequired: "يرجى إكمال جميع الحقول المطلوبة"
      },
      fileUpload: {
        uploaded: "تم تحميل الملف",
        uploadedDescription: "تم تحميل {fileName} بنجاح",
        failed: "فشل التحميل",
        failedDescription: "فشل تحميل الملف. يرجى المحاولة مرة أخرى."
      }
    },
    
    // إدارة الفئات (المرحلة 2)
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
      addCategory: "إضافة فئة",
      editCategory: "تعديل الفئة",
      deleteCategory: "حذف الفئة",
      bulkActions: "إجراءات مجمعة",
      exportCategories: "تصدير",
      searchPlaceholder: "البحث عن فئات...",
      statusFilter: "الحالة",
      allStatuses: "الكل",
      activeOnly: "النشطة فقط",
      inactiveOnly: "غير النشطة فقط",
      viewMode: "وضع العرض",
      treeView: "عرض شجري",
      tableView: "عرض جدول",
      expandAll: "توسيع الكل",
      collapseAll: "طي الكل",
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
      csvHeaders: {
        id: "المعرف",
        englishName: "الاسم بالإنجليزية",
        arabicName: "الاسم بالعربية",
        slug: "الرابط",
        status: "الحالة",
        level: "المستوى"
      },
      categoriesTable: "جدول الفئات",
      comprehensiveView: "عرض جدول شامل لجميع الفئات",
      total: "الإجمالي",
      categoryHierarchy: "تسلسل الفئات",
      arabicName: "الاسم بالعربية",
      slug: "الرابط",
      type: "النوع",
      status: "الحالة",
      actions: "الإجراءات",
      accessDenied: "الوصول مرفوض",
      needAdminPrivileges: "تحتاج صلاحيات مدير لإدارة الفئات",
      needAdminPrivilegesDelete: "تحتاج صلاحيات مدير لحذف الفئات",
      needAdminPrivilegesEdit: "تحتاج صلاحيات مدير لتعديل الفئات"
    },
    
    // حملات البريد الإلكتروني (المرحلة 4)
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
      totalCampaigns: "إجمالي الحملات",
      allTime: "كل الأوقات",
      sentThisMonth: "المرسل هذا الشهر",
      monthlyGrowth: "+12.5٪ عن الشهر الماضي",
      openRate: "معدل الفتح",
      average: "المتوسط",
      clickRate: "معدل النقر",
      campaignCreatedSuccess: "تم إنشاء الحملة بنجاح",
      campaignCreateFailed: "فشل إنشاء الحملة",
      templateCreatedSuccess: "تم إنشاء القالب بنجاح",
      templateCreateFailed: "فشل إنشاء القالب",
      campaignSentSuccess: "تم إرسال الحملة بنجاح",
      campaignSendFailed: "فشل إرسال الحملة",
      noCampaignsYet: "لا توجد حملات بعد",
      createFirstCampaign: "أنشئ حملتك الأولى للبدء"
    },
    
    // الإشعارات الفورية (المرحلة 4)
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
      registeredDevices: "الأجهزة المسجلة",
      successfullyDelivered: "تم التسليم بنجاح",
      userEngagement: "تفاعل المستخدم",
      platformDistribution: "توزيع المنصات",
      activeDevicesByPlatform: "الأجهزة النشطة حسب المنصة",
      success: "نجاح",
      error: "خطأ",
      createSuccess: "تم إنشاء الإشعار الفوري بنجاح",
      createError: "فشل إنشاء الإشعار الفوري",
      settingsUpdated: "تم تحديث الإعدادات بنجاح",
      settingsError: "فشل تحديث الإعدادات"
    },
    
    // Header
    header: {
      openMobileMenu: "فتح القائمة المحمولة",
      collapseSidebar: "طي الشريط الجانبي",
      expandSidebar: "توسيع الشريط الجانبي",
      goToAdminDashboard: "الانتقال إلى لوحة المدير",
      logoAlt: "شعار MWRD",
      managementPortal: "بوابة الإدارة",
      viewNotifications: "عرض الإشعارات"
    },
    
    // Search
    search: "بحث",
    searchPlaceholder: "البحث في لوحة الإدارة...",
    searchAdvancedPlaceholder: "البحث في المستخدمين والطلبات والعروض...",
    searchResults: "نتائج البحث",
    noSearchResults: "لم يتم العثور على نتائج بحث",
    tryDifferentSearch: "جرب مصطلح بحث مختلف",
    searchFailed: "فشل البحث",
    searchingFor: "البحث عن",
    recentSearches: "عمليات البحث الأخيرة",
    tryAgain: "حاول مرة أخرى",
    
    // Navigation
    navigation: {
      dashboard: "لوحة التحكم",
      analytics: "التحليلات",
      performanceMonitor: "مراقب الأداء",
      users: "إدارة المستخدمين",
      requests: "إدارة الطلبات",
      offers: "إدارة العروض",
      orders: "إدارة الطلبيات",
      messages: "الرسائل",
      notifications: "الإشعارات",
      emailCampaigns: "حملات البريد الإلكتروني",
      expertConsultations: "الاستشارات الخبيرة",
      security: "مركز الأمان",
      systemHealth: "صحة النظام",
      settings: "الإعدادات",
      support: "الدعم",
      projects: "المشاريع",
      categoryManagement: "إدارة الفئات",
      kycReview: "مراجعة التحقق من الهوية",
      verificationQueue: "قائمة انتظار التحقق",
      automation: "الأتمتة"
    },
    
    // Sidebar
    navigateTo: "انتقل إلى",
    badgeMax: "99+",
    
    // System Health
    systemHealth: {
      title: "مراقبة صحة النظام والجودة",
      description: "مراقبة الأداء في الوقت الفعلي، والاختبار الآلي، وأدوات ضمان الجودة",
      performanceTab: "الأداء",
      testingTab: "مجموعة الاختبار",
      qualityTab: "فحوصات الجودة"
    },
    
    financialTransactionsTitle: "المعاملات المالية",
    financialTransactionsDesc: "مراقبة وإدارة جميع المعاملات المالية للمنصة",
    communicationCenter: "مركز الاتصالات",
    communicationCenterDescription: "إدارة الإشعارات والرسائل والاتصالات",
    
    projectsManagement: {
      title: "إدارة المشاريع",
      description: "مراقبة وإدارة جميع مشاريع البناء",
      overview: {
        totalProjects: "إجمالي المشاريع",
        activeProjects: "نشط",
        completed: "مكتمل",
        projectsDelivered: "تم تسليمها بنجاح",
        overdue: "متأخر",
        requireAttention: "تتطلب انتباه",
        totalValue: "القيمة الإجمالية",
        combinedProjectValue: "قيمة المشروع المجمعة"
      },
      filters: {
        title: "الفلاتر",
        searchPlaceholder: "البحث في المشاريع...",
        status: "الحالة",
        allStatuses: "جميع الحالات",
        priority: "الأولوية",
        allPriorities: "جميع الأولويات",
        refresh: "تحديث"
      },
      status: {
        draft: "مسودة",
        active: "نشط",
        completed: "مكتمل",
        onHold: "معلق",
        cancelled: "ملغى"
      },
      priority: {
        urgent: "عاجل",
        high: "عالي",
        medium: "متوسط",
        low: "منخفض"
      },
      messages: {
        loading: "جار تحميل المشاريع...",
        noProjectsFound: "لم يتم العثور على مشاريع",
        updateSuccess: "نجح",
        statusUpdated: "تم تحديث حالة المشروع إلى",
        updateError: "خطأ",
        fetchError: "فشل في جلب المشاريع"
      },
      details: {
        noDescription: "لا يوجد وصف متاح",
        client: "العميل",
        projectProgress: "تقدم المشروع",
        budget: "الميزانية",
        boqItems: "بنود جدول الكميات",
        items: "بنود",
        timeline: "الجدول الزمني",
        notSpecified: "غير محدد",
        requests: "الطلبات",
        relatedRequests: "طلبات ذات صلة"
      },
      actions: {
        viewDetails: "عرض التفاصيل",
        viewBOQ: "عرض جدول الكميات",
        contactClient: "الاتصال بالعميل",
        putOnHold: "تعليق",
        markComplete: "تحديد كمكتمل",
        resumeProject: "استئناف المشروع"
      }
    },
    
    // Language settings
    languageEnglish: "الإنجليزية (English)",
    languageArabic: "العربية"
  },

  // Navigation Links  
  navigation: {
    userManagement: "إدارة المستخدمين",
    userManagementDescription: "إدارة حسابات المستخدمين والصلاحيات",
    approvalQueue: "قائمة انتظار الموافقات", 
    approvalQueueDescription: "مراجعة الطلبات والتحققات المعلقة",
    financialOverview: "النظرة المالية العامة",
    financialOverviewDescription: "مراقبة المعاملات والإيرادات",
    systemHealth: "حالة النظام",
    systemHealthDescription: "مراقبة أداء الخادم وحالة النظام",
    securityCenter: "مركز الأمان", 
    securityCenterDescription: "إدارة إعدادات الأمان وسجلات التدقيق", 
    communications: "الاتصالات",
    communicationsDescription: "إرسال البث وإدارة الإشعارات",
    analytics: "التحليلات",
    analyticsDescription: "عرض مقاييس المنصة ورؤى المستخدمين", 
    automation: "الأتمتة",
    automationDescription: "تكوين تدفقات العمل المؤتمتة والقواعد"
  },

  // Forms
  forms: {
    title: "العنوان",
    titleRequired: "العنوان *",
    description: "الوصف",
    descriptionRequired: "الوصف *",
    category: "الفئة",
    categoryRequired: "الفئة *",
    minimumBudget: "الحد الأدنى للميزانية",
    maximumBudget: "الحد الأقصى للميزانية",
    city: "المدينة",
    nationalAddress: "العنوان الوطني أو العنوان المختصر",
    deadline: "الموعد النهائي",
    urgency: "الأولوية",
    urgencyLow: "منخفضة",
    urgencyMedium: "متوسطة",
    urgencyHigh: "عالية",
    urgencyUrgent: "عاجلة",
    createRequest: "إنشاء طلب",
    creating: "جاري الإنشاء...",
    createNewRequest: "إنشاء طلب جديد",
    validationError: "خطأ في التحقق",
    fillRequiredFields: "يرجى ملء جميع الحقول المطلوبة",
    requestCreated: "تم إنشاء الطلب بنجاح!",
    requestCreateError: "فشل في إنشاء الطلب. يرجى المحاولة مرة أخرى."
  },

  // Authentication
  auth: {
    welcomeTitle: "مرحباً بك في MWRD",
    welcomeSubtitle: "سجل الدخول إلى حسابك أو أنشئ حساب جديد",
    login: "تسجيل الدخول",
    register: "التسجيل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم الكامل",
    companyName: "اسم الشركة",
    accountType: "نوع الحساب",
    clientType: "عميل (طلب خدمات)",
    vendorType: "مورد (تقديم خدمات)",
    signIn: "تسجيل الدخول",
    signingIn: "جاري تسجيل الدخول...",
    createAccount: "إنشاء حساب",
    creatingAccount: "جاري إنشاء الحساب...",
    forgotPassword: "نسيت كلمة المرور؟",
    accountCreated: "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني للتحقق.",
    accountCreatedClient: "تم إنشاء الحساب! يرجى رفع سجلك التجاري لإكمال التحقق.",
    completeRegistration: "أكمل تسجيلك",
    uploadCRPrompt: "ارفع سجلك التجاري لتفعيل حسابك",
    accountCreatedFor: "تم إنشاء حسابك لـ",
    uploadCRComplete: "يرجى رفع سجلك التجاري لإكمال عملية التحقق.",
    documentUploaded: "تم رفع الوثيقة بنجاح! سيتم مراجعة حسابك خلال 24-48 ساعة.",
    back: "رجوع",
    completeRegistrationButton: "إكمال التسجيل",
    registrationComplete: "اكتمل التسجيل! يمكنك الآن تسجيل الدخول. سيتم تفعيل حسابك بعد التحقق من الوثائق.",
    clientCRNotice: "كعميل، ستحتاج إلى رفع سجلك التجاري للتحقق من الحساب بعد التسجيل.",
    createAdminUser: "إنشاء مستخدم مدير (مؤقت)",
    resetPassword: {
      mismatch: "كلمات المرور غير متطابقة",
      mismatchDesc: "يرجى إعادة إدخال كلمات مرور متطابقة.",
      updated: "تم تحديث كلمة المرور",
      updatedDesc: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.",
      failed: "فشل إعادة التعيين"
    },
    placeholders: {
      email: "أدخل بريدك الإلكتروني",
      password: "أدخل كلمة المرور",
      fullName: "أدخل اسمك الكامل",
      companyName: "أدخل اسم شركتك",
      confirmPassword: "تأكيد كلمة المرور"
    },
    selectRole: "اختر دورك",
    secureLogin: "تسجيل دخول آمن"
  },

  // Email templates
  email: {
    offer: {
      subject: "عرض جديد تم استلامه",
      body: "لقد تلقيت عرضًا جديدًا لطلبك!"
    },
    request: {
      subject: "تحديث حالة الطلب",
      statusChanged: "تم تحديث حالة طلب المشتريات الخاص بك"
    },
    offerStatus: {
      subject: "تحديث حالة العرض",
      body: "هناك تحديث على حالة عرضك"
    }
  },

  // KYC Form
  kyc: {
    placeholders: {
      vatNumber: "300000000000003",
      phone: "+966 5X XXX XXXX",
      serviceCategories: "قائمة فئات الخدمات التي تهتم بها (مفصولة بفاصلة)",
      organizationType: "اختر النوع",
      natureOfBusiness: "مثال: تجارة، تصنيع، خدمات",
      designation: "مثال: الرئيس التنفيذي، المدير العام"
    },
    errors: {
      invalidFileType: "نوع ملف غير صالح",
      pdfOnly: "يُسمح فقط بملفات PDF للوثائق الرسمية",
      companyNameRequired: "اسم الشركة القانوني مطلوب",
      crNumberRequired: "رقم السجل التجاري مطلوب",
      crIssuingDateRequired: "تاريخ إصدار السجل التجاري مطلوب",
      crIssuingCityRequired: "مدينة إصدار السجل التجاري مطلوبة",
      crValidityDateRequired: "تاريخ صلاحية السجل التجاري مطلوب",
      crDocumentRequired: "يجب تحميل شهادة السجل التجاري",
      vatNumberRequired: "يجب أن يكون الرقم الضريبي 15 رقمًا بالضبط",
      vatCertificateRequired: "يجب تحميل شهادة ضريبة القيمة المضافة",
      addressRequired: "جميع حقول العنوان مطلوبة",
      addressCertificateRequired: "يجب تحميل شهادة العنوان الوطني",
      signatoryRequired: "جميع معلومات المفوض بالتوقيع مطلوبة",
      validationFailed: "يرجى إكمال جميع الحقول المطلوبة قبل المتابعة"
    },
    success: {
      title: "نجح",
      description: "تم إرسال طلب التحقق من الهوية! ستتم مراجعة مستنداتك خلال 24-48 ساعة."
    },
    submitting: "جاري إرسال طلب التحقق...",
    uploadError: "فشل تحميل المستند"
  },

  // KYV Form
  kyv: {
    fileUploaded: "تم تحميل الملف",
    fileUploadedDesc: "تم تحميل {fileName} بنجاح",
    uploadFailed: "فشل التحميل",
    uploadFailedDesc: "فشل تحميل الملف. يرجى المحاولة مرة أخرى.",
    submitting: "جاري إرسال التحقق...",
    success: "تم إرسال التحقق بنجاح!",
    successDesc: "سيتم مراجعة طلبك خلال 3-5 أيام عمل.",
    validationFailed: "لا يمكن الإرسال",
    completeRequired: "يرجى إكمال جميع الحقول المطلوبة"
  },

  // Common translations
  common: {
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    create: 'إنشاء',
    update: 'تحديث',
    loading: 'جاري التحميل...',
    notFound: 'غير موجود',
    refresh: 'تحديث',
    export: 'تصدير',
    view: 'عرض',
    search: 'بحث',
    filter: 'تصفية',
    clear: 'مسح',
    submit: 'إرسال',
    close: 'إغلاق',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    continue: 'متابعة',
    finish: 'إنهاء',
    done: 'تم',
    success: 'نجح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات',
    yes: 'نعم',
    no: 'لا',
    ok: 'موافق',
    retry: 'إعادة المحاولة',
    skip: 'تخطي',
    all: 'الكل',
    none: 'لا شيء',
    active: 'نشط',
    inactive: 'غير نشط',
    enabled: 'مفعل',
    disabled: 'معطل',
    online: 'متصل',
    offline: 'غير متصل',
    pending: 'معلق',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    completed: 'مكتمل',
    inProgress: 'قيد التنفيذ',
    draft: 'مسودة',
    published: 'منشور',
    total: 'الإجمالي',
    status: 'الحالة',
    actions: 'الإجراءات',
    details: 'التفاصيل',
    description: 'الوصف',
    date: 'التاريخ',
    time: 'الوقت',
    name: 'الاسم',
    title: 'العنوان',
    type: 'النوع',
    category: 'الفئة',
    priority: 'الأولوية',
    amount: 'المبلغ',
    price: 'السعر',
    quantity: 'الكمية',
    download: 'تحميل',
    upload: 'رفع',
    today: 'اليوم',
    yesterday: 'أمس',
    tomorrow: 'غدا',
    thisWeek: 'هذا الأسبوع',
    lastWeek: 'الأسبوع الماضي',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    thisYear: 'هذا العام',
    lastYear: 'العام الماضي',
    noData: 'لا توجد بيانات متاحة',
    backToTop: 'العودة للأعلى',
    toggleSidebar: 'تبديل الشريط الجانبي',
    exporting: 'جاري التصدير...',
    sort: 'ترتيب',
    social: {
      twitter: 'تويتر',
      linkedin: 'لينكد إن',
      facebook: 'فيسبوك',
      instagram: 'إنستغرام'
    },
    errors: {
      networkConnection: 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصال الإنترنت.',
      requestTimeout: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
      requestTimeoutDescription: 'استغرق الخادم وقتًا طويلاً للاستجابة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
      dataLoading: 'فشل في تحميل البيانات. يرجى تحديث الصفحة.',
      dataLoadingError: 'خطأ في تحميل البيانات',
      connectionError: 'خطأ في الاتصال',
      connectionErrorDescription: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.',
      accessDenied: 'تم رفض الوصول',
      accessDeniedDescription: 'ليس لديك إذن للوصول إلى هذا المورد.',
      accessDeniedDesc: 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم الخاصة بك.',
      dataFormatError: 'خطأ في تنسيق البيانات',
      dataFormatErrorDescription: 'أرجع الخادم بيانات غير صالحة. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.',
      unexpectedError: 'حدث خطأ غير متوقع أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
      loadFailed: 'فشل تحميل البيانات',
      retryAttempts: 'محاولات إعادة المحاولة',
      retryingAttempt: 'إعادة المحاولة... (المحاولة {count})',
      maxRetriesReached: 'تم الوصول إلى الحد الأقصى للمحاولات',
      unauthorized: 'غير مخول للقيام بهذا الإجراء.',
      forbidden: 'الوصول محظور. يرجى الاتصال بالمسؤول.',
      notFound: 'المورد المطلوب غير موجود.',
      serverError: 'خطأ في الخادم. يرجى المحاولة لاحقاً.',
      validationFailed: 'يرجى التحقق من المدخلات والمحاولة مرة أخرى.',
      unexpected: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
    },
    auth: {
      signInPrompt: 'تسجيل الدخول'
    },
    tryAgain: 'حاول مرة أخرى',
    refreshPage: 'تحديث الصفحة',

  // سير عمل الموافقة
  approval: {
    submitForApproval: 'إرسال للموافقة',
    submitForInternalApproval: 'إرسال للموافقة الداخلية',
    description: 'سيتم إرسال هذا الطلب إلى مدير في مؤسستك للمراجعة قبل نشره في السوق.',
    whatHappensNext: 'ما سيحدث بعد ذلك:',
    adminWillBeNotified: '• سيتم إخطار مدير في مؤسستك',
    adminWillReview: '• سيقوم بمراجعة الطلب والموافقة عليه أو رفضه أو طلب تغييرات',
    autoPostedAfterApproval: '• بعد الموافقة، سيتم نشر الطلب تلقائياً في السوق',
    youWillBeNotified: '• ستتلقى إشعاراً بالقرار',
    tip: 'نصيحة: تأكد من أن جميع تفاصيل طلبك كاملة ودقيقة قبل الإرسال للموافقة.',
    submitting: 'جاري الإرسال...',
    cancel: 'إلغاء',
    submitted: 'تم الإرسال للموافقة',
    approved: 'تمت الموافقة',
    rejected: 'تم الرفض',
    rejectionReasonRequired: 'يرجى تقديم سبب الرفض',
    changeDetailsRequired: 'يرجى تقديم التغييرات المطلوبة',
    changesRequested: 'تم طلب التغييرات'
  },

  // إدارة الإنفاق
  spendManagement: {
    failedToLoadData: 'فشل تحميل بيانات الإنفاق',
    failedToSaveBudget: 'فشل حفظ إعدادات الميزانية',
    budgetSavedSuccessfully: 'تم حفظ إعدادات الميزانية',
    reportExported: 'تم تصدير التقرير'
  },

    placeholders: {
      searchLogs: 'البحث في السجلات...',
      filterByAction: 'تصفية حسب الإجراء...',
      addNotes: 'إضافة ملاحظات...',
      enterText: 'أدخل النص...',
      selectOption: 'اختر خيار...',
      chooseFile: 'اختر ملف...',
      searchUsers: 'البحث في المستخدمين...',
      searchRequests: 'البحث في الطلبات...',
      searchOffers: 'البحث في العروض...',
      email: 'أدخل عنوان بريدك الإلكتروني',
      password: 'أدخل كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      firstName: 'أدخل اسمك الأول',
      lastName: 'أدخل اسم العائلة',
      companyName: 'أدخل اسم الشركة',
      fullName: 'أدخل اسمك الكامل',
      requestTitle: 'أدخل عنوان الطلب',
      requestDescription: 'وصف تفصيلي لما تحتاجه',
      selectCategory: 'اختر الفئة',
      selectCity: 'اختر المدينة',
      nationalAddress: 'أدخل العنوان الوطني أو عنوان التسليم المختصر',
      pickDate: 'اختر تاريخ',
      enterEmail: 'أدخل بريدك الإلكتروني',
      enterPassword: 'أدخل كلمة المرور',
      enterFullName: 'أدخل اسمك الكامل',
      enterCompanyName: 'أدخل اسم الشركة',
      phoneNumber: 'أدخل رقم الهاتف',
      address: 'أدخل العنوان',
      website: 'أدخل رابط الموقع الإلكتروني',
      description: 'أدخل الوصف...',
      search: 'بحث...',
      searchPlaceholder: 'البحث...',
      notes: 'أضف ملاحظاتك هنا...'
    },
    titles: {
      adminOnline: 'المدير متصل'
    },
    // Additional labels and terms
    vipClient: 'عميل مميز',
    activeClient: 'عميل نشط',
    prospect: 'عميل محتمل',
    totalRevenue: 'إجمالي الإيرادات',
    avgOrderValue: 'متوسط قيمة الطلب',
    orders: 'الطلبات',
    revenue: 'الإيرادات',
    lastContact: 'آخر اتصال',
    contact: 'تواصل',
    now: 'الآن',
    minutesAgo: 'دقائق مضت',
    hoursAgo: 'ساعات مضت',
    daysAgo: 'أيام مضت',
    unknown: 'غير معروف',
    company: 'الشركة',
    fromAllClients: "من جميع العملاء",
    perOrderAverage: "متوسط كل طلب",
    clientDirectory: "دليل العملاء",
    clientOverview: "نظرة شاملة على علاقات عملائك",
    failedToLoad: "فشل في تحميل البيانات",
    failedToDelete: "فشل في حذف العنصر",
    unableToLoadDetails: "تعذر تحميل تفاصيل الطلب. يرجى المحاولة مرة أخرى.",
    failedToComplete: "فشل في إكمال الإعداد. يرجى المحاولة مرة أخرى.",
    failedToSave: "فشل في حفظ المشروع",
    verified: "موثق",
    completing: "جاري الإكمال...",
    completeOnboarding: "إكمال الإعداد",
    good: "جيد",
    needsWork: "يحتاج عمل",
    vsLastMonth: "مقارنة بالشهر الماضي",
    errorLoadingDashboard: 'خطأ في تحميل لوحة التحكم',
    failedToUpdate: 'فشل في تحديث معلومات السجل التجاري',
    failedToUpload: 'فشل في رفع الوثيقة',
    failedToSubmit: 'فشل في تقديم طلب التحقق',
    failedToFetch: 'فشل في جلب بيانات العملاء',
    accessDenied: 'الوصول مرفوض',
    selectAll: 'تحديد الكل',
    deselectAll: 'إلغاء تحديد الكل',
    categories: {
      construction: "البناء",
      engineering: "الهندسة",
      technology: "التكنولوجيا",
      marketing: "التسويق"
    },
    verification: {
      title: 'حالة التحقق',
      description: 'تتبع تقدم التحقق من وثائقك',
      accountStatus: 'حالة الحساب',
      documentSubmissions: 'الوثائق المرسلة',
      nextSteps: 'الخطوات التالية',
      adminNotes: 'ملاحظات الإدارة',
      reviewNotes: 'ملاحظات المراجعة',
      refresh: 'تحديث الحالة',
      viewDocument: 'عرض الوثيقة',
      downloadDocument: 'تحميل الوثيقة',
      verificationPending: 'التحقق معلق',
      verificationApproved: 'تم الاعتماد',
      verificationRejected: 'مرفوض التحقق',
      reviewInProgress: 'المراجعة قيد التنفيذ (24-48 ساعة)',
      noDocumentsSubmitted: 'لم يتم تقديم أي وثائق بعد. يرجى رفع سجلك التجاري لبدء عملية التحقق.',
      beginVerification: 'ارفع وثيقة سجلك التجاري لبدء عملية التحقق.',
      reviewFeedback: 'يرجى مراجعة التعليقات أعلاه ورفع وثيقة سجل تجاري جديدة.',
      documentsBeingReviewed: 'وثائقك قيد المراجعة. سيتم إشعارك بمجرد اكتمال المراجعة.',
      approved: 'معتمد',
      underReview: 'تحت المراجعة',
      pending: 'معلق',
      rejected: 'مرفوض',
      submitted: 'مقدم',
      reviewed: 'مراجع',
      uploadCR: 'رفع السجل التجاري',
      uploadCRDescription: 'يرجى رفع وثيقة سجلك التجاري للتحقق',
      selectFile: 'اختر ملف',
      uploading: 'جاري الرفع...',
      upload: 'رفع',
      retry: 'إعادة المحاولة',
      fileSelected: 'تم اختيار الملف',
      supportedFormats: 'الصيغ المدعومة: PDF، JPG، PNG (حد أقصى 5 ميجابايت)',
      uploadSuccess: 'تم رفع الوثيقة بنجاح',
      uploadError: 'فشل في رفع الوثيقة',
      verificationRequired: 'التحقق مطلوب',
      completeVerificationAlert: 'أكمل التحقق من حسابك للوصول إلى جميع ميزات المنصة',
      failedToLoad: 'فشل في تحميل حالة التحقق',
      fileRequired: 'يرجى اختيار ملف أولاً',
      fileTooLarge: 'يجب أن يكون حجم الملف أقل من 5 ميجابايت',
      invalidFileType: 'نوع الملف غير صالح. يرجى رفع ملفات PDF أو JPG أو PNG فقط'
    }
  },

  // User management
  users: {
    fillRequiredFields: 'يرجى ملء جميع الحقول المطلوبة',
    userCreated: 'تم إنشاء المستخدم بنجاح',
    createUserError: 'فشل في إنشاء المستخدم',
    addUser: 'إضافة مستخدم',
    addUserDescription: 'إنشاء حساب مستخدم جديد',
    email: 'البريد الإلكتروني',
    users: 'المستخدمون',
    user: 'المستخدم',
    name: 'الاسم',
    role: 'الدور',
    status: 'الحالة',
    createdAt: 'تاريخ الإنشاء',
    lastLogin: 'آخر تسجيل دخول',
    permissions: 'الصلاحيات'
  },

  // User profile
  user: {
    fullName: 'الاسم الكامل',
    companyName: 'اسم الشركة',
    phoneNumber: 'رقم الهاتف',
    address: 'العنوان',
    bio: 'السيرة الذاتية',
    website: 'الموقع الإلكتروني',
    profilePicture: 'صورة الملف الشخصي',
    personalInfo: 'المعلومات الشخصية',
    contactInfo: 'معلومات الاتصال',
    businessInfo: 'معلومات الأعمال'
  },

  // Vendor Dashboard
  vendor: {
    navigation: {
      projectsManagement: 'إدارة المشاريع',
      portfolioManagement: 'إدارة المحفظة',
      dashboard: 'لوحة التحكم',
      support: 'الدعم',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      breadcrumbs: {
        home: 'الرئيسية',
        dashboard: 'لوحة التحكم',
        rfqs: 'طلبات عروض الأسعار',
        projects: 'المشاريع',
        portfolio: 'المحفظة',
        subscription: 'الاشتراك',
        transactions: 'المعاملات',
        notifications: 'الإشعارات',
        clients: 'العملاء',
        documents: 'الوثائق',
        reports: 'التقارير',
        messages: 'الرسائل',
        profile: 'الملف الشخصي',
        settings: 'الإعدادات',
        support: 'الدعم'
      }
    },
    dashboard: {
      title: 'لوحة تحكم المورد',
      subtitle: 'إدارة سجلك التجاري وعمليات عملك',
      welcome: 'أهلاً بك في لوحة التحكم',
      crStatus: 'حالة السجل التجاري',
      totalProjects: 'إجمالي المشاريع',
      activeProjects: 'المشاريع النشطة',
      completedProjects: 'المشاريع المكتملة',
      totalRevenue: 'إجمالي الإيرادات',
      monthlyRevenue: 'الإيرادات الشهرية',
      pendingPayments: 'المدفوعات المعلقة',
      recentActivity: 'النشاط الأخير',
      quickActions: 'الإجراءات السريعة',
      quickActionsDesc: 'وصول سريع إلى المهام الأكثر شيوعاً',
      viewAllProjects: 'عرض جميع المشاريع',
      createNewProject: 'إنشاء مشروع جديد',
      managePortfolio: 'إدارة المحفظة',
      updateProfile: 'تحديث الملف الشخصي',
      browseRFQs: 'تصفح طلبات التسعير',
      newRequests: '5 طلبات جديدة',
      submitOffer: 'تقديم عرض',
      createNewOffer: 'إنشاء عرض جديد',
      messages: 'الرسائل',
      unreadMessages: 'رسالتان غير مقروءتان',
      newRFQReceived: 'طلب تسعير جديد',
      constructionProject: 'مشروع إنشائي',
      hoursAgo: 'منذ ساعتين',
      offerSubmitted: 'تم تقديم العرض',
      officeRenovation: 'تجديد مكتب',
      profileUpdateRequired: 'مطلوب تحديث الملف الشخصي',
      dayAgo: 'منذ يوم واحد',
      crVerificationStatus: 'التحقق من السجل التجاري',
      crVerificationDesc: 'حالة السجل التجاري',
      profileCompletionTitle: 'اكتمال الملف الشخصي',
      profileCompletion: 'اكتمال الملف الشخصي',
      profileCompletionDesc: 'مدى اكتمال ملفك الشخصي',
      activeOffersCount: 'العروض النشطة',
      activeOffersCountDesc: 'العروض النشطة حالياً',
      successRateTitle: 'معدل النجاح',
      successRateDesc: 'معدل قبول العروض',
      totalEarningsTitle: 'إجمالي الأرباح',
      totalEarningsDesc: 'إجمالي الأرباح المحققة',
      monthlyRevenueTitle: 'الإيرادات الشهرية',
      monthlyRevenueDesc: 'إيرادات هذا الشهر',
      completedProjectsTitle: 'المشاريع المكتملة',
    completedProjectsDesc: 'المشاريع المنجزة بنجاح',
    clientRatingTitle: 'تقييم العملاء',
      clientRatingDesc: 'متوسط تقييم العملاء',
      accessRequired: 'الوصول إلى هذه الصفحة مقتصر على الموردين المعتمدين فقط',
      performanceOverview: 'نظرة عامة على الأداء',
      completeVerification: 'أكمل التحقق للوصول إلى جميع الميزات',
      actionRequired: 'الإجراءات المطلوبة',
      activeOffersTitle: 'العروض النشطة',
      activeOffersDesc: 'في انتظار الإجراء',
      allSetReady: 'كل شيء جاهز! أنت مستعد لتلقي الطلبات',
      browseRequestsTitle: 'تصفح الطلبات',
      browseRequestsDesc: 'اكتشف فرص جديدة',
      businessPerformance: 'أداء الأعمال',
      businessPerformanceDesc: 'تتبع مؤشرات الأداء الرئيسية',
      clientSatisfactionRate: 'رضا العملاء',
      completeCRTitle: 'إكمال التحقق من السجل التجاري',
      completeCRDesc: 'تحقق من سجلك التجاري',
      completeProfileTitle: 'أكمل ملفك الشخصي',
      completeProfileDesc: '% متبقية للإكمال',
      manageProjectsTitle: 'إدارة المشاريع',
      manageProjectsDesc: 'عرض وتحديث مشاريعك',
      messagesTitle: 'الرسائل',
      messagesDesc: 'تحقق من رسائلك',
      offerSuccessRate: 'معدل نجاح العروض',
      offerTrends: 'اتجاهات العروض',
      offerTrendsDesc: 'اتجاهات تقديم وقبول عروضك مع مرور الوقت',
      viewProjects: 'عرض المشاريع',
      viewAllOffers: 'عرض جميع العروض',
      responseRate: 'معدل الاستجابة',
      clientSatisfaction: 'رضا العملاء'
    },
    cr: {
      verificationRequired: 'التحقق من السجل التجاري مطلوب',
      completeVerification: 'أكمل التحقق من سجلك التجاري للوصول إلى جميع الميزات',
      approved: 'معتمد',
      pending: 'قيد المراجعة',
      rejected: 'مرفوض'
    },
    performance: {
      title: 'تتبع الأداء',
      subtitle: 'راقب وحسّن أداء عملك',
      overallScore: 'التقييم الإجمالي',
      performanceTrends: 'اتجاهات الأداء',
      performanceGoals: 'أهداف الأداء',
      performanceInsights: 'رؤى الأداء',
      trends: 'الاتجاهات',
      insights: 'الرؤى',
      goals: 'الأهداف',
      current: 'الحالي',
      target: 'المستهدف',
      complete: 'مكتمل',
      offerAcceptance: 'قبول العروض',
      responseTime: 'وقت الاستجابة',
      clientSatisfaction: 'رضا العملاء',
      projectCompletion: 'إتمام المشاريع',
      revenueGrowth: 'نمو الإيرادات',
      clientRetention: 'الاحتفاظ بالعملاء',
      strengths: 'نقاط القوة',
      strengthsDesc: 'المجالات التي تتفوق فيها',
      improvements: 'مجالات التحسين',
      improvementsDesc: 'مجالات التركيز للنمو',
      recommendations: 'التوصيات',
      recommendationsDesc: 'اقتراحات قابلة للتنفيذ لتحسين الأداء'
    },
    projects: {
      title: 'إدارة المشاريع',
      unifiedSubtitle: 'إدارة وتتبع محفظة مشاريعك',
      add: 'إضافة مشروع',
      addFirst: 'أضف مشروعك الأول',
      addNewProject: 'إضافة مشروع جديد',
      newProject: 'مشروع جديد',
      projectTitle: 'عنوان المشروع',
      description: 'الوصف',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ الانتهاء',
      status: 'الحالة',
      type: 'النوع',
      value: 'القيمة',
      location: 'الموقع',
      clientName: 'اسم العميل',
      clientType: 'نوع العميل',
      visibility: 'الظهور',
      portfolio: 'المحفظة',
      totalProjects: 'إجمالي المشاريع',
      activeProjects: 'المشاريع النشطة',
      completedProjects: 'المشاريع المكتملة',
      thisWeek: 'هذا الأسبوع',
      vsLastMonth: 'مقارنة بالشهر الماضي',
      searchAndFilter: 'البحث والتصفية',
      searchProjects: 'البحث في المشاريع...',
      allStatus: 'جميع الحالات',
      allPriority: 'جميع الأولويات',
      active: 'نشط',
      completed: 'مكتمل',
      pending: 'قيد الانتظار',
      ongoing: 'جاري التنفيذ',
      draft: 'مسودة',
      cancelled: 'ملغي',
      urgent: 'عاجل',
      high: 'مرتفع',
      medium: 'متوسط',
      low: 'منخفض',
      public: 'عام',
      private: 'خاص',
      confidential: 'سري',
      featured: 'مميز',
      government: 'حكومي',
      privateCompany: 'شركة خاصة',
      commercial: 'تجاري',
      individual: 'فردي',
      edit: 'تعديل',
      delete: 'حذف',
      noProjects: 'لم يتم العثور على مشاريع',
      noProjectsFound: 'لا توجد مشاريع مطابقة لمعايير التصفية',
      showingResults: 'عرض {count} نتيجة',
      tryAdjusting: 'حاول تعديل معايير التصفية',
      clearFilters: 'مسح المرشحات',
      createFirstProject: 'إنشاء مشروعك الأول',
      createYourFirst: 'قم بإنشاء أول',
      startFirstProject: 'ابدأ بإنشاء مشروعك الأول',
      showcasePortfolio: 'اعرض أعمالك المكتملة',
      updateProjectInfo: 'تحديث معلومات المشروع',
      projectDeleted: 'تم حذف المشروع بنجاح',
      deleteFailed: 'فشل حذف المشروع'
    },
    transactions: {
      title: 'المعاملات المالية',
      subtitle: 'تتبع أرباحك ومصروفاتك وتاريخ المدفوعات',
      totalRevenue: 'إجمالي الإيرادات',
      totalExpenses: 'إجمالي المصروفات',
      subscriptionsAndFees: 'الاشتراكات والرسوم',
      pendingAmount: 'المبلغ المعلق',
      awaitingProcessing: 'في انتظار المعالجة',
      netProfit: 'صافي الربح',
      revenueMinus: 'الإيرادات ناقص المصروفات',
      recentTransactions: 'المعاملات الأخيرة',
      transactionHistory: 'تاريخ معاملاتك الكامل',
      export: 'تصدير',
      searchTransactions: 'البحث في المعاملات...',
      allStatus: 'جميع الحالات',
      allTypes: 'جميع الأنواع',
      paymentReceived: 'دفعة مستلمة',
      noTransactions: 'لم يتم العثور على معاملات',
      error: 'خطأ',
      errorFetch: 'فشل في تحميل المعاملات',
      date: 'التاريخ',
      type: 'النوع',
      description: 'الوصف',
      amount: 'المبلغ',
      status: 'الحالة',
      reference: 'المرجع',
      completed: 'مكتمل',
      pending: 'معلق',
      failed: 'فاشل',
      subscription: 'اشتراك',
      fee: 'رسوم',
      fromCompletedOrders: 'من الطلبات المكتملة'
    },
    projectsManagement: {
      title: 'إدارة المشاريع',
      subtitle: 'إدارة مشاريعك وتتبع التقدم'
    },
    portfolioManagement: {
      title: 'إدارة المحفظة',
      subtitle: 'اعرض أعمالك وأدر محفظتك'
    },
    portfolio: {
      title: 'إدارة المحفظة',
      description: 'اعرض أعمالك وأدر محفظتك',
      addProject: 'إضافة مشروع',
      completed: 'مكتمل',
      inProgress: 'قيد التنفيذ',
      pending: 'في الانتظار',
      viewProject: 'عرض المشروع',
      noProjects: 'لا توجد مشاريع',
      addFirstProject: 'أضف مشروعك الأول لعرض أعمالك',
      sampleProject1Title: 'بناء مبنى تجاري',
      sampleProject1Description: 'إنشاء مبنى تجاري كامل من 10 طوابق في وسط الرياض',
      sampleProject2Title: 'تصميم داخلي للمستشفى',
      sampleProject2Description: 'التصميم الداخلي والأثاث لمستشفى الملك فيصل التخصصي'
    },
    clients: {
      title: 'إدارة العملاء',
      subtitle: 'إدارة علاقاتك مع العملاء والشراكات',
      description: 'إدارة علاقاتك مع العملاء والشراكات',
      addClient: 'إضافة عميل',
      clientList: 'قائمة العملاء',
      clientDetails: 'تفاصيل العميل',
      newClient: 'عميل جديد',
      editClient: 'تعديل العميل',
      deleteClient: 'حذف العميل',
      searchClients: 'البحث في العملاء...',
      noClients: 'لم يتم العثور على عملاء',
      noClientsDesc: 'ابدأ في بناء قاعدة عملائك عن طريق إضافة عميلك الأول.',
      searchAndActions: 'البحث والإجراءات',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      company: 'الشركة',
      location: 'الموقع',
      joinedDate: 'تاريخ الانضمام',
      status: 'الحالة',
      actions: 'الإجراءات',
      clientName: 'اسم العميل',
      contactPerson: 'شخص الاتصال',
      address: 'العنوان',
      totalRevenue: 'إجمالي الإيرادات',
      totalClients: 'إجمالي العملاء',
      allRelationships: 'جميع العلاقات',
      activeClients: 'العملاء النشطون',
      completedOrders: 'مع الطلبات المكتملة',
      contact: 'تواصل',
      viewHistory: 'عرض التاريخ',
      noClientsFound: 'لم يتم العثور على عملاء يطابقون بحثك',
      noClientsYet: 'لا يوجد عملاء بعد. ابدأ العمل مع العملاء لرؤيتهم هنا.'
    },
    subscription: {
      title: 'إدارة الاشتراك',
      subtitle: 'إدارة خطة الاشتراك والفوترة',
      description: 'إدارة خطة الاشتراك وتفضيلات الفوترة',
      currentPlan: 'الخطة الحالية',
      daysRemaining: 'الأيام المتبقية',
      monthlySpend: 'الإنفاق الشهري',
      fromLastMonth: 'من الشهر الماضي',
      overview: 'نظرة عامة',
      upgrade: 'ترقية',
      billingHistory: 'سجل الفوترة',
      subscriptionDetails: 'تفاصيل الاشتراك',
      planFeatures: 'ميزات الخطة',
      expiresIn: 'ينتهي اشتراكك خلال {days} أيام',
      upgradeButton: 'ترقية الخطة',
      currentPlanButton: 'الخطة الحالية',
      noBillingHistory: 'لا يوجد سجل فوترة متاح',
      upgradeInitiated: 'تم بدء الترقية',
      redirectingPayment: 'إعادة توجيه للدفع لخطة {plan}...',
      error: 'خطأ',
      failedUpgrade: 'فشل في ترقية الاشتراك',
      billingCycle: 'دورة الفوترة',
      nextBilling: 'تاريخ الفوترة التالي',
      upgradeNow: 'ترقية الآن',
      manageBilling: 'إدارة الفوترة',
      features: 'المميزات',
      usage: 'الاستخدام',
      limits: 'الحدود',
      support: 'مستوى الدعم',
      planName: 'اسم الخطة',
      planPrice: 'السعر',
      paymentMethod: 'طريقة الدفع',
      upgradePlan: 'ترقية الخطة',
      downgradePlan: 'تخفيض الخطة',
      cancelSubscription: 'إلغاء الاشتراك',
      plans: {
        basic: {
          name: 'الخطة الأساسية',
          price: '9.99 دولار/شهر',
          features: {
            0: 'حتى 10 مشاريع',
            1: 'دعم أساسي',
            2: 'الميزات المعيارية'
          }
        },
        premium: {
          name: 'الخطة المميزة',
          price: '19.99 دولار/شهر',
          features: {
            0: 'حتى 50 مشروع',
            1: 'دعم ذو أولوية',
            2: 'ميزات متقدمة',
            3: 'لوحة تحليلات'
          }
        },
        enterprise: {
          name: 'خطة الشركات',
          price: '49.99 دولار/شهر',
          features: {
            0: 'مشاريع غير محدودة',
            1: 'دعم مخصص',
            2: 'جميع الميزات',
            3: 'تكاملات مخصصة'
          }
        }
      },
      billing: {
        monthly: 'شهرياً',
        yearly: 'سنوياً',
        amount: 'المبلغ',
        currency: 'ر.س',
        paymentMethod: 'طريقة الدفع',
        invoiceHistory: 'سجل الفواتير'
      }
    },
    notifications: {
      title: 'الإشعارات',
      subtitle: 'ابق على اطلاع بأنشطة حسابك',
      markAllRead: 'تحديد الكل كمقروء',
      delete: 'حذف',
      all: 'الكل',
      unread: 'غير مقروء',
      read: 'مقروء',
      offerAccepted: 'تم قبول العرض',
      newRequest: 'طلب جديد متاح',
      paymentReceived: 'تم استلام الدفع',
      newMessage: 'رسالة جديدة',
      newRating: 'تقييم جديد',
      sampleMessage1: 'تم قبول عرضك لمشروع البناء الألفا!',
      sampleMessage2: 'طلب شراء جديد يتطابق مع خبرتك في الهندسة',
      sampleMessage3: 'تم استلام دفعة بقيمة 15,000 دولار لمشروع بيتا',
      sampleMessage4: 'لديك 3 رسائل جديدة من العملاء',
      sampleMessage5: 'حصلت على تقييم 5 نجوم من شركة البناء ABC',
      unreadCount: '{count} إشعارات غير مقروءة',
      allRead: 'جميع الإشعارات مقروءة',
      highPriority: 'أولوية عالية',
      mediumPriority: 'أولوية متوسطة',
      lowPriority: 'أولوية منخفضة',
      offers: 'العروض',
      requests: 'الطلبات',
      payments: 'المدفوعات',
      messages: 'الرسائل',
      system: 'النظام',
      noNotifications: 'لا توجد إشعارات',
      noNotificationsDesc: 'أنت محدث! ستظهر الإشعارات الجديدة هنا.',
      markRead: 'تحديد كمقروء',
      viewDetails: 'عرض التفاصيل'
    },
    documents: {
      title: 'إدارة الوثائق',
      subtitle: 'تنظيم وإدارة وثائق عملك',
      description: 'تنظيم وإدارة وثائق عملك',
      uploadDocument: 'رفع وثيقة',
      documentName: 'اسم الوثيقة',
      documentType: 'نوع الوثيقة',
      uploadDate: 'تاريخ الرفع',
      totalDocuments: 'إجمالي الوثائق',
      allFiles: 'جميع الملفات',
      rfqDocuments: 'وثائق طلبات التسعير',
      rfqAttachments: 'مرفقات طلبات التسعير',
      bidDocuments: 'وثائق العروض',
      bidAttachments: 'مرفقات العروض',
      storageUsed: 'المساحة المستخدمة',
      totalSize: 'الحجم الإجمالي',
      documents: 'الوثائق',
      rfqDocs: 'وثائق RFQ',
      bidDocs: 'وثائق العروض',
      documentLibrary: 'مكتبة الوثائق',
      allUploaded: 'جميع الوثائق المرفوعة',
      searchDocuments: 'البحث في الوثائق...',
      allCategories: 'جميع الفئات',
      allTypes: 'جميع الأنواع',
      images: 'الصور',
      noDocumentsFound: 'لم يتم العثور على وثائق تطابق بحثك',
      noDocumentsYet: 'لا توجد وثائق بعد. ارفع وثيقتك الأولى للبدء.',
      rfqDocumentsTitle: 'وثائق طلبات التسعير',
      rfqDocumentsDesc: 'الوثائق المرفقة مع طلبات التسعير',
      project: 'المشروع:',
      bidDocumentsTitle: 'وثائق العروض',
      bidDocumentsDesc: 'الوثائق المقدمة مع عروضك',
      bidFor: 'عرض لـ:',
      fetchFailed: 'فشل في جلب الوثائق',
      downloadFailed: 'فشل في تنزيل الوثيقة'
    },
    reports: {
      title: 'التقارير والتحليلات',
      subtitle: 'لوحة تقارير وتحليلات شاملة',
      description: 'تتبع أداء عملك من خلال التحليلات والرؤى التفصيلية',
      fetchFailed: 'فشل في جلب بيانات التقرير',
      exportInitiated: 'بدء التصدير',
      generatingReport: 'إنشاء تقرير {type}...',
      last7Days: 'آخر 7 أيام',
      last30Days: 'آخر 30 يوماً',
      last90Days: 'آخر 90 يوماً',
      lastYear: 'السنة الماضية',
      export: 'تصدير',
      totalRevenue: 'إجمالي الإيرادات',
      fromOrders: 'من {count} طلب',
      winRate: 'معدل الفوز',
      bidsCount: '{won} من {total} عرض فائز',
      avgOrderValue: 'متوسط قيمة الطلب',
      averagePerOrder: 'المتوسط لكل طلب',
      activeClients: 'العملاء النشطون',
      uniquePayingClients: 'العملاء الدافعون الفريدون',
      revenueAnalysis: 'تحليل الإيرادات',
      bidPerformance: 'أداء العروض',
      clientAnalysis: 'تحليل العملاء',
      executiveSummary: 'الملخص التنفيذي',
      revenueTrend: 'اتجاه الإيرادات',
      revenueTrendDesc: 'الإيرادات اليومية خلال الفترة المحددة',
      orderVolume: 'حجم الطلبات',
      orderVolumeDesc: 'عدد الطلبات المستلمة يومياً',
      bidStatusDistribution: 'توزيع حالة العروض',
      bidStatusDesc: 'تفصيل حالات العروض في الفترة المحددة',
      topClientsByRevenue: 'أهم العملاء بالإيرادات',
      topClientsDesc: 'العملاء المحققون لأعلى إيرادات',
      ordersLabel: 'طلبات',
      avgLabel: 'متوسط',
      noClientData: 'لا توجد بيانات عملاء متاحة للفترة المحددة',
      executiveSummaryDesc: 'مؤشرات الأداء الرئيسية والرؤى',
      financialPerformance: 'الأداء المالي',
      totalRevenueLabel: 'إجمالي الإيرادات',
      bidPerformanceLabel: 'أداء العروض',
      totalBidsSubmitted: 'إجمالي العروض المقدمة',
      successfulBids: 'العروض الناجحة',
      averageBidAmount: 'متوسط قيمة العرض',
      clientMetrics: 'مقاييس العملاء',
      totalActiveClients: 'إجمالي العملاء النشطين',
      newClientsAcquired: 'العملاء الجدد المكتسبين',
      clientRetentionRate: 'معدل الاحتفاظ بالعملاء',
      recommendations: 'التوصيات',
      improveBidStrategy: 'فكر في تحسين استراتيجية العروض لزيادة معدل الفوز',
      diversifyClients: 'ركز على تنويع قاعدة العملاء للحصول على إيرادات أكثر استقراراً',
      optimizePricing: 'راجع استراتيجية التسعير لتحسين متوسط قيمة الطلب',
      generateReport: 'إنتاج تقرير',
      reportType: 'نوع التقرير',
      dateRange: 'نطاق التاريخ'
    },
    businessIntelligence: {
      title: 'ذكاء الأعمال',
      subtitle: 'تحليلات متقدمة ورؤى الأداء لعملك'
    },
    analytics: {
      title: 'تحليلات الموردين',
      subtitle: 'رؤى الأداء وتحليلات الأعمال',
      overview: 'نظرة عامة',
      offers: 'العروض',
      revenue: 'الإيرادات',
      revenueGrowth: 'نمو الإيرادات',
      categories: 'الفئات',
      offerAcceptanceRate: 'معدل قبول العروض',
      averageResponseTime: 'متوسط وقت الاستجابة',
      clientSatisfaction: 'رضا العملاء',
      monthlyRevenue: 'الإيرادات الشهرية',
      offerTrends: 'اتجاهات العروض',
      totalOffers: 'إجمالي العروض',
      acceptedOffers: 'العروض المقبولة',
      categoryDistribution: 'توزيع الفئات',
      offerPerformance: 'أداء العروض',
      submitted: 'مقدمة',
      accepted: 'مقبولة',
      categoryBreakdown: 'تفصيل الفئات',
      topPerformingCategories: 'الفئات الأكثر أداءً'
    },
    categories: {
      construction: 'الإنشاءات',
      engineering: 'الهندسة',
      consulting: 'الاستشارات',
      technology: 'التكنولوجيا',
      other: 'أخرى',
      manage: 'إدارة الفئات',
      select: 'اختر فئات خدماتك'
    },
    months: {
      jan: 'يناير',
      feb: 'فبراير',
      mar: 'مارس',
      apr: 'أبريل', 
      may: 'مايو',
      jun: 'يونيو',
      jul: 'يوليو',
      aug: 'أغسطس',
      sep: 'سبتمبر',
      oct: 'أكتوبر',
      nov: 'نوفمبر',
      dec: 'ديسمبر'
    },
    bidStatus: {
      pending: 'قيد الانتظار',
      awarded: 'مقبولة',
      rejected: 'مرفوضة'
    },
    staticText: {
      ofTotalProjects: 'من إجمالي المشاريع',
      clientLabel: 'العميل',
      hours: 'س'
    },
    profile: {
      businessInfo: "معلومات الأعمال",
      basicInfo: "المعلومات الأساسية",
      title: "الملف الشخصي",
      subtitle: "إدارة معلوماتك الشخصية والتجارية",
      editProfile: "تعديل الملف الشخصي",
      saveChanges: "حفظ التغييرات",
      verified: "موثق",
      rejected: "مرفوض",
      underReview: "قيد المراجعة",
      notVerified: "غير موثق",
      profileNotFound: "الملف الشخصي غير موجود",
      verification: "التوثيق",
      memberSince: "عضو منذ",
      personalInformation: "المعلومات الشخصية",
      personalInfoDescription: "قم بتحديث تفاصيلك الشخصية ومعلومات الاتصال",
      fullName: "الاسم الكامل",
      notProvided: "غير مقدم",
      email: "عنوان البريد الإلكتروني",
      phone: "رقم الهاتف",
      companyName: "اسم الشركة",
      address: "العنوان",
      bio: "السيرة الذاتية",
      bioPlaceholder: "أخبرنا عن نفسك وعن عملك...",
      noBioProvided: "لم يتم تقديم سيرة ذاتية",
      accountVerification: "توثيق الحساب",
      verificationDescription: "وثق حسابك للوصول إلى المزيد من الميزات وبناء الثقة مع العملاء",
      portfolioUrl: "رابط المحفظة",
      serviceCategories: "فئات الخدمة",
      selectCategories: "اختر فئات خدمتك",
      businessInformation: "معلومات الأعمال",
      contactInformation: "معلومات الاتصال",
      additionalDetails: "تفاصيل إضافية",
      crDocument: "وثيقة السجل التجاري",
      uploadCR: "رفع وثيقة السجل التجاري",
      crStatus: "حالة السجل التجاري",
      crNumber: "رقم السجل التجاري",
      verificationStatus: "حالة التوثيق",
      pendingVerification: "في انتظار التوثيق",
      documentsRequired: "مطلوب وثائق للتوثيق",
      uploadDocuments: "رفع الوثائق",
      resubmitDocuments: "إعادة إرسال الوثائق",
      avatar: "الصورة الشخصية",
      changeAvatar: "تغيير الصورة الشخصية",
      removeAvatar: "إزالة الصورة الشخصية",
      profileCompletion: "اكتمال الملف الشخصي",
      completeProfile: "أكمل ملفك الشخصي لفتح جميع الميزات"
    },
    rfqs: {
      title: "طلبات الاستعلام المتاحة",
      subtitle: "تصفح والرد على طلبات الاستعلام",
      totalRFQs: "إجمالي طلبات الاستعلام",
      openRFQs: "طلبات الاستعلام المفتوحة",
      myResponses: "ردودي",
      awarded: "الممنوحة",
      searchPlaceholder: "البحث في طلبات الاستعلام...",
      category: "الفئة",
      status: "الحالة",
      budget: "الميزانية",
      open: "مفتوح",
      closed: "مغلق",
      newest: "الأحدث أولاً",
      oldest: "الأقدم أولاً",
      deadlineSoon: "الموعد النهائي قريب",
      budgetHigh: "الميزانية: من الأعلى إلى الأقل",
      leastCompetitive: "الأقل تنافسية",
      availableRFQs: "طلبات الاستعلام المتاحة",
      lastUpdated: "آخر تحديث",
      viewDetails: "عرض التفاصيل",
      respond: "الرد",
      responseSubmitted: "تم إرسال الرد",
      responseSubmittedDesc: "تم إرسال ردك بنجاح",
      newRFQTitle: "طلب استعلام جديد متاح",
      newRFQDesc: "طلب استعلام جديد يتطابق مع ملفك الشخصي متاح",
      sampleRfq1Title: "مشروع بناء - مبنى مكاتب",
      sampleRfq1Description: "نحتاج شركة بناء لإنشاء مبنى مكاتب من 5 طوابق في منطقة وسط المدينة.",
      sampleRfq2Title: "خدمات هندسية - تصميم جسر",
      sampleRfq2Description: "نبحث عن خدمات هندسة إنشائية لمشروع جسر جديد.",
      sampleRfq3Title: "استشارات تكنولوجيا المعلومات - ترقية النظام",
      sampleRfq3Description: "نحتاج خدمات استشارية في تكنولوجيا المعلومات لترقية أنظمتنا القديمة.",
      sampleRfq4Title: "حملة تسويقية - إطلاق منتج",
      sampleRfq4Description: "نبحث عن وكالة إبداعية لحملة تسويقية شاملة.",
      sampleRequirement1: "مقاول مرخص",
      sampleRequirement2: "تغطية تأمينية",
      sampleRequirement3: "خبرة 5+ سنوات",
      sampleRequirement4: "ترخيص PE مطلوب",
      sampleRequirement5: "خبرة في تصميم الجسور",
      sampleRequirement6: "إتقان برامج CAD",
      sampleRequirement7: "استشاريون معتمدون",
      sampleRequirement8: "خبرة في الأنظمة القديمة",
      sampleRequirement9: "متاح للعمل في الموقع",
      sampleRequirement10: "محفظة من الحملات الناجحة",
      sampleRequirement11: "خبرة في التسويق الرقمي",
      sampleRequirement12: "تطوير العلامة التجارية",
      noRFQsFound: "لم يتم العثور على طلبات تسعير",
      noRFQsDesc: "جرب تعديل مرشحاتك أو تحقق لاحقاً للحصول على فرص جديدة",
      description: "الوصف",
      deadline: "الموعد النهائي",
      requirements: "المتطلبات",
      submitResponse: "إرسال الرد"
    },

    // Market Intelligence
    marketIntelligence: {
      title: "تقارير ذكاء السوق",
      subtitle: "رؤى مجهولة المصدر حول السوق لمساعدتك على المنافسة بفعالية",
      loading: "جاري تحميل رؤى السوق...",
      error: "خطأ",
      loadError: "فشل تحميل بيانات السوق",
      anonymityNotice: "🔒 بيانات مجهولة المصدر تماماً",
      anonymityDescription: "جميع البيانات المعروضة هنا مجهولة المصدر ومجمعة. لن يتم الكشف عن هويات المنافسين أو العملاء الأفراد أبداً.",
      performanceVsMarket: "أدائك مقابل السوق",
      lastThreeMonths: "آخر 3 أشهر",
      responseTime: "وقت الاستجابة",
      you: "أنت",
      market: "السوق",
      winRate: "معدل الفوز",
      activityLevel: "مستوى النشاط",
      average: "المتوسط",

      // Performance labels
      betterThanMarket: "أفضل من السوق",
      belowMarket: "أقل من السوق",
      marketAverage: "متوسط السوق",
      aboveAverage: "أعلى من المتوسط",
      belowAverage: "أقل من المتوسط",

      // Tabs
      demand: "الطلب",
      pricing: "الأسعار",
      specs: "المواصفات",
      competition: "المنافسة",

      // Demand
      demandTrends: "اتجاهات الطلب",
      demandTrendsDesc: "حجم طلبات عروض الأسعار والميزانيات على مدى 6 أشهر",
      rfqCount: "عدد طلبات عروض الأسعار",
      avgBudget: "متوسط الميزانية",

      // Pricing
      winningPriceBands: "نطاقات الأسعار الفائزة",
      winningPriceBandsDesc: "نطاقات الأسعار للعروض الفائزة في فئاتك",
      bids: "عرض",
      min: "الحد الأدنى",
      median: "الوسيط",
      max: "الحد الأقصى",

      // Specs
      popularSpecs: "المواصفات الشائعة",
      popularSpecsDesc: "الميزات الأكثر طلباً في فئاتك",

      // Competition
      competitionInsights: "رؤى المنافسة",
      competitionInsightsDesc: "مقاييس السوق المجمعة",
      avgOffers: "متوسط العروض",
      totalRFQs: "إجمالي طلبات عروض الأسعار",

      // Common
      insufficientData: "لا توجد بيانات كافية",
      howToUse: "💡 كيفية استخدام هذه البيانات",
      hours: "ساعات",

      // How to Use Tips
      tipPricingBands: "استخدم نطاقات الأسعار لتقديم عروض تنافسية",
      tipPopularSpecs: "اطلع على المواصفات الشائعة لفهم احتياجات السوق",
      tipComparePerformance: "قارن أدائك بمعايير السوق لتحديد مجالات التحسين",
      tipDemandTrends: "راقب اتجاهات الطلب لتخطيط قدرتك الإنتاجية"
    }
  },

  // Messages System - Arabic
  messages: {
    title: "الرسائل",
    subtitle: "تواصل مع العملاء وإدارة المحادثات",
    goToSupport: "انتقل للدعم",
    searchAndActions: "البحث والإجراءات",
    unknownUser: "مستخدم غير معروف",
    startNewChat: "بدء محادثة جديدة",
    noConversations: "لا توجد محادثات بعد",
    noConversationsDesc: "ابدأ بمراسلة العملاء لرؤية المحادثات هنا.",
    totalConversations: "إجمالي المحادثات",
    unreadMessages: "الرسائل غير المقروءة",
    businessChats: "محادثات الأعمال",
    supportTickets: "تذاكر الدعم",
    searchMessages: "البحث في الرسائل...",
    online: "متصل",
    startConversation: "بدء محادثة",
    support: "الدعم",
    noMessages: "لا توجد رسائل",
    now: "الآن",
    minutesAgo: "د مضت",
    hoursAgo: "س مضت",
    daysAgo: "ي مضت",
    weeksAgo: "أ مضت",
    monthsAgo: "ش مضت",
    yearsAgo: "سنة مضت"
  },

  // Orders System - Arabic
  orders: {
    title: "الطلبات",
    subtitle: "إدارة طلباتك وتتبع التسليم",
    noOrders: "لا توجد طلبات بعد",
    noOrdersDesc: "ستظهر الطلبات من العروض المقبولة هنا.",
    browseRequests: "تصفح الطلبات",
    trackManage: "تتبع وإدارة طلباتك",
    totalOrders: "إجمالي الطلبات",
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    completed: "مكتمل",
    noDescription: "لا يوجد وصف متاح",
    amountNotSet: "المبلغ غير محدد",
    viewDetails: "عرض التفاصيل",
    orderNumber: "رقم الطلب",
    deliveryDate: "تاريخ التسليم",
    ordered: "تم الطلب",
    amount: "المبلغ",
    status: {
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
      refunded: "مسترد"
    }
  },

  // Offers System - Arabic
  offers: {
    title: "العروض",
    subtitle: {
      vendor: "إدارة وتتبع العروض المقدمة",
      client: "مراجعة وإدارة العروض لطلباتك"
    },
    newOffer: "عرض جديد",
    filtersAndSearch: "المرشحات والبحث",
    noOffers: "لا توجد عروض متاحة",
    noOffersDesc: {
      vendor: "لم تقدم أي عروض بعد. ابدأ في إنشاء عروض لطلبات العملاء.",
      client: "لم يتم تقديم عروض لطلباتك بعد."
    },
    noOffersFound: "لا توجد عروض",
    tryAdjustingFilters: "جرب تعديل مصطلحات البحث أو المرشحات",
    searchPlaceholder: "البحث في العروض...",
    offerStatus: "حالة العرض",
    allStatus: "جميع الحالات",
    showingResults: "عرض {count} من {total} عرض",
    clearFilters: "مسح المرشحات",
    totalOffers: "إجمالي العروض",
    pendingOffers: "العروض المعلقة",
    approvedOffers: "العروض المعتمدة",
    rejectedOffers: "العروض المرفوضة",
    compare: "مقارنة",
    forRequest: "للطلب:",
    vendor: "المورد:",
    days: "أيام",
    viewDetails: "عرض التفاصيل",
    messageVendor: "مراسلة المورد",
    accept: "قبول",
    reject: "رفض",
    status: {
      draft: "مسودة",
      pending: "معلق",
      accepted: "مقبول",
      approved: "مُعتمد",
      rejected: "مرفوض",
      expired: "منتهي الصلاحية",
      withdrawn: "مسحوب"
    },
    actions: {
      view: "عرض التفاصيل",
      edit: "تعديل العرض",
      withdraw: "سحب",
      accept: "قبول",
      reject: "رفض"
    }
  },

  requests: {
    title: "الطلبات",
    description: "إدارة وتتبع طلبات الشراء الخاصة بك",
    createNew: "إنشاء طلب جديد",
    manageRequests: "إدارة وتتبع طلبات الخدمة الخاصة بك",
    noRequests: "لم يتم العثور على طلبات.",
    createRequest: "إنشاء طلب",
    metrics: {
      total: "إجمالي الطلبات",
      active: "الطلبات النشطة",
      completed: "مكتمل",
      pending: "قيد الانتظار"
    },
    filters: {
      title: "الفلاتر والبحث",
      searchPlaceholder: "البحث في الطلبات...",
      statusPlaceholder: "تصفية حسب الحالة",
      showing: "عرض",
      of: "من",
      requests: "الطلبات",
      clear: "مسح الفلاتر",
      statuses: {
        all: "كل الحالات",
        new: "جديد",
        in_progress: "قيد التنفيذ",
        completed: "مكتمل",
        cancelled: "ملغى"
      }
    },
    card: {
      viewDetails: "عرض التفاصيل",
      editRequest: "تعديل الطلب",
      notSpecified: "غير محدد",
      noDeadline: "بدون موعد نهائي"
    },
    empty: {
      noResultsTitle: "لم يتم العثور على طلبات",
      noResultsDesc: "حاول تعديل معايير البحث أو الفلاتر للعثور على ما تبحث عنه",
      startTitle: "ابدأ أول طلب لك",
      startDesc: "أنشئ أول طلب مشتريات لربطك بموردين مؤهلين والحصول على عروض تنافسية",
      features: {
        match: "مطابقة سريعة للموردين",
        offers: "عروض تنافسية",
        secure: "معاملات آمنة"
      },
      createFirst: "أنشئ أول طلب لك"
    },
    status: {
      new: "جديد",
      in_progress: "قيد التنفيذ",
      completed: "مكتمل",
      cancelled: "ملغى"
    }
  },

  // Browse Requests
  browseRequests: {
    title: "تصفح الطلبات",
    subtitle: "اكتشف وقدم عروضاً على فرص الشراء",
    totalRequests: "إجمالي الطلبات",
    urgentHighPriority: "عاجل وأولوية عالية",
    highBudget: "ميزانية عالية",
    newThisWeek: "جديد هذا الأسبوع",
    searchAndFilter: "البحث والتصفية",
    searchPlaceholder: "البحث في الطلبات بالعنوان أو الفئة...",
    filterByCategory: "التصفية حسب الفئة",
    allCategories: "جميع الفئات",
    noResults: "لا توجد نتائج",
    noResultsDesc: "جرب تعديل معايير البحث أو التصفية",
    budget: "الميزانية",
    deadline: "الموعد النهائي",
    posted: "تاريخ النشر",
    submitOffer: "تقديم عرض",
    viewDetails: "عرض التفاصيل",
    budgetNotSpecified: "الميزانية غير محددة",
    budgetNegotiable: "الميزانية قابلة للتفاوض",
    filterDescription: "استخدم المرشحات للعثور على الطلبات ذات الصلة"
  },

  // Settings
  settings: {
    title: "الإعدادات",
    subtitle: "إدارة إعدادات حسابك وتفضيلاتك.",
    notifications: "الإشعارات",
    notificationsDescription: "إدارة تفضيلات الإشعارات",
    emailNotifications: "إشعارات البريد الإلكتروني",
    emailNotificationsDesc: "تلقي التحديثات عبر البريد الإلكتروني", 
    pushNotifications: "الإشعارات الفورية",
    pushNotificationsDesc: "تلقي إشعارات فورية على جهازك",
    languageAndRegion: "اللغة والمنطقة", 
    languageDescription: "اختر اللغة والمنطقة المفضلة لديك",
    language: "اللغة",
    profileCompletion: "اكتمال الملف الشخصي",
    activeNotifications: "الإشعارات النشطة",
    securityScore: "نقاط الأمان",
    lastUpdated: "آخر تحديث",
    enabledNotificationTypes: "أنواع الإشعارات المُفعلة",
    settingsSaved: "تم حفظ الإعدادات",
    settingsUpdated: "تم تحديث الإعدادات بنجاح",
    updateError: "فشل في تحديث الإعدادات",
    notificationPrefsUpdated: "تم تحديث تفضيلات الإشعارات",
    notificationError: "فشل في تحديث إعدادات الإشعارات"
  },

  // Landing Page
  landing: {
    footer: {
      taglineText: "شريكك الموثوق في المشتريات وإدارة سلسلة التوريد",
      whyStart: "لماذا تبدأ مع MWRD",
      whyMove: "لماذا تنتقل إلى MWRD",
      pricingSection: "التسعير",
      supportSection: "الدعم",
      support: "الدعم",
      helpCenterLink: "مركز المساعدة",
      documentation: "التوثيق",
      systemStatus: "حالة النظام",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
      rights: "جميع الحقوق محفوظة",
      followUs: "تابعنا"
    }
  },

  // نظام الدفع
  payment: {
    // عام
    title: "الدفع",
    subtitle: "إدارة المدفوعات والفواتير",
    paymentGateway: "بوابة الدفع",
    securePayment: "دفع آمن",

    // ملخص الدفع
    paymentSummary: "ملخص الدفع",
    payInvoice: "دفع الفاتورة",
    completePayment: "أكمل الدفع بشكل آمن باستخدام Moyasar",

    // طرق الدفع
    paymentMethods: "طرق الدفع",
    availablePaymentMethods: "طرق الدفع المتاحة",
    addPaymentMethod: "إضافة طريقة دفع",
    deletePaymentMethod: "حذف طريقة الدفع",
    setDefaultPaymentMethod: "تعيين كافتراضي",
    defaultPaymentMethod: "طريقة الدفع الافتراضية",
    creditCard: "بطاقة ائتمان",
    fastAndSecure: "دفع سريع وآمن",
    payWith: "الدفع عبر",

    // حالة الدفع
    paymentSuccessful: "تمت العملية بنجاح",
    paymentSuccessfulDesc: "تم استلام دفعتك وسيتم معالجة طلبك قريباً",
    paymentFailed: "فشل الدفع",
    paymentFailedDesc: "فشلت عملية الدفع",
    paymentProcessing: "جاري معالجة الدفع...",
    paymentComplete: "اكتملت عملية الدفع!",

    // حالة المعاملة
    pending: "قيد الانتظار",
    completed: "مكتمل",
    processing: "قيد المعالجة",
    failed: "فشل",
    refunded: "مسترد",
    cancelled: "ملغى",

    // الفاتورة
    invoice: "فاتورة",
    invoiceNumber: "رقم الفاتورة",
    invoices: "الفواتير",
    invoiceNotFound: "الفاتورة غير موجودة",
    backToInvoices: "العودة إلى الفواتير",
    vendor: "المورد",
    dueDate: "تاريخ الاستحقاق",
    overdue: "متأخرة",
    subtotal: "المبلغ الأساسي",
    tax: "الضريبة",
    taxAmount: "الضريبة (15%)",
    total: "المجموع",
    amount: "المبلغ",

    // إجراءات الدفع
    pay: "دفع",
    payNow: "ادفع الآن",
    refund: "استرداد",
    processRefund: "معالجة الاسترداد",
    refundAmount: "مبلغ الاسترداد",
    refundReason: "سبب الاسترداد",

    // الأمان
    secureAndEncrypted: "دفع آمن ومشفر",
    securityNotice: "جميع المعاملات محمية بتشفير SSL. لا نقوم بتخزين بيانات بطاقتك.",
    pciCompliant: "متوافق مع PCI DSS",

    // رسائل الخطأ والنجاح
    error: "خطأ",
    success: "نجح",
    failedToInitialize: "فشل تهيئة بوابة الدفع",
    failedToProcess: "فشل معالجة الدفع",
    failedToUpdate: "فشل تحديث حالة الدفع",
    failedToLoad: "فشل التحميل",
    paymentMethodAdded: "تمت إضافة طريقة الدفع بنجاح",
    paymentMethodRemoved: "تم حذف طريقة الدفع",
    paymentMethodUpdated: "تم تحديث طريقة الدفع الافتراضية",
    failedToAddMethod: "فشلت إضافة طريقة الدفع",
    failedToRemoveMethod: "فشل حذف طريقة الدفع",
    failedToUpdateMethod: "فشل تحديث طريقة الدفع الافتراضية",
    failedToLoadMethods: "فشل تحميل طرق الدفع",
    failedToLoadTransactions: "فشل تحميل المعاملات",
    failedToLoadStatistics: "فشل تحميل الإحصائيات",
    refundProcessed: "تمت معالجة الاسترداد بنجاح",
    failedToProcessRefund: "فشلت معالجة الاسترداد",

    // المبالغ والعملة
    sar: "ر.س",
    riyal: "ريال",
    halalas: "هللة",
    currency: "العملة",

    // بوابة الدفع
    gatewayNotConfigured: "بوابة الدفع غير مهيأة",
    publishableKeyNotConfigured: "المفتاح القابل للنشر غير مهيأ",

    // المعاملات
    transactions: "المعاملات",
    transactionId: "معرف المعاملة",
    transactionHistory: "سجل المعاملات",
    paymentTransactions: "معاملات الدفع",
    recentTransactions: "المعاملات الأخيرة",
    viewTransactions: "عرض المعاملات",
    noTransactions: "لا توجد معاملات متاحة",

    // الإحصائيات
    statistics: "إحصائيات الدفع",
    totalAmount: "المبلغ الإجمالي",
    successRate: "معدل النجاح",
    averageAmount: "المتوسط",

    // حالات التحميل
    loading: "جاري التحميل...",
    loadingPaymentInfo: "جاري تحميل معلومات الدفع...",
    initializingPayment: "جاري تهيئة الدفع...",

    // تفاصيل البطاقة
    cardBrand: "نوع البطاقة",
    cardLastFour: "آخر 4 أرقام",
    cardName: "اسم حامل البطاقة",
    expiryDate: "تاريخ الانتهاء",

    // ميزات بوابة الدفع
    applePay: "Apple Pay",
    stcPay: "STC Pay",
    mada: "مدى",
    visa: "فيزا",
    mastercard: "ماستركارد"
  },

  // Modals
  modals: {
    editRequest: {
      title: "تعديل الطلب",
      deleteConfirmTitle: "هل أنت متأكد؟",
      deleteConfirmDescription: "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف الطلب وجميع العروض المرتبطة به نهائياً.",
      deleteButton: "حذف الطلب",
      cancelButton: "إلغاء",
      updateButton: "تحديث الطلب",
      updating: "جاري التحديث...",
      labels: {
        title: "العنوان *",
        description: "الوصف *",
        category: "الفئة *",
        budgetMin: "الحد الأدنى للميزانية",
        budgetMax: "الحد الأقصى للميزانية",
        location: "الموقع",
        deadline: "الموعد النهائي",
        urgency: "الأولوية"
      },
      placeholders: {
        title: "أدخل عنوان الطلب",
        description: "وصف تفصيلي لما تحتاجه",
        category: "اختر الفئة",
        location: "موقع المشروع (اختياري)",
        deadline: "اختر تاريخاً"
      },
      urgencyLevels: {
        low: "منخفض",
        medium: "متوسط",
        high: "عالي",
        urgent: "عاجل"
      },
      validation: {
        requiredFields: "يرجى ملء جميع الحقول المطلوبة"
      },
      success: {
        updated: "تم تحديث الطلب بنجاح!",
        deleted: "تم حذف الطلب بنجاح!"
      },
      errors: {
        updateFailed: "فشل في تحديث الطلب. يرجى المحاولة مرة أخرى.",
        deleteFailed: "فشل في حذف الطلب. يرجى المحاولة مرة أخرى."
      }
    },
    createProject: {
      title: "إنشاء مشروع جديد",
      createButton: "إنشاء مشروع",
      cancelButton: "إلغاء",
      labels: {
        projectTitle: "عنوان المشروع *",
        category: "الفئة",
        description: "الوصف",
        budgetTotal: "إجمالي الميزانية (ر.س)",
        priority: "الأولوية",
        location: "الموقع",
        startDate: "تاريخ البدء",
        endDate: "تاريخ الانتهاء",
        tags: "الوسوم"
      },
      placeholders: {
        title: "أدخل عنوان المشروع",
        category: "اختر الفئة",
        description: "صف مشروعك...",
        budgetTotal: "أدخل إجمالي الميزانية",
        location: "موقع المشروع",
        startDate: "اختر تاريخ البدء",
        endDate: "اختر تاريخ الانتهاء",
        tags: "أضف وسماً..."
      },
      priorityLevels: {
        low: "منخفض",
        medium: "متوسط",
        high: "عالي",
        urgent: "عاجل"
      },
      validation: {
        titleRequired: "عنوان المشروع مطلوب"
      },
      success: {
        created: "تم إنشاء المشروع بنجاح"
      },
      errors: {
        createFailed: "فشل في إنشاء المشروع",
        loadingCategories: "جاري تحميل الفئات..."
      }
    }
  },

  // Chat
  chat: {
    interface: {
      searchPlaceholder: "البحث في الرسائل...",
      typePlaceholder: "اكتب رسالة...",
      loading: "جاري تحميل المحادثات...",
      noSearchResults: "لم يتم العثور على رسائل تطابق بحثك.",
      noMessages: "لا توجد رسائل بعد. ابدأ المحادثة!",
      selectConversation: "اختر محادثة",
      selectConversationDesc: "اختر محادثة من القائمة لبدء المراسلة",
      roleLabels: {
        vendor: "مورد",
        client: "عميل"
      },
      menu: {
        archive: "أرشفة المحادثة"
      },
      fileMessages: {
        image: "📷 صورة",
        file: "📎 {fileName}",
        voice: "🎵 رسالة صوتية"
      },
      errors: {
        startConversation: "فشل في بدء المحادثة",
        sendMessage: "فشل في إرسال الرسالة",
        sendFile: "فشل في إرسال الملف",
        sendVoice: "فشل في إرسال الرسالة الصوتية"
      }
    },
    messageSearch: {
      title: "البحث في الرسائل",
      placeholder: "ابحث في محادثاتك...",
      filters: {
        all: "جميع الرسائل",
        text: "نص",
        images: "صور",
        files: "ملفات"
      },
      noResults: "لم يتم العثور على رسائل لـ \"{query}\"",
      noResultsDesc: "جرب كلمات مفتاحية مختلفة أو عدل المرشحات"
    },
    communicationHub: {
      headings: {
        noConversations: "لا توجد محادثات",
        conversations: "المحادثات",
        selectConversation: "اختر محادثة"
      },
      messages: {
        startConversation: "ابدأ محادثة مع عميل أو مورد.",
        noMessages: "لا توجد رسائل بعد. ابدأ المحادثة!",
        selectToStart: "اختر محادثة من القائمة لبدء المراسلة."
      },
      placeholder: "اكتب رسالتك...",
      conversationLabel: "محادثة #{id}"
    }
  },

  // KYV Additional Forms
  kyvForms: {
    basicInfo: {
      title: "معلومات الأعمال الإضافية",
      description: "قدم تفاصيل إضافية عن عملك",
      labels: {
        tradeName: "الاسم التجاري (إذا كان مختلفاً عن الاسم القانوني)",
        numberOfEmployees: "عدد الموظفين *",
        zakatCertificate: "شهادة الزكاة (PDF)",
        chamberCertificate: "شهادة الغرفة التجارية (PDF)",
        companyLogo: "شعار الشركة (صورة)"
      },
      placeholders: {
        tradeName: "أدخل اسمك التجاري",
        companySize: "اختر حجم الشركة"
      },
      companySizes: {
        small: "1-10 موظفين",
        small_medium: "11-50 موظف",
        medium: "51-100 موظف",
        medium_large: "101-250 موظف",
        large: "251-500 موظف",
        xlarge: "500+ موظف"
      },
      helpText: {
        tradeName: "الاسم الذي تمارس به نشاطك التجاري، إذا كان مختلفاً عن الاسم القانوني",
        zakat: "ارفع شهادة هيئة الزكاة والضريبة والجمارك",
        chamber: "ارفع شهادة عضوية الغرفة التجارية",
        logo: "ارفع شعار شركتك الرسمي (PNG أو JPG أو SVG)"
      }
    },
    productDetails: {
      paymentTermsPlaceholder: "اختر شروط الدفع"
    },
    bankingDetails: {
      placeholders: {
        accountName: "كما هو مسجل في البنك",
        iban: "SA0000000000000000000000",
        branchName: "اسم أو رمز الفرع"
      }
    }
  },

  // Vendor Directory & Pages
  vendors: {
    directory: {
      title: "دليل الموردين",
      metrics: {
        totalVendors: {
          title: "إجمالي الموردين",
          description: "الموردون المسجلون"
        },
        verifiedVendors: {
          title: "الموردون الموثقون",
          description: "شركاء معتمدون"
        },
        availableNow: {
          title: "متاح الآن",
          description: "جاهز لمشاريع جديدة"
        },
        serviceCategories: {
          title: "فئات الخدمات",
          description: "تخصصات مختلفة"
        }
      },
      labels: {
        specialties: "التخصصات",
        joined: "تاريخ الانضمام",
        portfolio: "المحفظة"
      },
      buttons: {
        viewProfile: "عرض الملف الشخصي",
        message: "إرسال رسالة",
        privateRequest: "طلب خاص",
        publicRequest: "طلب عام"
      },
      filters: {
        title: "تصفية النتائج",
        sortBy: "الترتيب حسب",
        budgetRange: "نطاق الميزانية (ر.س)",
        categories: "الفئات",
        clearAll: "مسح جميع المرشحات"
      },
      sortOptions: {
        newest: "الأحدث",
        rating: "التقييم",
        companyName: "اسم الشركة"
      },
      placeholders: {
        search: "البحث عن موردين...",
        minBudget: "الحد الأدنى",
        maxBudget: "الحد الأقصى"
      },
      pagination: {
        previous: "السابق",
        next: "التالي",
        pageInfo: "صفحة {page} من {total}"
      },
      emptyState: {
        title: "لم يتم العثور على موردين",
        description: "جرب تعديل معايير البحث",
        clearFilters: "مسح المرشحات"
      },
      status: {
        verified: "موثق",
        available: "متاح"
      }
    }
  },

  // Offers Page
  myOffers: {
    metrics: {
      total: "إجمالي العروض",
      pending: "معلق",
      approved: "معتمد",
      rejected: "مرفوض"
    },
    labels: {
      offerNumber: "رقم العرض #{id}",
      daysRemaining: "الأيام المتبقية",
      clientResponse: "استجابة العميل:",
      submitted: "تم التقديم"
    },
    emptyState: {
      action: "تصفح الطلبات"
    }
  },

  // Categories
  categories: {
    constructionMaterials: "مواد البناء",
    itEquipment: "معدات تكنولوجيا المعلومات",
    officeSupplies: "لوازم المكاتب",
    industrialEquipment: "المعدات الصناعية",
    medicalEquipment: "المعدات الطبية",
    transportation: "النقل",
    cateringServices: "خدمات التموين",
    maintenanceServices: "خدمات الصيانة",
    consultingServices: "الخدمات الاستشارية",
    securityServices: "خدمات الأمن"
  },

  // Subscription Management
  subscription: {
    management: {
      title: "إدارة الاشتراك",
      currentPlan: "الخطة الحالية",
      daysRemaining: "الأيام المتبقية",
      monthlyCost: "التكلفة الشهرية",
      status: "الحالة",
      processing: "جاري المعالجة..."
    }
  },

  // Hooks Error Messages
  hooks: {
    errors: {
      userNotAuthenticated: "المستخدم غير مصادق عليه",
      vendorProfileNotFound: "لم يتم العثور على ملف المورد",
      offerNotFound: "لم يتم العثور على العرض",
      currentUserProfileNotFound: "لم يتم العثور على ملف المستخدم الحالي",
      recipientProfileNotFound: "لم يتم العثور على ملف المستلم",
      missingRequiredFields: "حقول مطلوبة مفقودة: العنوان أو الوصف أو الفئة",
      userMustBeAuthenticated: "يجب أن يكون المستخدم مصادق عليه لإنشاء تذاكر"
    }
  },

  // Advanced Search
  search: {
    advanced: {
      placeholders: {
        search: "البحث عن موردين أو خدمات أو كلمات مفتاحية...",
        location: "المدينة، البلد",
        rating: "أي تقييم",
        urgency: "أي أولوية",
        tags: "أضف وسماً..."
      }
    }
  },

  // RFQ & Bids
  rfq: {
    bidSubmission: {
      placeholders: {
        bidAmount: "أدخل إجمالي مبلغ العطاء",
        deliveryDays: "عدد الأيام للإكمال",
        warrantyMonths: "فترة الضمان بالأشهر"
      }
    }
  },

  // Offer Review
  offerReview: {
    placeholders: {
      notes: "أي ملاحظات أو متطلبات إضافية...",
      feedback: "يرجى تقديم ملاحظاتك للمورد..."
    }
  },

  // BOQ
  boq: {
    createItem: {
      placeholders: {
        category: "اختر الفئة",
        description: "صف العنصر...",
        unit: "اختر الوحدة"
      }
    }
  },

  // Forms
  forms: {
    simpleRequest: {
      createButton: "إنشاء طلب",
      creating: "جاري الإنشاء..."
    }
  },

  // Loading & Processing States
  states: {
    loading: "جاري التحميل...",
    processing: "جاري المعالجة...",
    updating: "جاري التحديث...",
    creating: "جاري الإنشاء...",
    deleting: "جاري الحذف...",
    saving: "جاري الحفظ...",
    submitting: "جاري الإرسال..."
  },

  // NotFound
  notFound: {
    consoleMessage: "خطأ 404: حاول المستخدم الوصول إلى مسار غير موجود:"
  }
};