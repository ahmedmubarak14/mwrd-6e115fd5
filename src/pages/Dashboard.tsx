import { ProcurementClientDashboard } from "@/components/Dashboard/ProcurementClientDashboard";
import { OfferReviewSystem } from "@/components/client/OfferReviewSystem";
import { OrderManagementSystem } from "@/components/orders/OrderManagementSystem";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CreditCardWidget } from "@/components/dashboard/CreditCardWidget";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [hasCreditAccount, setHasCreditAccount] = useState(false);
  const [checkingCredit, setCheckingCredit] = useState(true);

  // Check for credit account
  useEffect(() => {
    const checkCreditAccount = async () => {
      if (userProfile?.user_id) {
        const { data, error } = await supabase
          .from('client_credit_accounts')
          .select('id')
          .eq('user_id', userProfile.user_id)
          .single();
        
        setHasCreditAccount(!!data && !error);
      }
      setCheckingCredit(false);
    };

    if (!loading && userProfile) {
      checkCreditAccount();
    }
  }, [loading, userProfile]);

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
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Only render for client users
  if (userProfile?.role !== 'client') {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
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
      <Alert variant={content.variant} className="mb-4 md:mb-6">
        {content.icon}
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 w-full">
          <div className="flex-1">
            <h4 className="font-medium mb-2 lg:mb-1 flex flex-col space-y-1 lg:flex-row lg:items-center lg:space-y-0 lg:gap-2">
              <span>{content.title}</span>
              {content.badge}
            </h4>
            <AlertDescription className="mb-3 lg:mb-0">
              {content.description}
              {userProfile.verification_notes && isRejected && (
                <div className="mt-2 p-3 bg-destructive/10 rounded border border-destructive/20">
                  <strong>Rejection Reason:</strong><br />
                  <span className="text-sm">{userProfile.verification_notes}</span>
                </div>
              )}
            </AlertDescription>
          </div>
          <Button
            variant={content.variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => navigate('/profile?tab=verification')}
            className="w-full lg:w-auto"
          >
            {content.action}
          </Button>
        </div>
      </Alert>
    );
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {renderVerificationBanner()}
        
        {/* Credit Account Widget */}
        {!checkingCredit && hasCreditAccount && (
          <CreditCardWidget />
        )}
        
        <ProcurementClientDashboard />
      </div>
    </ClientLayout>
  );
};

export default Dashboard;