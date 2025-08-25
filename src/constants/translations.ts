export type Language = 'en' | 'ar';

export interface Translations {
  [key: string]: string;
}

export const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.requests': 'Requests',
    'nav.offers': 'Offers', 
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Register',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.refresh': 'Refresh',

    // Dashboard
    'dashboard.welcome': 'Welcome to your dashboard',
    'dashboard.loading': 'Loading your dashboard...',
    'dashboard.error': 'Failed to load dashboard',
    'dashboard.refresh': 'Refresh Data',
    'dashboard.export': 'Export Analytics',
    'dashboard.lastUpdated': 'Last updated',
    'dashboard.refreshSuccess': 'Dashboard refreshed successfully',
    'dashboard.refreshError': 'Failed to refresh dashboard',
    'dashboard.exportSuccess': 'Analytics exported successfully',
    'dashboard.exportError': 'Failed to export analytics',
    'dashboard.drillDownMessage': 'Viewing details for {section}',

    // Dashboard Stats
    'dashboard.stats.totalRequests': 'Total Requests',
    'dashboard.stats.activeProjects': 'Active Projects',
    'dashboard.stats.completedOrders': 'Completed Orders',
    'dashboard.stats.savings': 'Total Savings',
    'dashboard.stats.totalUsers': 'Total Users',
    'dashboard.stats.totalOffers': 'Total Offers',
    'dashboard.stats.revenue': 'Revenue',
    'dashboard.stats.growth': 'Growth',

    // Dashboard Empty State
    'dashboard.emptyState.title': 'No data available',
    'dashboard.emptyState.description': 'Start by creating your first request to see analytics',
    'dashboard.emptyState.action': 'Create Request',

    // Status
    'status.pending': 'Pending',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.underReview': 'Under Review',
    'status.active': 'Active',
    'status.inactive': 'Inactive',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',

    // Verification
    'verification.required': 'Verification Required',
    'verification.pending': 'Verification Pending',
    'verification.rejected': 'Verification Rejected',
    'verification.approved': 'Verification Approved',
    'verification.requiredDescription': 'Complete your profile verification to access all features',
    'verification.pendingDescription': 'Your documents are being reviewed (24-48 hours)',
    'verification.rejectedDescription': 'Please review the feedback and resubmit your documents',
    'verification.uploadDocuments': 'Upload Documents',
    'verification.reviewStatus': 'Review Status',
    'verification.rejectionReason': 'Rejection Reason',

    // Actions
    'action.viewDetails': 'View Details',
    'action.create': 'Create',
    'action.update': 'Update',
    'action.delete': 'Delete',
    'action.approve': 'Approve',
    'action.reject': 'Reject',

    // Admin
    'admin.totalUsers': 'Total Users',
    'admin.activeRequests': 'Active Requests',
    'admin.revenue': 'Revenue',
    'admin.userRegistered': 'User Registered',
    'admin.documentSubmitted': 'Document Submitted',

    // Analytics
    'analytics.fromLastMonth': 'from last month',
    'analytics.fromLastWeek': 'from last week',
    'analytics.system': 'System',
    'analytics.noEmail': 'No Email',
    'analytics.registeredUsers': 'registered users',
    'analytics.platformAnalytics': 'Platform Analytics',
    'analytics.comprehensiveInsights': 'Comprehensive insights into your platform',
    'analytics.last7Days': 'Last 7 Days',
    'analytics.last30Days': 'Last 30 Days', 
    'analytics.last90Days': 'Last 90 Days',
    'analytics.totalUsers': 'Total Users',
    'analytics.totalRequests': 'Total Requests',
    'analytics.totalOffers': 'Total Offers',
    'analytics.monthlyRevenue': 'Monthly Revenue',
    'analytics.totalTransactions': 'Total Transactions',
    'analytics.activeSubscriptions': 'Active Subscriptions',
    'analytics.serviceRequests': 'service requests',
    'analytics.offersSubmitted': 'offers submitted',
    'analytics.thisMonth': 'this month',
    'analytics.transactionsProcessed': 'transactions processed',
    'analytics.currentlyActive': 'currently active',
    'analytics.recentActivity': 'Recent Activity',
    'analytics.performanceMetrics': 'Performance Metrics',
    'analytics.usageTrends': 'Usage Trends',
    'analytics.systemActivity': 'System activity and user actions',
    'analytics.performanceDescription': 'Key performance indicators and metrics',
    'analytics.trendsDescription': 'Usage patterns and trends over time',
    'analytics.performanceContent': 'Performance metrics will be displayed here',
    'analytics.trendsContent': 'Usage trends will be displayed here',
    'analytics.noActivityLogs': 'No recent activity logs',

    // Orders
    'orders.title': 'Orders',

    // Profile
    'profile.loading': 'Loading profile...',
    'profile.loadingDescription': 'Please wait while we load your profile information',

    // Vendor
    vendor: {
      welcome: "Welcome to Vendor Dashboard",
      subtitle: "Find and submit offers for procurement requests",
      totalOffers: "Total Offers",
      acceptedOffers: "Accepted Offers", 
      pendingOffers: "Pending Offers",
      submittedThisMonth: "Submitted this month",
      successRate: "Success Rate",
      awaitingClientResponse: "Awaiting client response",
      successfullyWon: "Successfully won",
      findOpportunities: "Find Opportunities",
      filterDescription: "Search and filter procurement opportunities that match your expertise",
      searchRequests: "Search requests...",
      opportunitiesFound: "opportunities found",
      availableOpportunities: "Available Opportunities",
      submitOffersToWin: "Submit competitive offers to win projects",
      completeVerificationToSubmit: "Complete verification to submit offers",
      noOpportunities: "No Opportunities Found",
      noOpportunitiesDesc: "Check back later for new procurement opportunities that match your profile",
      budget: "Budget",
      negotiable: "Negotiable",
      deadline: "Deadline", 
      posted: "Posted",
      viewDetails: "View Details",
      submitOffer: "Submit Offer",
      verificationRequired: "Verification Required"
    }
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.requests': 'الطلبات',
    'nav.offers': 'العروض',
    'nav.messages': 'الرسائل',
    'nav.profile': 'الملف الشخصي',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.submit': 'إرسال',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.close': 'إغلاق',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.refresh': 'تحديث',

    // Dashboard
    'dashboard.welcome': 'مرحباً بك في لوحة التحكم',
    'dashboard.loading': 'جاري تحميل لوحة التحكم...',
    'dashboard.error': 'فشل في تحميل لوحة التحكم',
    'dashboard.refresh': 'تحديث البيانات',
    'dashboard.export': 'تصدير التحليلات',
    'dashboard.lastUpdated': 'آخر تحديث',
    'dashboard.refreshSuccess': 'تم تحديث لوحة التحكم بنجاح',
    'dashboard.refreshError': 'فشل في تحديث لوحة التحكم',
    'dashboard.exportSuccess': 'تم تصدير التحليلات بنجاح',
    'dashboard.exportError': 'فشل في تصدير التحليلات',
    'dashboard.drillDownMessage': 'عرض تفاصيل {section}',

    // Dashboard Stats
    'dashboard.stats.totalRequests': 'إجمالي الطلبات',
    'dashboard.stats.activeProjects': 'المشاريع النشطة',
    'dashboard.stats.completedOrders': 'الطلبات المكتملة',
    'dashboard.stats.savings': 'إجمالي التوفير',
    'dashboard.stats.totalUsers': 'إجمالي المستخدمين',
    'dashboard.stats.totalOffers': 'إجمالي العروض',
    'dashboard.stats.revenue': 'الإيرادات',
    'dashboard.stats.growth': 'النمو',

    // Dashboard Empty State
    'dashboard.emptyState.title': 'لا توجد بيانات متاحة',
    'dashboard.emptyState.description': 'ابدأ بإنشاء طلبك الأول لرؤية التحليلات',
    'dashboard.emptyState.action': 'إنشاء طلب',

    // Status
    'status.pending': 'قيد الانتظار',
    'status.approved': 'موافق عليه',
    'status.rejected': 'مرفوض',
    'status.underReview': 'قيد المراجعة',
    'status.active': 'نشط',
    'status.inactive': 'غير نشط',
    'status.completed': 'مكتمل',
    'status.cancelled': 'ملغي',

    // Verification
    'verification.required': 'التحقق مطلوب',
    'verification.pending': 'التحقق قيد الانتظار',
    'verification.rejected': 'التحقق مرفوض',
    'verification.approved': 'التحقق موافق عليه',
    'verification.requiredDescription': 'أكمل التحقق من ملفك الشخصي للوصول إلى جميع الميزات',
    'verification.pendingDescription': 'مستنداتك قيد المراجعة (24-48 ساعة)',
    'verification.rejectedDescription': 'يرجى مراجعة التعليقات وإعادة تقديم مستنداتك',
    'verification.uploadDocuments': 'رفع المستندات',
    'verification.reviewStatus': 'مراجعة الحالة',
    'verification.rejectionReason': 'سبب الرفض',

    // Actions
    'action.viewDetails': 'عرض التفاصيل',
    'action.create': 'إنشاء',
    'action.update': 'تحديث',
    'action.delete': 'حذف',
    'action.approve': 'موافقة',
    'action.reject': 'رفض',

    // Admin
    'admin.totalUsers': 'إجمالي المستخدمين',
    'admin.activeRequests': 'الطلبات النشطة',
    'admin.revenue': 'الإيرادات',
    'admin.userRegistered': 'مستخدم مسجل',
    'admin.documentSubmitted': 'مستند مقدم',

    // Analytics
    'analytics.fromLastMonth': 'من الشهر الماضي',
    'analytics.fromLastWeek': 'من الأسبوع الماضي',
    'analytics.system': 'النظام',
    'analytics.noEmail': 'لا يوجد بريد إلكتروني',
    'analytics.registeredUsers': 'مستخدمين مسجلين',
    'analytics.platformAnalytics': 'تحليلات المنصة',
    'analytics.comprehensiveInsights': 'رؤى شاملة حول منصتك',
    'analytics.last7Days': 'آخر 7 أيام',
    'analytics.last30Days': 'آخر 30 يوم',
    'analytics.last90Days': 'آخر 90 يوم',
    'analytics.totalUsers': 'إجمالي المستخدمين',
    'analytics.totalRequests': 'إجمالي الطلبات',
    'analytics.totalOffers': 'إجمالي العروض',
    'analytics.monthlyRevenue': 'الإيرادات الشهرية',
    'analytics.totalTransactions': 'إجمالي المعاملات',
    'analytics.activeSubscriptions': 'الاشتراكات النشطة',
    'analytics.serviceRequests': 'طلبات الخدمة',
    'analytics.offersSubmitted': 'العروض المقدمة',
    'analytics.thisMonth': 'هذا الشهر',
    'analytics.transactionsProcessed': 'المعاملات المعالجة',
    'analytics.currentlyActive': 'نشطة حالياً',
    'analytics.recentActivity': 'النشاط الأخير',
    'analytics.performanceMetrics': 'مقاييس الأداء',
    'analytics.usageTrends': 'اتجاهات الاستخدام',
    'analytics.systemActivity': 'نشاط النظام وإجراءات المستخدم',
    'analytics.performanceDescription': 'مؤشرات الأداء الرئيسية والمقاييس',
    'analytics.trendsDescription': 'أنماط الاستخدام والاتجاهات عبر الوقت',
    'analytics.performanceContent': 'ستظهر مقاييس الأداء هنا',
    'analytics.trendsContent': 'ستظهر اتجاهات الاستخدام هنا',
    'analytics.noActivityLogs': 'لا توجد سجلات نشاط حديثة',

    // Orders
    'orders.title': 'الطلبات',

    // Profile
    'profile.loading': 'جاري تحميل الملف الشخصي...',
    'profile.loadingDescription': 'يرجى الانتظار أثناء تحميل معلومات ملفك الشخصي',

    // Vendor
    vendor: {
      welcome: "مرحباً بك في لوحة تحكم المورد",
      subtitle: "ابحث عن طلبات التوريد وقدم عروضك",
      totalOffers: "إجمالي العروض",
      acceptedOffers: "العروض المقبولة",
      pendingOffers: "العروض المعلقة", 
      submittedThisMonth: "المقدمة هذا الشهر",
      successRate: "معدل النجاح",
      awaitingClientResponse: "في انتظار رد العميل",
      successfullyWon: "تم الفوز بها بنجاح",
      findOpportunities: "البحث عن الفرص",
      filterDescription: "ابحث وصفي فرص التوريد التي تتناسب مع خبرتك",
      searchRequests: "البحث في الطلبات...",
      opportunitiesFound: "فرصة متاحة",
      availableOpportunities: "الفرص المتاحة",
      submitOffersToWin: "قدم عروضاً تنافسية للفوز بالمشاريع",
      completeVerificationToSubmit: "أكمل التحقق لتتمكن من تقديم العروض",
      noOpportunities: "لا توجد فرص متاحة",
      noOpportunitiesDesc: "تحقق لاحقاً من وجود فرص توريد جديدة تتناسب مع ملفك الشخصي",
      budget: "الميزانية",
      negotiable: "قابل للتفاوض",
      deadline: "الموعد النهائي",
      posted: "تاريخ النشر",
      viewDetails: "عرض التفاصيل",
      submitOffer: "تقديم عرض",
      verificationRequired: "التحقق مطلوب"
    }
  }
};

export const getTranslation = (key: string, language: Language): string => {
  return translations[language][key] || key;
};
