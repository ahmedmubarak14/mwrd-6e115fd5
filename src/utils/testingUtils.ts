// Testing utilities for production vendor dashboard

export const testIds = {
  // Layout
  vendorHeader: 'vendor-header',
  vendorSidebar: 'vendor-sidebar',
  mainContent: 'main-content',
  
  // Navigation
  navItem: (item: string) => `nav-item-${item}`,
  breadcrumb: 'breadcrumb',
  mobileMenuToggle: 'mobile-menu-toggle',
  
  // Dashboard
  statsCard: (stat: string) => `stats-card-${stat}`,
  chartContainer: 'chart-container',
  activityFeed: 'activity-feed',
  
  // Common UI
  loadingSpinner: 'loading-spinner',
  errorBoundary: 'error-boundary',
  emptyState: 'empty-state',
  
  // Forms
  submitButton: 'submit-button',
  cancelButton: 'cancel-button',
  searchInput: 'search-input'
} as const;

export const performanceMarkers = {
  VENDOR_LAYOUT_START: 'vendor-layout-start',
  VENDOR_LAYOUT_END: 'vendor-layout-end',
  DASHBOARD_RENDER_START: 'dashboard-render-start', 
  DASHBOARD_RENDER_END: 'dashboard-render-end',
  DATA_FETCH_START: 'data-fetch-start',
  DATA_FETCH_END: 'data-fetch-end'
} as const;

// Performance measurement helpers
export const measurePerformance = {
  start: (marker: string) => {
    performance.mark(`${marker}-start`);
  },
  
  end: (marker: string) => {
    performance.mark(`${marker}-end`);
    performance.measure(marker, `${marker}-start`, `${marker}-end`);
  },
  
  get: (marker: string) => {
    const measures = performance.getEntriesByName(marker, 'measure');
    return measures.length > 0 ? measures[measures.length - 1].duration : 0;
  },
  
  clear: () => {
    performance.clearMarks();
    performance.clearMeasures();
  }
};

// Test data generators for development
export const mockVendorData = {
  profile: {
    user_id: 'test-vendor-id',
    role: 'vendor',
    full_name: 'Test Vendor',
    company_name: 'Test Company',
    verification_status: 'approved'
  },
  
  stats: {
    totalOffers: 25,
    activeOffers: 8,
    totalEarnings: 15000,
    monthlyEarnings: 3200,
    successRate: 85,
    averageResponseTime: 2.5,
    profileCompletion: 90,
    crStatus: 'approved' as const,
    completedProjects: 17,
    clientSatisfaction: 4.2,
    recentActivity: [],
    offerTrends: []
  }
} as const;

// Accessibility testing helpers
export const a11yHelpers = {
  getFocusableElements: (container: Element) => {
    return container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  },
  
  checkAriaLabels: (container: Element) => {
    const elementsNeedingLabels = container.querySelectorAll(
      'button:not([aria-label]):not([aria-labelledby]), input:not([aria-label]):not([aria-labelledby])'
    );
    return elementsNeedingLabels.length === 0;
  },
  
  checkColorContrast: () => {
    // Basic color contrast validation would go here
    // This is a placeholder for more comprehensive contrast checking
    return true;
  }
};