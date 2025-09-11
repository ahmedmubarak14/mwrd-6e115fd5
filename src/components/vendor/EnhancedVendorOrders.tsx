import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Clock, CheckCircle, AlertCircle, Eye, MessageSquare,
  Filter, Calendar, DollarSign, User, MapPin, Search, Download,
  MoreHorizontal, RefreshCw, Truck, Star, ArrowUpDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOptimizedFormatters } from '@/hooks/usePerformanceOptimization';
import { ErrorRecovery } from '@/components/ui/error-recovery';
import { 
  MobileDataList, MobileSearchFilter, MobileCollapsibleCard,
  MobileActionSheet, ResponsiveContainer 
} from '@/components/ui/mobile-optimized-components';
import { TableRowSkeleton } from '@/components/ui/skeleton-components';
import { InlineLoading } from '@/components/ui/enhanced-loading-states';
import { cn } from '@/lib/utils';

// Order status types
type OrderStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'disputed';

interface Order {
  id: string;
  projectTitle: string;
  clientName: string;
  clientAvatar?: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  dueDate: Date;
  location: string;
  description: string;
  completionPercentage?: number;
  lastUpdate: Date;
  unreadMessages: number;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: '1',
    projectTitle: 'Office Building Construction',
    clientName: 'Ahmed Al-Rashid',
    amount: 150000,
    status: 'in-progress',
    createdAt: new Date('2024-01-15'),
    dueDate: new Date('2024-06-15'),
    location: 'Riyadh, Saudi Arabia',
    description: 'Complete office building construction with modern specifications',
    completionPercentage: 65,
    lastUpdate: new Date('2024-02-01'),
    unreadMessages: 3,
    tags: ['Construction', 'Commercial'],
    priority: 'high'
  },
  {
    id: '2',
    projectTitle: 'Villa Renovation',
    clientName: 'Sarah Mohamed',
    amount: 75000,
    status: 'pending',
    createdAt: new Date('2024-02-01'),
    dueDate: new Date('2024-04-01'),
    location: 'Jeddah, Saudi Arabia',
    description: 'Complete villa renovation including interior design',
    lastUpdate: new Date('2024-02-01'),
    unreadMessages: 1,
    tags: ['Renovation', 'Residential'],
    priority: 'medium'
  },
  {
    id: '3',
    projectTitle: 'Shopping Mall Maintenance',
    clientName: 'Khalid Trading Co.',
    amount: 45000,
    status: 'completed',
    createdAt: new Date('2024-01-01'),
    dueDate: new Date('2024-02-15'),
    location: 'Dammam, Saudi Arabia',
    description: 'Quarterly maintenance and repair services',
    completionPercentage: 100,
    lastUpdate: new Date('2024-02-10'),
    unreadMessages: 0,
    tags: ['Maintenance', 'Commercial'],
    priority: 'low'
  }
];

