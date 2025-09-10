import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Upload, 
  Download,
  MessageSquare,
  Calendar,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Building2,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  client: {
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'new' | 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  dueDate: string;
  notes: string;
  documents: string[];
  trackingNumber?: string;
  deliveryAddress: string;
}

interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku: string;
}

const ORDER_STATUSES = [
  { id: 'new', label: 'New', color: 'bg-blue-100 text-blue-800', icon: Plus },
  { id: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { id: 'in_production', label: 'In Production', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  { id: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  { id: 'delivered', label: 'Delivered', color: 'bg-indigo-100 text-indigo-800', icon: CheckCircle },
  { id: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertCircle }
];

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

export const OrderKanbanBoard: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdateNotes, setStatusUpdateNotes] = useState('');

  // Mock data - in real app, this would come from API
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      client: {
        name: 'Ahmed Al-Rashid',
        company: 'Tech Solutions Inc.',
        email: 'ahmed@techsolutions.com',
        phone: '+966501234567'
      },
      items: [
        {
          id: '1',
          name: 'Office Chairs',
          description: 'Ergonomic office chairs with lumbar support',
          quantity: 10,
          unitPrice: 450,
          totalPrice: 4500,
          sku: 'CHAIR-001'
        }
      ],
      totalAmount: 4500,
      currency: 'SAR',
      status: 'new',
      priority: 'high',
      createdAt: '2024-01-20',
      dueDate: '2024-02-15',
      notes: 'Urgent delivery required for new office setup',
      documents: ['order_confirmation.pdf'],
      deliveryAddress: 'Riyadh, Saudi Arabia - King Fahd Road, Building 123'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      client: {
        name: 'Sarah Johnson',
        company: 'Green Building Co.',
        email: 'sarah@greenbuilding.com',
        phone: '+966502345678'
      },
      items: [
        {
          id: '2',
          name: 'LED Panel Lights',
          description: 'Energy-efficient LED panel lights',
          quantity: 25,
          unitPrice: 120,
          totalPrice: 3000,
          sku: 'LED-002'
        }
      ],
      totalAmount: 3000,
      currency: 'SAR',
      status: 'confirmed',
      priority: 'medium',
      createdAt: '2024-01-18',
      dueDate: '2024-02-20',
      notes: 'Installation required on site',
      documents: ['technical_specs.pdf', 'installation_guide.pdf'],
      deliveryAddress: 'Jeddah, Saudi Arabia - Corniche Road, Tower 456'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      client: {
        name: 'Mohammed Al-Sheikh',
        company: 'Modern Interiors',
        email: 'mohammed@moderninteriors.com',
        phone: '+966503456789'
      },
      items: [
        {
          id: '3',
          name: 'Desk Lamps',
          description: 'Adjustable desk lamps with USB charging',
          quantity: 15,
          unitPrice: 85,
          totalPrice: 1275,
          sku: 'LAMP-003'
        }
      ],
      totalAmount: 1275,
      currency: 'SAR',
      status: 'in_production',
      priority: 'low',
      createdAt: '2024-01-15',
      dueDate: '2024-02-10',
      notes: 'Custom color: Black',
      documents: ['customization_request.pdf'],
      deliveryAddress: 'Dammam, Saudi Arabia - Prince Faisal Street, Office 789'
    }
  ]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.client.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
      
      return matchesSearch && matchesPriority;
    });
  }, [orders, searchTerm, priorityFilter]);

  const ordersByStatus = useMemo(() => {
    const grouped: Record<string, Order[]> = {};
    ORDER_STATUSES.forEach(status => {
      grouped[status.id] = filteredOrders.filter(order => order.status === status.id);
    });
    return grouped;
  }, [filteredOrders]);

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as Order['status'] }
        : order
    ));
    
    toast({
      title: t('common.success'),
      description: t('vendor.orders.statusUpdated')
    });
    
    setShowStatusUpdate(false);
    setNewStatus('');
    setStatusUpdateNotes('');
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-3 w-3" />;
      case 'high': return <Clock className="h-3 w-3" />;
      case 'medium': return <Package className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('vendor.orders.kanbanTitle')}</h1>
          <p className="text-muted-foreground">{t('vendor.orders.kanbanDescription')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('vendor.orders.export')}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('vendor.orders.addOrder')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t('vendor.orders.searchOrders')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('vendor.orders.filterByPriority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="urgent">{t('vendor.orders.priorityUrgent')}</SelectItem>
                <SelectItem value="high">{t('vendor.orders.priorityHigh')}</SelectItem>
                <SelectItem value="medium">{t('vendor.orders.priorityMedium')}</SelectItem>
                <SelectItem value="low">{t('vendor.orders.priorityLow')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 overflow-x-auto">
        {ORDER_STATUSES.map((status) => {
          const statusOrders = ordersByStatus[status.id] || [];
          const StatusIcon = status.icon;
          
          return (
            <div key={status.id} className="min-w-[280px]">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4" />
                      <CardTitle className="text-sm font-medium">
                        {status.label}
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {statusOrders.length}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {statusOrders.map((order) => {
                    const daysUntilDue = getDaysUntilDue(order.dueDate);
                    const isOverdue = daysUntilDue < 0;
                    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
                    
                    return (
                      <Card 
                        key={order.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleViewOrder(order)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-sm">{order.orderNumber}</h4>
                                <p className="text-xs text-muted-foreground">{order.client.company}</p>
                              </div>
                              <Badge className={cn("text-xs", PRIORITY_COLORS[order.priority])}>
                                {getPriorityIcon(order.priority)}
                                {t(`vendor.orders.priority${order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}`)}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('vendor.orders.total')}</span>
                                <span className="font-medium">
                                  {formatCurrency(order.totalAmount, order.currency)}
                                </span>
                              </div>
                              
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('vendor.orders.dueDate')}</span>
                                <span className={cn(
                                  "text-xs",
                                  isOverdue && "text-red-600 font-medium",
                                  isDueSoon && !isOverdue && "text-orange-600 font-medium"
                                )}>
                                  {formatDate(order.dueDate)}
                                  {isOverdue && ` (${Math.abs(daysUntilDue)} days overdue)`}
                                  {isDueSoon && !isOverdue && ` (${daysUntilDue} days left)`}
                                </span>
                              </div>
                              
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('vendor.orders.items')}</span>
                                <span>{order.items.length} {t('vendor.orders.item')}</span>
                              </div>
                            </div>
                            
                            {order.trackingNumber && (
                              <div className="text-xs text-muted-foreground">
                                {t('vendor.orders.tracking')}: {order.trackingNumber}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {statusOrders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      {t('vendor.orders.noOrdersInStatus')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('vendor.orders.orderDetails')}</DialogTitle>
            <DialogDescription>
              {t('vendor.orders.orderDetailsDescription')} - {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('vendor.orders.clientInfo')}</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>{t('vendor.orders.clientName')}:</strong> {selectedOrder.client.name}</p>
                    <p><strong>{t('vendor.orders.company')}:</strong> {selectedOrder.client.company}</p>
                    <p><strong>{t('vendor.orders.email')}:</strong> {selectedOrder.client.email}</p>
                    <p><strong>{t('vendor.orders.phone')}:</strong> {selectedOrder.client.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">{t('vendor.orders.orderInfo')}</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>{t('vendor.orders.orderNumber')}:</strong> {selectedOrder.orderNumber}</p>
                    <p><strong>{t('vendor.orders.created')}:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>{t('vendor.orders.dueDate')}:</strong> {formatDate(selectedOrder.dueDate)}</p>
                    <p><strong>{t('vendor.orders.priority')}:</strong> 
                      <Badge className={cn("ml-2 text-xs", PRIORITY_COLORS[selectedOrder.priority])}>
                        {t(`vendor.orders.priority${selectedOrder.priority.charAt(0).toUpperCase() + selectedOrder.priority.slice(1)}`)}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">{t('vendor.orders.orderItems')}</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t('vendor.orders.sku')}: {item.sku}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <p>{item.quantity} x {formatCurrency(item.unitPrice, selectedOrder.currency)}</p>
                            <p className="font-medium">{formatCurrency(item.totalPrice, selectedOrder.currency)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{t('vendor.orders.total')}</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="font-semibold mb-2">{t('vendor.orders.deliveryAddress')}</h3>
                <p className="text-sm">{selectedOrder.deliveryAddress}</p>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold mb-2">{t('vendor.orders.notes')}</h3>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Documents */}
              {selectedOrder.documents.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">{t('vendor.orders.documents')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.documents.map((doc, index) => (
                      <Button key={index} variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        {doc}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                  {t('common.close')}
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t('vendor.orders.contactClient')}
                </Button>
                <Button onClick={() => setShowStatusUpdate(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t('vendor.orders.updateStatus')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('vendor.orders.updateStatus')}</DialogTitle>
            <DialogDescription>
              {t('vendor.orders.updateStatusDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">{t('vendor.orders.newStatus')}</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t('vendor.orders.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map(status => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">{t('vendor.orders.statusNotes')}</Label>
              <Textarea
                id="notes"
                value={statusUpdateNotes}
                onChange={(e) => setStatusUpdateNotes(e.target.value)}
                placeholder={t('vendor.orders.statusNotesPlaceholder')}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowStatusUpdate(false)}>
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={() => selectedOrder && handleStatusUpdate(selectedOrder.id, newStatus)}
              disabled={!newStatus}
            >
              {t('vendor.orders.updateStatus')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
