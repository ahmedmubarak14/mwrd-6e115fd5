import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Star,
  FileText,
  Users,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const VendorDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  const mockStats = {
    activeOrders: 12,
    totalEarnings: 45600,
    completionRate: 94.5,
    averageRating: 4.8,
    responseTime: '2.3h',
    totalOrders: 156
  };

  const mockRecentOrders = [
    { id: '1', title: 'Office Construction', client: 'ABC Corp', amount: 15000, status: 'in_progress' },
    { id: '2', title: 'Warehouse Renovation', client: 'XYZ Ltd', amount: 8500, status: 'completed' },
    { id: '3', title: 'Electrical Installation', client: 'Tech Solutions', amount: 3200, status: 'pending' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {userProfile?.full_name || 'Vendor'}!
          </h1>
          <p className="text-muted-foreground">
            Here's your business overview and recent activity
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Create Offer
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 p-2 bg-blue-100 text-blue-600 rounded-lg" />
              <div>
                <p className="text-2xl font-bold">{mockStats.activeOrders}</p>
                <p className="text-xs text-muted-foreground">Active Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 p-2 bg-green-100 text-green-600 rounded-lg" />
              <div>
                <p className="text-2xl font-bold">SAR {mockStats.totalEarnings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 p-2 bg-purple-100 text-purple-600 rounded-lg" />
              <div>
                <p className="text-2xl font-bold">{mockStats.completionRate}%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 p-2 bg-yellow-100 text-yellow-600 rounded-lg" />
              <div>
                <p className="text-2xl font-bold">{mockStats.averageRating}</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 p-2 bg-orange-100 text-orange-600 rounded-lg" />
              <div>
                <p className="text-2xl font-bold">{mockStats.responseTime}</p>
                <p className="text-xs text-muted-foreground">Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 p-2 bg-indigo-100 text-indigo-600 rounded-lg" />
              <div>
                <p className="text-2xl font-bold">{mockStats.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{order.title}</h4>
                  <p className="text-sm text-muted-foreground">Client: {order.client}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">SAR {order.amount.toLocaleString()}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Browse Requests</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              <span>Manage Products</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              <span>Customer Support</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};