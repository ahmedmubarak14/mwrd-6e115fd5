
import React from 'react';
import { Users, Building, FileText, ShoppingCart, CheckCircle, Package, Ticket, DollarSign } from 'lucide-react';
import { StatsGrid } from '@/components/dashboard/shared/StatsGrid';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminStatsCardsProps {
  stats: {
    totalUsers: number;
    totalClients: number;
    totalVendors: number;
    totalAdmins: number;
    activeRequests: number;
    confirmedOrders: number;
    completedOrders: number;
    pendingOffers: number;
    openTickets: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
  isLoading?: boolean;
  onCardClick?: (key: string) => void;
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({
  stats,
  isLoading = false,
  onCardClick
}) => {
  const { t, formatNumber, formatCurrency } = useLanguage();

  const keyMetrics = [
    {
      key: 'totalClients',
      title: t('admin.totalClients'),
      value: formatNumber(stats.totalClients),
      description: t('admin.activeClientAccounts'),
      icon: Users,
    },
    {
      key: 'totalVendors',
      title: t('admin.totalVendors'),
      value: formatNumber(stats.totalVendors),
      description: t('admin.registeredVendors'),
      icon: Building,
    },
    {
      key: 'activeRequests',
      title: t('admin.activeRequests'),
      value: formatNumber(stats.activeRequests),
      description: t('admin.currentlyBeingProcessed'),
      icon: FileText,
    },
    {
      key: 'orders',
      title: t('admin.orders'),
      value: formatNumber(stats.confirmedOrders),
      description: t('admin.inProgressOrders'),
      icon: ShoppingCart,
    },
  ];

  const lifecycleMetrics = [
    {
      key: 'completedOrders',
      title: t('admin.completedOrders'),
      value: formatNumber(stats.completedOrders),
      description: t('admin.successfullyDelivered'),
      icon: CheckCircle,
    },
    {
      key: 'pendingOffers',
      title: t('admin.pendingOffers'),
      value: formatNumber(stats.pendingOffers),
      description: t('admin.awaitingAdminApproval'),
      icon: Package,
    },
    {
      key: 'supportTickets',
      title: t('admin.supportTickets'),
      value: formatNumber(stats.openTickets),
      description: t('admin.requireAttention'),
      icon: Ticket,
    },
    {
      key: 'revenue',
      title: t('admin.revenue'),
      value: formatCurrency(stats.totalRevenue),
      description: t('admin.platformCommissionEarned'),
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Key Business Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('admin.keyBusinessMetrics')}</h3>
        <StatsGrid
          stats={keyMetrics}
          isLoading={isLoading}
          onCardClick={onCardClick}
          columns={4}
        />
      </div>

      {/* Order Lifecycle & Support Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('admin.orderLifecycleSupport')}</h3>
        <StatsGrid
          stats={lifecycleMetrics}
          isLoading={isLoading}
          onCardClick={onCardClick}
          columns={4}
        />
      </div>
    </div>
  );
};
