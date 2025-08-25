
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getVerificationStatus } from "@/utils/verificationUtils";

interface UnifiedVerificationBannerProps {
  userProfile: any;
  className?: string;
}

export const UnifiedVerificationBanner: React.FC<UnifiedVerificationBannerProps> = ({
  userProfile,
  className,
}) => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  
  if (!userProfile) return null;
  
  const { isFullyVerified, isPending, isRejected } = getVerificationStatus(userProfile);
  
  // Don't show banner if already verified
  if (isFullyVerified) return null;

  const getAlertContent = () => {
    if (isRejected) {
      return {
        variant: 'destructive' as const,
        icon: <AlertTriangle className="h-4 w-4" />,
        title: t('verification.rejected'),
        description: t('verification.rejectedDescription'),
        action: t('verification.reviewStatus'),
        badge: <Badge variant="destructive">{t('status.rejected')}</Badge>
      };
    }
    
    if (isPending) {
      return {
        variant: 'default' as const,
        icon: <Clock className="h-4 w-4" />,
        title: t('verification.pending'),
        description: t('verification.pendingDescription'),
        action: t('verification.reviewStatus'),
        badge: <Badge variant="outline">{t('status.underReview')}</Badge>
      };
    }

    return {
      variant: 'default' as const,
      icon: <AlertTriangle className="h-4 w-4" />,
      title: t('verification.required'),
      description: t('verification.requiredDescription'),
      action: t('verification.uploadDocuments'),
      badge: <Badge variant="secondary">{t('status.pending')}</Badge>
    };
  };

  const content = getAlertContent();

  return (
    <Alert variant={content.variant} className={cn("mb-6", className)}>
      {content.icon}
      <div className={cn(
        "flex items-center justify-between w-full",
        isRTL && "flex-row-reverse"
      )}>
        <div className="flex-1">
          <h4 className={cn(
            "font-medium mb-1 flex items-center gap-2",
            isRTL && "flex-row-reverse"
          )}>
            {content.title}
            {content.badge}
          </h4>
          <AlertDescription className="mb-3">
            {content.description}
            {userProfile.verification_notes && isRejected && (
              <div className="mt-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                <strong>{t('verification.rejectionReason')}:</strong><br />
                {userProfile.verification_notes}
              </div>
            )}
          </AlertDescription>
        </div>
        <Button
          variant={content.variant === 'destructive' ? 'destructive' : 'default'}
          onClick={() => navigate('/profile?tab=verification')}
        >
          {content.action}
        </Button>
      </div>
    </Alert>
  );
};
