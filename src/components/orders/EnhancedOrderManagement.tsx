import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Calendar,
  TrendingUp,
  Package,
  Truck,
  DollarSign,
  User,
  Edit,
  Eye,
  Download
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Order } from '@/hooks/useOrders';

interface OrderMilestone {
  id: string;
  order_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  due_date?: string;
  completed_date?: string;
  progress_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface EnhancedOrderManagementProps {
  orders: Order[];
  onOrderUpdate: (orderId: string, updates: any) => void;
}

export const EnhancedOrderManagement = ({ orders, onOrderUpdate }: EnhancedOrderManagementProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [milestones, setMilestones] = useState<Record<string, OrderMilestone[]>>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMilestones, setShowMilestones] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    due_date: '',
    progress_percentage: 0
  });

  // Load milestones for all orders
  useEffect(() => {
    const loadMilestones = async () => {
      if (orders.length === 0) return;

      const orderIds = orders.map(o => o.id);
      const { data, error } = await supabase
        .from('order_milestones')
        .select('*')
        .in('order_id', orderIds)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading milestones:', error);
        return;
      }

      const milestonesByOrder = (data || []).reduce((acc, milestone) => {
        if (!acc[milestone.order_id]) {
          acc[milestone.order_id] = [];
        }
        acc[milestone.order_id].push({
          ...milestone,
          status: milestone.status as 'pending' | 'in_progress' | 'completed' | 'delayed'
        });
        return acc;
      }, {} as Record<string, OrderMilestone[]>);

      setMilestones(milestonesByOrder);
    };

    loadMilestones();
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'pending': language === 'ar' ? 'في الانتظار' : 'Pending',
      'confirmed': language === 'ar' ? 'مؤكد' : 'Confirmed',
      'in_progress': language === 'ar' ? 'قيد التنفيذ' : 'In Progress',
      'completed': language === 'ar' ? 'مكتمل' : 'Completed',
      'cancelled': language === 'ar' ? 'ملغي' : 'Cancelled'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const calculateOrderProgress = (orderId: string) => {
    const orderMilestones = milestones[orderId] || [];
    if (orderMilestones.length === 0) return 0;
    
    const totalProgress = orderMilestones.reduce((sum, m) => sum + m.progress_percentage, 0);
    return Math.round(totalProgress / orderMilestones.length);
  };

  const getDaysUntilDelivery = (deliveryDate?: string) => {
    if (!deliveryDate) return null;
    return differenceInDays(new Date(deliveryDate), new Date());
  };

  const addMilestone = async () => {
    if (!selectedOrder || !newMilestone.title) return;

    try {
      const { data, error } = await supabase
        .from('order_milestones')
        .insert([{
          order_id: selectedOrder.id,
          title: newMilestone.title,
          description: newMilestone.description,
          due_date: newMilestone.due_date || null,
          progress_percentage: newMilestone.progress_percentage,
          status: 'pending' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
        setMilestones(prev => ({
          ...prev,
          [selectedOrder.id]: [...(prev[selectedOrder.id] || []), {
            ...data,
            status: data.status as 'pending' | 'in_progress' | 'completed' | 'delayed'
          }]
        }));

      setNewMilestone({
        title: '',
        description: '',
        due_date: '',
        progress_percentage: 0
      });

      toast({
        title: language === 'ar' ? 'تم إضافة المعلم' : 'Milestone Added',
        description: language === 'ar' ? 'تم إضافة المعلم بنجاح' : 'Milestone has been added successfully',
      });
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في إضافة المعلم' : 'Failed to add milestone',
        variant: 'destructive'
      });
    }
  };

  const updateMilestoneProgress = async (milestoneId: string, progress: number, status?: string) => {
    try {
      const { error } = await supabase
        .from('order_milestones')
        .update({
          progress_percentage: progress,
          status: status || (progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending'),
          completed_date: progress === 100 ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', milestoneId);

      if (error) throw error;

      // Update local state
      setMilestones(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(orderId => {
          updated[orderId] = updated[orderId].map(m => 
            m.id === milestoneId 
              ? { 
                  ...m, 
                  progress_percentage: progress,
                  status: (status || (progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending')) as 'pending' | 'in_progress' | 'completed' | 'delayed',
                  completed_date: progress === 100 ? new Date().toISOString() : null,
                  updated_at: new Date().toISOString()
                }
              : m
          );
        });
        return updated;
      });

      toast({
        title: language === 'ar' ? 'تم تحديث التقدم' : 'Progress Updated',
        description: language === 'ar' ? 'تم تحديث تقدم المعلم بنجاح' : 'Milestone progress has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في تحديث التقدم' : 'Failed to update progress',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Orders Grid */}
      <div className="grid gap-6">
        {orders.map((order) => {
          const orderProgress = calculateOrderProgress(order.id);
          const daysUntilDelivery = getDaysUntilDelivery(order.delivery_date);
          const orderMilestones = milestones[order.id] || [];

          return (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {order.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {order.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                    {daysUntilDelivery !== null && (
                      <Badge variant={daysUntilDelivery < 0 ? 'destructive' : daysUntilDelivery <= 3 ? 'secondary' : 'outline'}>
                        {daysUntilDelivery < 0 
                          ? (language === 'ar' ? `متأخر ${Math.abs(daysUntilDelivery)} يوم` : `${Math.abs(daysUntilDelivery)} days overdue`)
                          : (language === 'ar' ? `${daysUntilDelivery} يوم متبقي` : `${daysUntilDelivery} days left`)
                        }
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'ar' ? 'المبلغ' : 'Amount'}</p>
                      <p className="font-semibold">{order.amount.toLocaleString()} {order.currency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'ar' ? 'تاريخ الطلب' : 'Order Date'}</p>
                      <p className="font-semibold">{format(new Date(order.date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  {order.delivery_date && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">{language === 'ar' ? 'تاريخ التسليم' : 'Delivery Date'}</p>
                        <p className="font-semibold">{format(new Date(order.delivery_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">{language === 'ar' ? 'العميل' : 'Client'}</p>
                      <p className="font-semibold">{order.client}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium">
                      {language === 'ar' ? 'تقدم الطلب' : 'Order Progress'}
                    </Label>
                    <span className="text-sm text-muted-foreground">{orderProgress}%</span>
                  </div>
                  <Progress value={orderProgress} className="h-2" />
                </div>

                {/* Milestones Preview */}
                {orderMilestones.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {language === 'ar' ? 'المعالم الرئيسية' : 'Milestones'} ({orderMilestones.filter(m => m.status === 'completed').length}/{orderMilestones.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {orderMilestones.slice(0, 4).map((milestone) => (
                        <div key={milestone.id} className="flex items-center gap-2 text-sm">
                          {milestone.status === 'completed' ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : milestone.status === 'in_progress' ? (
                            <Clock className="h-3 w-3 text-blue-600" />
                          ) : milestone.status === 'delayed' ? (
                            <AlertCircle className="h-3 w-3 text-red-600" />
                          ) : (
                            <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
                          )}
                          <span className={milestone.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                            {milestone.title}
                          </span>
                          <span className="text-xs text-muted-foreground">({milestone.progress_percentage}%)</span>
                        </div>
                      ))}
                      {orderMilestones.length > 4 && (
                        <div className="text-sm text-muted-foreground">
                          +{orderMilestones.length - 4} {language === 'ar' ? 'المزيد' : 'more'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowMilestones(true);
                    }}
                    className="gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    {language === 'ar' ? 'إدارة المعالم' : 'Manage Milestones'}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {language === 'ar' ? 'رسائل' : 'Messages'}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    {language === 'ar' ? 'الوثائق' : 'Documents'}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    {language === 'ar' ? 'تصدير' : 'Export'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Milestones Management Dialog */}
      <Dialog open={showMilestones} onOpenChange={setShowMilestones}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'إدارة معالم الطلب' : 'Order Milestone Management'}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.title} - {language === 'ar' ? 'تتبع وإدارة معالم التقدم' : 'Track and manage progress milestones'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto max-h-96">
            {/* Add New Milestone */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'إضافة معلم جديد' : 'Add New Milestone'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'ar' ? 'عنوان المعلم' : 'Milestone Title'}</Label>
                    <Input
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={language === 'ar' ? 'أدخل عنوان المعلم' : 'Enter milestone title'}
                    />
                  </div>
                  <div>
                    <Label>{language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</Label>
                    <Input
                      type="date"
                      value={newMilestone.due_date}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, due_date: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>{language === 'ar' ? 'الوصف' : 'Description'}</Label>
                    <Textarea
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={language === 'ar' ? 'وصف تفصيلي للمعلم' : 'Detailed description of the milestone'}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>{language === 'ar' ? 'نسبة التقدم الأولية' : 'Initial Progress'} (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newMilestone.progress_percentage}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, progress_percentage: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addMilestone} disabled={!newMilestone.title}>
                      {language === 'ar' ? 'إضافة المعلم' : 'Add Milestone'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Milestones */}
            <div className="space-y-3">
              {selectedOrder && milestones[selectedOrder.id]?.map((milestone) => (
                <Card key={milestone.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{milestone.title}</h4>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        )}
                        {milestone.due_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {language === 'ar' ? 'مستحق في' : 'Due'}: {format(new Date(milestone.due_date), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                      <Badge variant={milestone.status === 'completed' ? 'default' : milestone.status === 'delayed' ? 'destructive' : 'secondary'}>
                        {milestone.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">{language === 'ar' ? 'التقدم' : 'Progress'}</Label>
                        <span className="text-sm">{milestone.progress_percentage}%</span>
                      </div>
                      <Progress value={milestone.progress_percentage} className="h-2" />
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={milestone.progress_percentage}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            updateMilestoneProgress(milestone.id, value);
                          }}
                          className="w-20"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateMilestoneProgress(milestone.id, 100, 'completed')}
                          disabled={milestone.status === 'completed'}
                        >
                          {language === 'ar' ? 'اكتمل' : 'Complete'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMilestones(false)}>
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
