// Production configuration and environment checks
export const PRODUCTION_CONFIG = {
  // Performance settings
  LAZY_LOADING_DELAY: 100,
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 20,
  
  // Cache settings
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  STALE_TIME: 2 * 60 * 1000, // 2 minutes
  
  // Real-time settings
  REALTIME_RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
  
  // Security settings
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS_PER_WINDOW: 100,
  
  // Error handling
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Monitoring
  HEALTH_CHECK_INTERVAL: 30 * 1000, // 30 seconds
  PERFORMANCE_THRESHOLD: 2000, // 2 seconds
};

export const isProduction = () => {
  return import.meta.env.PROD;
};

export const isDevelopment = () => {
  return import.meta.env.DEV;
};

export const getEnvironment = () => {
  if (isProduction()) return 'production';
  if (isDevelopment()) return 'development';
  return 'unknown';
};

// Environment validation
export const validateEnvironment = () => {
  const errors: string[] = [];
  
  // Check required environment variables
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (!import.meta.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  });
  
  // Validate Supabase URL format
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.match(/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/)) {
    errors.push('Invalid Supabase URL format');
  }
  
  // Check for production-specific requirements
  if (isProduction()) {
    // Additional production checks can be added here
    console.log('✅ Production environment validated');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Performance monitoring utilities
export const performanceLogger = {
  startTimer: (name: string) => {
    if (isDevelopment()) {
      console.time(name);
    }
    return Date.now();
  },
  
  endTimer: (name: string, startTime?: number) => {
    if (isDevelopment()) {
      console.timeEnd(name);
    }
    if (startTime) {
      const duration = Date.now() - startTime;
      if (duration > PRODUCTION_CONFIG.PERFORMANCE_THRESHOLD) {
        console.warn(`⚠️ Slow operation detected: ${name} took ${duration}ms`);
      }
    }
  },
  
  logMetric: (name: string, value: number, unit = 'ms') => {
    if (isDevelopment()) {
      console.log(`📊 ${name}: ${value}${unit}`);
    }
  }
};

// Initialize environment on app start
export const initializeEnvironment = () => {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    console.error('❌ Environment validation failed:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    
    if (isProduction()) {
      throw new Error('Invalid production environment configuration');
    }
  } else {
    console.log(`✅ Environment initialized: ${getEnvironment()}`);
  }
  
  // Log performance config in development
  if (isDevelopment()) {
    console.log('🔧 Production config loaded:', PRODUCTION_CONFIG);
  }
  
  return validation;
};