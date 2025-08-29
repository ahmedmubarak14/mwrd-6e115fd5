import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  DollarSign, 
  User, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  FileText,
  Calendar,
  Building,
  Truck,
  AlertCircle,
  Star
} from "lucide-react";

interface OrderWithDetails {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  delivery_date?: string;
  completion_date?: string;
  created_at: string;
  notes?: string;
  client_id: string;
  vendor_id: string;
  offer_id?: string;
  request_id: string;
  client?: {
    full_name: string;
    company_name?: string;
    email: string;
  };
  vendor?: {
    full_name: string;
    company_name?: string;
    email: string;
  };
  offers?: {
    delivery_time_days: number;
  };
}

interface StatusUpdate {
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  notes: string;
}

export const OrderManagementSystem = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdate>({
    status: 'in_progress',
    notes: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch orders based on user role
  const fetchOrders = async () => {
    if (!user || !userProfile) return;
    
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          client:user_profiles!orders_client_id_fkey (
            full_name,
            company_name,
            email
          ),
          vendor:user_profiles!orders_vendor_id_fkey (
            full_name,
            company_name,
            email
          ),
          offers (
            delivery_time_days
          )
        `);

      // Filter based on user role
      if (userProfile.role === 'vendor') {
        query = query.eq('vendor_id', user.id);
      } else if (userProfile.role === 'client') {
        query = query.eq('client_id', user.id);
      }
      // Admins can see all orders (no filter)

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data as OrderWithDetails[] || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    
    setIsUpdating(true);
    
    try {
      const updateData: any = {
        status: statusUpdate.status,
        notes: statusUpdate.notes
      };

      // Set completion date if marking as completed
      if (statusUpdate.status === 'completed') {
        updateData.completion_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // Create financial transaction for completed orders
      if (statusUpdate.status === 'completed' && selectedOrder.status !== 'completed') {
        await supabase
          .from('financial_transactions')
          .insert([{
            user_id: selectedOrder.vendor_id,
            order_id: selectedOrder.id,
            amount: selectedOrder.amount,
            type: 'payment_received',
            status: 'completed',
            description: `Payment for order: ${selectedOrder.title}`,
            payment_method: 'bank_transfer'
          }]);
      }

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });

      // Reset form and close dialog
      setStatusUpdate({ status: 'in_progress', notes: '' });
      setSelectedOrder(null);
      
      // Refresh orders
      await fetchOrders();
      
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Get status badge variant and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' };
      case 'in_progress':
        return { variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' };
      case 'cancelled':
        return { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' };
      case 'disputed':
        return { variant: 'destructive' as const, icon: AlertCircle, color: 'text-orange-600' };
      default:
        return { variant: 'outline' as const, icon: Clock, color: 'text-gray-600' };
    }
  };

  // Calculate progress based on dates
  const calculateProgress = (order: OrderWithDetails) => {
    if (order.status === 'completed') return 100;
    if (order.status === 'cancelled') return 0;
    
    if (!order.delivery_date) return 25; // Default for pending
    
    const startDate = new Date(order.created_at).getTime();
    const endDate = new Date(order.delivery_date).getTime();
    const currentDate = Date.now();
    
    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;
    
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 90);
    return Math.round(progress);
  };

  // Check if order is overdue
  const isOverdue = (order: OrderWithDetails) => {
    if (!order.delivery_date || order.status === 'completed' || order.status === 'cancelled') {
      return false;
    }
    return new Date(order.delivery_date) < new Date();
  };

  // Get user role specific actions
  const getAvailableActions = (order: OrderWithDetails) => {
    if (!userProfile) return [];
    
    const actions = [];
    
    if (userProfile.role === 'vendor' && order.vendor_id === user?.id) {
      if (order.status === 'pending') {
        actions.push({ label: 'Start Work', status: 'in_progress' });
      }
      if (order.status === 'in_progress') {
        actions.push({ label: 'Mark Complete', status: 'completed' });
        actions.push({ label: 'Report Issue', status: 'disputed' });
      }
    } else if (userProfile.role === 'client' && order.client_id === user?.id) {
      if (order.status === 'pending' || order.status === 'in_progress') {
        actions.push({ label: 'Cancel Order', status: 'cancelled' });
        actions.push({ label: 'Report Issue', status: 'disputed' });
      }
    } else if (userProfile.role === 'admin') {
      actions.push(
        { label: 'Set Pending', status: 'pending' },
        { label: 'Set In Progress', status: 'in_progress' },
        { label: 'Mark Complete', status: 'completed' },
        { label: 'Cancel Order', status: 'cancelled' },
        { label: 'Mark Disputed', status: 'disputed' }
      );
    }
    
    return actions;
  };

  // Group orders by status
  const activeOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'in_progress'
  );
  const completedOrders = orders.filter(order => order.status === 'completed');
  const otherOrders = orders.filter(order => 
    order.status !== 'pending' && order.status !== 'in_progress' && order.status !== 'completed'
  );

  useEffect(() => {
    if (user && userProfile) {
      fetchOrders();
    }
  }, [user, userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const OrderCard = ({ order }: { order: OrderWithDetails }) => {
    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;
    const progress = calculateProgress(order);
    const overdue = isOverdue(order);
    const availableActions = getAvailableActions(order);

    return (
      <Card key={order.id} className={`${
        overdue ? 'border-l-4 border-l-red-500' : ''
      }`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {order.title}
                {overdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </CardTitle>
              <div className="space-y-1">
                {userProfile?.role !== 'client' && order.client && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Client: {order.client.full_name || order.client.company_name}
                  </p>
                )}
                {userProfile?.role !== 'vendor' && order.vendor && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    Vendor: {order.vendor.full_name || order.vendor.company_name}
                  </p>
                )}
              </div>
            </div>
            <Badge variant={statusInfo.variant} className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              {order.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.description && (
              <p className="text-muted-foreground text-sm">{order.description}</p>
            )}
            
            {/* Progress Bar */}
            {order.status !== 'cancelled' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Order Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {order.amount.toLocaleString()} {order.currency}
                </span>
              </div>
              
              {order.delivery_date && (
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className={overdue ? 'text-red-600' : ''}>
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              {order.completion_date && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>
                    {new Date(order.completion_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {order.notes && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {availableActions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableActions.map((action) => (
                  <Dialog key={action.status}>
                    <DialogTrigger asChild>
                      <Button
                        variant={action.status === 'cancelled' || action.status === 'disputed' ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setStatusUpdate({ status: action.status as any, notes: '' });
                        }}
                      >
                        {action.label}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{action.label}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Order: {order.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Amount: {order.amount.toLocaleString()} {order.currency}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="status-notes">
                            {action.status === 'completed' ? 'Completion Notes' : 
                             action.status === 'cancelled' ? 'Cancellation Reason' :
                             action.status === 'disputed' ? 'Issue Description' : 'Notes'}
                            {action.status !== 'in_progress' && ' *'}
                          </Label>
                          <Textarea
                            id="status-notes"
                            value={statusUpdate.notes}
                            onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder={
                              action.status === 'completed' ? 'Describe what was delivered...' :
                              action.status === 'cancelled' ? 'Reason for cancellation...' :
                              action.status === 'disputed' ? 'Describe the issue...' :
                              'Additional notes (optional)...'
                            }
                            rows={3}
                            required={action.status !== 'in_progress'}
                          />
                        </div>
                        
                        <Button 
                          onClick={handleStatusUpdate}
                          disabled={isUpdating || (action.status !== 'in_progress' && !statusUpdate.notes.trim())}
                          className="w-full"
                          variant={action.status === 'cancelled' || action.status === 'disputed' ? 'destructive' : 'default'}
                        >
                          {isUpdating ? 'Updating...' : `Confirm ${action.label}`}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Order Management</h2>
        <p className="text-muted-foreground">
          {userProfile?.role === 'vendor' 
            ? 'Track and manage your active orders' 
            : userProfile?.role === 'client'
            ? 'Monitor your orders and track progress'
            : 'Oversee all platform orders and transactions'
          }
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground">
              {userProfile?.role === 'vendor' 
                ? 'Orders from accepted offers will appear here'
                : 'Orders from your approved offers will appear here'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Active Orders ({activeOrders.length})
              </h3>
              <div className="grid gap-4">
                {activeOrders.map((order) => <OrderCard key={order.id} order={order} />)}
              </div>
            </div>
          )}

          {/* Completed Orders */}
          {completedOrders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Completed Orders ({completedOrders.length})
              </h3>
              <div className="grid gap-4">
                {completedOrders.map((order) => <OrderCard key={order.id} order={order} />)}
              </div>
            </div>
          )}

          {/* Other Orders (Cancelled, Disputed) */}
          {otherOrders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Other Orders ({otherOrders.length})
              </h3>
              <div className="grid gap-4">
                {otherOrders.map((order) => <OrderCard key={order.id} order={order} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
