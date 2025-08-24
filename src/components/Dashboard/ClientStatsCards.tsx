
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Package, 
  TrendingUp, 
  CheckCircle
} from 'lucide-react';

interface ClientStatsCardsProps {
  stats: {
    activeRequests: number;
    totalOffers: number;
    completedProjects: number;
    totalSpent: number;
  };
}

export const ClientStatsCards = ({ stats }: ClientStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeRequests}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary">+2 this week</Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOffers}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary">+12 this month</Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedProjects}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary">+1 this month</Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'SAR',
              minimumFractionDigits: 0
            }).format(stats.totalSpent)}
          </div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary">This year</Badge>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
