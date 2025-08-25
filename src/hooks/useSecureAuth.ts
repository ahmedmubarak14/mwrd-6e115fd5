
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { validateEmailDomain, sanitizeInput, logSecurityEvent, rateLimiter } from '@/utils/security';
import { useToastFeedback } from './useToastFeedback';

export const useSecureAuth = () => {
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useToastFeedback();

  const secureSignUp = async (email: string, password: string, userData: any) => {
    const clientIP = 'user-signup'; // In production, get actual IP
    
    // Rate limiting check
    if (!rateLimiter.isAllowed(clientIP, 3, 600000)) { // 3 attempts per 10 minutes
      showError('Too many signup attempts. Please try again later.');
      await logSecurityEvent('signup_rate_limit_exceeded', { email, ip: clientIP });
      return { error: { message: 'Rate limit exceeded' } };
    }

    // Validate email
    if (!validateEmailDomain(email)) {
      showError('Please use a valid email address.');
      await logSecurityEvent('invalid_email_attempt', { email, ip: clientIP });
      return { error: { message: 'Invalid email' } };
    }

    // Sanitize user input
    const sanitizedData = {
      full_name: sanitizeInput(userData.full_name || ''),
      company_name: sanitizeInput(userData.company_name || ''),
      role: userData.role
    };

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: sanitizedData,
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        await logSecurityEvent('signup_failed', { email, error: error.message, ip: clientIP });
        return { error };
      }

      await logSecurityEvent('signup_success', { email, role: userData.role, ip: clientIP });
      rateLimiter.reset(clientIP); // Reset on success
      
      return { data, error: null };
    } catch (error) {
      await logSecurityEvent('signup_error', { email, error: String(error), ip: clientIP });
      return { error: { message: 'An unexpected error occurred' } };
    } finally {
      setLoading(false);
    }
  };

  const secureSignIn = async (email: string, password: string) => {
    const clientIP = 'user-signin'; // In production, get actual IP
    
    // Rate limiting check
    if (!rateLimiter.isAllowed(clientIP, 5, 900000)) { // 5 attempts per 15 minutes
      showError('Too many login attempts. Please try again later.');
      await logSecurityEvent('signin_rate_limit_exceeded', { email, ip: clientIP });
      return { error: { message: 'Rate limit exceeded' } };
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        await logSecurityEvent('signin_failed', { email, error: error.message, ip: clientIP });
        return { error };
      }

      await logSecurityEvent('signin_success', { email, userId: data.user?.id, ip: clientIP });
      rateLimiter.reset(clientIP); // Reset on success
      
      return { data, error: null };
    } catch (error) {
      await logSecurityEvent('signin_error', { email, error: String(error), ip: clientIP });
      return { error: { message: 'An unexpected error occurred' } };
    } finally {
      setLoading(false);
    }
  };

  const securePasswordReset = async (email: string) => {
    const clientIP = 'password-reset';
    
    // Rate limiting check
    if (!rateLimiter.isAllowed(clientIP, 3, 3600000)) { // 3 attempts per hour
      showError('Too many password reset attempts. Please try again later.');
      return { error: { message: 'Rate limit exceeded' } };
    }

    if (!validateEmailDomain(email)) {
      showError('Please use a valid email address.');
      return { error: { message: 'Invalid email' } };
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (error) {
        await logSecurityEvent('password_reset_failed', { email, error: error.message });
        return { error };
      }

      await logSecurityEvent('password_reset_requested', { email });
      showSuccess('Password reset link sent to your email.');
      
      return { error: null };
    } catch (error) {
      await logSecurityEvent('password_reset_error', { email, error: String(error) });
      return { error: { message: 'An unexpected error occurred' } };
    } finally {
      setLoading(false);
    }
  };

  return {
    secureSignUp,
    secureSignIn,
    securePasswordReset,
    loading
  };
};
