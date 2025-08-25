
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProcurementClientDashboard } from "@/components/Dashboard/ProcurementClientDashboard";
import { UnifiedVerificationBanner } from "@/components/verification/UnifiedVerificationBanner";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/dashboard/shared/LoadingState";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const Dashboard = () => {
  const { userProfile, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  // Redirect based on user role with safeguards
  useEffect(() => {
    if (!loading && userProfile && !hasRedirected.current) {
      if (userProfile.role === 'vendor') {
        hasRedirected.current = true;
        navigate('/vendor/dashboard', { replace: true });
        return;
      } else if (userProfile.role === 'admin') {
        hasRedirected.current = true;
        navigate('/admin/dashboard', { replace: true });
        return;
      }
    }
  }, [loading, userProfile, navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }

  // Handle case where user profile doesn't exist yet
  if (!userProfile) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">{t('profile.loading')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('profile.loadingDescription')}
            </p>
            <LoadingState size="md" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Only render for client users - others should have been redirected
  if (userProfile.role !== 'client') {
    return (
      <DashboardLayout>
        <LoadingState message={t('dashboard.redirecting')} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <UnifiedVerificationBanner userProfile={userProfile} />
      <ProcurementClientDashboard />
    </DashboardLayout>
  );
};

export default Dashboard;
