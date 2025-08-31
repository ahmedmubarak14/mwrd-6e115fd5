/**
 * Admin Translations - English (US)
 * Clean, focused translation keys for admin interface
 */

export const adminTranslationsEN = {
  // Header interface
  openMobileMenu: "Open mobile menu",
  collapseSidebar: "Collapse sidebar",
  expandSidebar: "Expand sidebar", 
  goToAdminDashboard: "Go to admin dashboard",
  logoAlt: "MWRD Logo",
  managementPortal: "Management Portal",
  viewNotifications: "View notifications",
  languageEnglish: "English",
  languageArabic: "العربية",

  // Root level admin keys for navigation
  dashboard: "Admin Dashboard",
  performanceMonitor: "Performance Monitor", 
  offers: "Offers",
  orders: "Orders",
  financialTransactions: "Financial Transactions",
  subscriptions: "Subscriptions",
  supportTickets: "Support Tickets",
  communications: "Communications",
  settings: "Settings",
  profile: "Profile",
  navigateTo: "Navigate to",
  badgeMax: "99+",
  
  // Direct sidebar navigation keys (avoiding conflicts)
  sidebarAnalytics: "Analytics",
  sidebarUsers: "Users", 
  sidebarRequests: "Requests",
  sidebarExpertConsultations: "Expert Consultations",

  // Common admin filter and action keys
  filterByRole: "Filter by role",
  allRoles: "All roles", 
  admin: "Admin",
  vendor: "Vendor",
  client: "Client",
  filterByStatus: "Filter by status",
  allStatus: "All status",
  approved: "Approved",
  pending: "Pending", 
  blocked: "Blocked",
  rejected: "Rejected",
  selectRole: "Select role",
  updateRoleAction: "Update Role",
  bulkActionConfirm: "Confirm Bulk Action",
  bulkRoleConfirm: "Are you sure you want to change the role of {count} users to {role}?",
  selectStatus: "Select status", 
  updateStatusAction: "Update Status",
  bulkStatusConfirm: "Are you sure you want to change the status of {count} users to {status}?",
  exportSelectedAction: "Export Selected",
  usersTab: "Users",
  verificationQueueTab: "Verification Queue",
  analyticsTab: "Analytics",
  noUsersFound: "No Users Found",
  noUsersMatchFilters: "No users match your current filters.",
  deleteUserTitle: "Delete User",
  deleteUserConfirm: "Are you sure you want to delete {name}? This action cannot be undone.",
  verificationText: "Verification: {status}",
  joinedText: "Joined {date}",
  approvedStatus: "Approved",
  pendingStatus: "Pending", 
  blockedStatus: "Blocked",
  rejectedStatus: "Rejected",
  newThisMonthAnalytics: "New This Month",
  usersRegisteredAnalytics: "Users registered",
  activeThisWeekAnalytics: "Active This Week", 
  usersWithActivityAnalytics: "Users with activity",
  growthRateAnalytics: "Growth Rate",
  vsLastMonthAnalytics: "vs last month",
  totalUsersAnalytics: "Total Users",
  allTimeAnalytics: "All time",
  userDistributionByRole: "User Distribution by Role",
  clients: "Clients",
  vendors: "Vendors", 
  admins: "Admins",
  userStatusOverview: "User Status Overview",

  // User Management
  users: {
    // Page headers
    userManagement: "User Management",
    userManagementDescription: "Manage user accounts, roles, and access permissions across the platform.",
    
    // Metrics cards
    totalUsers: "Total Users",
    allRegisteredUsers: "All registered users",
    activeUsers: "Active Users", 
    approvedUsers: "Approved users",
    pendingUsers: "Pending Users",
    awaitingApproval: "Awaiting approval",
    adminUsers: "Admin Users",
    systemAdministrators: "System administrators",
    
    // Filters and actions
    filtersAndSearch: "Filters & Search",
    searchUsers: "Search users by name, email, or company...",
    refresh: "Refresh",
    exportUsers: "Export Users",
    addUser: "Add User",
    selectAllUsers: "Select All ({count} selected)",
    
    // User status labels
    userPending: "Pending",
    userActive: "Active", 
    userBlocked: "Blocked",
    userInactive: "Inactive",
    
    // User roles
    admin: "Admin",
    vendor: "Vendor", 
    client: "Client",
    
    // Actions and messages
    fetchUsersError: "Failed to fetch users",
    noName: "No Name",
    csvHeaders: "ID,Name,Email,Role,Status,Verification,Company,Phone,Created",
    bulkRoleUpdateSuccess: "Successfully updated {count} users' roles",
    bulkRoleUpdateError: "Failed to update user roles",
    bulkStatusUpdateSuccess: "Successfully updated {count} users' status",
    bulkStatusUpdateError: "Failed to update user status",
    exportSelectedSuccess: "Exported {count} selected users successfully",
    fillRequiredFields: "Please fill in all required fields",
    userExistsError: "A user with this email already exists",
    userAddedSuccess: "User added successfully",
    userUpdatedSuccess: "User updated successfully", 
    userDeletedSuccess: "User '{name}' deleted successfully",
    
    // Add user modal
    addNewUser: "Add New User",
    addNewUserDescription: "Create a new user account with the specified role and permissions.",
    fullNameRequired: "Full Name *",
    enterFullName: "Enter user's full name",
    emailRequired: "Email *",
    enterEmailAddress: "Enter email address",
    roleLabel: "Role",
    clientRole: "Client",
    vendorRole: "Vendor", 
    adminRole: "Admin",
    companyName: "Company Name",
    enterCompanyNameOptional: "Enter company name (optional)",
    enterPhoneOptional: "Enter phone number (optional)",
    
    // Edit user modal
    editUser: "Edit User",
    editUserDescription: "Update user information, role, and status.",
    editFullName: "Full Name",
    editEmail: "Email", 
    editRole: "Role",
    editStatus: "Status",
    editCompanyName: "Company Name",
    editPhone: "Phone",
    updateUser: "Update User"
  },

  // Dashboard and Overview (nested object)
  dashboardData: {
    title: "Admin Dashboard",
    description: "Comprehensive platform management and monitoring",
    welcome: "Welcome to Admin Dashboard",
    overview: "Platform Overview",
    quickActions: "Quick Actions",
    quickActionsDesc: "Commonly used admin functions and shortcuts"
  },

  // Analytics Keys
  analytics: {
    title: "Analytics",
    totalUsers: "Total Users",
    totalRevenue: "Total Revenue", 
    pendingApprovals: "Pending Approvals",
    platformActivity: "Platform Activity",
    platformActivityDesc: "Overview of platform usage and activity trends",
    recentActivity: "Recent Activity",
    recentActivityDescription: "Latest system activities and changes",
    activityOn: "on",
    noRecentActivity: "No recent activity"
  },

  // Request Management Keys  
  requests: {
    title: "Requests",
    requiresAdminReview: "Requires admin review"
  },

  // Navigation groups
  groups: {
    overview: "Overview",
    management: "Management",
    business: "Business",
    system: "System"
  },

  // Navigation descriptions for comprehensive overview
  navigation: {
    userManagement: "User Management",
    userManagementDescription: "Manage user accounts and permissions",
    approvalQueue: "Approval Queue", 
    approvalQueueDescription: "Review pending requests and offers",
    financialOverview: "Financial Overview",
    financialOverviewDescription: "Monitor transactions and revenue",
    systemHealth: "System Health",
    systemHealthDescription: "Check server and system status",
    securityCenter: "Security Center",
    securityCenterDescription: "Security monitoring and compliance",
    communications: "Communications", 
    communicationsDescription: "Manage notifications and messaging",
    analytics: "Analytics",
    analyticsDescription: "View platform insights and metrics",
    automation: "Automation",
    automationDescription: "Workflow automation and rules",
    projects: "Projects",
    verificationQueue: "Verification Queue",
    workflowAutomation: "Workflow Automation",
    categoryManagement: "Category Management"
  },

  // Breadcrumbs
  breadcrumbs: {
    admin: "Admin",
    dashboardOverview: "Dashboard Overview",
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
    unknown: "Unknown",
    dashboard: "Dashboard",
    users: "Users",
    requests: "Requests",
    offers: "Offers",
    orders: "Orders",
    transactions: "Transactions",
    analytics: "Analytics",
    settings: "Settings",
    communications: "Communications",
    security: "Security",
    verification: "Verification",
    automation: "Automation"
  },

  // Command Palette
  commandPalette: {
    placeholder: "Type a command or search...",
    noResults: "No results found",
    recent: "Recent",
    suggestions: "Suggestions"
  },

  // User Management (detailed object)
  usersManagement: {
    title: "User Management",
    description: "Manage platform users and their permissions",
    searchPlaceholder: "Search users...",
    filterByRole: "Filter by role",
    filterByStatus: "Filter by status",
    allRoles: "All roles",
    allStatuses: "All statuses",
    exportUsers: "Export Users",
    bulkActions: "Bulk Actions",
    selectedUsers: "selected users",
    userDetails: {
      personalInfo: "Personal Information",
      accountSettings: "Account Settings",
      activityHistory: "Activity History",
      role: "Role",
      status: "Status",
      client: "Client",
      vendor: "Vendor",
      admin: "Admin",
      active: "Active",
      suspended: "Suspended",
      pending: "Pending",
      selectRole: "Select role",
      addUserError: "Failed to add user"
    }
  },

  // Request Management (detailed object)  
  requestsManagement: {
    title: "Request Management",
    description: "Monitor and manage procurement requests",
    searchPlaceholder: "Search requests...",
    exportRequests: "Export Requests"
  },

  // Orders Management
  ordersManagement: {
    title: "Orders Management",
    description: "Track and manage customer orders",
    searchPlaceholder: "Search orders...",
    exportOrders: "Export Orders",
    csvOrderId: "Order ID",
    csvClient: "Client",
    csvSupplier: "Supplier", 
    csvAmount: "Amount",
    csvStatus: "Status",
    csvDate: "Date"
  },

  // Financial Management
  financial: {
    title: "Financial Dashboard",
    description: "Monitor transactions, revenue, and financial performance",
    transactionHistory: "Transaction History",
    revenue: "Revenue",
    expenses: "Expenses",
    balance: "Balance",
    totalRevenue: "Total Revenue",
    pendingAmount: "Pending Amount",
    failedTransactions: "Failed Transactions",
    avgTransaction: "Avg Transaction",
    perCompletedTransaction: "Per completed transaction",
    awaitingProcessing: "Awaiting processing",
    needsAttention: "Needs attention",
    monthlyGrowth: "+12.5% this month",
    revenueTrend: "Revenue Trend",
    financialPerformance: "Financial performance over the selected period",
    recentTransactions: "Recent Transactions",
    viewAndManage: "View and manage financial transactions",
    searchTransactions: "Search transactions...",
    filterByStatus: "Filter by Status",
    filterByType: "Filter by Type",
    allStatus: "All Status",
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    allTypes: "All Types",
    payment: "Payment",
    refund: "Refund",
    noTransactionsFound: "No transactions found",
    adjustFilters: "Try adjusting your search or filters",
    export: "Export",
    refresh: "Refresh",
    loadingDashboard: "Loading financial dashboard...",
    exportSuccess: "Transactions exported successfully",
    exportError: "Failed to export transactions",
    fetchError: "Failed to fetch transactions",
    csvTransactionId: "Transaction ID",
    csvUser: "User",
    csvAmount: "Amount",
    csvType: "Type",
    csvStatus: "Status",
    csvDate: "Date",
    bulkProcessTransactions: "Process Selected",
    bulkProcessing: "Processing transactions...",
    transactionsSelected: "transactions selected"
  },

  // Verification Management
  verification: {
    title: "Verification Queue",
    description: "Review pending user verifications",
    documentReview: "Document Review",
    approveVerification: "Approve",
    rejectVerification: "Reject",
    verificationStatus: "Verification Status",
    tableNotFoundError: "Verification table not found",
    tableNotFoundMessage: "Verification system not yet configured", 
    fallbackToDemo: "Loading demo data",
    documentNotFound: "Document not found",
    failedAccessDocument: "Failed to access document",
    cannotDownloadMissing: "Cannot download missing document", 
    failedDownloadDocument: "Failed to download document",
    requestUpdated: "Request updated:",
    failedUpdateStatus: "Failed to update status",
    demoUser1: "Demo User 1",
    demoCompany1: "Demo Company 1", 
    demoUser2: "Demo User 2",
    demoCompany2: "Demo Company 2"
  },

  verificationQueue: {
    approved: "Approved",
    rejected: "Rejected", 
    pending: "Pending",
    underReview: "Under Review",
    checking: "Checking",
    available: "Available",
    missing: "Missing", 
    unknown: "Unknown",
    viewDocument: "View Document",
    download: "Download",
    email: "Email:",
    submitted: "Submitted",
    documentStatus: "Document Status",
    warning: "Warning!",
    documentMissing: "Document file is missing from storage",
    unknownUser: "Unknown User",
    totalCount: "Total Count",
    pendingCount: "Pending",
    approvedCount: "Approved", 
    rejectedCount: "Rejected",
    underReviewCount: "Under Review",
    avgProcessingTime: "Avg Processing Time",
    approvalRate: "Approval Rate",
    addReviewNotesPlaceholder: "Add review notes (optional)...",
    // Analytics cards
    totalRequests: "Total Requests",
    pendingReview: "Pending Review",
    avgProcessing: "Avg Processing Time",
    // Controls and actions
    searchPlaceholder: "Search verification requests...",
    sortByDate: "Sort by Date",
    sortByName: "Sort by Name", 
    sortByStatus: "Sort by Status",
    tableView: "Table View",
    cardView: "Card View",
    refresh: "Refresh",
    // Action buttons
    processing: "Processing...",
    approve: "Approve",
    reject: "Reject",
    cannotApproveMessage: "Cannot approve requests with missing documents",
    reviewNotesRequired: "Review notes are required for rejection", 
    reviewNotes: "Review Notes:",
    // Table headers
    verificationRequestsTable: "Verification Requests",
    comprehensiveView: "Comprehensive view of all verification requests",
    vendorInformation: "Vendor Information",
    document: "Document",
    status: "Status",
    actions: "Actions",
    // Bulk actions
    requestsSelected: "{count} requests selected",
    bulkApprove: "Bulk Approve",
    bulkReject: "Bulk Reject", 
    bulkApproveTitle: "Bulk Approve Requests",
    bulkRejectTitle: "Bulk Reject Requests",
    bulkActionDescription: "You are about to {action} {count} requests. Please add notes:",
    bulkNotesPlaceholder: "Add notes for {action} action...",
    cancel: "Cancel",
    confirmApproval: "Confirm Approval",
    confirmRejection: "Confirm Rejection",
    // Loading and empty states
    loadingRequests: "Loading verification requests...",
    noVerificationRequests: "No Verification Requests",
    noRequestsMatch: "No requests match your search criteria",
    noVerificationRequestsFound: "No verification requests found",
    noStatusRequestsFound: "No {status} requests found",
    clearSearch: "Clear Search",
    // Tabs
    all: "All"
  },

  // System Management
  system: {
    title: "System Management",
    description: "System health and configuration",
    alerts: "System Alerts",
    activeSystemAlerts: "active system alerts",
    requireAttention: "require attention",
    health: "System Health",
    healthy: "Healthy",
    warning: "Warning",
    critical: "Critical",
    allSystemsOperational: "All systems operational",
    database: "Database",
    cpuUsage: "CPU Usage",
    memoryUsage: "Memory Usage",
    activeConnections: "Active Connections",
    status: "System Status",
    statusDescription: "Current system health and performance metrics",
    metricsError: "Failed to load system metrics"
  },

  // Security Center
  security: {
    title: "Security Center",
    description: "Comprehensive security monitoring and management",
    liveMonitor: "Live Monitor",
    overview: "Overview", 
    incidents: "Incidents",
    auditTrail: "Audit Trail",
    systemHealth: "Health",
    compliance: "Compliance"
  },

  // Expert Consultations Management
  expertConsultations: {
    title: "Expert Consultations",
    description: "Manage consultation requests and scheduling",
    table: "Table View",
    cards: "Cards View",
    totalConsultations: "Total Consultations", 
    allTime: "All time",
    awaitingResponse: "Awaiting response",
    activeBookings: "Active bookings",
    successfullyFinished: "Successfully finished",
    avgResponseTime: "Avg Response Time",
    hoursUnit: "h",
    responseTime: "Average response time",
    conversionRate: "Conversion Rate",
    completionRate: "Completion rate",
    consultationManagement: "Consultation Management",
    exportBtn: "Export",
    refresh: "Refresh",
    searchPlaceholder: "Search consultations...",
    status: "Status",
    allStatus: "All Status",
    pending: "Pending",
    scheduled: "Scheduled", 
    completed: "Completed",
    cancelled: "Cancelled",
    eventType: "Event Type",
    allEvents: "All Events",
    consultation: "Consultation",
    meeting: "Meeting",
    presentation: "Presentation",
    workshop: "Workshop",
    sortBy: "Sort By",
    dateCreated: "Date Created",
    name: "Name",
    asc: "Ascending",
    desc: "Descending",
    consultationsSelected: "consultations selected",
    consultationSelected: "consultation selected", 
    changeStatus: "Change Status",
    deleteBtn: "Delete",
    deleteConsultations: "Delete Consultations",
    deleteConsultationConfirm: "Are you sure you want to delete",
    cannotUndo: "This action cannot be undone.",
    cancelBtn: "Cancel",
    fullName: "Full Name",
    company: "Company",
    createdAt: "Created At",
    actions: "Actions",
    notProvided: "Not provided",
    viewDetails: "View Details",
    schedule: "Schedule",
    complete: "Complete",
    deleteConsultationTitle: "Delete Consultation",
    deleteConsultationMessage: "Are you sure you want to delete this consultation?",
    noConsultationsFoundMessage: "No consultations found. Try adjusting your search criteria.",
    allTab: "All",
    noConsultationsFoundCard: "No consultations found with current filters.",
    consultationScheduled: "Consultation scheduled successfully",
    bulkUpdateSuccess: "Successfully updated {count} consultations",
    bulkUpdateFailed: "Failed to update consultations",
    bulkDeleteSuccess: "Successfully deleted {count} consultations",
    bulkDeleteFailed: "Failed to delete consultations",
    csvName: "Name",
    csvEmail: "Email",
    csvCompany: "Company", 
    csvEventType: "Event Type",
    csvStatus: "Status",
    csvCreatedDate: "Created Date",
    csvMessage: "Message"
  },

  // Communication Management
  communication: {
    title: "Communication Center",
    description: "Manage platform communications",
    emailCampaigns: "Email Campaigns",
    notifications: "Notifications",
    messaging: "Messaging"
  },

  // Common Actions
  actions: {
    viewDetails: "View Details",
    export: "Export",
    import: "Import",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    save: "Save",
    cancel: "Cancel",
    approve: "Approve",
    reject: "Reject",
    suspend: "Suspend",
    activate: "Activate"
  },

  // Messages and Notifications
  messages: {
    success: "Success",
    error: "Error",
    warning: "Warning",  
    info: "Information",
    loading: "Loading...",
    saved: "Saved successfully",
    deleted: "Deleted successfully", 
    updated: "Updated successfully",
    created: "Created successfully"
  },

  // Form Elements
  forms: {
    placeholders: {
      search: "Search...",
      email: "Enter email address",
      name: "Enter full name",
      company: "Enter company name",
      phone: "Enter phone number",
      message: "Enter message"
    },
    labels: {
      email: "Email Address",
      name: "Full Name", 
      company: "Company Name",
      phone: "Phone Number",
      role: "Role",
      status: "Status",
      dateRange: "Date Range"
    },
    validation: {
      required: "This field is required",
      invalidEmail: "Please enter a valid email",
      invalidPhone: "Please enter a valid phone number",
      minLength: "Minimum {count} characters required",
      maxLength: "Maximum {count} characters allowed"
    }
  }
};