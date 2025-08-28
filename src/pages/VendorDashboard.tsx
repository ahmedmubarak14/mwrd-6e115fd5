
import { CleanVendorDashboard } from "@/components/vendor/CleanVendorDashboard";
import { CleanDashboardLayout } from "@/components/layout/CleanDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const VendorDashboard = () => {
  const { userProfile, loading } = useAuth();
  const languageContext = useOptionalLanguage();
  const t = languageContext?.t || ((key: string) => key);

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
