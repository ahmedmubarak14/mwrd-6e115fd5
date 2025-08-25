
import { supabase } from '@/integrations/supabase/client';

// Security utility functions
export const validateEmailDomain = (email: string): boolean => {
  // Basic email validation with domain checking
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Block known disposable email domains
  const disposableDomains = ['10minutemail.com', 'temp-mail.org', 'guerrillamail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  return !disposableDomains.includes(domain);
};

export const sanitizeInput = (input: string): string => {
  // Remove potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const validateRedirectUrl = (url: string): boolean => {
  // Only allow redirects to the same origin
  try {
    const redirectUrl = new URL(url);
    const currentOrigin = window.location.origin;
    return redirectUrl.origin === currentOrigin;
  } catch {
    return false;
  }
};

export const logSecurityEvent = async (event: string, details: any) => {
  try {
    await supabase.from('audit_log').insert({
      action: 'security_event',
      entity_type: 'security',
      entity_id: crypto.randomUUID(),
      new_values: { event, details, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 300000): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  reset(key: string) {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();
