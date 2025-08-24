
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClientStatsCards } from './ClientStatsCards';
import { ClientQuickActions } from './ClientQuickActions';
import { ClientRecentRequests } from './ClientRecentRequests';
import { ClientProgressOverview } from './ClientProgressOverview';

interface ProcurementClientDashboardProps {
  userProfile?: any;
}

export const ProcurementClientDashboard = ({ userProfile }: ProcurementClientDashboardProps) => {
  const { t } = useLanguage();

  // Mock data - replace with real data from your API
  const stats = {
    activeRequests: 12,
    totalOffers: 45,
    completedProjects: 8,
    totalSpent: 125000
  };

  const recentRequests = [
    {
      id: 1,
      title: 'Office Furniture Procurement',
      status: 'active',
      offers: 5,
      deadline: '2024-02-15',
      budget: 25000
    },
    {
      id: 2,
      title: 'IT Equipment Purchase',
      status: 'pending',
      offers: 3,
      deadline: '2024-02-20',
      budget: 50000
    },
    {
      id: 3,
      title: 'Marketing Materials',
      status: 'completed',
      offers: 8,
      deadline: '2024-01-30',
      budget: 15000
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {userProfile?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Manage your procurement requests and track offers from vendors.
        </p>
      </div>

      {/* Quick Actions */}
      <ClientQuickActions />

      {/* Stats Cards */}
      <ClientStatsCards stats={stats} />

      {/* Recent Requests */}
      <ClientRecentRequests requests={recentRequests} />

      {/* Progress Overview */}
      <ClientProgressOverview />
    </div>
  );
};
