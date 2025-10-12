// Complete Admin Dashboard Translation Additions for en-US.ts
// Add these keys to the admin object in src/constants/locales/en-US.ts

export const adminTranslationsEN = {
  // Phase 1: Performance Monitor (Complete Set)
  performance: {
    title: "Performance",
    description: "Monitor system performance and optimization",
    performanceMonitor: "Performance Monitor",
    realTimeMetrics: "Real-time performance metrics and system health monitoring",
    refreshMetrics: "Refresh Metrics",
    checking: "Checking...",
    checkSystemHealth: "Check System Health",
    analyzing: "Analyzing...",
    analyzeBundle: "Analyze Bundle",
    
    // Tabs
    coreWebVitals: "Core Web Vitals",
    systemHealth: "System Health",
    bundleAnalysis: "Bundle Analysis",
    network: "Network",
    recommendations: "Recommendations",
    
    // Performance Score
    performanceScore: "Performance Score",
    overallAssessment: "Overall performance assessment based on multiple metrics",
    accessibility: "Accessibility",
    bestPractices: "Best Practices",
    seo: "SEO",
    
    // Core Web Vitals
    firstContentfulPaint: "First Contentful Paint",
    fcpDescription: "Measures how long it takes for the first content to appear",
    largestContentfulPaint: "Largest Contentful Paint",
    lcpDescription: "Measures loading performance of the largest content element",
    timeToInteractive: "Time to Interactive",
    ttiDescription: "Time until the page becomes fully interactive",
    domContentLoaded: "DOM Content Loaded",
    dclDescription: "Time to parse and load the initial HTML document",
    memoryUsage: "Memory Usage",
    memoryDescription: "JavaScript heap memory currently in use",
    
    // Status labels
    good: "Good",
    needsImprovement: "Needs Improvement",
    poor: "Poor",
    
    // System monitoring
    realTimeSystemMonitor: "Real-Time System Monitor",
    lastUpdated: "Last Updated",
    systemStatus: "System Status",
    healthy: "Healthy",
    operational: "Operational",
    cpuUsage: "CPU Usage",
    highLoad: "High Load",
    normal: "Normal",
    database: "Database",
    activeConnections: "active connections",
    
    // Service status
    serviceStatus: "Service Status",
    corePlatformServicesHealth: "Health status of core platform services",
    apiGateway: "API Gateway",
    authentication: "Authentication",
    realtimeServices: "Realtime Services",
    
    // Device capabilities
    deviceEnvironment: "Device Environment",
    currentDeviceCapabilities: "Current device performance profile and capabilities",
    deviceType: "Device Type",
    lowEnd: "Low-end Device",
    highPerformance: "High Performance",
    cpuCores: "CPU Cores",
    memory: "Memory",
    networkSpeed: "Network Speed",
    animations: "Animations",
    enabled: "Enabled",
    disabled: "Disabled",
    
    // Bundle analysis
    totalBundleSize: "Total Bundle Size",
    uncompressed: "Uncompressed",
    gzippedSize: "Gzipped Size",
    compression: "Compression",
    mobileImpact: "Mobile Impact",
    loadTimeOn3G: "Estimated load time on 3G",
    bundleComposition: "Bundle Composition",
    optimizationSuggestions: "Optimization Suggestions",
    
    // Recommendations
    performanceRecommendations: "Performance Recommendations",
    actionableSuggestions: "Actionable suggestions to improve your application's performance",
    implementLazyLoading: "Implement Lazy Loading",
    optimizeImages: "Optimize Images",
    enableCaching: "Enable Caching",
    databaseOptimization: "Database Optimization"
  },
  
  // Phase 2: Category Management
  categoryManagement: {
    title: "Category Management",
    description: "Manage product and service categories",
    totalCategories: "Total Categories",
    active: "Active",
    inactive: "Inactive",
    parent: "Parent",
    parentCategories: "Parent Categories",
    subcategory: "Subcategory",
    subcategories: "Subcategories",
    labels: {
      children: "child",
      childrenPlural: "children"
    },
    
    // Actions
    addCategory: "Add Category",
    editCategory: "Edit Category",
    deleteCategory: "Delete Category",
    bulkActions: "Bulk Actions",
    exportCategories: "Export",
    
    // Search & filters
    searchPlaceholder: "Search categories...",
    statusFilter: "Status",
    allStatuses: "All",
    activeOnly: "Active only",
    inactiveOnly: "Inactive only",
    
    // View modes
    viewMode: "View Mode",
    treeView: "Tree View",
    tableView: "Table View",
    expandAll: "Expand All",
    collapseAll: "Collapse All",
    
    // Messages
    categoryUpdated: "Category updated successfully",
    categoryCreated: "Category created successfully",
    categoryDeleted: "Category deleted successfully",
    deleteCategoryConfirm: "Are you sure you want to delete this category?",
    loadingCategories: "Loading categories...",
    noCategoriesInTable: "No categories in table view",
    switchToTreeView: "Switch to tree view to see categories",
    showingCategories: "Showing",
    categoriesSelected: "categories selected",
    selected: "selected",
    bulkActionSuccess: "categories updated with action",
    
    // CSV Headers
    csvHeaders: {
      id: "ID",
      englishName: "English Name",
      arabicName: "Arabic Name",
      slug: "Slug",
      status: "Status",
      level: "Level"
    },
    
    // Table headers
    categoriesTable: "Categories Table",
    comprehensiveView: "Comprehensive table view of all categories",
    total: "total",
    categoryHierarchy: "Category Hierarchy",
    arabicName: "Arabic Name",
    slug: "Slug",
    type: "Type",
    status: "Status",
    actions: "Actions",
    
    // Access control
    accessDenied: "Access Denied",
    needAdminPrivileges: "You need admin privileges to manage categories",
    needAdminPrivilegesDelete: "You need admin privileges to delete categories",
    needAdminPrivilegesEdit: "You need admin privileges to edit categories"
  },
  
  // Phase 4: KYC Review
  kyc: {
    title: "KYC Review",
    subtitle: "Review and approve client KYC submissions",
    submissionsReview: "KYC Submissions Review",
    companyName: "Company Name",
    crNumber: "CR Number",
    vatNumber: "VAT Number",
    accountType: "Account Type",
    submittedAt: "Submitted At",
    actions: "Actions",
    review: "Review",
    
    // Review submission
    reviewSubmission: "Review Submission",
    multipleSubmissions: "Multiple Submissions",
    multipleSubmissionsDesc: "This user has submitted {count} times",
    previousRejected: "Previous submissions were rejected",
    previousApproved: "A previous submission was approved",
    reviewingLatest: "You are reviewing the latest submission",
    
    // Tabs
    companyTab: "Company",
    taxTab: "Tax",
    addressTab: "Address",
    signatoryTab: "Signatory",
    creditTab: "Credit",
    
    // Fields
    legalName: "Legal Name",
    crIssuingDate: "CR Issuing Date",
    crValidity: "CR Validity Date",
    viewCRDocument: "View CR Document",
    downloadDocument: "Download Document",
    
    // Warnings
    warning: "Warning",
    warningCRMissing: "CR document is missing from storage",
    warningVATMissing: "VAT certificate is missing from storage",
    warningStorageNote: "This may indicate a storage issue",
    
    // Messages
    fetchError: "Error Fetching Data",
    fetchErrorDesc: "Failed to load KYC submissions",
    approveSuccess: "KYC Approved",
    approveSuccessDesc: "KYC submission has been approved successfully",
    rejectSuccess: "KYC Rejected",
    rejectSuccessDesc: "KYC submission has been rejected",
    reviewNotesRequired: "Review Notes Required",
    reviewNotesRequiredDesc: "Please provide review notes before rejecting",
    viewError: "View Error",
    viewErrorDesc: "Failed to open document",
    downloadSuccess: "Download Started",
    downloadSuccessDesc: "Document download has started",
    downloadError: "Download Error",
    downloadErrorDesc: "Failed to download document"
  },
  
  // Phase 4: Email Campaigns
  email: {
    campaigns: "Campaigns",
    templates: "Templates",
    analytics: "Analytics",
    newCampaign: "New Campaign",
    createCampaign: "Create Campaign",
    campaignName: "Campaign Name",
    campaignNamePlaceholder: "Enter campaign name",
    emailSubject: "Email Subject",
    subjectPlaceholder: "Enter email subject",
    template: "Template",
    selectTemplate: "Select template",
    targetAudience: "Target Audience",
    allUsers: "All Users",
    clientsOnly: "Clients Only",
    vendorsOnly: "Vendors Only",
    activeUsers: "Active Users",
    scheduleOptional: "Schedule (Optional)",
    
    // Templates
    newTemplate: "New Template",
    createEmailTemplate: "Create Email Template",
    templateName: "Template Name",
    templateNamePlaceholder: "Enter template name",
    category: "Category",
    announcement: "Announcement",
    newsletter: "Newsletter",
    promotion: "Promotion",
    welcome: "Welcome",
    defaultSubject: "Default Subject",
    defaultSubjectPlaceholder: "Enter default subject",
    htmlContent: "HTML Content",
    htmlContentPlaceholder: "Enter HTML content",
    createTemplate: "Create Template",
    
    // Stats
    totalCampaigns: "Total Campaigns",
    allTime: "All time",
    sentThisMonth: "Sent This Month",
    monthlyGrowth: "+12.5% from last month",
    openRate: "Open Rate",
    average: "average",
    clickRate: "Click Rate",
    
    // Messages
    campaignCreatedSuccess: "Campaign created successfully",
    campaignCreateFailed: "Failed to create campaign",
    templateCreatedSuccess: "Template created successfully",
    templateCreateFailed: "Failed to create template",
    campaignSentSuccess: "Campaign sent successfully",
    campaignSendFailed: "Failed to send campaign",
    noCampaignsYet: "No Campaigns Yet",
    createFirstCampaign: "Create your first email campaign to get started"
  },
  
  // Phase 4: Push Notifications
  pushNotifications: {
    overview: "Overview",
    notifications: "Notifications",
    analytics: "Analytics",
    settings: "Settings",
    newPushNotification: "New Push Notification",
    createPushNotification: "Create Push Notification",
    title: "Title",
    titlePlaceholder: "Enter notification title",
    message: "Message",
    messagePlaceholder: "Enter notification message",
    targetPlatform: "Target Platform",
    allPlatforms: "All Platforms",
    android: "Android",
    ios: "iOS",
    web: "Web",
    targetAudience: "Target Audience",
    allUsers: "All Users",
    clients: "Clients",
    vendors: "Vendors",
    activeUsers: "Active Users",
    actionUrl: "Action URL (Optional)",
    actionUrlPlaceholder: "https://example.com/action",
    schedule: "Schedule (Optional)",
    createAndSend: "Create & Send",
    
    // Settings
    pushNotificationSettings: "Push Notification Settings",
    enablePushNotifications: "Enable Push Notifications",
    enablePushNotificationsDesc: "Allow sending push notifications to users",
    allowPromotional: "Allow Promotional Notifications",
    allowPromotionalDesc: "Enable promotional and marketing notifications",
    enableQuietHours: "Enable Quiet Hours",
    enableQuietHoursDesc: "Don't send notifications during quiet hours",
    quietHoursStart: "Quiet Hours Start",
    quietHoursEnd: "Quiet Hours End",
    maxDailyNotifications: "Max Daily Notifications",
    saveSettings: "Save Settings",
    
    // Stats
    registeredDevices: "Registered devices",
    successfullyDelivered: "Successfully delivered",
    userEngagement: "User engagement",
    platformDistribution: "Platform Distribution",
    activeDevicesByPlatform: "Active devices by platform",
    
    // Messages
    success: "Success",
    error: "Error",
    createSuccess: "Push notification created successfully",
    createError: "Failed to create push notification",
    settingsUpdated: "Settings updated successfully",
    settingsError: "Failed to update settings"
  },
  
  // Phase 4: Security Monitor (Additional keys)
  security: {
    criticalSecurityAlert: "Critical Security Alert",
    criticalAlertsDetected: "critical alerts detected"
  }
};
