
import { CleanVendorDashboard } from "@/components/vendor/CleanVendorDashboard";
import { CleanDashboardLayout } from "@/components/layout/CleanDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const VendorDashboard = () => {
  const { userProfile, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <CleanDashboardLayout>
      <CleanVendorDashboard />
    </CleanDashboardLayout>
  );
};