// Order status configuration
const orderStatusConfig: Record<OrderStatus, {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = {
  pending: { 
    label: 'Pending', 
    variant: 'warning', 
    icon: Clock, 
    color: 'text-yellow-600' 
  },
  confirmed: { 
    label: 'Confirmed', 
    variant: 'default', 
    icon: CheckCircle, 
    color: 'text-blue-600' 
  },
  'in-progress': { 
    label: 'In Progress', 
    variant: 'default', 
    icon: Package, 
    color: 'text-blue-600' 
  },
  completed: { 
    label: 'Completed', 
    variant: 'success', 
    icon: CheckCircle, 
    color: 'text-green-600' 
  },
  cancelled: { 
    label: 'Cancelled', 
    variant: 'destructive', 
    icon: AlertCircle, 
    color: 'text-red-600' 
  },
  disputed: { 
    label: 'Disputed', 
    variant: 'destructive', 
    icon: AlertCircle, 
    color: 'text-red-600' 
  }
};

// Mobile Order Card Component
const MobileOrderCard = React.memo<{ order: Order; onAction: (action: string, order: Order) => void }>(
({ order, onAction }) => {
  const { formatCurrency, formatRelativeTime } = useOptimizedFormatters();
  const statusConfig = orderStatusConfig[order.status];
  const StatusIcon = statusConfig.icon;

  return (
    <MobileCollapsibleCard
      title={order.projectTitle}
      description={`${order.clientName} • ${formatCurrency(order.amount)}`}
      icon={StatusIcon}
      badge={statusConfig.label}
      className="border-l-4 border-l-primary"
    >
      <div className="space-y-4">
        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{order.clientName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{order.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatRelativeTime(order.dueDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatCurrency(order.amount)}</span>
          </div>
        </div>

        {/* Progress Bar (for in-progress orders) */}
        {order.status === 'in-progress' && order.completionPercentage && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{order.completionPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${order.completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {order.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onAction('view', order)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAction('message', order)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {order.unreadMessages > 0 && (
              <Badge variant="destructive" className="text-xs ml-1">
                {order.unreadMessages}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </MobileCollapsibleCard>
  );
});

MobileOrderCard.displayName = 'MobileOrderCard';

export const EnhancedVendorOrders: React.FC = () => {
  const { language, isRTL, t } = useLanguage();
  const { formatCurrency, formatRelativeTime } = useOptimizedFormatters();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    let filtered = mockOrders.filter(order => {
      const matchesSearch = order.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, selectedStatus, sortBy, sortOrder]);

  // Order statistics
  const orderStats = useMemo(() => {
    const stats = mockOrders.reduce(
      (acc, order) => {
        acc.total++;
        acc.totalValue += order.amount;
        
        switch (order.status) {
          case 'pending':
            acc.pending++;
            break;
          case 'in-progress':
            acc.inProgress++;
            break;
          case 'completed':
            acc.completed++;
            break;
          default:
            acc.other++;
        }
        
        return acc;
      },
      { total: 0, pending: 0, inProgress: 0, completed: 0, other: 0, totalValue: 0 }
    );

    return stats;
  }, []);

  const handleOrderAction = useCallback((action: string, order: Order) => {
    setSelectedOrder(order);
    
    switch (action) {
      case 'view':
        // Navigate to order details
        console.log('View order:', order.id);
        break;
      case 'message':
        // Navigate to messages
        console.log('Message client for order:', order.id);
        break;
      case 'edit':
        setShowActionSheet(true);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <ResponsiveContainer>
        <Suspense fallback={<InlineLoading />}>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} columns={6} />
            ))}
          </div>
        </Suspense>
      </ResponsiveContainer>
    );
  }

  if (error) {
    return (
      <ResponsiveContainer>
        <ErrorRecovery
          error={error}
          onRetry={handleRetry}
          title="Failed to load orders"
          description="Unable to fetch your order data. Please try again."
        />
      </ResponsiveContainer>
    );
  }

  const FilterComponent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus | 'all')}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Sort By</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'status')}
            className="w-full p-2 border rounded-md"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="status">Status</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Order</label>
          <Button 
            variant="outline" 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full justify-start"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveContainer className="space-y-6">
      {/* Header */}
      <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", isRTL && "sm:flex-row-reverse")}>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">
            Manage your project orders and track progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orderStats.total}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{orderStats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-lg font-bold">{formatCurrency(orderStats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <MobileSearchFilter
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search orders..."
        filterComponent={FilterComponent}
        showFilter={showFilters}
      />

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Package className="h-5 w-5" />
            Your Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MobileDataList
            items={filteredOrders}
            renderItem={(order) => (
              <MobileOrderCard 
                key={order.id}
                order={order} 
                onAction={handleOrderAction}
              />
            )}
            keyExtractor={(order) => order.id}
            loading={loading}
            empty={
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedStatus !== 'all' 
                    ? "Try adjusting your search or filters"
                    : "You haven't received any orders yet"
                  }
                </p>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Action Sheet for Mobile */}
      {showActionSheet && (
        <MobileActionSheet
          trigger={<div />}
          title={selectedOrder?.projectTitle || "Order Actions"}
        >
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                if (selectedOrder) handleOrderAction('view', selectedOrder);
                setShowActionSheet(false);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                if (selectedOrder) handleOrderAction('message', selectedOrder);
                setShowActionSheet(false);
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Client
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                console.log('Update status');
                setShowActionSheet(false);
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </div>
        </MobileActionSheet>
      )}
    </ResponsiveContainer>
  );
};