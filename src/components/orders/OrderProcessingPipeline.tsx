import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, CheckCircle, Package, Truck, XCircle } from "lucide-react";
import { useOrderProcessing, Order } from "@/hooks/useOrderProcessing";
import { format } from "date-fns";

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'confirmed':
      return <CheckCircle className="h-4 w-4" />;
    case 'in_progress':
      return <Package className="h-4 w-4" />;
    case 'delivered':
      return <Truck className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusVariant = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'confirmed':
      return 'default';
    case 'in_progress':
      return 'outline';
    case 'delivered':
      return 'default';
    case 'completed':
      return 'default';
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: Exclude<Order['status'], 'disputed'>) => void;
  userRole: 'client' | 'vendor' | 'admin';
}

const OrderCard = ({ order, onStatusUpdate, userRole }: OrderCardProps) => {
  const getAvailableActions = () => {
    const actions = [];
    
    if (userRole === 'client') {
      if (order.status === 'pending') {
        actions.push(
          <Button
            key="confirm"
            size="sm"
            onClick={() => onStatusUpdate(order.id, 'confirmed')}
          >
            Confirm Order
          </Button>
        );
      }
      if (order.status === 'delivered') {
        actions.push(
          <Button
            key="complete"
            size="sm"
            onClick={() => onStatusUpdate(order.id, 'completed')}
          >
            Mark Complete
          </Button>
        );
      }
    }
    
    if (userRole === 'vendor') {
      if (order.status === 'confirmed') {
        actions.push(
          <Button
            key="start"
            size="sm"
            onClick={() => onStatusUpdate(order.id, 'in_progress')}
          >
            Start Work
          </Button>
        );
      }
      if (order.status === 'in_progress') {
        actions.push(
          <Button
            key="deliver"
            size="sm"
            onClick={() => onStatusUpdate(order.id, 'delivered')}
          >
            Mark Delivered
          </Button>
        );
      }
    }

    if (order.status !== 'completed' && order.status !== 'cancelled') {
      actions.push(
        <Button
          key="cancel"
          size="sm"
          variant="destructive"
          onClick={() => onStatusUpdate(order.id, 'cancelled')}
        >
          Cancel
        </Button>
      );
    }

    return actions;
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{order.title}</h3>
          <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
        </div>
        <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
          {getStatusIcon(order.status)}
          {order.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      {order.description && (
        <p className="text-sm text-muted-foreground mb-4">{order.description}</p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-sm font-medium">Amount:</span>
          <p className="text-sm">{order.currency || 'SAR'} {order.amount?.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-sm font-medium">Created:</span>
          <p className="text-sm">{format(new Date(order.created_at), 'MMM dd, yyyy')}</p>
        </div>
      </div>

      {order.delivery_date && (
        <div className="mb-4">
          <span className="text-sm font-medium">Delivery Date:</span>
          <p className="text-sm">{format(new Date(order.delivery_date), 'MMM dd, yyyy')}</p>
        </div>
      )}

      {order.notes && (
        <div className="mb-4">
          <span className="text-sm font-medium">Notes:</span>
          <p className="text-sm text-muted-foreground">{order.notes}</p>
        </div>
      )}

      {getAvailableActions().length > 0 && (
        <>
          <Separator className="mb-4" />
          <div className="flex gap-2 flex-wrap">
            {getAvailableActions()}
          </div>
        </>
      )}
    </Card>
  );
};

interface OrderProcessingPipelineProps {
  userRole: 'client' | 'vendor' | 'admin';
}

export const OrderProcessingPipeline = ({ userRole }: OrderProcessingPipelineProps) => {
  const { orders, loading, confirmOrder, startProgress, markDelivered, completeOrder, cancelOrder } = useOrderProcessing();

  const handleStatusUpdate = async (orderId: string, status: Exclude<Order['status'], 'disputed'>) => {
    switch (status) {
      case 'confirmed':
        await confirmOrder(orderId);
        break;
      case 'in_progress':
        await startProgress(orderId);
        break;
      case 'delivered':
        await markDelivered(orderId);
        break;
      case 'completed':
        await completeOrder(orderId);
        break;
      case 'cancelled':
        await cancelOrder(orderId);
        break;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
        <p className="text-muted-foreground">
          {userRole === 'vendor' 
            ? "You haven't received any orders yet." 
            : "You haven't placed any orders yet."
          }
        </p>
      </Card>
    );
  }

  const statusGroups = orders.reduce((groups, order) => {
    const status = order.status;
    if (!groups[status]) groups[status] = [];
    groups[status].push(order);
    return groups;
  }, {} as Record<string, Order[]>);

  const statusOrder = ['pending', 'confirmed', 'in_progress', 'delivered', 'completed', 'cancelled'];

  return (
    <div className="space-y-6">
      {statusOrder.map((status) => {
        const statusOrders = statusGroups[status];
        if (!statusOrders?.length) return null;

        return (
          <div key={status}>
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {status.replace('_', ' ')} Orders ({statusOrders.length})
            </h2>
            <div className="space-y-4">
              {statusOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={handleStatusUpdate}
                  userRole={userRole}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};