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
    overview: "Overview"
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
    workflowAutomation: "Workflow Automation"
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
    
    // Actions
    selectRole: "Select Role",
    selectStatus: "Select Status",
    searchUsers: "Search users...",
    filterByRole: "Filter by Role",
    filterByStatus: "Filter by Status",
    exportUsers: "Export Users",
    bulkActions: "Bulk Actions",
    
    // Messages
    userCreated: "User created successfully",
    userUpdated: "User updated successfully", 
    userDeleted: "User deleted successfully",
    fillRequiredFields: "Please fill in all required fields",
    deleteConfirmation: "Are you sure you want to delete this user?",
    noUsersFound: "No users found",
    loadingUsers: "Loading users..."
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
    loadingRequests: "Loading requests..."
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
    failedTransactions: "Failed Transactions"
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
    registered: "Registered",
    
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
    totalUsers: "Total Users",
    activeUsers: "Active Users",
    newRegistrations: "New Registrations",
    totalRequests: "Total Requests", 
    completedRequests: "Completed Requests",
    totalRevenue: "Total Revenue",
    conversionRate: "Conversion Rate",
    
    // Actions
    exportData: "Export Data",
    generateReport: "Generate Report",
    viewDetails: "View Details"
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
    refreshStatus: "Refresh Status"
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