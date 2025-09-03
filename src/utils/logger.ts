/**
 * Production-safe logging utility
 * Replaces console.log statements for better production control
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private isDevelopment = import.meta.env.NODE_ENV === 'development';
  private enableDebugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';

  private log(level: LogLevel, message: string, context?: LogContext, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const componentInfo = context?.component ? ` [${context.component}]` : '';
    
    const logMessage = `${prefix}${componentInfo} ${message}`;

    // Always log errors and warnings
    if (level === 'error' || level === 'warn') {
      console[level](logMessage, context, ...args);
      return;
    }

    // Log info and debug only in development or when debug mode is enabled
    if (this.isDevelopment || this.enableDebugMode) {
      console[level === 'debug' ? 'log' : level](logMessage, context, ...args);
    }
  }

  debug(message: string, context?: LogContext, ...args: any[]) {
    this.log('debug', message, context, ...args);
  }

  info(message: string, context?: LogContext, ...args: any[]) {
    this.log('info', message, context, ...args);
  }

  warn(message: string, context?: LogContext, ...args: any[]) {
    this.log('warn', message, context, ...args);
  }

  error(message: string, context?: LogContext, ...args: any[]) {
    this.log('error', message, context, ...args);
  }

  // Component-specific logger factory
  createComponentLogger(componentName: string) {
    return {
      debug: (message: string, metadata?: any, ...args: any[]) => 
        this.debug(message, { component: componentName, metadata }, ...args),
      info: (message: string, metadata?: any, ...args: any[]) => 
        this.info(message, { component: componentName, metadata }, ...args),
      warn: (message: string, metadata?: any, ...args: any[]) => 
        this.warn(message, { component: componentName, metadata }, ...args),
      error: (message: string, metadata?: any, ...args: any[]) => 
        this.error(message, { component: componentName, metadata }, ...args),
    };
  }
}

// Export singleton instance
export const logger = new Logger();

// Export component logger factory for easy use
export const createLogger = (componentName: string) => 
  logger.createComponentLogger(componentName);