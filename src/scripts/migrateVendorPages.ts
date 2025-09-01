// Migration script to update all vendor pages to use OptimizedVendorLayout

const vendorPages = [
  'src/pages/VendorDashboard.tsx',
  'src/pages/vendor/CRManagement.tsx', 
  'src/pages/vendor/PortfolioManagement.tsx',
  'src/pages/vendor/ProjectsManagement.tsx',
  'src/pages/vendor/VendorAnalytics.tsx',
  'src/pages/vendor/VendorBrowseRequests.tsx',
  'src/pages/vendor/VendorClients.tsx',
  'src/pages/vendor/VendorDocuments.tsx',
  'src/pages/vendor/VendorMessages.tsx',
  'src/pages/vendor/VendorNotifications.tsx',
  'src/pages/vendor/VendorOffers.tsx',
  'src/pages/vendor/VendorOrders.tsx',
  'src/pages/vendor/VendorProfile.tsx',
  'src/pages/vendor/VendorProjects.tsx',
  'src/pages/vendor/VendorRFQs.tsx',
  'src/pages/vendor/VendorReports.tsx',
  'src/pages/vendor/VendorSettings.tsx',
  'src/pages/vendor/VendorSubscription.tsx',
  'src/pages/vendor/VendorTransactions.tsx'
];

export const migrationTasks = {
  // Update import statements
  updateImports: (content: string) => {
    return content.replace(
      'import { VendorLayout } from "@/components/vendor/VendorLayout";',
      'import { OptimizedVendorLayout } from "@/components/vendor/OptimizedVendorLayout";'
    );
  },

  // Update JSX usage
  updateJSX: (content: string) => {
    return content
      .replace(/<VendorLayout>/g, '<OptimizedVendorLayout>')
      .replace(/<\/VendorLayout>/g, '</OptimizedVendorLayout>');
  },

  // Add performance monitoring
  addPerformanceMonitoring: (content: string) => {
    if (!content.includes('PerformanceMonitor')) {
      const importMatch = content.match(/^import.*from.*$/gm);
      if (importMatch) {
        const lastImport = importMatch[importMatch.length - 1];
        return content.replace(
          lastImport,
          `${lastImport}\nimport { PerformanceMonitor } from "@/components/dev/PerformanceMonitor";`
        );
      }
    }
    return content;
  }
};

// Validation checks
export const validateMigration = {
  checkImports: (content: string) => {
    return !content.includes('VendorLayout') || content.includes('OptimizedVendorLayout');
  },

  checkJSXUsage: (content: string) => {
    return !content.includes('<VendorLayout>') && !content.includes('</VendorLayout>');
  },

  checkOptimizations: (content: string) => {
    // Check for modern React patterns
    const checks = [
      content.includes('React.memo') || content.includes('useMemo') || content.includes('useCallback'),
      !content.includes('console.log'), // No debug logs
      content.includes('loading') || content.includes('error'), // Proper states
    ];
    return checks.some(Boolean);
  }
};

console.log('Vendor page migration utilities ready for:', vendorPages.length, 'pages');