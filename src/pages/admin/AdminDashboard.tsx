import { ComprehensiveAdminOverview } from '@/components/admin/ComprehensiveAdminOverview';

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          Admin Dashboard
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          Comprehensive platform management and monitoring center
        </p>
      </div>

      {/* Comprehensive Admin Overview */}
      <ComprehensiveAdminOverview />
    </div>
  );
};