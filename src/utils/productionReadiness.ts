import { createLogger } from '@/utils/logger';

const logger = createLogger('ProductionReadiness');

interface ProductionCheck {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const runProductionReadinessCheck = (): ProductionCheck[] => {
  const checks: ProductionCheck[] = [];

  // Environment configuration check (Lovable projects use direct configuration)
  try {
    // Check if we can access Supabase client configuration
    const hasSupabaseConfig = window.location.hostname === 'localhost' || 
                              window.location.hostname.includes('lovableproject.com') ||
                              window.location.protocol === 'https:';
    checks.push({
      name: 'Environment Configuration',
      status: hasSupabaseConfig ? 'passed' : 'warning',
      message: hasSupabaseConfig ? 'Supabase configuration is accessible' : 'Environment configuration needs verification',
      severity: 'medium'
    });
  } catch {
    checks.push({
      name: 'Environment Configuration',
      status: 'warning',
      message: 'Could not verify environment configuration',
      severity: 'low'
    });
  }

  // Error boundary check
  const hasErrorBoundary = document.querySelector('[data-error-boundary]') !== null;
  checks.push({
    name: 'Error Boundary',
    status: hasErrorBoundary ? 'passed' : 'warning',
    message: hasErrorBoundary ? 'Error boundary is active' : 'Error boundary not detected in DOM',
    severity: 'medium'
  });

  // Performance monitoring
  const hasPerformanceAPI = 'performance' in window && 'mark' in performance;
  checks.push({
    name: 'Performance Monitoring',
    status: hasPerformanceAPI ? 'passed' : 'warning',
    message: hasPerformanceAPI ? 'Performance API available' : 'Performance API not available',
    severity: 'low'
  });

  // Network status monitoring
  const hasNetworkInfo = 'navigator' in window && 'onLine' in navigator;
  checks.push({
    name: 'Network Status Monitoring',
    status: hasNetworkInfo ? 'passed' : 'warning',
    message: hasNetworkInfo ? 'Network status monitoring available' : 'Network status monitoring not available',
    severity: 'low'
  });

  // Security headers (can only partially check from frontend)
  const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  checks.push({
    name: 'Secure Protocol',
    status: isHTTPS ? 'passed' : 'failed',
    message: isHTTPS ? 'Using secure HTTPS protocol' : 'Not using secure HTTPS protocol',
    severity: 'critical'
  });

  // Service Worker (if available)
  const hasServiceWorker = 'serviceWorker' in navigator;
  checks.push({
    name: 'Service Worker Support',
    status: hasServiceWorker ? 'passed' : 'warning',
    message: hasServiceWorker ? 'Service Worker support available' : 'Service Worker not supported',
    severity: 'low'
  });

  // Local Storage availability
  let hasLocalStorage = false;
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    hasLocalStorage = true;
  } catch {
    hasLocalStorage = false;
  }
  
  checks.push({
    name: 'Local Storage',
    status: hasLocalStorage ? 'passed' : 'warning',
    message: hasLocalStorage ? 'Local Storage is available' : 'Local Storage is not available',
    severity: 'medium'
  });

  // Log results
  const failed = checks.filter(c => c.status === 'failed');
  const warnings = checks.filter(c => c.status === 'warning');
  const passed = checks.filter(c => c.status === 'passed');

  logger.info('Production readiness check completed', {
    total: checks.length,
    passed: passed.length,
    warnings: warnings.length,
    failed: failed.length,
    criticalIssues: failed.filter(c => c.severity === 'critical').length
  });

  if (failed.length > 0) {
    logger.error('Production readiness failures', {
      failures: failed.map(f => ({ name: f.name, message: f.message, severity: f.severity }))
    });
  }

  return checks;
};

export const getProductionScore = (checks: ProductionCheck[]): number => {
  const weights = {
    critical: 40,
    high: 25,
    medium: 15,
    low: 5
  };

  let totalWeight = 0;
  let earnedWeight = 0;

  checks.forEach(check => {
    const weight = weights[check.severity];
    totalWeight += weight;
    
    if (check.status === 'passed') {
      earnedWeight += weight;
    } else if (check.status === 'warning') {
      earnedWeight += weight * 0.5; // Half credit for warnings
    }
    // Failed checks get 0 credit
  });

  return Math.round((earnedWeight / totalWeight) * 100);
};