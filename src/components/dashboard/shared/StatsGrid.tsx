
import React from "react";
import { DashboardCard } from "./DashboardCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface StatItem {
  key: string;
  title: string;
  value: string | number;
  description?: string;
  icon?: any;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface StatsGridProps {
  stats: StatItem[];
  isLoading?: boolean;
  onCardClick?: (key: string) => void;
  columns?: 1 | 2 | 3 | 4;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  isLoading = false,
  onCardClick,
  columns = 4,
}) => {
  const { isRTL } = useLanguage();

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={cn(
      "grid gap-4 md:gap-6",
      gridCols[columns],
      isRTL && "dir-rtl"
    )}>
      {stats.map((stat) => (
        <DashboardCard
          key={stat.key}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
          isLoading={isLoading}
          onClick={() => onCardClick?.(stat.key)}
        />
      ))}
    </div>
  );
};
