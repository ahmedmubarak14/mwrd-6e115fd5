
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface VerificationGuardProps {
  children: React.ReactNode;
  requireVerification?: boolean;
  fallbackMessage?: string;
  allowViewOnly?: boolean;
}

export const VerificationGuard = ({ 
  children, 
  requireVerification = true,
  fallbackMessage = "This feature requires account verification",
  allowViewOnly = false
}: VerificationGuardProps) => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Please log in to access this feature.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // If verification is not required or user is admin, show content
  if (!requireVerification || userProfile.role === 'admin') {
    return <>{children}</>;
  }

  // Check verification status
  const isVerified = userProfile.verification_status === 'approved' && userProfile.status === 'approved';
  const isRejected = userProfile.verification_status === 'rejected';
  const isPending = userProfile.verification_status === 'pending' || userProfile.verification_status === 'under_review';

  // If verified, show content
  if (isVerified) {
    return <>{children}</>;
  }

  // If view-only is allowed and user is pending verification, show content with warning
  if (allowViewOnly && isPending) {
    return (
      <div className="space-y-4">
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Your account is pending verification. Some features may be restricted.</span>
            <Badge variant="outline" className="ml-2">
              <Clock className="h-3 w-3 mr-1" />
              Pending Review
            </Badge>
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  // Show verification status message
  const getStatusIcon = () => {
    if (isRejected) return <XCircle className="h-6 w-6 text-destructive" />;
    if (isPending) return <Clock className="h-6 w-6 text-warning" />;
    return <AlertTriangle className="h-6 w-6 text-muted-foreground" />;
  };

  const getStatusMessage = () => {
    if (isRejected) {
      return {
        title: "Verification Rejected",
        description: "Your Commercial Registration was rejected. Please review the feedback and resubmit.",
        action: "Review & Resubmit"
      };
    }
    if (isPending) {
      return {
        title: "Verification Pending",
        description: "Your Commercial Registration is under review. This usually takes 24-48 hours.",
        action: "View Status"
      };
    }
    return {
      title: "Verification Required",
      description: "Please upload your Commercial Registration to access this feature.",
      action: "Upload Documents"
    };
  };

  const status = getStatusMessage();

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle>{status.title}</CardTitle>
          <CardDescription>{status.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userProfile.verification_notes && isRejected && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Rejection Reason:</strong><br />
                {userProfile.verification_notes}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-center space-y-2">
            <Button 
              onClick={() => navigate('/profile')}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              {status.action}
            </Button>
            
            {isPending && (
              <p className="text-sm text-muted-foreground">
                Estimated processing time: 24-48 hours
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
