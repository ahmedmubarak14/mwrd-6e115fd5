/**
 * Application health check utilities
 * Used for monitoring and production readiness
 */

import { supabase } from '@/integrations/supabase/client';
import { createLogger } from './logger';

const logger = createLogger('HealthCheck');

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: boolean;
    authentication: boolean;
    storage: boolean;
    [key: string]: boolean;
  };
  metrics?: {
    responseTime: number;
    memoryUsage?: number;
  };
}

/**
 * Perform a comprehensive health check
 */
export async function performHealthCheck(): Promise<HealthCheckResult> {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();
  
  const checks = {
    database: await checkDatabase(),
    authentication: await checkAuthentication(),
    storage: await checkStorage(),
  };

  const responseTime = performance.now() - startTime;
  const allHealthy = Object.values(checks).every(Boolean);
  const someHealthy = Object.values(checks).some(Boolean);

  const status: HealthCheckResult['status'] = 
    allHealthy ? 'healthy' : 
    someHealthy ? 'degraded' : 'unhealthy';

  const result: HealthCheckResult = {
    status,
    timestamp,
    checks,
    metrics: {
      responseTime: Math.round(responseTime),
      memoryUsage: getMemoryUsage(),
    },
  };

  logger.info('Health check completed', result);
  return result;
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    logger.error('Database health check failed', { error });
    return false;
  }
}

/**
 * Check authentication service
 */
async function checkAuthentication(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getSession();
    // Auth service is healthy if we can get a session (even if null)
    return !error;
  } catch (error) {
    logger.error('Auth health check failed', { error });
    return false;
  }
}

/**
 * Check storage service
 */
async function checkStorage(): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    return !error;
  } catch (error) {
    logger.error('Storage health check failed', { error });
    return false;
  }
}

/**
 * Get memory usage information
 */
function getMemoryUsage(): number | undefined {
  if ('memory' in performance) {
    // @ts-ignore - performance.memory is available in Chrome
    return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
  }
  return undefined;
}

/**
 * Simple uptime tracking
 */
let startTime = Date.now();

export function getUptime(): number {
  return Date.now() - startTime;
}

/**
 * Reset uptime counter (useful for testing)
 */
export function resetUptime(): void {
  startTime = Date.now();
}