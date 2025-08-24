
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileFriendlyCard } from "@/components/ui/MobileFriendlyCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, FileText, Users, TrendingUp, Package, Banknote, Clock, Eye, ShoppingCart, BarChart3, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useUserStats } from "@/hooks/useUserStats";
import { useRecentItems } from "@/hooks/useRecentItems";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { useNavigate } from "react-router-dom";

export const ProcurementClientDashboard = () => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  
  const { data: analyticsData, loading: analyticsLoading } = useRealTimeAnalytics();
  const { stats: userStats, loading: statsLoading, error: statsError } = useUserStats();
  const { recentItems, loading: itemsLoading } = useRecentItems();

  const handleCreateProcurement = () => {
    navigate('/procurement-requests');
  };

  const handleViewSuppliers = () => {
    navigate('/suppliers');
  };

  const handleViewRequests = () => {
    navigate('/requests');
  };

  // Show error state if stats failed to load
  if (statsError) {
    toast({
      title: "Error loading dashboard data",
      description: statsError,
      variant: "destructive",
    });
  }

  // Procurement-focused stats for clients
  const procurementStats = [
    {
      title: isRTL ? 'طلبات التوريد النشطة' : 'Active Procurement Requests',
      value: userStats?.totalRequests?.toString() || "0",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: isRTL ? 'العروض المستلمة' : 'Received Offers',
      value: userStats?.pendingOffers?.toString() || "0",
      icon: Package,
      color: "text-lime",
      bgColor: "bg-lime/10"
    },
    {
      title: isRTL ? 'الموردون المتصلون' : 'Connected Suppliers',
      value: userStats?.suppliersConnected?.toString() || "0",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      title: isRTL ? 'إجمالي الإنفاق' : 'Total Spend',
      value: userStats?.totalSpend?.toLocaleString() || "0",
      icon: Banknote,
      color: "text-lime",
      bgColor: "bg-lime/10",
      currency: true
    }
  ];

  const displayRecentItems = recentItems?.length > 0 ? recentItems.slice(0, 3) : [];

  return (
    <div className={`space-y-4 sm:space-y-6 lg:space-y-8 pb-20 md:pb-0 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Welcome Header */}
      <MobileFriendlyCard className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-lime text-white border-0">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-20 h-20 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 sm:w-40 sm:h-40 lg:w-80 lg:h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-3">
            {isRTL ? 'مرحباً في منصة التوريد' : 'Welcome to Procurement Platform'}
          </h1>
          <p className="text-sm sm:text-base lg:text-xl opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-2xl leading-relaxed">
            {isRTL 
              ? 'إدارة طلبات التوريد والتواصل مع أفضل الموردين في السوق'
              : 'Manage your procurement requests and connect with the best suppliers in the market'
            }
          </p>
          <Button 
            onClick={handleCreateProcurement}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg hover:scale-105 transition-transform w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className={`h-4 w-4 sm:h-5 sm:w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'إنشاء طلب توريد' : 'Create Procurement Request'}
          </Button>
        </div>
      </MobileFriendlyCard>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {(analyticsLoading || statsLoading) ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between space-y-0 pb-2 p-4 sm:p-6`}>
                <div className="h-4 bg-muted rounded animate-pulse w-20" />
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full animate-pulse" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))
        ) : (
          procurementStats.map((stat, index) => (
            <MobileFriendlyCard key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between space-y-0 pb-2 p-4 sm:p-6`}>
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} flex items-center gap-2`}>
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  {stat.currency && (
                    <img 
                      src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                      alt="SAR" 
                      className="h-5 w-5 sm:h-6 sm:w-6 opacity-80"
                    />
                  )}
                </div>
              </CardContent>
            </MobileFriendlyCard>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <MobileFriendlyCard className="group hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105" onClick={handleCreateProcurement}>
          <CardHeader className="pb-4 p-4 sm:p-6">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 mb-3 sm:mb-4 ${isRTL ? 'ml-auto mr-0' : 'mr-auto ml-0'}`}>
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <CardTitle className="text-lg sm:text-xl">
              {isRTL ? 'إنشاء طلب توريد' : 'Create Procurement Request'}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base leading-relaxed">
              {isRTL ? 'ابدأ طلب توريد جديد مع تحديد المتطلبات والمواصفات' : 'Start a new procurement request with detailed requirements and specifications'}
            </CardDescription>
          </CardHeader>
        </MobileFriendlyCard>

        <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover:scale-105 cursor-pointer" onClick={handleViewRequests}>
          <CardHeader className="pb-4 p-4 sm:p-6">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-accent/20 to-lime/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-lime/30 transition-all duration-300 mb-3 sm:mb-4 ${isRTL ? 'ml-auto mr-0' : 'mr-auto ml-0'}`}>
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
            </div>
            <CardTitle className="text-lg sm:text-xl">
              {isRTL ? 'إدارة الطلبات' : 'Manage Requests'}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base leading-relaxed">
              {isRTL ? 'عرض ومتابعة جميع طلبات التوريد الخاصة بك' : 'View and track all your procurement requests'}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover:scale-105 cursor-pointer sm:col-span-2 lg:col-span-1" onClick={handleViewSuppliers}>
          <CardHeader className="pb-4 p-4 sm:p-6">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-lime/20 to-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-lime/30 group-hover:to-primary/30 transition-all duration-300 mb-3 sm:mb-4 ${isRTL ? 'ml-auto mr-0' : 'mr-auto ml-0'}`}>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-lime" />
            </div>
            <CardTitle className="text-lg sm:text-xl">
              {isRTL ? 'استكشاف الموردين' : 'Explore Suppliers'}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base leading-relaxed">
              {isRTL ? 'اكتشف وتواصل مع أفضل الموردين في مختلف الفئات' : 'Discover and connect with top suppliers across various categories'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Procurement Activity */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">
            {isRTL ? 'النشاط الحديث' : 'Recent Activity'}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {isRTL ? 'متابعة آخر طلبات التوريد والعروض المستلمة' : 'Track your latest procurement requests and received offers'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {itemsLoading ? (
            <div className="space-y-3 sm:space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border rounded-lg">
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                  <div className="w-16 h-6 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : displayRecentItems.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {displayRecentItems.map((item) => (
                <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 lg:p-6 border rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 bg-background/50 gap-3 sm:gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base lg:text-lg truncate">{item.title}</h4>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                        {item.description}
                      </p>
                      {item.currency && (
                        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground text-xs sm:text-sm lg:text-base">{item.value}</span>
                          <img 
                            src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                            alt="SAR" 
                            className="h-3 w-3 sm:h-4 sm:w-4 opacity-70"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 ${isRTL ? 'items-end sm:items-center' : ''}`}>
                    <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto ${
                      item.status === 'active' || item.status === 'approved' 
                        ? 'bg-lime/20 text-lime-700 border border-lime/20' :
                      item.status === 'pending' 
                        ? 'bg-accent/20 text-accent-700 border border-accent/20' :
                      'bg-primary/20 text-primary-700 border border-primary/20'
                    }`}>
                      {item.status === 'approved' ? (isRTL ? 'معتمد' : 'Approved') : 
                       item.status === 'pending' ? (isRTL ? 'قيد المراجعة' : 'Pending') :
                       item.status}
                    </span>
                    <ViewDetailsModal item={{...item, id: typeof item.id === 'number' ? item.id : parseInt(String(item.id)) || 1}} userRole={userProfile?.role}>
                      <Button variant="outline" size="sm" className={`hover:scale-105 transition-transform w-full sm:w-auto text-xs sm:text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Eye className={`h-3 w-3 sm:h-4 sm:w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        {isRTL ? 'عرض' : 'View'}
                      </Button>
                    </ViewDetailsModal>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {isRTL ? 'لا توجد طلبات حديثة' : 'No Recent Requests'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isRTL ? 'ابدأ بإنشاء طلب التوريد الأول' : 'Start by creating your first procurement request'}
              </p>
              <Button onClick={handleCreateProcurement}>
                <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'إنشاء طلب توريد' : 'Create Request'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real Analytics Preview - No longer placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <BarChart3 className="h-5 w-5 text-primary" />
              {isRTL ? 'تحليل الإنفاق' : 'Spend Analytics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'إجمالي الإنفاق هذا الشهر' : 'Total Spend This Month'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{userStats?.totalSpend?.toLocaleString() || '0'}</span>
                  <img src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" alt="SAR" className="h-4 w-4 opacity-70" />
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary/70 rounded-full" style={{ width: userStats?.totalSpend ? `${Math.min((userStats.totalSpend / 10000) * 100, 100)}%` : '0%' }} />
              </div>
              <p className="text-xs text-muted-foreground">
                {isRTL ? 'مقارنة مع الشهر الماضي' : 'Compared to last month'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="h-5 w-5 text-accent" />
              {isRTL ? 'المواعيد النهائية القادمة' : 'Active Requests Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'الطلبات النشطة' : 'Active Requests'}
                </span>
                <span className="font-semibold">{userStats?.totalRequests || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {isRTL ? 'العروض المعلقة' : 'Pending Offers'}
                </span>
                <span className="font-semibold">{userStats?.pendingOffers || 0}</span>
              </div>
              {(userStats?.totalRequests || 0) === 0 ? (
                <p className="text-xs text-muted-foreground">
                  {isRTL ? 'لا توجد طلبات نشطة حالياً' : 'No active requests currently'}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {isRTL ? 'تتم مراجعة العروض الواردة' : 'Reviewing incoming offers'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
