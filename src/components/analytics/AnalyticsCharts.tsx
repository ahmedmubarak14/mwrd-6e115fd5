import React from 'react';
import { 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface ChartData {
  month?: string;
  name?: string;
  value?: number;
  revenue?: number;
  orders?: number;
  clients?: number;
  color?: string;
}

interface PerformanceData {
  period: string;
  orders: number;
  revenue: number;
  completionRate: number;
  clientSatisfaction: number;
  responseTime: number;
}

interface RevenueChartProps {
  data: ChartData[];
}

interface OrdersCategoryChartProps {
  data: ChartData[];
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export const RevenueChart = React.memo<RevenueChartProps>(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip 
        formatter={(value: any, name: string) => [
          name === 'revenue' ? `SAR ${value.toLocaleString()}` : value,
          name === 'revenue' ? 'Revenue' : 'Orders'
        ]}
      />
      <Area
        type="monotone"
        dataKey="revenue"
        stackId="1"
        stroke="#3b82f6"
        fill="#3b82f6"
        fillOpacity={0.6}
      />
    </AreaChart>
  </ResponsiveContainer>
));

RevenueChart.displayName = 'RevenueChart';

export const OrdersCategoryChart = React.memo<OrdersCategoryChartProps>(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
));

OrdersCategoryChart.displayName = 'OrdersCategoryChart';

export const PerformanceChart = React.memo<PerformanceChartProps>(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="period" />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" name="Orders" />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="completionRate"
        stroke="#10b981"
        strokeWidth={2}
        name="Completion Rate (%)"
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="clientSatisfaction"
        stroke="#8b5cf6"
        strokeWidth={2}
        name="Client Rating"
      />
    </LineChart>
  </ResponsiveContainer>
));

PerformanceChart.displayName = 'PerformanceChart';

// Default mock data for categories and performance when no real data is available
export const mockOrdersByCategory: ChartData[] = [
  { name: 'Construction', value: 18, color: '#3b82f6' },
  { name: 'Renovation', value: 14, color: '#10b981' },
  { name: 'Maintenance', value: 8, color: '#f59e0b' },
  { name: 'Consulting', value: 6, color: '#8b5cf6' }
];

export const mockPerformanceData: PerformanceData[] = [
  {
    period: 'Week 1',
    orders: 3,
    revenue: 18000,
    completionRate: 100,
    clientSatisfaction: 4.8,
    responseTime: 1.5
  },
  {
    period: 'Week 2', 
    orders: 4,
    revenue: 22000,
    completionRate: 95,
    clientSatisfaction: 4.9,
    responseTime: 2.1
  },
  {
    period: 'Week 3',
    orders: 2,
    revenue: 15000,
    completionRate: 100,
    clientSatisfaction: 4.7,
    responseTime: 1.8
  },
  {
    period: 'Week 4',
    orders: 5,
    revenue: 28000,
    clientSatisfaction: 4.6,
    completionRate: 90,
    responseTime: 2.8
  }
];