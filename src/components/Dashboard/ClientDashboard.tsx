import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, FileText, Users, TrendingUp, Package, Banknote, Star, Eye, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateRequestModal } from "@/components/modals/CreateRequestModal";
import { CreateOfferModal } from "@/components/modals/CreateOfferModal";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { EnhancedAnalyticsDashboard } from "@/components/analytics/EnhancedAnalyticsDashboard";
import { useRealTimeAnalytics } from "@/hooks/useRealTimeAnalytics";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import ActivityFeed from "@/components/ActivityFeed";

export const ClientDashboard = () => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const { data: analyticsData, loading: analyticsLoading } = useRealTimeAnalytics();

  const handleUpgradeSubscription = () => {
    toast({
      title: isRTL ? "ميزة تجريبية" : "Demo Feature",
      description: isRTL ? "هذه ميزة تجريبية - ترقية الاشتراك ستكون متاحة قريباً" : "This is a demo feature - subscription upgrade will be available soon",
    });
  };

  const handleViewBilling = () => {
    toast({
      title: isRTL ? "ميزة تجريبية" : "Demo Feature", 
      description: isRTL ? "هذه ميزة تجريبية - عرض تفاصيل الفوترة سيكون متاح قريباً" : "This is a demo feature - billing details view will be available soon",
    });
  };

  const handleChangePayment = () => {
    toast({
      title: isRTL ? "ميزة تجريبية" : "Demo Feature",
      description: isRTL ? "هذه ميزة تجريبية - تغيير طريقة الدفع سيكون متاح قريباً" : "This is a demo feature - payment method change will be available soon", 
    });
  };

  // Real-time stats using analytics data
  const stats = userProfile?.role === 'supplier' ? [
    { 
      title: t('dashboard.activeOffers'), 
      value: analyticsData.totalOffers?.toString() || "0", 
      icon: Package, 
      color: "text-primary" 
    },
    { 
      title: t('dashboard.totalEarnings'), 
      value: analyticsData.totalRevenue?.toLocaleString() || "0", 
      icon: Banknote, 
      color: "text-lime", 
      currency: true 
    },
    { 
      title: t('dashboard.successRate'), 
      value: `${Math.round(analyticsData.successRate || 0)}%`, 
      icon: TrendingUp, 
      color: "text-primary" 
    },
    { 
      title: t('dashboard.clientRating'), 
      value: "4.8", 
      icon: Star, 
      color: "text-lime" 
    }
  ] : [
    { 
      title: t('dashboard.totalRequests'), 
      value: analyticsData.totalRequests?.toString() || "0", 
      icon: FileText, 
      color: "text-primary" 
    },
    { 
      title: t('dashboard.pendingOffers'), 
      value: analyticsData.totalOffers?.toString() || "0", 
      icon: TrendingUp, 
      color: "text-lime" 
    },
    { 
      title: t('dashboard.suppliersConnected'), 
      value: "12", 
      icon: Users, 
      color: "text-primary" 
    }
  ];

  // Universal recent items that work for both user types
  const recentItems = userProfile?.role === 'supplier' ? [
    { id: 1, title: "Office Furniture Package", description: "Modern Supply Co.", value: "9,400", status: "pending", currency: true },
    { id: 2, title: "Corporate Meeting Setup", description: "Tech Solutions Ltd.", value: "6,800", status: "accepted", currency: true },
    { id: 3, title: "Exhibition Booth Furniture", description: "Global Exhibitions", value: "15,800", status: "in_progress", currency: true }
  ] : [
    { id: 1, title: "AVL Equipment for Conference", status: "pending", value: "3 offers" },
    { id: 2, title: "Catering Services", status: "active", value: "5 offers" },
    { id: 3, title: "Booth Design & Setup", status: "completed", value: "2 offers" }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 rtl-text-left">
      {/* Enhanced Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-lime text-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-20 h-20 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 sm:w-40 sm:h-40 lg:w-80 lg:h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-3">{t('dashboard.welcome')}</h1>
          <p className="text-sm sm:text-base lg:text-xl opacity-90 mb-4 sm:mb-6 lg:mb-8 max-w-2xl leading-relaxed">
            {userProfile?.role === 'supplier' 
              ? t('dashboard.supplierSubtitle')
              : t('dashboard.subtitle')
            }
          </p>
          {userProfile?.role === 'supplier' ? (
            <CreateOfferModal>
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg hover-scale w-full sm:w-auto text-sm sm:text-base rtl-button-gap">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                {t('dashboard.createOffer')}
              </Button>
            </CreateOfferModal>
          ) : (
            <CreateRequestModal>
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg hover-scale w-full sm:w-auto text-sm sm:text-base rtl-button-gap">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                {t('dashboard.createRequest')}
              </Button>
            </CreateRequestModal>
          )}
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {analyticsLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader className="rtl-card-header space-y-0 pb-2 p-4 sm:p-6">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full animate-pulse" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
              <CardHeader className="rtl-card-header space-y-0 pb-2 p-4 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="rtl-flex items-center gap-2">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
                  {stat.currency && (
                    <img 
                      src="/lovable-uploads/15dca457-47b5-47cc-802f-12b66c558eee.png" 
                      alt="SAR" 
                      className="h-5 w-5 sm:h-6 sm:w-6 opacity-80"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Enhanced Quick Actions - Universal for both user types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {userProfile?.role === 'supplier' ? (
          <>
            <CreateOfferModal>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer">
                <CardHeader className="pb-4 p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 mb-3 sm:mb-4">
                    <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{t('dashboard.createNewOffer')}</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    {t('dashboard.submitOffers')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </CreateOfferModal>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer" onClick={() => window.location.href = '/my-offers'}>
              <CardHeader className="pb-4 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-accent/20 to-lime/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-lime/30 transition-all duration-300 mb-3 sm:mb-4">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{t('dashboard.myOffers')}</CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {t('dashboard.trackOffers')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer sm:col-span-2 lg:col-span-1" onClick={() => window.location.href = '/browse-requests'}>
              <CardHeader className="pb-4 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-lime/20 to-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-lime/30 group-hover:to-primary/30 transition-all duration-300 mb-3 sm:mb-4">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-lime" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{t('dashboard.browseRequests')}</CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {t('dashboard.findOpportunities')}
                </CardDescription>
              </CardHeader>
            </Card>
          </>
        ) : (
          <>
            <CreateRequestModal>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer">
                <CardHeader className="pb-4 p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 mb-3 sm:mb-4">
                    <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{t('dashboard.createRequest')}</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    {t('dashboard.postRequest')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </CreateRequestModal>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer" onClick={() => window.location.href = '/requests'}>
              <CardHeader className="pb-4 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-accent/20 to-lime/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-lime/30 transition-all duration-300 mb-3 sm:mb-4">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{t('dashboard.viewRequests')}</CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {t('dashboard.manageRequests')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-card/70 backdrop-blur-sm hover-scale cursor-pointer sm:col-span-2 lg:col-span-1" onClick={() => window.location.href = '/suppliers'}>
              <CardHeader className="pb-4 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-lime/20 to-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-lime/30 group-hover:to-primary/30 transition-all duration-300 mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-lime" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{t('dashboard.browseSuppliers')}</CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                  {t('dashboard.discoverSuppliers')}
                </CardDescription>
              </CardHeader>
            </Card>
          </>
        )}
      </div>

      {/* Enhanced Recent Items - Universal for both user types */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">
            {userProfile?.role === 'supplier' ? t('dashboard.recentOffers') : t('dashboard.recentRequests')}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {userProfile?.role === 'supplier' 
              ? t('dashboard.recentOffersDesc')
              : t('dashboard.recentRequestsDesc')
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {recentItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 lg:p-6 border rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 bg-background/50 gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base lg:text-lg truncate">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                      {userProfile?.role === 'supplier' ? item.description : `${item.value}`}
                    </p>
                    {userProfile?.role === 'supplier' && item.currency && (
                      <div className="flex items-center gap-1">
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
                  <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto ${
                    item.status === 'active' || item.status === 'accepted' || item.status === 'in_progress' 
                      ? 'bg-lime/20 text-lime-foreground border border-lime/20' :
                    item.status === 'pending' 
                      ? 'bg-accent/20 text-accent-foreground border border-accent/20' :
                    'bg-primary/20 text-primary-foreground border border-primary/20'
                  }`}>
                    {item.status === 'in_progress' ? t('dashboard.inProgress') : item.status}
                  </span>
                  <ViewDetailsModal item={item} userRole={userProfile?.role}>
                    <Button variant="outline" size="sm" className="hover-scale w-full sm:w-auto text-xs sm:text-sm rtl-button-gap">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t('dashboard.view')}
                    </Button>
                  </ViewDetailsModal>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <EnhancedAnalyticsDashboard />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};