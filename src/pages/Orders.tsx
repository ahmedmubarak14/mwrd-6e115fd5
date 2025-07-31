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
import { Package, Search, Filter, Eye, Download, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";

interface Order {
  id: string;
  title: string;
  client: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  date: string;
  description: string;
  category: string;
}

export const Orders = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock orders data
  const orders: Order[] = [
    {
      id: "ORD-001",
      title: isRTL ? "تنظيم معرض تجاري" : "Trade Exhibition Organization",
      client: isRTL ? "شركة الإبداع التجاري" : "Creative Commerce Co.",
      amount: 25000,
      currency: "SAR",
      status: "confirmed",
      date: "2024-02-15",
      description: isRTL ? "تنظيم معرض تجاري شامل مع جميع الخدمات اللوجستية" : "Complete trade exhibition with all logistics services",
      category: isRTL ? "معارض" : "Exhibitions"
    },
    {
      id: "ORD-002", 
      title: isRTL ? "حفل زفاف فاخر" : "Luxury Wedding Ceremony",
      client: isRTL ? "عائلة الأحمد" : "Al-Ahmad Family",
      amount: 45000,
      currency: "SAR",
      status: "in-progress",
      date: "2024-02-20",
      description: isRTL ? "حفل زفاف بتصميم فاخر يتضمن الديكور والطعام والتصوير" : "Luxury wedding with design, catering, and photography",
      category: isRTL ? "حفلات زفاف" : "Weddings"
    },
    {
      id: "ORD-003",
      title: isRTL ? "مؤتمر تقني" : "Tech Conference",
      client: isRTL ? "مؤسسة التكنولوجيا" : "Tech Foundation",
      amount: 32000,
      currency: "SAR", 
      status: "pending",
      date: "2024-03-01",
      description: isRTL ? "مؤتمر تقني يضم 500 مشارك مع خدمات التقنية والضيافة" : "Tech conference for 500 participants with tech and hospitality services",
      category: isRTL ? "مؤتمرات" : "Conferences"
    },
    {
      id: "ORD-004",
      title: isRTL ? "إطلاق منتج جديد" : "Product Launch Event",
      client: isRTL ? "شركة الابتكار" : "Innovation Corp",
      amount: 18000,
      currency: "SAR",
      status: "completed",
      date: "2024-01-25",
      description: isRTL ? "فعالية إطلاق منتج جديد مع إدارة كاملة للحدث" : "New product launch with complete event management",
      category: isRTL ? "إطلاق منتجات" : "Product Launches"
    }
  ];

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

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-arabic' : ''}`}>
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isMobile && (
          <div className="w-64 flex-shrink-0">
            <Sidebar userRole={userProfile?.role} />
          </div>
        )}

        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side={isRTL ? "right" : "left"} className="p-0 w-64">
              <Sidebar userRole={userProfile?.role} />
            </SheetContent>
          </Sheet>
        )}

        <main className="flex-1 p-6">
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
              <Button className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                <Download className="h-4 w-4" />
                {isRTL ? 'تصدير' : 'Export'}
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

            {/* Orders List */}
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
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <p className="text-sm text-muted-foreground">
                        {order.description}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                      >
                        <Eye className="h-4 w-4" />
                        {isRTL ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
          userRole={userProfile?.role}
        >
          <div />
        </ViewDetailsModal>
      )}
    </div>
  );
};