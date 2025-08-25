
import React from 'react';
import { StatsGrid } from '../shared/StatsGrid';
import { FileText, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface AnalyticsMetrics {
  activeRequests?: number;
  totalUsers?: number;
  totalOrders?: number;
  totalRevenue?: number;
}

interface ClientStatsCardsProps {
  metrics: AnalyticsMetrics | null;
  isLoading?: boolean;
  onCardClick?: (cardKey: string) => void;
  className?: string;
}

export const ClientStatsCards: React.FC<ClientStatsCardsProps> = ({
  metrics,
  isLoading = false,
  onCardClick,
  className
}) => {
  const { t, formatCurrency } = useLanguage();

  const statsData = [
    {
      key: 'totalRequests',
      title: t('dashboard.stats.totalRequests'),
      value: metrics?.activeRequests || 0,
      icon: FileText,
      trend: { value: 12, isPositive: true }
    },
    {
      key: 'activeProjects', 
      title: t('dashboard.stats.activeProjects'),
      value: metrics?.totalUsers || 0,
      icon: Clock,
      trend: { value: 8, isPositive: true }
    },
    {
      key: 'completedOrders',
      title: t('dashboard.stats.completedOrders'), 
      value: metrics?.totalOrders || 0,
      icon: CheckCircle,
      trend: { value: 15, isPositive: true }
    },
    {
      key: 'savings',
      title: t('dashboard.stats.savings'),
      value: formatCurrency(metrics?.totalRevenue || 0),
      icon: DollarSign,
      trend: { value: 23, isPositive: true }
    },
  ];

  return (
    <div className={cn("mb-6", className)}>
      <StatsGrid 
        stats={statsData}
        onCardClick={onCardClick}
        isLoading={isLoading}
      />
    </div>
  );
};
