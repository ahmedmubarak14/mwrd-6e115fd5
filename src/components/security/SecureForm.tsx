
import React, { FormEvent, ReactNode } from 'react';
import { z } from 'zod';
import { useSecurity } from '@/contexts/SecurityContext';
import { sanitizeInput, clientRateLimiter } from '@/utils/securityValidation';
import { useToastFeedback } from '@/hooks/useToastFeedback';

interface SecureFormProps {
  children: ReactNode;
  onSubmit: (data: FormData, csrfToken: string) => Promise<void> | void;
  schema?: z.ZodSchema;
  className?: string;
  rateLimitKey?: string;
  maxAttempts?: number;
  windowMs?: number;
}

export const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSubmit,
  schema,
  className = '',
  rateLimitKey,
  maxAttempts = 5,
  windowMs = 300000
}) => {
  const { csrfToken } = useSecurity();
  const { showError } = useToastFeedback();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Rate limiting check
    if (rateLimitKey && !clientRateLimiter.isAllowed(rateLimitKey, maxAttempts, windowMs)) {
      showError('Too many attempts. Please try again later.');
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    // Add CSRF token
    formData.append('csrfToken', csrfToken);
    
    // Sanitize all form inputs
    const sanitizedData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        sanitizedData.append(key, sanitizeInput(value));
      } else {
        sanitizedData.append(key, value);
      }
    }

    // Schema validation if provided
    if (schema) {
      try {
        const dataObject = Object.fromEntries(sanitizedData.entries());
        schema.parse(dataObject);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const firstError = error.errors[0];
          showError(firstError.message);
          return;
        }
      }
    }

    try {
      await onSubmit(sanitizedData, csrfToken);
      
      // Reset rate limiter on successful submission
      if (rateLimitKey) {
        clientRateLimiter.reset(rateLimitKey);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showError('Form submission failed. Please try again.');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={className}
      noValidate
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      {children}
    </form>
  );
};
