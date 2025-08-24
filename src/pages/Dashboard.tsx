
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClientDashboard } from "@/components/Dashboard/ClientDashboard";
import { SupplierDashboard } from "@/pages/SupplierDashboard";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const Dashboard = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const renderDashboard = () => {
    switch (userProfile?.role) {
      case 'vendor':
        return <SupplierDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <ClientDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
