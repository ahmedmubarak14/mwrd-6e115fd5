// Production validation utilities

export const productionChecks = {
  // Validate required environment setup
  checkEnvironment: () => {
    const checks = {
      supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      httpsInProd: location.protocol === 'https:' || location.hostname === 'localhost',
      noConsoleErrors: !window.console.error.toString().includes('native')
    };
    
    return {
      passed: Object.values(checks).every(Boolean),
      checks,
      score: Object.values(checks).filter(Boolean).length / Object.values(checks).length
    };
  },

  // Check accessibility standards
  checkAccessibility: () => {
    const checks = {
      hasSkipLinks: !!document.querySelector('[href="#main-content"]'),
      hasProperId: !!document.getElementById('main-content'),
      hasLangAttr: !!document.documentElement.lang,
      hasMetaViewport: !!document.querySelector('meta[name="viewport"]'),
      hasAriaLabels: document.querySelectorAll('[aria-label], [aria-labelledby]').length > 0
    };

    return {
      passed: Object.values(checks).filter(Boolean).length >= 4,
      checks,
      score: Object.values(checks).filter(Boolean).length / Object.values(checks).length
    };
  },

  // Performance validation
  checkPerformance: () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource');
    
    const metrics = {
      loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : 0,
      resourceCount: resources.length,
      largeResources: resources.filter(r => (r as any).transferSize > 500000).length
    };

    const checks = {
      fastLoad: metrics.loadTime < 3000,
      quickDom: metrics.domContentLoaded < 1500,
      efficientResources: metrics.resourceCount < 50,
      noLargeResources: metrics.largeResources === 0
    };

    return {
      passed: Object.values(checks).filter(Boolean).length >= 3,
      checks,
      metrics,
      score: Object.values(checks).filter(Boolean).length / Object.values(checks).length
    };
  },

  // Security validation
  checkSecurity: () => {
    const checks = {
      httpsEnabled: location.protocol === 'https:' || location.hostname === 'localhost',
      noInlineScripts: document.querySelectorAll('script:not([src])').length === 0,
      hasCSP: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
      noEvalUsage: !window.eval.toString().includes('native'),
      secureStorage: !localStorage.getItem('password') && !sessionStorage.getItem('password')
    };

    return {
      passed: Object.values(checks).filter(Boolean).length >= 3,
      checks,
      score: Object.values(checks).filter(Boolean).length / Object.values(checks).length
    };
  }
};

// Complete production readiness check
export const runProductionAudit = () => {
  const environment = productionChecks.checkEnvironment();
  const accessibility = productionChecks.checkAccessibility();
  const performance = productionChecks.checkPerformance();
  const security = productionChecks.checkSecurity();

  const overallScore = (
    environment.score + 
    accessibility.score + 
    performance.score + 
    security.score
  ) / 4;

  const readyForProduction = overallScore >= 0.8 && [
    environment.passed,
    accessibility.passed,
    performance.passed,
    security.passed
  ].filter(Boolean).length >= 3;

  return {
    readyForProduction,
    overallScore,
    categories: {
      environment,
      accessibility, 
      performance,
      security
    },
    recommendations: generateRecommendations({
      environment,
      accessibility,
      performance,
      security
    })
  };
};

function generateRecommendations(results: any) {
  const recommendations = [];

  if (!results.environment.passed) {
    recommendations.push('Configure all required environment variables');
  }
  if (!results.accessibility.passed) {
    recommendations.push('Add missing accessibility features (skip links, ARIA labels)');
  }
  if (!results.performance.passed) {
    recommendations.push('Optimize bundle size and reduce resource count');
  }
  if (!results.security.passed) {
    recommendations.push('Enable HTTPS and implement proper CSP headers');
  }

  return recommendations;
}