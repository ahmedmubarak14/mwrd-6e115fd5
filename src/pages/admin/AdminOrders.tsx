import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { format } from "date-fns";
import { ShoppingCart, DollarSign, Download, RefreshCw, TrendingUp, Clock, CheckCircle, Edit, Trash2, Eye, Users, BarChart3, Calendar, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AdminOrder {
  id: string;
  title: string;
  client_id: string;
  vendor_id: string;
  request_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  delivery_date?: string;
  completion_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: {
    full_name: string | null;
    email: string;
    company_name?: string | null;
  } | null;
  vendor?: {
    full_name: string | null;
    email: string;
    company_name?: string | null;
  } | null;
  request?: {
    title: string;
    category: string;
  } | null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [bulkAction, setBulkAction] = useState<string>("");
  
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          client:user_profiles!orders_client_id_fkey(full_name, email, company_name),
          vendor:user_profiles!orders_vendor_id_fkey(full_name, email, company_name),
          request:requests(title, category)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedOrders: AdminOrder[] = (data || []).map(order => ({
        id: order.id,
        title: order.title || order.request?.title || 'Order',
        client_id: order.client_id,
        vendor_id: order.vendor_id,
        request_id: order.request_id,
        amount: Number(order.amount) || 0,
        currency: order.currency || 'SAR',
        status: order.status,
        delivery_date: order.delivery_date,
        completion_date: order.completion_date,
        notes: order.notes,
        created_at: order.created_at,
        updated_at: order.updated_at,
        client: order.client,
        vendor: order.vendor,
        request: order.request
      }));

      setOrders(transformedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: AdminOrder['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(newStatus === 'completed' && { completion_date: new Date().toISOString() })
        })
        .eq('id', orderId);

      if (error) throw error;
      
      await fetchOrders();
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      
      await fetchOrders();
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
    }
  };

  const handleBulkAction = async () => {
    if (selectedOrders.length === 0 || !bulkAction) return;

    try {
      if (bulkAction === 'delete') {
        const { error } = await supabase
          .from('orders')
          .delete()
          .in('id', selectedOrders);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: `${selectedOrders.length} orders deleted`,
        });
      } else {
        const { error } = await supabase
          .from('orders')
          .update({ status: bulkAction as AdminOrder['status'] })
          .in('id', selectedOrders);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: `${selectedOrders.length} orders updated`,
        });
      }

      setSelectedOrders([]);
      setBulkAction("");
      await fetchOrders();
    } catch (error: any) {
      console.error('Error with bulk action:', error);
      toast({
        title: "Error",
        description: "Bulk action failed",
        variant: "destructive"
      });
    }
  };

  const handleExportSelected = () => {
    const ordersToExport = selectedOrders.length > 0 
      ? filteredOrders.filter(order => selectedOrders.includes(order.id))
      : filteredOrders;

    const csvContent = [
      'Order ID,Title,Client,Vendor,Status,Amount,Currency,Created Date',
      ...ordersToExport.map(order => 
        `${order.id},"${order.title}","${order.client?.full_name || order.client?.email || 'Unknown'}","${order.vendor?.full_name || order.vendor?.email || 'Unknown'}",${order.status},${order.amount},${order.currency},${format(new Date(order.created_at), 'yyyy-MM-dd')}`
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
      description: `${ordersToExport.length} orders exported to CSV`,
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
      confirmed: "outline", 
      in_progress: "default",
      completed: "secondary",
      cancelled: "destructive",
      disputed: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  // Analytics calculations
  const currentDate = new Date();
  const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const thisWeekStart = new Date(currentDate);
  thisWeekStart.setDate(currentDate.getDate() - 7);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const inProgressOrders = orders.filter(order => order.status === 'in_progress').length;
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.amount, 0);

  const newOrdersThisMonth = orders.filter(order => 
    new Date(order.created_at) >= thisMonthStart
  ).length;

  const completedOrdersThisWeek = orders.filter(order => 
    order.status === 'completed' && new Date(order.created_at) >= thisWeekStart
  ).length;

  const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

  const filteredOrders = orders.filter(order => {
    const searchMatch = searchTerm === "" || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendor?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    
    const tabMatch = activeTab === "all" || 
      (activeTab === "pending" && order.status === "pending") ||
      (activeTab === "active" && ["confirmed", "in_progress"].includes(order.status)) ||
      (activeTab === "completed" && order.status === "completed");
    
    return searchMatch && statusMatch && tabMatch;
  });

  const selectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" data-admin-dashboard>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          Orders Management
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          Monitor and manage all orders across the platform
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{newOrdersThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedOrders.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{completedOrdersThisWeek} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} SAR</div>
                <p className="text-xs text-muted-foreground">
                  Avg: {avgOrderValue.toLocaleString()} SAR
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressOrders.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingOrders} pending
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Bulk Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Filters & Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button variant="outline" onClick={handleExportSelected}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedOrders.length > 0 && (
                  <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">
                      {selectedOrders.length} order(s) selected
                    </span>
                    <Select value={bulkAction} onValueChange={setBulkAction}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Bulk action..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Mark as Confirmed</SelectItem>
                        <SelectItem value="in_progress">Mark as In Progress</SelectItem>
                        <SelectItem value="completed">Mark as Completed</SelectItem>
                        <SelectItem value="cancelled">Mark as Cancelled</SelectItem>
                        <SelectItem value="disputed">Mark as Disputed</SelectItem>
                        <SelectItem value="delete">Delete Orders</SelectItem>
                      </SelectContent>
                    </Select>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={!bulkAction}>
                          Apply Action
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to {bulkAction === 'delete' ? 'delete' : 'update'} {selectedOrders.length} order(s)?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleBulkAction}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Orders ({filteredOrders.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onCheckedChange={selectAllOrders}
                  />
                  <span className="text-sm">Select All</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                    <p className="text-muted-foreground">No orders match your current filters</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedOrders([...selectedOrders, order.id]);
                          } else {
                            setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                          }
                        }}
                      />
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="font-medium">{order.title}</p>
                          <p className="text-sm text-muted-foreground">#{order.id.slice(0, 8)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">
                            {order.client?.full_name || order.client?.company_name || 'Unknown Client'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Vendor: {order.vendor?.full_name || order.vendor?.company_name || 'Unknown'}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="font-medium">
                            {order.amount.toLocaleString()} {order.currency}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {getStatusBadge(order.status)}
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setEditingOrder(order)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Order Details</DialogTitle>
                                  <DialogDescription>
                                    View and manage order #{order.id.slice(0, 8)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Title</label>
                                      <p className="text-sm text-muted-foreground">{order.title}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <div className="mt-1">
                                        <Select 
                                          value={order.status} 
                                          onValueChange={(value) => updateOrderStatus(order.id, value as AdminOrder['status'])}
                                        >
                                          <SelectTrigger className="w-full">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                            <SelectItem value="disputed">Disputed</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Client</label>
                                      <p className="text-sm text-muted-foreground">
                                        {order.client?.full_name || order.client?.company_name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">{order.client?.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Vendor</label>
                                      <p className="text-sm text-muted-foreground">
                                        {order.vendor?.full_name || order.vendor?.company_name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">{order.vendor?.email}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Amount</label>
                                      <p className="text-sm text-muted-foreground">
                                        {order.amount.toLocaleString()} {order.currency}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Created</label>
                                      <p className="text-sm text-muted-foreground">
                                        {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                                      </p>
                                    </div>
                                  </div>
                                  {order.notes && (
                                    <div>
                                      <label className="text-sm font-medium">Notes</label>
                                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this order? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteOrder(order.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}