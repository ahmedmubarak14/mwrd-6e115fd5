/**
 * Admin Translations - English (US)
 * Clean, focused translation keys for admin interface
 */

export const adminTranslationsEN = {
  admin: {
    // Dashboard and Overview
    dashboard: {
      title: "Admin Dashboard",
      description: "Comprehensive platform management and monitoring",
      welcome: "Welcome to Admin Dashboard",
      overview: "Platform Overview",
      quickActions: "Quick Actions",
      quickActionsDesc: "Commonly used admin functions and shortcuts"
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
      automationDescription: "Workflow automation and rules"
    },

    // Breadcrumbs
    breadcrumbs: {
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
      automation: "Automation",
      expertConsultations: "Expert Consultations"
    },

    // Command Palette
    commandPalette: {
      placeholder: "Type a command or search...",
      noResults: "No results found",
      recent: "Recent",
      suggestions: "Suggestions"
    },

    // User Management
    users: {
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

    // Request Management  
    requests: {
      title: "Request Management",
      description: "Monitor and manage procurement requests",
      searchPlaceholder: "Search requests...",
      exportRequests: "Export Requests"
    },

    // Offers Management
    offersManagement: {
      title: "Offers Management", 
      description: "Review and manage supplier offers",
      searchPlaceholder: "Search offers...",
      exportOffers: "Export Offers",
      pendingApprovalSince: "Pending admin approval since",
      requiresAttention: "Requires Attention", 
      approvedAndActive: "Approved and active",
      supplier: "Supplier",
      request: "Request",
      price: "Price",
      daysDelivery: "days delivery",
      created: "Created",
      noOffersFound: "No offers found",
      noOffersDesc: "No offers match your current search criteria."
    },

    // Request Management Specific
    requestsManagement: {
      statusPlaceholder: "Status",
      approvalStatusPlaceholder: "Approval Status", 
      urgencyPlaceholder: "Urgency"
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
      title: "Financial Management",
      description: "Monitor transactions and financial data",
      transactionHistory: "Transaction History",
      revenue: "Revenue",
      expenses: "Expenses",
      balance: "Balance",
      csvTransactionId: "Transaction ID",
      csvUser: "User",
      csvAmount: "Amount",
      csvType: "Type",
      csvStatus: "Status",
      csvDate: "Date",
      bulkProcessTransactions: "Process Selected",
      bulkProcessing: "Processing transactions...",
      transactionsSelected: "transactions selected",
      monthlyGrowth: "Monthly growth"
    },

    // Verification Management
    verification: {
      title: "Verification Queue",
      description: "Review pending user verifications",
      documentReview: "Document Review",
      approveVerification: "Approve",
      rejectVerification: "Reject",
      verificationStatus: "Verification Status"
    },

    // Analytics
    analytics: {
      title: "Platform Analytics",
      description: "Insights and performance metrics",
      totalUsers: "Total Users",
      totalRevenue: "Total Revenue", 
      pendingApprovals: "Pending Approvals",
      platformActivity: "Platform Activity",
      platformActivityDesc: "Daily activity metrics across the platform",
      recentActivity: "Recent Activity",
      recentActivityDescription: "Latest system activities and events",
      activityOn: "on",
      noRecentActivity: "No recent activity"
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
    },

    // Search and filtering
    searchFilter: "Search & Filter",
    searchByTitle: "Search by title, supplier, or request...",
    allStatuses: "All Statuses",
    filterByStatus: "Filter by status"
  },

  // Common UI elements  
  users: {
    addUser: "Add User",
    addUserDescription: "Create a new user account",
    email: "Email",
    fillRequiredFields: "Please fill in all required fields",
    userCreated: "User created successfully",
    createUserError: "Failed to create user",
    activeThisMonth: "active this month"
  },

  requests: {
    requiresAdminReview: "Requires admin review" 
  },

  // Common terms used across admin interface
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    create: "Create",
    update: "Update",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    ok: "OK",
    close: "Close",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    retry: "Retry",
    refresh: "Refresh",
    clear: "Clear",
    select: "Select",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    actions: "Actions",
    options: "Options",
    settings: "Settings",
    preferences: "Preferences",
    account: "Account",
    profile: "Profile",
    dashboard: "Dashboard",
    home: "Home",
    back: "Back",
    forward: "Forward",
    active: "Active",
    inactive: "Inactive",
    enabled: "Enabled",
    disabled: "Disabled",
    online: "Online",
    offline: "Offline",
    available: "Available",
    unavailable: "Unavailable",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
    completed: "Completed",
    failed: "Failed",
    scheduled: "Scheduled",
    draft: "Draft",
    published: "Published",
    archived: "Archived",
    deleted: "Deleted",
    new: "New",
    updated: "Updated",
    modified: "Modified",
    created: "Created",
    date: "Date",
    time: "Time",
    datetime: "Date & Time",
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    lastWeek: "Last Week",
    nextWeek: "Next Week",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    nextMonth: "Next Month",
    thisYear: "This Year",
    lastYear: "Last Year",
    nextYear: "Next Year",
    all: "All",
    none: "None",
    other: "Other",
    unknown: "Unknown",
    total: "Total",
    subtotal: "Subtotal",
    quantity: "Quantity",
    price: "Price",
    amount: "Amount",
    discount: "Discount",
    tax: "Tax",
    shipping: "Shipping",
    currency: "Currency",
    language: "Language",
    timezone: "Timezone",
    country: "Country",
    region: "Region",
    city: "City",
    address: "Address",
    phone: "Phone",
    email: "Email",
    website: "Website",
    company: "Company",
    organization: "Organization",
    department: "Department",
    position: "Position",
    title: "Title",
    description: "Description",
    notes: "Notes",
    comments: "Comments",
    tags: "Tags",
    categories: "Categories",
    type: "Type",
    status: "Status",
    priority: "Priority",
    level: "Level",
    role: "Role"
  }
};