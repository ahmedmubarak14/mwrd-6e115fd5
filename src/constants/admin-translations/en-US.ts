/**
 * Admin Dashboard - English Translations
 * Structured namespace for all admin-related translations
 */

export const adminTranslationsEN = {
  // Core Navigation & Layout
  dashboard: {
    title: "Admin Dashboard",
    description: "Comprehensive platform management and oversight",
    welcome: "Welcome to Admin Dashboard",
    overview: "Overview",
    quickActions: "Quick Actions",
    quickActionsDesc: "Access key administrative functions and tools"
  },

  navigation: {
    users: "Users",
    requests: "Requests", 
    offers: "Offers",
    orders: "Orders",
    projects: "Projects",
    communications: "Communications",
    analytics: "Analytics",
    financial: "Financial",
    subscriptions: "Subscriptions",
    support: "Support",
    verificationQueue: "Verification Queue",
    categoryManagement: "Category Management",
    expertConsultations: "Expert Consultations",
    security: "Security",
    settings: "Settings",
    profile: "Profile",
    workflowAutomation: "Workflow Automation",
    userManagement: "User Management",
    requestsApproval: "Requests Approval",
    offersManagement: "Offers Management",
    systemHealth: "System Health",
    securityCenter: "Security Center", 
    approvalQueue: "Approval Queue",
    financialOverview: "Financial Overview",
    automation: "Automation",
    userManagementDescription: "Manage user accounts, roles, and permissions",
    approvalQueueDescription: "Review and approve pending requests and offers",
    financialOverviewDescription: "Monitor revenue, transactions, and financial metrics",
    systemHealthDescription: "Check system performance and operational status",
    securityCenterDescription: "Monitor security incidents and compliance",
    communicationsDescription: "Manage notifications and communication channels",
    analyticsDescription: "View platform analytics and performance metrics",
    automationDescription: "Configure automated workflows and processes"
  },

  // Breadcrumbs
  breadcrumbs: {
    admin: "Admin",
    dashboard: "Dashboard",
    userManagement: "User Management",
    requestsManagement: "Requests Management", 
    offersManagement: "Offers Management",
    ordersManagement: "Orders Management",
    projectsManagement: "Projects Management",
    platformAnalytics: "Platform Analytics",
    subscriptionManagement: "Subscription Management",
    supportCenter: "Support Center",
    verificationQueue: "Verification Queue",
    categoryManagement: "Category Management",
    expertConsultations: "Expert Consultations",
    financialTransactions: "Financial Transactions",
    securityMonitoring: "Security Monitoring",
    communicationCenter: "Communication Center",
    unknown: "Unknown Page"
  },

  // Command Palette
  commandPalette: {
    placeholder: "Search users, requests, offers...",
    goToUsers: "Go to Users",
    createNewUser: "Create New User",
    reviewRequests: "Review Requests", 
    manageOffers: "Manage Offers",
    viewAnalytics: "View Analytics",
    financialTransactions: "Financial Transactions",
    quickActions: "Quick Actions",
    searchingFor: "Searching for",
    searchTips: "Use ↑↓ to navigate, Enter to select",
    noResults: "No results found"
  },

  // User Management
  users: {
    title: "User Management",
    description: "Manage platform users and their access",
    addUser: "Add User",
    addUserDescription: "Create a new user account",
    editUser: "Edit User",
    deleteUser: "Delete User",
    userDetails: "User Details",
    userProfile: "User Profile",
    userActivity: "User Activity",
    userPermissions: "User Permissions",
    
    // Core Admin User Management
    userManagement: "User Management",
    userManagementDescription: "Manage user accounts, roles, permissions, and access control",
    totalUsers: "Total Users", 
    allRegisteredUsers: "All registered users on the platform",
    activeUsers: "Active Users",
    approvedUsers: "Approved Users",
    pendingUsers: "Pending Users",
    awaitingApproval: "Awaiting Approval",
    adminUsers: "Admin Users",
    systemAdministrators: "System Administrators",
    filtersAndSearch: "Filters & Search",
    searchUsers: "Search users...",
    refresh: "Refresh",
    exportUsers: "Export Users",
    selectAllUsers: "Select All Users",
    usersSelected: "users selected",
    selectRole: "Select Role",
    selectStatus: "Select Status",
    bulkUpdateRole: "Bulk Update Role", 
    bulkUpdateStatus: "Bulk Update Status",
    updateRoleAction: "Update Role",
    updateStatusAction: "Update Status",
    confirmBulkAction: "Confirm Bulk Action",
    
    // Status and Messages
    fetchUsersError: "Failed to fetch users",
    noName: "No Name",
    bulkRoleUpdateSuccess: "Successfully updated role for {count} users",
    bulkRoleUpdateError: "Failed to update user roles",
    bulkStatusUpdateSuccess: "Successfully updated status for {count} users", 
    bulkStatusUpdateError: "Failed to update user status",
    fillRequiredFields: "Please fill in all required fields",
    userExistsError: "User with this email already exists",
    userAddedSuccess: "User added successfully",
    userUpdatedSuccess: "User updated successfully",
    userDeletedSuccess: "User {name} deleted successfully", 
    exportSelectedSuccess: "Exported {count} selected users",
    
    // Additional missing keys for full functionality
    bulkActionConfirm: "Confirm Bulk Action",
    bulkRoleConfirm: "Are you sure you want to update the role to {role} for {count} users?",
    bulkStatusConfirm: "Are you sure you want to update the status to {status} for {count} users?",
    exportSelectedAction: "Export Selected",
    users: "Users",
    verificationQueueTab: "Verification Queue",
    analyticsTab: "Analytics",
    noUsersMatchFilters: "No users match the current filters",
    deleteUserTitle: "Delete User",
    deleteUserConfirm: "Are you sure you want to delete {name}? This action cannot be undone.",
    userRoleOverview: "User Role Overview",
    clients: "Clients",
    vendors: "Vendors", 
    admins: "Admins",
    userStatusOverview: "User Status Overview",
    approvedStatus: "Approved",
    pendingStatus: "Pending",
    blockedStatus: "Blocked",
    rejectedStatus: "Rejected",
    addNewUser: "Add New User",
    addNewUserDescription: "Create a new user account with basic information",
    fullNameRequired: "Full Name *",
    emailRequired: "Email *",
    enterFullName: "Enter full name",
    enterEmailAddress: "Enter email address",
    roleLabel: "Role",
    clientRole: "Client",
    vendorRole: "Vendor",
    adminRole: "Administrator",
    companyNameOptional: "Company Name",
    phoneOptional: "Phone",
    enterCompanyName: "Enter company name", 
    enterPhoneNumber: "Enter phone number",
    editUserTitle: "Edit User",
    editUserDescription: "Update user information and settings",
    editFullName: "Full Name",
    editEmail: "Email",
    editRole: "Role",
    editStatus: "Status",
    editCompanyName: "Company Name",
    editPhone: "Phone",
    saveUserChanges: "Save Changes",
    
    // CSV Headers
    csvHeaders: "ID,Full Name,Email,Role,Status,Verification,Company,Phone,Created Date",
    
    // User Fields
    fullName: "Full Name", 
    email: "Email Address",
    companyName: "Company Name",
    phone: "Phone Number",
    role: "User Role",
    status: "Status",
    createdAt: "Created Date",
    lastLogin: "Last Login",
    
    // User Roles
    admin: "Administrator",
    client: "Client",
    vendor: "Vendor", 
    moderator: "Moderator",
    
    // User Status
    userActive: "Active",
    userInactive: "Inactive",
    userPending: "Pending",
    userSuspended: "Suspended",
    userBlocked: "Blocked",
    
    // Actions (removed duplicates)
    filterByRole: "Filter by Role",
    filterByStatus: "Filter by Status",
    bulkActions: "Bulk Actions",
    
    // Messages (removed duplicates)
    userCreated: "User created successfully",
    userUpdated: "User updated successfully", 
    userDeleted: "User deleted successfully",
    deleteConfirmation: "Are you sure you want to delete this user?",
    noUsersFound: "No users found",
    loadingUsers: "Loading users...",
    activeThisMonth: "active this month"
  },

  // Request Management
  requests: {
    title: "Request Management",
    description: "Manage and approve platform requests",
    viewRequest: "View Request",
    approveRequest: "Approve Request", 
    rejectRequest: "Reject Request",
    requestDetails: "Request Details",
    requestHistory: "Request History",
    
    // Request Fields
    requestId: "Request ID",
    requestTitle: "Title",
    requestDescription: "Description",
    category: "Category",
    budget: "Budget",
    deadline: "Deadline",
    priority: "Priority",
    submittedBy: "Submitted By",
    submittedAt: "Submitted Date",
    
    // Request Status
    requestPending: "Pending",
    requestApproved: "Approved", 
    requestRejected: "Rejected",
    requestInProgress: "In Progress",
    requestCompleted: "Completed",
    requestCancelled: "Cancelled",
    
    // Priority Levels
    low: "Low",
    medium: "Medium",
    high: "High", 
    urgent: "Urgent",
    
    // Actions
    searchRequests: "Search requests...",
    filterByStatus: "Filter by Status",
    filterByCategory: "Filter by Category",
    filterByPriority: "Filter by Priority",
    
    // Messages
    requestApprovedMessage: "Request approved successfully",
    requestRejectedMessage: "Request rejected successfully", 
    noRequestsFound: "No requests found",
    loadingRequests: "Loading requests...",
    pendingApprovals: "Pending Approvals",
    requiresAdminReview: "requires admin review"
  },

  // Offer Management
  offers: {
    title: "Offer Management",
    description: "Manage vendor offers and proposals",
    viewOffer: "View Offer",
    approveOffer: "Approve Offer",
    rejectOffer: "Reject Offer", 
    offerDetails: "Offer Details",
    offerHistory: "Offer History",
    
    // Offer Fields
    offerId: "Offer ID",
    offerTitle: "Title",
    price: "Price",
    deliveryTime: "Delivery Time",
    offerDescription: "Description",
    vendorName: "Vendor Name",
    submittedAt: "Submitted Date",
    validUntil: "Valid Until",
    
    // Offer Status
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected", 
    accepted: "Accepted",
    expired: "Expired",
    cancelled: "Cancelled",
    
    // Actions
    searchOffers: "Search offers...",
    compareOffers: "Compare Offers",
    
    // Messages
    offerApproved: "Offer approved successfully",
    offerRejected: "Offer rejected successfully",
    noOffersFound: "No offers found",
    loadingOffers: "Loading offers..."
  },

  // Communication Center
  communication: {
    title: "Communication Center", 
    description: "Manage platform communications and messaging",
    
    // Tabs
    notifications: "Notifications",
    broadcast: "Broadcast Messages",
    templates: "Email Templates",
    chat: "Live Chat",
    settings: "Settings",
    
    // Notification Types
    allUsers: "All Users",
    clientsOnly: "Clients Only", 
    vendorsOnly: "Vendors Only",
    pendingVerification: "Pending Verification",
    inactiveUsers: "Inactive Users",
    
    // Priority Levels
    lowPriority: "Low Priority",
    mediumPriority: "Medium Priority",
    highPriority: "High Priority", 
    urgentPriority: "Urgent Priority",
    
    // Status
    sent: "Sent", 
    draft: "Draft",
    scheduled: "Scheduled",
    failed: "Failed",
    delivered: "Delivered",
    read: "Read",
    unread: "Unread",
    
    // Priority Badges
    urgent: "Urgent",
    high: "High",
    medium: "Medium",
    low: "Low",
    
    // Actions
    sendBroadcast: "Send Broadcast",
    createEmailTemplate: "Create Email Template",
    newTemplate: "New Template",
    templateName: "Template Name",
    templateNamePlaceholder: "Newsletter Template",
    category: "Category",
    announcement: "Announcement",
    newsletter: "Newsletter",
    promotion: "Promotion",
    welcome: "Welcome",
    defaultSubject: "Default Subject",
    defaultSubjectPlaceholder: "{{company_name}} Weekly Update",
    htmlContent: "HTML Content",
    htmlContentPlaceholder: "<!DOCTYPE html><html><body>...</body></html>",
    createTemplate: "Create Template",
    scheduleMessage: "Schedule Message",
    markAllRead: "Mark All Read",
    
    // Messages
    broadcastCreated: "Broadcast message created successfully",
    broadcastFailed: "Failed to create broadcast message", 
    allMarkedRead: "All notifications marked as read",
    unknownUser: "Unknown User"
  },

  // Financial Management
  financial: {
    title: "Financial Transactions",
    description: "Monitor and manage platform finances",
    
    // Transaction Types
    payment: "Payment",
    refund: "Refund",
    fee: "Platform Fee", 
    commission: "Commission",
    withdrawal: "Withdrawal",
    
    // Transaction Status
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    cancelled: "Cancelled",
    processing: "Processing",
    
    // Fields
    transactionId: "Transaction ID",
    amount: "Amount", 
    currency: "Currency",
    paymentMethod: "Payment Method",
    processedAt: "Processed Date",
    reference: "Reference",
    
    // Actions
    searchTransactions: "Search transactions...",
    exportTransactions: "Export Transactions",
    viewDetails: "View Details",
    processRefund: "Process Refund",
    
    // Stats
    totalRevenue: "Total Revenue",
    pendingAmount: "Pending Amount",
    completedTransactions: "Completed Transactions",
    failedTransactions: "Failed Transactions",
    monthlyGrowth: "+8.2% this month"
  },

  // Verification Workflow  
  verification: {
    title: "Verification Workflow",
    description: "Review and approve user verifications",
    
    // Status
    pending: "Pending",
    underReview: "Under Review",
    approved: "Approved", 
    rejected: "Rejected",
    
    // Content
    allCaughtUp: "All caught up!",
    noPendingVerifications: "No pending verifications at this time",
    verificationQueue: "Verification Queue", 
    verificationDetails: "Verification Details",
    reviewAndApprove: "Review and approve user verification",
    selectUser: "Select a User",
    chooseUserFromQueue: "Choose a user from the queue to review their verification",
    reviewNotes: "Review Notes",
    
    // Actions
    markUnderReview: "Mark Under Review", 
    approve: "Approve",
    reject: "Reject",
    refresh: "Refresh",
    
    // Info
    usersAwaiting: "users awaiting verification",
    submitted: "Submitted",
    documents: "documents", 
    verificationDocuments: "Verification Documents",
    noDocumentsUploaded: "No documents uploaded",
    view: "View",
    document: "Document",
    noDocuments: "No documents uploaded",
    
    // Messages
    statusUpdated: "Status Updated",
    markedUnderReview: "Verification marked as under review", 
    approvedSuccessfully: "User verification approved successfully",
    rejectedSuccessfully: "User verification rejected successfully",
    errorUpdatingStatus: "Failed to update verification status",
    errorFetchingVerifications: "Failed to fetch pending verifications",
    
    // User Types
    vendor: "Vendor", 
    client: "Client"
  },

  // Analytics
  analytics: {
    title: "Platform Analytics",
    description: "Insights and metrics for platform performance",
    
    // Time Periods
    last7Days: "Last 7 Days",
    last30Days: "Last 30 Days", 
    last90Days: "Last 90 Days",
    lastYear: "Last Year",
    
    // Metrics
    analyticsUsers: "Total Users",
    analyticsActiveUsers: "Active Users",
    newRegistrations: "New Registrations",
    analyticsRequests: "Total Requests", 
    completedRequests: "Completed Requests",
    analyticsRevenue: "Total Revenue",
    conversionRate: "Conversion Rate",
    
    // Actions
    exportData: "Export Data",
    generateReport: "Generate Report",
    viewDetails: "View Details",
    platformActivity: "Platform Activity",
    platformActivityDesc: "Track user registrations, requests, and orders over time",
    recentActivity: "Recent Activity",
    recentActivityDescription: "Latest system events and user actions",
    activityOn: "on",
    noRecentActivity: "No recent activity"
  },

  // System Health & Performance
  system: {
    title: "System Health",
    description: "Monitor system performance and status",
    
    // Status
    healthy: "Healthy",
    warning: "Warning", 
    critical: "Critical",
    offline: "Offline",
    
    // Components
    database: "Database",
    api: "API Services",
    storage: "Storage", 
    cache: "Cache",
    queue: "Queue System",
    
    // Metrics
    uptime: "Uptime",
    responseTime: "Response Time",
    cpuUsage: "CPU Usage", 
    memoryUsage: "Memory Usage",
    diskUsage: "Disk Usage",
    
    // Actions
    restartService: "Restart Service",
    viewLogs: "View Logs",
    refreshStatus: "Refresh Status",
    metricsError: "Failed to load system metrics",
    alerts: "System Alerts",
    activeSystemAlerts: "active system alerts",
    requireAttention: "require attention",
    health: "System Health",
    allSystemsOperational: "All systems operational",
    status: "Status",
    statusDescription: "Real-time system component status",
    activeConnections: "Active Connections"
  },

  // Security
  security: {
    title: "Security Center",
    description: "Monitor and manage platform security",
    
    // Incident Types
    loginAttempt: "Failed Login Attempt",
    suspiciousActivity: "Suspicious Activity", 
    dataAccess: "Unauthorized Data Access",
    systemBreach: "System Breach",
    
    // Severity
    low: "Low",
    medium: "Medium", 
    high: "High",
    critical: "Critical",
    
    // Status
    open: "Open",
    investigating: "Investigating",
    resolved: "Resolved", 
    closed: "Closed",
    
    // Actions
    investigateIncident: "Investigate Incident",
    blockUser: "Block User",
    viewLogs: "View Security Logs", 
    generateReport: "Generate Security Report"
  },

  // Workflow Automation 
  workflowAutomation: {
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and streamline processes',
    automationCenter: 'Automation Center',
    automationDescription: 'Create, manage, and monitor automated workflows',
    createWorkflow: 'Create Workflow',
    overview: {
      activeWorkflows: 'Active Workflows',
      totalExecutions: 'Total Executions',
      pendingTasks: 'Pending Tasks',
      successRate: 'Success Rate'
    },
    tabs: {
      workflows: 'Workflows',
      executionHistory: 'Execution History',
      tasks: 'Tasks'
    },
    workflowForm: {
      createTitle: 'Create New Workflow',
      workflowName: 'Workflow Name',
      workflowNamePlaceholder: 'Enter workflow name',
      description: 'Description',
      descriptionPlaceholder: 'Describe what this workflow does',
      triggerType: 'Trigger Type',
      triggerPlaceholder: 'manual, scheduled, event',
      priority: 'Priority (1-10)',
      cancel: 'Cancel',
      createButton: 'Create Workflow'
    },
    workflowCard: {
      trigger: 'Trigger',
      priority: 'Priority',
      created: 'Created',
      execute: 'Execute'
    },
    executions: {
      title: 'Recent Executions',
      workflowId: 'Workflow ID: ',
      duration: 'Duration:',
      noExecutions: 'No executions found'
    },
    tasks: {
      pendingTitle: 'Pending Tasks',
      overdueTitle: 'Overdue Tasks',
      complete: 'Complete',
      priorityLabel: 'Priority:',
      dueLabel: 'Due:',
      noDueDate: 'No due date',
      noPendingTasks: 'No pending tasks',
      noOverdueTasks: 'No overdue tasks',
      overdueBy: 'Overdue by',
      days: 'days'
    },
    messages: {
      loading: 'Loading automation data...',
      nameRequired: 'Workflow name is required',
      created: 'Workflow created successfully',
      createError: 'Failed to create workflow',
      enabled: 'enabled',
      disabled: 'disabled',
      toggleError: 'Failed to toggle workflow status',
      deleted: 'Workflow deleted successfully',
      deleteError: 'Failed to delete workflow'
    }
  },
  
  // Data Tables
  table: {
    searchPlaceholder: 'Search...',
    clearSearch: 'Clear search',
    filters: 'Filters',
    filterBy: 'Filter by',
    allItems: 'All',
    exportData: 'Export',
    bulkActions: 'Bulk Actions',
    refreshData: 'Refresh',
    actions: 'Actions',
    noResults: 'No results found',
    showingResults: 'Showing results',
    showing: 'Showing',
    to: 'to',
    of: 'of',
    results: 'results',
    previous: 'Previous',
    next: 'Next'
  },

  // Error Messages
  errors: {
    title: 'Something went wrong',
    description: 'An error occurred in the admin dashboard. Please try refreshing the page.',
    details: 'Error Details:',
    stackTrace: 'Stack Trace:',
    tryAgain: 'Try Again',
    refreshPage: 'Refresh Page'
  },

  // Approval Dashboard
  approvals: {
    title: 'Approval Center',
    description: 'Centralized approval management with automated workflows',
    loading: 'Loading approval dashboard...',
    exportReport: 'Export Report',
    advancedFilters: 'Advanced Filters',
    pendingItems: 'Pending Items',
    approvalRate: 'Approval Rate',
    avgProcessing: 'Avg Processing',
    avgResponseTime: 'Average response time',
    totalProcessed: 'Total Processed',
    totalProcessedDesc: 'All time approvals/rejections',
    progressTitle: 'Approval Progress',
    requests: 'Requests',
    offers: 'Offers',
    requestsLabel: 'requests',
    offersLabel: 'offers',
    thisWeek: 'this week',
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected'
  },

  // Audit Trail
  auditTrail: {
    noLogsFound: 'No audit logs found',
    adjustFilters: 'Try adjusting your filters',
    noActivities: 'No audit activities to display',
    on: 'on',
    id: 'ID:'
  },

  // i18n Compliance Dashboard
  i18nCompliance: {
    title: 'i18n Compliance Dashboard',
    description: 'Monitor and validate internationalization compliance across admin components',
    runCheck: 'Run Check',
    score: 'Compliance Score',
    totalIssues: 'Total Issues',
    errors: 'errors',
    compliantComponents: 'Compliant Components',
    outOf: 'out of',
    warnings: 'Warnings',
    needsAttention: 'Need attention',
    tabs: {
      issues: 'Issues',
      coverage: 'Coverage',
      components: 'Components',
      testing: 'Testing'
    },
    line: 'Line',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    suggestedFix: 'Suggested Fix',
    allClear: 'All Clear!',
    noIssuesFound: 'No i18n compliance issues found',
    missingTranslations: 'Missing Translations',
    extraTranslations: 'Extra Translations',
    allKeysTranslated: 'All translation keys are properly covered',
    noExtraKeys: 'No unused translation keys found',
    componentStatus: 'Component Status',
    nonCompliantComponents: 'Non-Compliant Components',
    compliantComponentsList: 'Compliant Components',
    compliantComponentsDesc: 'These components follow i18n best practices',
    manualTests: 'Manual Tests',
    languageSwitching: 'Language Switching',
    testSwitchLanguages: 'Switch between English and Arabic',
    testRTLLayout: 'Verify RTL layout changes',
    testTextAlignment: 'Check text alignment and direction',
    testNumberFormat: 'Test number and date formatting',
    automatedChecks: 'Automated Checks',
    lastChecked: 'Last checked',
    runFullCheck: 'Run Full Compliance Check'
  },

  // Common Actions & Messages
  actions: {
    create: "Create",
    edit: "Edit", 
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    approve: "Approve", 
    reject: "Reject",
    view: "View",
    download: "Download",
    export: "Export",
    import: "Import", 
    refresh: "Refresh",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    reset: "Reset",
    back: "Back", 
    next: "Next",
    previous: "Previous",
    close: "Close"
  },

  // Status Messages
  messages: {
    loading: "Loading...",
    saving: "Saving...", 
    success: "Success!",
    error: "An error occurred",
    noData: "No data available",
    noResults: "No results found",
    selectOption: "Select an option", 
    fillRequired: "Please fill in all required fields",
    confirmDelete: "Are you sure you want to delete this item?",
    operationComplete: "Operation completed successfully",
    operationFailed: "Operation failed. Please try again"
  },

  // Toast messages
  toast: {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    exportUsers: 'Export Users',
    userDataExported: 'User data exported successfully',
    notificationCreated: 'Notification created successfully',
    notificationSent: 'Notification sent successfully',
    notificationFailed: 'Failed to create notification',
    notificationSendFailed: 'Failed to send notification',
    pushNotificationCreated: 'Push notification created successfully',
    pushNotificationFailed: 'Failed to create push notification',
    settingsUpdated: 'Settings updated successfully',
    settingsFailed: 'Failed to update settings',
    complianceReportGenerated: 'Compliance report generated successfully',
    complianceReportFailed: 'Failed to generate compliance report',
    editingUser: 'Editing',
    deletingUser: 'Deleting'
  },

  // Notification Center
  notifications: {
    totalNotifications: 'Total Notifications',
    sentToday: 'Sent Today',
    pending: 'Pending',
    openRate: 'Open Rate',
    allTime: 'All time',
    lastTwentyFourHours: 'Last 24 hours',
    scheduled: 'Scheduled',
    average: 'Average',
    title: 'Title',
    type: 'Type',
    message: 'Message',
    priority: 'Priority',
    targetAudience: 'Target Audience',
    scheduleOptional: 'Schedule (Optional)',
    createNotification: 'Create Notification',
    cancel: 'Cancel',
    noNotificationsFound: 'No notifications found',
    adjustFilters: 'Try adjusting your filters',
    createFirstNotification: 'Create your first notification to get started',
    allStatus: 'All Status',
    draft: 'Draft',
    sent: 'Sent',
    allPriority: 'All Priority',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    createNewNotification: 'Create New Notification',
    notificationTitle: 'Notification title',
    notificationMessage: 'Notification message',
    announcement: 'Announcement',
    alert: 'Alert',
    promotion: 'Promotion',
    system: 'System',
    allUsers: 'All Users',
    clientsOnly: 'Clients Only',
    vendorsOnly: 'Vendors Only',
    adminsOnly: 'Admins Only',
    sendNow: 'Send Now',
    editSchedule: 'Edit Schedule',
    edit: 'Edit'
  },

  // Push Notifications
  pushNotifications: {
    overview: 'Overview',
    analytics: 'Analytics',
    settings: 'Settings',
    newPushNotification: 'New Push Notification',
    createPushNotification: 'Create Push Notification',
    importantUpdate: 'Important Update Available',
    checkLatestFeatures: 'Check out the latest features and improvements we\'ve made for you.',
    targetPlatform: 'Target Platform',
    allPlatforms: 'All Platforms',
    android: 'Android',
    ios: 'iOS',
    web: 'Web',
    clients: 'Clients',
    vendors: 'Vendors',
    activeUsers: 'Active Users',
    actionUrl: 'Action URL (Optional)',
    actionUrlPlaceholder: 'https://yourapp.com/feature',
    schedule: 'Schedule (Optional)',
    createAndSend: 'Create & Send',
    pushNotificationSettings: 'Push Notification Settings',
    enablePushNotifications: 'Enable Push Notifications',
    allowSendingPush: 'Allow sending push notifications to users',
    allowPromotionalNotifications: 'Allow Promotional Notifications',
    sendMarketingContent: 'Send marketing and promotional content',
    enableQuietHours: 'Enable Quiet Hours',
    dontSendDuringQuiet: 'Don\'t send notifications during quiet hours',
    quietHoursStart: 'Quiet Hours Start',
    quietHoursEnd: 'Quiet Hours End',
    maxDailyNotifications: 'Max Daily Notifications per User',
    saveSettings: 'Save Settings',
    totalDevices: 'Total Devices',
    registeredDevices: 'Registered devices',
    pushNotifications: 'Push notifications',
    deliveryRate: 'Delivery Rate',
    successfullyDelivered: 'Successfully delivered',
    clickRate: 'Click Rate',
    userEngagement: 'User engagement',
    platformDistribution: 'Platform Distribution',
    activeDevicesByPlatform: 'Active devices by platform',
    recentNotifications: 'Recent Notifications',
    latestPushNotifications: 'Latest push notifications sent'
  },

  // Security & Compliance (consolidated)
  securityCompliance: {
    overallComplianceScore: 'Overall Compliance Score',
    aboveIndustryAverage: 'Above industry average',
    activeFrameworks: 'Active Frameworks',
    gdprSoc2PciDss: 'GDPR, SOC 2, PCI DSS',
    pendingActions: 'Pending Actions',
    requiresAttention: 'Requires attention',
    complianceStatusSummary: 'Compliance Status Summary',
    currentStatusAcrossFrameworks: 'Current status across all compliance frameworks',
    report: 'Report',
    generateReport: 'Generate Report',
    frameworks: 'Frameworks',
    privacyControls: 'Privacy Controls',
    dataRetention: 'Data Retention',
    dataProcessingActivities: 'Data Processing Activities',
    lawfulBasisConsent: 'Lawful Basis: Consent',
    lawfulBasisContract: 'Lawful Basis: Contract',
    lawfulBasisLegitimateInterest: 'Lawful Basis: Legitimate Interest',
    userRegistrationData: 'User Registration Data',
    paymentProcessing: 'Payment Processing',
    marketingCommunications: 'Marketing Communications',
    securityMonitoring: 'Security Monitoring',
    dataSubjectRights: 'Data Subject Rights',
    rightToAccess: 'Right to Access',
    rightToRectification: 'Right to Rectification',
    rightToErasure: 'Right to Erasure',
    rightToPortability: 'Right to Portability',
    implemented: 'Implemented',
    inProgress: 'In Progress',
    dataRetentionPolicies: 'Data Retention Policies',
    automatedRetentionDeletion: 'Automated data retention and deletion schedules',
    userAccountData: 'User Account Data',
    retainedSevenYears: 'Retained for 7 years after account closure',
    transactionRecords: 'Transaction Records',
    retainedTenYears: 'Retained for 10 years for compliance',
    auditLogs: 'Audit Logs',
    retainedThreeYears: 'Retained for 3 years from creation',
    active: 'Active',
    nextScheduledCleanup: 'Next Scheduled Cleanup',
    automaticDataCleanup: 'Automatic data cleanup will run on March 15, 2025 at 2:00 AM UTC',
    estimatedRecords: 'Estimated records to be processed: 1,247',
    configureSchedule: 'Configure Schedule',
    criticalSecurityAlert: "Critical Security Alert",
    criticalAlertsDetected: "critical security alert(s) detected",
    allSystemsOperational: "All systems operational",
    metricsError: "Failed to load platform metrics"
  },

  // Communication Settings (consolidated)
  communicationSettings: {
    emailTab: 'Email',
    smsTab: 'SMS',
    notificationsTab: 'Notifications',
    integrationsTab: 'Integrations',
    emailConfiguration: 'Email Configuration',
    emailConfigDesc: 'Configure SMTP settings and email delivery options',
    smtpHost: 'SMTP Host',
    smtpPort: 'SMTP Port',
    encryption: 'Encryption',
    smtpUsername: 'SMTP Username',
    fromEmail: 'From Email',
    fromName: 'From Name',
    replyToEmail: 'Reply-to Email',
    emailFeatures: 'Email Features',
    bounceHandling: 'Bounce Handling',
    bounceHandlingDesc: 'Automatically handle bounced emails',
    emailTracking: 'Email Tracking',
    emailTrackingDesc: 'Track email opens and clicks',
    unsubscribeLink: 'Unsubscribe Link',
    unsubscribeLinkDesc: 'Include unsubscribe link in emails',
    saveEmailSettings: 'Save Email Settings',
    smsConfiguration: 'SMS Configuration',
    smsConfigDesc: 'Configure SMS provider and delivery settings',
    smsProvider: 'SMS Provider',
    apiKey: 'API Key',
    apiKeyPlaceholder: 'Enter your API key',
    apiSecret: 'API Secret',
    apiSecretPlaceholder: 'Enter your API secret',
    fromNumber: 'From Number',
    fromNumberPlaceholder: '+1234567890',
    rateLimitPerMinute: 'Rate Limit (per minute)',
    deliveryReports: 'Delivery Reports',
    deliveryReportsDesc: 'Receive delivery status reports',
    optOutKeywords: 'Opt-out Keywords',
    optOutKeywordsDesc: 'Users can text these keywords to unsubscribe',
    saveSmsSettings: 'Save SMS Settings',
    notificationPreferences: 'Notification Preferences',
    notificationConfigDesc: 'Configure how and when notifications are sent',
    settingsSaved: 'Settings Saved',
    settingsUpdated: 'settings updated successfully',
    settingsError: 'Settings Error',
    settingsFailedSave: 'Failed to save settings'
  },

  // Form Labels & Placeholders  
  forms: {
    placeholders: {
      search: "Search...",
      email: "Enter email address",
      name: "Enter full name", 
      company: "Enter company name",
      phone: "Enter phone number",
      message: "Enter message...",
      notes: "Add notes...",
      title: "Enter title", 
      description: "Enter description",
      amount: "Enter amount",
      date: "Select date",
      category: "Select category"
    },
    
    labels: {
      required: "Required field",
      optional: "Optional", 
      characters: "characters",
      maxLength: "Maximum length",
      minLength: "Minimum length"
    },
    
    validation: {
      emailInvalid: "Please enter a valid email address",
      phoneInvalid: "Please enter a valid phone number", 
      amountInvalid: "Please enter a valid amount",
      dateInvalid: "Please select a valid date",
      fieldRequired: "This field is required"
    }
  }
};