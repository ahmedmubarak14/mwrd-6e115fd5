import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Filter, Eye, Download, Calendar, FileText, CreditCard, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/ui/layout/Footer";
import { useOrders, Order } from "@/hooks/useOrders";


export const Orders = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  const { orders, loading: ordersLoading, error: ordersError, updateOrderStatus, generateInvoice } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'in-progress': return 'outline';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    if (isRTL) {
      switch (status) {
        case 'pending': return 'قيد الانتظار';
        case 'confirmed': return 'مؤكد';
        case 'in-progress': return 'قيد التنفيذ';
        case 'completed': return 'مكتمل';
        case 'cancelled': return 'ملغي';
        default: return status;
      }
    } else {
      switch (status) {
        case 'pending': return 'Pending';
        case 'confirmed': return 'Confirmed';
        case 'in-progress': return 'In Progress';
        case 'completed': return 'Completed';
        case 'cancelled': return 'Cancelled';
        default: return status;
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportOrders = async () => {
    setIsExporting(true);
    try {
      // Create CSV content
      const csvContent = orders.map(order => 
        `${order.id},${order.title},${order.client},${order.amount},${order.status},${order.date}`
      ).join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.csv';
      a.click();
      
      toast({
        title: isRTL ? "تم تصدير البيانات" : "Export Successful",
        description: isRTL ? "تم تصدير الطلبات بنجاح" : "Orders exported successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في التصدير" : "Export Error",
        description: isRTL ? "حدث خطأ أثناء تصدير البيانات" : "Error exporting data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      const result = await generateInvoice(orderId);
      if (result.success) {
        toast({
          title: isRTL ? "تم إنشاء الفاتورة" : "Invoice Generated",
          description: isRTL ? "تم إنشاء الفاتورة بنجاح" : "Invoice generated successfully",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في الفاتورة" : "Invoice Error",
        description: error.message || (isRTL ? "حدث خطأ أثناء إنشاء الفاتورة" : "Error generating invoice"),
        variant: "destructive"
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast({
          title: isRTL ? "تم تحديث الحالة" : "Status Updated",
          description: isRTL ? "تم تحديث حالة الطلب بنجاح" : "Order status updated successfully",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: isRTL ? "خطأ في التحديث" : "Update Error",
        description: error.message || (isRTL ? "حدث خطأ أثناء تحديث الحالة" : "Error updating status"),
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-arabic' : ''}`}>
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h1 className="text-3xl font-bold mb-2">
                  {isRTL ? 'إدارة الطلبات' : 'Orders Management'}
                </h1>
                <p className="text-muted-foreground">
                  {isRTL ? 'تتبع وإدارة جميع طلباتك وعروضك' : 'Track and manage all your orders and offers'}
                </p>
              </div>
              <Button 
                className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                onClick={handleExportOrders}
                disabled={isExporting}
              >
                <Download className="h-4 w-4" />
                {isExporting ? (isRTL ? 'جاري التصدير...' : 'Exporting...') : (isRTL ? 'تصدير' : 'Export')}
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''} flex-wrap`}>
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-muted-foreground`} />
                      <Input
                        placeholder={isRTL ? "البحث في الطلبات..." : "Search orders..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder={isRTL ? "حالة الطلب" : "Order Status"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                      <SelectItem value="pending">{isRTL ? 'قيد الانتظار' : 'Pending'}</SelectItem>
                      <SelectItem value="confirmed">{isRTL ? 'مؤكد' : 'Confirmed'}</SelectItem>
                      <SelectItem value="in-progress">{isRTL ? 'قيد التنفيذ' : 'In Progress'}</SelectItem>
                      <SelectItem value="completed">{isRTL ? 'مكتمل' : 'Completed'}</SelectItem>
                      <SelectItem value="cancelled">{isRTL ? 'ملغي' : 'Cancelled'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Loading State */}
            {ordersLoading && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            )}

            {/* Error State */}
            {ordersError && (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {isRTL ? 'حدث خطأ' : 'Error Loading Orders'}
                  </h3>
                  <p className="text-muted-foreground">
                    {ordersError}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Orders List */}
            {!ordersLoading && !ordersError && (
              <div className="grid gap-4">
                {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <CardTitle className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5" />
                          {order.title}
                        </CardTitle>
                        <CardDescription className="mb-2">
                          {isRTL ? 'العميل: ' : 'Client: '}{order.client}
                        </CardDescription>
                        <div className={`flex items-center gap-4 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {order.date}
                          </span>
                          <span>#{order.id}</span>
                        </div>
                      </div>
                      <div className={`flex flex-col items-end gap-2 ${isRTL ? 'items-start' : ''}`}>
                        <Badge variant={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        <div className="text-lg font-bold text-primary">
                          {order.amount.toLocaleString()} {order.currency}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''} mb-4`}>
                      <p className="text-sm text-muted-foreground">
                        {order.description}
                      </p>
                    </div>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''} flex-wrap`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                      >
                        <Eye className="h-4 w-4" />
                        {isRTL ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGenerateInvoice(order.id)}
                        className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                      >
                        <FileText className="h-4 w-4" />
                        {isRTL ? 'إنشاء فاتورة' : 'Generate Invoice'}
                      </Button>
                      {order.status !== 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateOrderStatus(order.id, order.status === 'pending' ? 'confirmed' : 'in_progress')}
                          className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                        >
                          <CreditCard className="h-4 w-4" />
                          {isRTL ? 'تحديث الحالة' : 'Update Status'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}

            {filteredOrders.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {isRTL ? 'لا توجد طلبات' : 'No Orders Found'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'لم يتم العثور على طلبات تطابق معايير البحث' : 'No orders match your search criteria'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {selectedOrder && (
        <ViewDetailsModal
          item={{
            id: parseInt(selectedOrder.id.replace('ORD-', '')),
            title: selectedOrder.title,
            description: selectedOrder.description,
            value: `${selectedOrder.amount.toLocaleString()} ${selectedOrder.currency}`,
            status: selectedOrder.status
          }}
          userRole={userProfile?.role === 'vendor' ? 'client' : userProfile?.role}
        >
          <div />
        </ViewDetailsModal>
      )}
      <Footer />
    </div>
  );
};