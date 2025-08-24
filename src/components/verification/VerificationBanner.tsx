
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface VerificationBannerProps {
  showActions?: boolean;
  className?: string;
}

export const VerificationBanner = ({ 
  showActions = true, 
  className = "" 
}: VerificationBannerProps) => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  if (!userProfile) return null;

  const getVerificationStatus = () => {
    const status = userProfile.verification_status || 'pending';
    const accountStatus = userProfile.status;

    if (status === 'approved' && accountStatus === 'approved') {
      return null; // Don't show banner for verified users
    } else if (status === 'pending' || status === 'under_review') {
      return {
        variant: 'default' as const,
        icon: <Clock className="h-4 w-4" />,
        title: 'Verification Pending',
        message: 'Your documents are being reviewed. This typically takes 24-48 hours.',
        badge: <Badge variant="outline">Under Review</Badge>,
        showAction: false
      };
    } else if (status === 'rejected') {
      return {
        variant: 'destructive' as const,
        icon: <XCircle className="h-4 w-4" />,
        title: 'Verification Rejected',
        message: 'Please review the feedback and resubmit your documents.',
        badge: <Badge variant="destructive">Rejected</Badge>,
        showAction: true,
        actionText: 'Resubmit Documents'
      };
    } else {
      return {
        variant: 'default' as const,
        icon: <AlertTriangle className="h-4 w-4" />,
        title: 'Verification Required',
        message: 'Complete your account verification to access all platform features.',
        badge: <Badge variant="secondary">Pending</Badge>,
        showAction: true,
        actionText: 'Complete Verification'
      };
    }
  };

  const verificationStatus = getVerificationStatus();

  if (!verificationStatus) return null;

  return (
    <Alert variant={verificationStatus.variant} className={className}>
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start gap-2 flex-1">
          {verificationStatus.icon}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold">{verificationStatus.title}</h4>
              {verificationStatus.badge}
            </div>
            <AlertDescription className="text-sm">
              {verificationStatus.message}
              {userProfile.verification_notes && verificationStatus.variant === 'destructive' && (
                <>
                  <br />
                  <strong>Reason:</strong> {userProfile.verification_notes}
                </>
              )}
            </AlertDescription>
          </div>
        </div>
        
        {showActions && verificationStatus.showAction && (
          <Button
            variant={verificationStatus.variant === 'destructive' ? 'destructive' : 'default'}
            size="sm"
            onClick={() => navigate('/profile')}
            className="ml-4 flex-shrink-0"
          >
            <FileText className="h-4 w-4 mr-2" />
            {verificationStatus.actionText}
          </Button>
        )}
      </div>
    </Alert>
  );
};
