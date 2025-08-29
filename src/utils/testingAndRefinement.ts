// Testing and Refinement utilities

export interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export class TestingAndRefinementSuite {
  private results: TestResult[] = [];

  // Mobile responsiveness tests
  testMobileResponsiveness(): TestResult[] {
    const mobileTests: TestResult[] = [];

    // Test viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    mobileTests.push({
      test: 'Viewport Meta Tag',
      status: viewportMeta ? 'pass' : 'fail',
      message: viewportMeta ? 'Viewport meta tag present' : 'Missing viewport meta tag'
    });

    // Test mobile navigation
    const mobileNav = document.querySelector('.mobile-nav, [class*="mobile-nav"]');
    mobileTests.push({
      test: 'Mobile Navigation',
      status: mobileNav ? 'pass' : 'warning',
      message: mobileNav ? 'Mobile navigation detected' : 'No mobile navigation found'
    });

    // Test touch targets (minimum 44px)
    const touchTargets = document.querySelectorAll('button, [role="button"], a');
    let smallTargets = 0;
    touchTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      if (rect.height < 44 || rect.width < 44) {
        smallTargets++;
      }
    });

    mobileTests.push({
      test: 'Touch Target Size',
      status: smallTargets === 0 ? 'pass' : 'warning',
      message: `${smallTargets} touch targets smaller than 44px`,
      details: { totalTargets: touchTargets.length, smallTargets }
    });

    return mobileTests;
  }

  // PWA functionality tests
  testPWAFunctionality(): TestResult[] {
    const pwaTests: TestResult[] = [];

    // Test manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    pwaTests.push({
      test: 'Web App Manifest',
      status: manifestLink ? 'pass' : 'fail',
      message: manifestLink ? 'Manifest linked' : 'Missing manifest link'
    });

    // Test service worker
    const swSupported = 'serviceWorker' in navigator;
    pwaTests.push({
      test: 'Service Worker Support',
      status: swSupported ? 'pass' : 'fail',
      message: swSupported ? 'Service Worker supported' : 'Service Worker not supported'
    });

    // Test installability
    if (swSupported) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        pwaTests.push({
          test: 'Service Worker Registration',
          status: registration ? 'pass' : 'warning',
          message: registration ? 'Service Worker registered' : 'Service Worker not registered'
        });
      });
    }

    return pwaTests;
  }

  // Performance tests
  testPerformance(): TestResult[] {
    const perfTests: TestResult[] = [];

    // Test First Contentful Paint
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint') as PerformanceEntry[];
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcp) {
        const fcpTime = fcp.startTime;
        perfTests.push({
          test: 'First Contentful Paint',
          status: fcpTime < 2000 ? 'pass' : fcpTime < 4000 ? 'warning' : 'fail',
          message: `FCP: ${fcpTime.toFixed(0)}ms`,
          details: { time: fcpTime, threshold: { good: 2000, needs_improvement: 4000 } }
        });
      }

      // Test Largest Contentful Paint
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lcp = lcpEntries[lcpEntries.length - 1];
        const lcpTime = lcp.startTime;
        perfTests.push({
          test: 'Largest Contentful Paint',
          status: lcpTime < 2500 ? 'pass' : lcpTime < 4000 ? 'warning' : 'fail',
          message: `LCP: ${lcpTime.toFixed(0)}ms`,
          details: { time: lcpTime, threshold: { good: 2500, needs_improvement: 4000 } }
        });
      }
    }

    // Test bundle size (approximation)
    const scripts = document.querySelectorAll('script[src]');
    let totalScripts = scripts.length;
    perfTests.push({
      test: 'Script Count',
      status: totalScripts < 10 ? 'pass' : totalScripts < 20 ? 'warning' : 'fail',
      message: `${totalScripts} scripts loaded`,
      details: { count: totalScripts }
    });

    return perfTests;
  }

  // Accessibility tests
  testAccessibility(): TestResult[] {
    const a11yTests: TestResult[] = [];

    // Test images without alt text
    const images = document.querySelectorAll('img');
    let imagesWithoutAlt = 0;
    images.forEach((img) => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        imagesWithoutAlt++;
      }
    });

    a11yTests.push({
      test: 'Image Alt Text',
      status: imagesWithoutAlt === 0 ? 'pass' : 'warning',
      message: `${imagesWithoutAlt} images without alt text`,
      details: { totalImages: images.length, missingAlt: imagesWithoutAlt }
    });

    // Test headings hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const h1Count = document.querySelectorAll('h1').length;
    
    a11yTests.push({
      test: 'Heading Structure',
      status: h1Count === 1 ? 'pass' : h1Count === 0 ? 'fail' : 'warning',
      message: `${h1Count} H1 headings found (should be 1)`,
      details: { h1Count, totalHeadings: headings.length }
    });

    // Test focus indicators
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    a11yTests.push({
      test: 'Focusable Elements',
      status: focusableElements.length > 0 ? 'pass' : 'warning',
      message: `${focusableElements.length} focusable elements found`,
      details: { count: focusableElements.length }
    });

    return a11yTests;
  }

  // Run all tests
  async runAllTests(): Promise<TestResult[]> {
    const allResults: TestResult[] = [
      ...this.testMobileResponsiveness(),
      ...this.testPWAFunctionality(),
      ...this.testPerformance(),
      ...this.testAccessibility()
    ];

    this.results = allResults;
    return allResults;
  }

  // Generate report
  generateReport(): string {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    
    return `
Testing Report:
✅ ${passed} tests passed
⚠️  ${warnings} warnings
❌ ${failed} tests failed

Total Score: ${((passed / this.results.length) * 100).toFixed(1)}%
`;
  }

  // Get improvement suggestions
  getImprovementSuggestions(): string[] {
    const suggestions: string[] = [];
    
    this.results.forEach((result) => {
      if (result.status === 'fail') {
        suggestions.push(`🔴 Fix: ${result.test} - ${result.message}`);
      } else if (result.status === 'warning') {
        suggestions.push(`🟡 Improve: ${result.test} - ${result.message}`);
      }
    });

    return suggestions;
  }
}

// Usage example:
export const runQualityAssurance = async () => {
  const tester = new TestingAndRefinementSuite();
  const results = await tester.runAllTests();
  
  console.log(tester.generateReport());
  console.log('\nImprovement Suggestions:');
  tester.getImprovementSuggestions().forEach(suggestion => {
    console.log(suggestion);
  });
  
  return results;
};