import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Package,
  Plus,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Edit,
  Trash2,
  History,
  Bell,
  Download,
  RefreshCw,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit_of_measure: string;
  current_stock: number;
  min_stock_level: number;
  max_stock_level?: number;
  unit_cost?: number;
  unit_price?: number;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface InventoryMovement {
  id: string;
  movement_type: string;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason?: string;
  reference_type?: string;
  notes?: string;
  created_at: string;
}

interface InventoryAlert {
  id: string;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  inventory_item_id: string;
  inventory_items: {
    name: string;
    sku: string;
  };
}

export const BasicInventoryTracker = () => {
  const { isRTL } = useLanguage();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [summary, setSummary] = useState({
    total_items: 0,
    low_stock_items: 0,
    out_of_stock_items: 0,
    total_inventory_value: 0,
  });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMovementDialog, setShowMovementDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  // Form states
  const [itemForm, setItemForm] = useState({
    sku: '',
    name: '',
    description: '',
    category: '',
    unit_of_measure: 'unit',
    current_stock: 0,
    min_stock_level: 10,
    max_stock_level: '',
    unit_cost: '',
    unit_price: '',
    location: '',
    notes: '',
  });

  const [movementForm, setMovementForm] = useState({
    movement_type: 'in',
    quantity: 0,
    reason: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, [userProfile?.id]);

  const loadData = async () => {
    if (!userProfile?.id) return;

    try {
      setLoading(true);
      await Promise.all([
        loadInventoryItems(),
        loadSummary(),
        loadAlerts(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryItems = async () => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('vendor_id', userProfile!.id)
      .order('name');

    if (error) {
      console.error('Error loading inventory:', error);
      return;
    }

    setItems(data || []);
  };

  const loadSummary = async () => {
    const { data, error } = await supabase
      .rpc('get_inventory_summary', { p_vendor_id: userProfile!.id });

    if (error) {
      console.error('Error loading summary:', error);
      return;
    }

    if (data?.success) {
      setSummary({
        total_items: data.total_items,
        low_stock_items: data.low_stock_items,
        out_of_stock_items: data.out_of_stock_items,
        total_inventory_value: data.total_inventory_value,
      });
    }
  };

  const loadAlerts = async () => {
    const { data, error } = await supabase
      .from('inventory_alerts')
      .select(`
        *,
        inventory_items (name, sku)
      `)
      .eq('vendor_id', userProfile!.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading alerts:', error);
      return;
    }

    setAlerts(data || []);
  };

  const loadMovements = async (itemId: string) => {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select('*')
      .eq('inventory_item_id', itemId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error loading movements:', error);
      return;
    }

    setMovements(data || []);
  };

  const handleAddItem = async () => {
    try {
      const { error } = await supabase.from('inventory_items').insert({
        vendor_id: userProfile!.id,
        sku: itemForm.sku,
        name: itemForm.name,
        description: itemForm.description || null,
        category: itemForm.category || null,
        unit_of_measure: itemForm.unit_of_measure,
        current_stock: itemForm.current_stock,
        min_stock_level: itemForm.min_stock_level,
        max_stock_level: itemForm.max_stock_level ? parseInt(itemForm.max_stock_level) : null,
        unit_cost: itemForm.unit_cost ? parseFloat(itemForm.unit_cost) : null,
        unit_price: itemForm.unit_price ? parseFloat(itemForm.unit_price) : null,
        location: itemForm.location || null,
        notes: itemForm.notes || null,
      });

      if (error) throw error;

      toast({
        title: isRTL ? 'تمت الإضافة بنجاح' : 'Item Added',
        description: isRTL ? 'تمت إضافة المنتج إلى المخزون' : 'Item added to inventory',
      });

      setShowAddDialog(false);
      resetItemForm();
      loadData();
    } catch (error: any) {
      console.error('Error adding item:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message || (isRTL ? 'فشل إضافة المنتج' : 'Failed to add item'),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;

    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          sku: itemForm.sku,
          name: itemForm.name,
          description: itemForm.description || null,
          category: itemForm.category || null,
          unit_of_measure: itemForm.unit_of_measure,
          min_stock_level: itemForm.min_stock_level,
          max_stock_level: itemForm.max_stock_level ? parseInt(itemForm.max_stock_level) : null,
          unit_cost: itemForm.unit_cost ? parseFloat(itemForm.unit_cost) : null,
          unit_price: itemForm.unit_price ? parseFloat(itemForm.unit_price) : null,
          location: itemForm.location || null,
          notes: itemForm.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedItem.id);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم التحديث' : 'Updated',
        description: isRTL ? 'تم تحديث المنتج' : 'Item updated successfully',
      });

      setShowAddDialog(false);
      setSelectedItem(null);
      resetItemForm();
      loadData();
    } catch (error: any) {
      console.error('Error updating item:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message || (isRTL ? 'فشل التحديث' : 'Failed to update item'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم الحذف' : 'Deleted',
        description: isRTL ? 'تم حذف المنتج' : 'Item deleted successfully',
      });

      loadData();
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message || (isRTL ? 'فشل الحذف' : 'Failed to delete item'),
        variant: 'destructive',
      });
    }
  };

  const handleRecordMovement = async () => {
    if (!selectedItem) return;

    try {
      const { data, error } = await supabase.rpc('record_inventory_movement', {
        p_inventory_item_id: selectedItem.id,
        p_movement_type: movementForm.movement_type,
        p_quantity: movementForm.quantity,
        p_reason: movementForm.reason || null,
        p_notes: movementForm.notes || null,
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to record movement');
      }

      toast({
        title: isRTL ? 'تم التسجيل' : 'Movement Recorded',
        description: isRTL
          ? `تم تحديث المخزون من ${data.previous_stock} إلى ${data.new_stock}`
          : `Stock updated from ${data.previous_stock} to ${data.new_stock}`,
      });

      setShowMovementDialog(false);
      resetMovementForm();
      loadData();
      if (selectedItem) {
        loadMovements(selectedItem.id);
      }
    } catch (error: any) {
      console.error('Error recording movement:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message || (isRTL ? 'فشل تسجيل الحركة' : 'Failed to record movement'),
        variant: 'destructive',
      });
    }
  };

  const resetItemForm = () => {
    setItemForm({
      sku: '',
      name: '',
      description: '',
      category: '',
      unit_of_measure: 'unit',
      current_stock: 0,
      min_stock_level: 10,
      max_stock_level: '',
      unit_cost: '',
      unit_price: '',
      location: '',
      notes: '',
    });
  };

  const resetMovementForm = () => {
    setMovementForm({
      movement_type: 'in',
      quantity: 0,
      reason: '',
      notes: '',
    });
  };

  const openEditDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setItemForm({
      sku: item.sku,
      name: item.name,
      description: item.description || '',
      category: item.category || '',
      unit_of_measure: item.unit_of_measure,
      current_stock: item.current_stock,
      min_stock_level: item.min_stock_level,
      max_stock_level: item.max_stock_level?.toString() || '',
      unit_cost: item.unit_cost?.toString() || '',
      unit_price: item.unit_price?.toString() || '',
      location: item.location || '',
      notes: item.notes || '',
    });
    setShowAddDialog(true);
  };

  const openMovementDialog = async (item: InventoryItem) => {
    setSelectedItem(item);
    await loadMovements(item.id);
    setShowMovementDialog(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.current_stock === 0) {
      return { label: isRTL ? 'نفذ المخزون' : 'Out of Stock', color: 'destructive' };
    } else if (item.current_stock <= item.min_stock_level) {
      return { label: isRTL ? 'مخزون منخفض' : 'Low Stock', color: 'warning' };
    } else if (item.max_stock_level && item.current_stock > item.max_stock_level) {
      return { label: isRTL ? 'مخزون زائد' : 'Overstock', color: 'secondary' };
    } else {
      return { label: isRTL ? 'عادي' : 'Normal', color: 'success' };
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    await supabase
      .from('inventory_alerts')
      .update({ is_read: true })
      .eq('id', alertId);

    loadAlerts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'إجمالي المنتجات' : 'Total Items'}
                </p>
                <p className="text-2xl font-bold">{summary.total_items}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'مخزون منخفض' : 'Low Stock'}
                </p>
                <p className="text-2xl font-bold text-yellow-600">{summary.low_stock_items}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'نفذ المخزون' : 'Out of Stock'}
                </p>
                <p className="text-2xl font-bold text-red-600">{summary.out_of_stock_items}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'قيمة المخزون' : 'Inventory Value'}
                </p>
                <p className="text-2xl font-bold">
                  {summary.total_inventory_value.toLocaleString()} SAR
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {isRTL ? 'التنبيهات' : 'Alerts'} ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAlertAsRead(alert.id)}
                  >
                    {isRTL ? 'تجاهل' : 'Dismiss'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{isRTL ? 'مخزون المنتجات' : 'Inventory Items'}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setSelectedItem(null); resetItemForm(); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? 'إضافة منتج' : 'Add Item'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedItem
                        ? (isRTL ? 'تعديل منتج' : 'Edit Item')
                        : (isRTL ? 'إضافة منتج جديد' : 'Add New Item')}
                    </DialogTitle>
                    <DialogDescription>
                      {isRTL
                        ? 'أدخل تفاصيل المنتج في المخزون'
                        : 'Enter the details of the inventory item'}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">{isRTL ? 'رمز المنتج (SKU)' : 'SKU'} *</Label>
                      <Input
                        id="sku"
                        value={itemForm.sku}
                        onChange={(e) => setItemForm({ ...itemForm, sku: e.target.value })}
                        placeholder="SKU-001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">{isRTL ? 'اسم المنتج' : 'Name'} *</Label>
                      <Input
                        id="name"
                        value={itemForm.name}
                        onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                        placeholder={isRTL ? 'أدخل اسم المنتج' : 'Enter product name'}
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="description">{isRTL ? 'الوصف' : 'Description'}</Label>
                      <Textarea
                        id="description"
                        value={itemForm.description}
                        onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                        placeholder={isRTL ? 'وصف المنتج' : 'Product description'}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">{isRTL ? 'الفئة' : 'Category'}</Label>
                      <Input
                        id="category"
                        value={itemForm.category}
                        onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                        placeholder={isRTL ? 'الفئة' : 'Category'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit_of_measure">{isRTL ? 'وحدة القياس' : 'Unit of Measure'}</Label>
                      <Select
                        value={itemForm.unit_of_measure}
                        onValueChange={(value) => setItemForm({ ...itemForm, unit_of_measure: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unit">{isRTL ? 'وحدة' : 'Unit'}</SelectItem>
                          <SelectItem value="kg">{isRTL ? 'كيلوجرام' : 'Kilogram'}</SelectItem>
                          <SelectItem value="meter">{isRTL ? 'متر' : 'Meter'}</SelectItem>
                          <SelectItem value="liter">{isRTL ? 'لتر' : 'Liter'}</SelectItem>
                          <SelectItem value="box">{isRTL ? 'صندوق' : 'Box'}</SelectItem>
                          <SelectItem value="pallet">{isRTL ? 'منصة نقالة' : 'Pallet'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {!selectedItem && (
                      <div className="space-y-2">
                        <Label htmlFor="current_stock">{isRTL ? 'المخزون الحالي' : 'Current Stock'}</Label>
                        <Input
                          id="current_stock"
                          type="number"
                          value={itemForm.current_stock}
                          onChange={(e) => setItemForm({ ...itemForm, current_stock: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="min_stock_level">{isRTL ? 'الحد الأدنى' : 'Min Stock Level'}</Label>
                      <Input
                        id="min_stock_level"
                        type="number"
                        value={itemForm.min_stock_level}
                        onChange={(e) => setItemForm({ ...itemForm, min_stock_level: parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_stock_level">{isRTL ? 'الحد الأقصى' : 'Max Stock Level'}</Label>
                      <Input
                        id="max_stock_level"
                        type="number"
                        value={itemForm.max_stock_level}
                        onChange={(e) => setItemForm({ ...itemForm, max_stock_level: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit_cost">{isRTL ? 'سعر التكلفة' : 'Unit Cost'} (SAR)</Label>
                      <Input
                        id="unit_cost"
                        type="number"
                        step="0.01"
                        value={itemForm.unit_cost}
                        onChange={(e) => setItemForm({ ...itemForm, unit_cost: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit_price">{isRTL ? 'سعر البيع' : 'Unit Price'} (SAR)</Label>
                      <Input
                        id="unit_price"
                        type="number"
                        step="0.01"
                        value={itemForm.unit_price}
                        onChange={(e) => setItemForm({ ...itemForm, unit_price: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">{isRTL ? 'الموقع' : 'Location'}</Label>
                      <Input
                        id="location"
                        value={itemForm.location}
                        onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                        placeholder={isRTL ? 'رف A، صف 3' : 'Shelf A, Row 3'}
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="notes">{isRTL ? 'ملاحظات' : 'Notes'}</Label>
                      <Textarea
                        id="notes"
                        value={itemForm.notes}
                        onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
                        placeholder={isRTL ? 'ملاحظات إضافية' : 'Additional notes'}
                        rows={2}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => { setShowAddDialog(false); setSelectedItem(null); }}>
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button
                      onClick={selectedItem ? handleUpdateItem : handleAddItem}
                      disabled={!itemForm.sku || !itemForm.name}
                    >
                      {selectedItem ? (isRTL ? 'حفظ' : 'Save') : (isRTL ? 'إضافة' : 'Add')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isRTL ? 'لا توجد منتجات في المخزون' : 'No inventory items yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const status = getStockStatus(item);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <Badge variant={status.color as any}>{status.label}</Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>SKU: {item.sku}</span>
                        <span>
                          {isRTL ? 'المخزون:' : 'Stock:'} {item.current_stock} {item.unit_of_measure}
                        </span>
                        {item.category && <span>{item.category}</span>}
                        {item.location && <span>📍 {item.location}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openMovementDialog(item)}
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Movement Dialog */}
      <Dialog open={showMovementDialog} onOpenChange={setShowMovementDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isRTL ? 'حركات المخزون' : 'Inventory Movements'} - {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              {isRTL ? 'المخزون الحالي:' : 'Current Stock:'} {selectedItem?.current_stock} {selectedItem?.unit_of_measure}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="record">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="record">{isRTL ? 'تسجيل حركة' : 'Record Movement'}</TabsTrigger>
              <TabsTrigger value="history">{isRTL ? 'السجل' : 'History'}</TabsTrigger>
            </TabsList>

            <TabsContent value="record" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="movement_type">{isRTL ? 'نوع الحركة' : 'Movement Type'}</Label>
                  <Select
                    value={movementForm.movement_type}
                    onValueChange={(value) => setMovementForm({ ...movementForm, movement_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">{isRTL ? 'إضافة' : 'Stock In'}</SelectItem>
                      <SelectItem value="out">{isRTL ? 'سحب' : 'Stock Out'}</SelectItem>
                      <SelectItem value="adjustment">{isRTL ? 'تعديل' : 'Adjustment'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">{isRTL ? 'الكمية' : 'Quantity'}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={movementForm.quantity}
                    onChange={(e) => setMovementForm({ ...movementForm, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="reason">{isRTL ? 'السبب' : 'Reason'}</Label>
                  <Input
                    id="reason"
                    value={movementForm.reason}
                    onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                    placeholder={isRTL ? 'سبب الحركة' : 'Reason for movement'}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="movement_notes">{isRTL ? 'ملاحظات' : 'Notes'}</Label>
                  <Textarea
                    id="movement_notes"
                    value={movementForm.notes}
                    onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                    placeholder={isRTL ? 'ملاحظات إضافية' : 'Additional notes'}
                    rows={2}
                  />
                </div>
              </div>

              <Button
                onClick={handleRecordMovement}
                disabled={movementForm.quantity <= 0}
                className="w-full"
              >
                {isRTL ? 'تسجيل الحركة' : 'Record Movement'}
              </Button>
            </TabsContent>

            <TabsContent value="history" className="space-y-2">
              {movements.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {isRTL ? 'لا توجد حركات مسجلة' : 'No movements recorded'}
                </p>
              ) : (
                <div className="space-y-2">
                  {movements.map((movement) => (
                    <div key={movement.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={movement.movement_type === 'in' ? 'default' : 'secondary'}>
                          {movement.movement_type === 'in'
                            ? (isRTL ? 'إضافة' : 'Stock In')
                            : movement.movement_type === 'out'
                            ? (isRTL ? 'سحب' : 'Stock Out')
                            : (isRTL ? 'تعديل' : 'Adjustment')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(movement.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">{isRTL ? 'الكمية:' : 'Quantity:'}</span>
                          <span className="ml-1 font-medium">{movement.quantity}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{isRTL ? 'من:' : 'From:'}</span>
                          <span className="ml-1">{movement.previous_stock}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{isRTL ? 'إلى:' : 'To:'}</span>
                          <span className="ml-1">{movement.new_stock}</span>
                        </div>
                      </div>
                      {movement.reason && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {isRTL ? 'السبب:' : 'Reason:'} {movement.reason}
                        </p>
                      )}
                      {movement.notes && (
                        <p className="text-sm text-muted-foreground">
                          {isRTL ? 'ملاحظات:' : 'Notes:'} {movement.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMovementDialog(false);
                setSelectedItem(null);
                resetMovementForm();
              }}
            >
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
