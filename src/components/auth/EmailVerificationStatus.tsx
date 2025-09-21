import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { cn } from '@/lib/utils';

interface EmailVerificationStatusProps {
  className?: string;
  showResendButton?: boolean;
  variant?: 'default' | 'compact';
}

export const EmailVerificationStatus = ({ 
  className,
  showResendButton = true,
  variant = 'default'
}: EmailVerificationStatusProps) => {
  const {
    isVerified,
    needsVerification,
    resendingEmail,
    cooldownTime,
    canResend,
    userEmail,
    resendVerificationEmail
  } = useEmailVerification();

  if (!needsVerification) {
    if (isVerified && variant !== 'compact') {
      return (
        <Alert className={cn("border-green-200 bg-green-50", className)}>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Your email address is verified.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }

  const handleResend = async () => {
    await resendVerificationEmail();
  };

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <span className="text-amber-700">Email not verified</span>
        {showResendButton && (
          <Button
            variant="link"
            size="sm"
            onClick={handleResend}
            disabled={!canResend || resendingEmail}
            className="h-auto p-0 text-amber-600 hover:text-amber-700"
          >
            {resendingEmail ? 'Sending...' : 
             cooldownTime > 0 ? `Resend (${cooldownTime}s)` : 'Resend'}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Alert className={cn("border-amber-200 bg-amber-50", className)}>
      <Mail className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-700 space-y-3">
        <div>
          <p className="font-medium">Email verification required</p>
          <p className="text-sm">
            We sent a verification email to <strong>{userEmail}</strong>.
            Please check your inbox and spam folder.
          </p>
        </div>
        
        {showResendButton && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={!canResend || resendingEmail}
              className="bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200"
            >
              {resendingEmail ? (
                <>
                  <Clock className="h-3 w-3 mr-2 animate-spin" />
                  Sending...
                </>
              ) : cooldownTime > 0 ? (
                <>
                  <Clock className="h-3 w-3 mr-2" />
                  Resend in {cooldownTime}s
                </>
              ) : (
                <>
                  <Mail className="h-3 w-3 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};