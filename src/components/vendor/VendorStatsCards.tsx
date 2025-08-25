
import React from 'react';
import { Package, TrendingUp, Clock, Award } from 'lucide-react';
import { StatsGrid } from '@/components/dashboard/shared/StatsGrid';
import { DashboardCard } from '@/components/dashboard/shared/DashboardCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOffers } from '@/hooks/useOffers';

interface VendorStatsCardsProps {
  loading?: boolean;
}

export const VendorStatsCards: React.FC<VendorStatsCardsProps> = ({ loading = false }) => {
  const { t } = useLanguage();
  const { offers } = useOffers();

  const stats = {
    totalOffers: offers.length,
    approvedOffers: offers.filter(o => o.client_approval_status === 'approved').length,
    pendingOffers: offers.filter(o => o.client_approval_status === 'pending').length,
    completedProjects: offers.filter(o => o.status === 'accepted').length,
  };

  const successRate = stats.totalOffers > 0 
    ? Math.round((stats.approvedOffers / stats.totalOffers) * 100) 
    : 0;

  const cards = [
    {
      title: t('vendor.totalOffers'),
      value: stats.totalOffers,
      description: t('vendor.submittedThisMonth'),
      icon: Package,
    },
    {
      title: t('vendor.acceptedOffers'),
      value: stats.approvedOffers,
      description: `${t('vendor.successRate')}: ${successRate}%`,
      icon: TrendingUp,
      trend: { value: successRate, isPositive: successRate > 50 }
    },
    {
      title: t('vendor.pendingOffers'),
      value: stats.pendingOffers,
      description: t('vendor.awaitingClientResponse'),
      icon: Clock,
    },
    {
      title: t('dashboard.completedProjects'),
      value: stats.completedProjects,
      description: t('vendor.successfullyWon'),
      icon: Award,
    }
  ];

  return (
    <StatsGrid>
      {cards.map((card, index) => (
        <DashboardCard
          key={index}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          trend={card.trend}
          isLoading={loading}
          className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover:scale-105"
        />
      ))}
    </StatsGrid>
  );
};
