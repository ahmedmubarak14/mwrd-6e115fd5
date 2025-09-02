
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Activity
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MetricsDetailModal } from "@/components/analytics/MetricsDetailModal";
import { useState } from "react";

interface MetricsData {
  totalUsers?: number;
  userGrowth?: number;
  activeRequests?: number;
  requestGrowth?: number;
  totalRevenue?: number;
  revenueGrowth?: number;
  totalOrders?: number;
  orderDecline?: number;
}

interface MetricsCardsProps {
  metrics: MetricsData;
  onCardClick?: (cardTitle: string) => void;
}

export const MetricsCards = ({ metrics, onCardClick }: MetricsCardsProps) => {
  const { t, isRTL, formatNumber, formatCurrency } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState<{
    type: 'users' | 'requests' | 'revenue' | 'orders' | null;
    title: string;
  }>({ type: null, title: '' });

  const handleCardClick = (metricType: 'users' | 'requests' | 'revenue' | 'orders', title: string) => {
    // Call the legacy onCardClick if provided (for backwards compatibility)
    onCardClick?.(title);
    
    // Open detailed modal
    setSelectedMetric({ type: metricType, title });
  };

  const cards = [
    {
      title: t('admin.totalUsers') === 'admin.totalUsers' ? 'Total Users' : t('admin.totalUsers'),
      value: formatNumber(metrics?.totalUsers || 0),
      change: `+${metrics?.userGrowth || '0'}%`,
      trend: 'up' as const,
      period: t('analytics.fromLastMonth') === 'analytics.fromLastMonth' ? 'from last month' : t('analytics.fromLastMonth'),
      icon: Users,
      color: 'text-blue-600',
      metricType: 'users' as const
    },
    {
      title: t('admin.activeRequests') === 'admin.activeRequests' ? 'Active Requests' : t('admin.activeRequests'),
      value: formatNumber(metrics?.activeRequests || 0),
      change: `+${metrics?.requestGrowth || '0'}%`,
      trend: 'up' as const,
      period: t('analytics.fromLastWeek') === 'analytics.fromLastWeek' ? 'from last week' : t('analytics.fromLastWeek'),
      icon: Activity,
      color: 'text-green-600',
      metricType: 'requests' as const
    },
    {
      title: t('admin.revenue') === 'admin.revenue' ? 'Revenue' : t('admin.revenue'),
      value: formatCurrency(metrics?.totalRevenue || 0),
      change: `+${metrics?.revenueGrowth || '0'}%`,
      trend: 'up' as const,
      period: t('analytics.fromLastMonth') === 'analytics.fromLastMonth' ? 'from last month' : t('analytics.fromLastMonth'),
      icon: DollarSign,
      color: 'text-purple-600',
      metricType: 'revenue' as const
    },
    {
      title: t('orders.title') === 'orders.title' ? 'Orders' : t('orders.title'),
      value: formatNumber(metrics?.totalOrders || 0),
      change: `-${metrics?.orderDecline || '0'}%`,
      trend: 'down' as const,
      period: t('analytics.fromLastWeek') === 'analytics.fromLastWeek' ? 'from last week' : t('analytics.fromLastWeek'),
      icon: ShoppingCart,
      color: 'text-orange-600',
      metricType: 'orders' as const
    }
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {cards.map((card, index) => (
          <Card 
            key={index}
            onClick={() => handleCardClick(card.metricType, card.title)} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 group"
          >
            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 text-muted-foreground ${card.color} group-hover:scale-110 transition-transform`} />
            </CardHeader>
            <CardContent className="pt-3">
              <div className="text-xl md:text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                {card.value}
              </div>
              <div className={`flex items-center text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                {card.trend === 'up' ? (
                  <TrendingUp className={`h-3 w-3 text-green-500 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                ) : (
                  <TrendingDown className={`h-3 w-3 text-red-500 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                )}
                <span className="group-hover:text-primary transition-colors text-xs">
                  <span className="font-medium">{card.change}</span>
                  <span className="hidden sm:inline"> {card.period}</span>
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Modal */}
      <MetricsDetailModal
        isOpen={selectedMetric.type !== null}
        onClose={() => setSelectedMetric({ type: null, title: '' })}
        metricType={selectedMetric.type}
        metricTitle={selectedMetric.title}
      />
    </>
  );
};
