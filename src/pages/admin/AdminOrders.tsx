
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { format } from "date-fns";
import { ShoppingCart, Package, DollarSign, Download, RefreshCw, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  client_id: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  user_profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Using mock data temporarily - replace with real Supabase query when ready
      const mockOrders: Order[] = [
        {
          id: "order_001",
          client_id: "client_1",
          status: "completed",
          amount: 15000,
          currency: "SAR",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          user_profiles: {
            full_name: "Ahmed Al-Rashid",
            email: "ahmed@example.com"
          }
        },
        {
          id: "order_002",
          client_id: "client_2", 
          status: "pending",
          amount: 8500,
          currency: "SAR",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          user_profiles: {
            full_name: "Sara Mohammed",
            email: "sara@example.com"
          }
        },
        {
          id: "order_003",
          client_id: "client_3",
          status: "in_progress", 
          amount: 22000,
          currency: "SAR",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          user_profiles: {
            full_name: "Omar Hassan",
            email: "omar@example.com"
          }
        },
        {
          id: "order_004",
          client_id: "client_4",
          status: "cancelled",
          amount: 5000,
          currency: "SAR", 
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          user_profiles: {
            full_name: "Fatima Ali",
            email: "fatima@example.com"
          }
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = [
      'Order ID,Client,Status,Amount,Currency,Created Date',
      ...filteredOrders.map(order => 
        `${order.id},${order.user_profiles?.full_name || 'Unknown'},${order.status},${order.amount},${order.currency},${format(new Date(order.created_at), 'yyyy-MM-dd')}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export completed",
      description: "Orders data has been exported to CSV",
    });
  };

  const handleRefresh = () => {
    fetchOrders();
    toast({
      title: "Data refreshed",
      description: "Orders data has been updated",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      in_progress: "default",
      completed: "secondary",
      cancelled: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  // Calculate metrics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.amount, 0);

  const filteredOrders = orders.filter(order => {
    const searchMatch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_profiles?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-admin-dashboard>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AdminPageContainer
      title="Orders Management"
      description="Monitor and manage all orders across the platform"
    >
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">Finished orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">Awaiting processing</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} SAR</div>
              <p className="text-xs text-foreground opacity-75">From completed orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground">No orders match your current filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-5 w-5 text-foreground" />
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(0, 8)}
                        </CardTitle>
                        <p className="text-sm text-foreground opacity-75">
                          {order.user_profiles?.full_name || order.user_profiles?.email || 'Unknown User'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-medium">
                        {order.amount.toLocaleString()} {order.currency}
                      </span>
                    </div>
                    <span className="text-foreground opacity-75">
                      {format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminPageContainer>
  );
}
