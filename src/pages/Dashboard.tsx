
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProcurementClientDashboard } from "@/components/Dashboard/ProcurementClientDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect based on user role
  useEffect(() => {
    if (!loading && userProfile) {
      if (userProfile.role === 'vendor') {
        navigate('/vendor-dashboard');
      } else if (userProfile.role === 'admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [loading, userProfile, navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Only render for client users
  if (userProfile?.role !== 'client') {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const renderVerificationBanner = () => {
    if (!userProfile || userProfile.role !== 'client') return null;

    const isVerified = userProfile.verification_status === 'approved';
    const isRejected = userProfile.verification_status === 'rejected';
    const isPending = userProfile.verification_status === 'pending' || userProfile.verification_status === 'under_review';

    if (isVerified) return null;

    const getAlertContent = () => {
      if (isRejected) {
        return {
          variant: 'destructive' as const,
          icon: <AlertTriangle className="h-4 w-4" />,
          title: 'Account Verification Rejected',
          description: 'Your Commercial Registration was rejected. Please review the feedback and resubmit your documents.',
          action: 'Review & Resubmit',
          badge: <Badge variant="destructive">Rejected</Badge>
        };
      }
      
      if (isPending) {
        return {
          variant: 'default' as const,
          icon: <Clock className="h-4 w-4" />,
          title: 'Account Verification Pending',
          description: 'Your Commercial Registration is under review. Some features are temporarily restricted.',
          action: 'View Status',
          badge: <Badge variant="outline">Under Review</Badge>
        };
      }

      return {
        variant: 'default' as const,
        icon: <AlertTriangle className="h-4 w-4" />,
        title: 'Account Verification Required',
        description: 'Upload your Commercial Registration to access RFQ creation, orders, and vendor interactions.',
        action: 'Upload Documents',
        badge: <Badge variant="secondary">Pending</Badge>
      };
    };

    const content = getAlertContent();

    return (
      <Alert variant={content.variant} className="mb-6">
        {content.icon}
        <div className="flex items-center justify-between w-full">
          <div className="flex-1">
            <h4 className="font-medium mb-1 flex items-center gap-2">
              {content.title}
              {content.badge}
            </h4>
            <AlertDescription className="mb-3">
              {content.description}
              {userProfile.verification_notes && isRejected && (
                <div className="mt-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                  <strong>Rejection Reason:</strong><br />
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

  return (
    <DashboardLayout>
      {renderVerificationBanner()}
      <ProcurementClientDashboard />
    </DashboardLayout>
  );
};

export default Dashboard;
