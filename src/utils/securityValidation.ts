
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Enhanced input validation schemas
export const securitySchemas = {
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email too short')
    .max(100, 'Email too long')
    .refine(email => {
      // Block suspicious patterns
      const suspiciousPatterns = [
        /javascript:/i,
        /<script/i,
        /on\w+\s*=/i,
        /data:text\/html/i
      ];
      return !suspiciousPatterns.some(pattern => pattern.test(email));
    }, 'Invalid email format'),

  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .refine(name => {
      // Block XSS attempts and suspicious characters
      const dangerousPatterns = [
        /<[^>]*>/,
        /javascript:/i,
        /on\w+\s*=/i,
        /\beval\b/i,
        /\balert\b/i
      ];
      return !dangerousPatterns.some(pattern => pattern.test(name));
    }, 'Invalid characters in name'),

  message: z.string()
    .min(1, 'Message is required')
    .max(5000, 'Message too long')
    .refine(message => {
      // Allow basic formatting but block dangerous scripts
      const blockedPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /\beval\s*\(/gi,
        /\balert\s*\(/gi,
        /document\.cookie/gi,
        /window\.location/gi
      ];
      return !blockedPatterns.some(pattern => pattern.test(message));
    }, 'Message contains invalid content'),

  url: z.string()
    .url('Invalid URL format')
    .refine(url => {
      try {
        const urlObj = new URL(url);
        // Block dangerous protocols
        const allowedProtocols = ['http:', 'https:'];
        return allowedProtocols.includes(urlObj.protocol);
      } catch {
        return false;
      }
    }, 'Invalid or unsafe URL')
};

// Enhanced sanitization functions
export const sanitizeInput = (input: string, options: {
  allowHTML?: boolean;
  maxLength?: number;
} = {}): string => {
  const { allowHTML = false, maxLength = 1000 } = options;
  
  if (!input || typeof input !== 'string') return '';
  
  let sanitized = input.trim();
  
  // Truncate if too long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  if (allowHTML) {
    // Use DOMPurify for HTML content
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
      ALLOWED_ATTR: []
    });
  } else {
    // Strip all HTML and dangerous content
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '')
      .replace(/\beval\b/gi, '')
      .replace(/\balert\b/gi, '');
  }
  
  return sanitized;
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 100);
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type.toLowerCase();
  
  const allowedExtensions = allowedTypes.map(type => type.toLowerCase());
  
  return allowedExtensions.includes(mimeType) || 
         (fileExtension && allowedExtensions.some(type => type.includes(fileExtension)));
};

export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Rate limiting utilities
export class ClientRateLimiter {
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

export const clientRateLimiter = new ClientRateLimiter();

// Content Security Policy helpers
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

// Secure random ID generation
export const generateSecureId = (length: number = 16): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(36)).join('').substring(0, length);
};
