import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { resendConfirmationEmail } from '@/utils/resendConfirmation';
import { logEmailVerificationEvent } from '@/utils/security';

export const useEmailVerification = () => {
  const { user } = useAuth();
  const { showError, showSuccess, showInfo } = useToastFeedback();
  const [isVerified, setIsVerified] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [lastResendTime, setLastResendTime] = useState<number | null>(null);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Check if user is verified
  useEffect(() => {
    if (user?.email_confirmed_at) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [user]);

  // Handle cooldown timer
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const resendVerificationEmail = async (email?: string) => {
    if (!email && !user?.email) {
      showError('No email address available to send verification to.');
      return false;
    }

    const targetEmail = email || user!.email;
    const now = Date.now();

    // Log the verification request
    await logEmailVerificationEvent('requested', targetEmail, {
      user_id: user?.id,
      source: 'manual_resend'
    });

    // Check client-side rate limiting (1 minute minimum)
    if (lastResendTime && now - lastResendTime < 60000) {
      const remainingTime = Math.ceil((60000 - (now - lastResendTime)) / 1000);
      showError(`Please wait ${remainingTime} seconds before requesting another verification email.`);
      setCooldownTime(remainingTime);
      await logEmailVerificationEvent('rate_limited', targetEmail, {
        reason: 'client_side_cooldown',
        cooldown_remaining_seconds: remainingTime
      });
      return false;
    }

    setResendingEmail(true);
    try {
      const result = await resendConfirmationEmail(targetEmail);
      
      if (result.success) {
        showSuccess('Verification email sent successfully!');
        showInfo('Please check your inbox and spam folder. The email may take a few minutes to arrive.');
        setLastResendTime(now);
        setCooldownTime(60); // Set 1-minute cooldown
        await logEmailVerificationEvent('success', targetEmail, {
          user_id: user?.id,
          cooldown_set_seconds: 60
        });
        return true;
      } else {
        await logEmailVerificationEvent('failed', targetEmail, {
          error: result.error,
          user_id: user?.id
        });
        
        if (result.error?.includes('rate limit') || 
            result.error?.includes('429') || 
            result.error?.includes('security purposes')) {
          showError('Too many email requests. Please wait before trying again.');
          setCooldownTime(120); // Set 2-minute cooldown for rate limits
          await logEmailVerificationEvent('rate_limited', targetEmail, {
            reason: 'supabase_rate_limit',
            cooldown_set_seconds: 120
          });
        } else {
          showError(result.error || 'Failed to send verification email.');
        }
        return false;
      }
    } catch (error) {
      await logEmailVerificationEvent('failed', targetEmail, {
        error: String(error),
        user_id: user?.id,
        error_type: 'unexpected_error'
      });
      showError('An unexpected error occurred. Please try again later.');
      return false;
    } finally {
      setResendingEmail(false);
    }
  };

  const checkVerificationStatus = () => {
    return {
      isVerified,
      needsVerification: user && !isVerified,
      canResend: !resendingEmail && cooldownTime === 0,
      cooldownTime,
      userEmail: user?.email
    };
  };

  return {
    isVerified,
    resendingEmail,
    cooldownTime,
    lastResendTime,
    resendVerificationEmail,
    checkVerificationStatus,
    // Computed values for easy use
    needsVerification: user && !isVerified,
    canResend: !resendingEmail && cooldownTime === 0,
    userEmail: user?.email
  };
};