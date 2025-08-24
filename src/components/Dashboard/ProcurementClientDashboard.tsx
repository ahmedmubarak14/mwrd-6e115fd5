import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Package, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

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
      <div className="flex flex-wrap gap-4">
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Request
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Browse Vendors
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Messages
        </Button>
      </div>

      {/* Stats Cards */}
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

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Procurement Requests
            <Button variant="outline" size="sm">View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                  </div>
                  <div>
                    <h3 className="font-medium">{request.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Budget: {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'SAR',
                        minimumFractionDigits: 0
                      }).format(request.budget)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {request.offers} offers • Due {request.deadline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Requests Created</span>
                <span>8/10</span>
              </div>
              <Progress value={80} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Offers Reviewed</span>
                <span>25/30</span>
              </div>
              <Progress value={83} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Projects Completed</span>
                <span>3/5</span>
              </div>
              <Progress value={60} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Response Time</span>
              <span className="font-medium">2.5 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Vendor Rating</span>
              <span className="font-medium">4.8/5.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <span className="font-medium">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cost Savings</span>
              <span className="font-medium text-green-600">15%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
