import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, DollarSign, Calendar, Download } from 'lucide-react';

interface FinancialData {
  date: string;
  revenue: number;
  transactions: number;
  growth: number;
}

interface FinancialAnalyticsChartProps {
  period?: 'week' | 'month' | 'quarter' | 'year';
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const FinancialAnalyticsChart: React.FC<FinancialAnalyticsChartProps> = ({ 
  period = 'month' 
}) => {
  const { user } = useAuth();
  const [data, setData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

  const fetchFinancialData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const endDate = new Date();
      const startDate = new Date();
      
      // Calculate date range based on period
      switch (period) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Use mock data for financial transactions
      const mockTransactions = [
        { amount: 5000, created_at: new Date().toISOString() },
        { amount: 3500, created_at: new Date(Date.now() - 86400000).toISOString() },
        { amount: 7200, created_at: new Date(Date.now() - 172800000).toISOString() }
      ];

      if (!mockTransactions) throw new Error('No financial data available');

      // Process data by grouping by date
      const groupedData = mockTransactions?.reduce((acc: any, transaction) => {
        const date = new Date(transaction.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            date,
            revenue: 0,
            transactions: 0,
            growth: 0
          };
        }
        acc[date].revenue += transaction.amount || 0;
        acc[date].transactions += 1;
        return acc;
      }, {});

      const processedData = Object.values(groupedData || {}) as FinancialData[];
      
      // Calculate growth rates
      processedData.forEach((item, index) => {
        if (index > 0) {
          const prevRevenue = processedData[index - 1].revenue;
          item.growth = prevRevenue > 0 ? ((item.revenue - prevRevenue) / prevRevenue) * 100 : 0;
        }
      });

      setData(processedData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [user, period]);

  const exportData = () => {
    const csvContent = [
      ['Date', 'Revenue', 'Transactions', 'Growth %'],
      ...data.map(item => [item.date, item.revenue, item.transactions, item.growth.toFixed(2)])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-analytics-${period}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalTransactions = data.reduce((sum, item) => sum + item.transactions, 0);
  const avgGrowth = data.length > 0 ? data.reduce((sum, item) => sum + item.growth, 0) / data.length : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Analytics</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <LoadingSpinner text="Loading financial data..." />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Financial Data</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchFinancialData} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{totalRevenue.toLocaleString()} SAR</div>
            <p className="text-xs text-muted-foreground">
              {avgGrowth > 0 ? '+' : ''}{avgGrowth.toFixed(1)}% average growth
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {data.length > 0 ? (totalRevenue / totalTransactions).toLocaleString() : 0} SAR avg per transaction
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold capitalize">{period}</div>
            <p className="text-xs text-muted-foreground">
              {data.length} data points
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-base sm:text-lg">Financial Performance</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Revenue and transaction trends over time</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                Line
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                Bar
              </Button>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `${value} SAR` : value,
                      name === 'revenue' ? 'Revenue' : 'Transactions'
                    ]}
                    contentStyle={{ 
                      fontSize: '12px',
                      padding: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="transactions" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="transactions"
                  />
                </LineChart>
              ) : (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `${value} SAR` : value,
                      name === 'revenue' ? 'Revenue' : 'Transactions'
                    ]}
                    contentStyle={{ 
                      fontSize: '12px',
                      padding: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" name="revenue" />
                  <Bar dataKey="transactions" fill="#10b981" name="transactions" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};