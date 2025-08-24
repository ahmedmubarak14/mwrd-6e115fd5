
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, TrendingUp, Clock, Eye, DollarSign, Package, MapPin, Calendar, Plus, Search, Target, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMatchingSystem } from "@/hooks/useMatchingSystem";
import { useOffers } from "@/hooks/useOffers";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CreateOfferModal } from "@/components/modals/CreateOfferModal";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { Footer } from "@/components/ui/layout/Footer";

export const ProcurementSupplierDashboard = () => {
  const { userProfile } = useAuth();
  const { language, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const isRTL = language === 'ar';
  
  const { matchedRequests, loading: matchingLoading } = useMatchingSystem();
  const { offers, loading: offersLoading } = useOffers();

  if (matchingLoading || offersLoading) {
    return <LoadingSpinner />;
  }

  const filteredRequests = matchedRequests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      request.title.toLowerCase().includes(searchLower) ||
      request.category.toLowerCase().includes(searchLower);
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatBudget = (request: any) => {
    if (!request.budget_min && !request.budget_max) return isRTL ? 'لم تحدد الميزانية' : 'Budget not specified';
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()}`;
    }
    return isRTL ? 'ميزانية قابلة للتفاوض' : 'Budget negotiable';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const handleSubmitOffer = (requestId: string) => {
    console.log('Submit offer for request:', requestId);
  };

  const stats = {
    totalOffers: offers.length,
    approvedOffers: offers.filter(o => o.client_approval_status === 'approved').length,
    pendingOffers: offers.filter(o => o.client_approval_status === 'pending').length,
    wonProjects: offers.filter(o => o.status === 'accepted').length,
    rating: 4.8,
    completedProjects: 25
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'vendor'} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar userRole={userProfile?.role || 'vendor'} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    {isRTL ? 'مرحباً بك في منصة الموردين' : 'Welcome to Supplier Platform'}
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {isRTL ? 'اكتشف فرص التوريد وقدم عروضاً تنافسية' : 'Discover procurement opportunities and submit competitive offers'}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover:scale-105">
                <CardHeader className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} flex items-center justify-between space-y-0 pb-2 p-4 sm:p-6`}>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isRTL ? 'إجمالي العروض' : 'Total Offers'}
                  </CardTitle>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stats.totalOffers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 'المقدمة هذا الشهر' : 'Submitted this month'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover:scale-105">
                <CardHeader className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} flex items-center justify-between space-y-0 pb-2 p-4 sm:p-6`}>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isRTL ? 'العروض المقبولة' : 'Accepted Offers'}
                  </CardTitle>
                  <div className="w-10 h-10 bg-lime/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-lime" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-lime to-primary bg-clip-text text-transparent">
                    {stats.approvedOffers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? `معدل النجاح: ${Math.round((stats.approvedOffers / Math.max(stats.totalOffers, 1)) * 100)}%` : `Success rate: ${Math.round((stats.approvedOffers / Math.max(stats.totalOffers, 1)) * 100)}%`}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover:scale-105">
                <CardHeader className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} flex items-center justify-between space-y-0 pb-2 p-4 sm:p-6`}>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isRTL ? 'العروض المعلقة' : 'Pending Offers'}
                  </CardTitle>
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent to-lime bg-clip-text text-transparent">
                    {stats.pendingOffers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 'في انتظار رد العميل' : 'Awaiting client response'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover:scale-105">
                <CardHeader className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} flex items-center justify-between space-y-0 pb-2 p-4 sm:p-6`}>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isRTL ? 'المشاريع المكتملة' : 'Won Projects'}
                  </CardTitle>
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-lime bg-clip-text text-transparent">
                    {stats.wonProjects}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 'تم الفوز بها بنجاح' : 'Successfully won'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <CardTitle className={`flex items-center gap-2 text-lg sm:text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  {isRTL ? 'البحث والتصفية' : 'Search & Filter'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {isRTL ? 'ابحث عن فرص التوريد المناسبة لتخصصك' : 'Find procurement opportunities that match your expertise'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                    <Input 
                      placeholder={isRTL ? 'ابحث في طلبات التوريد' : 'Search procurement requests'}
                      className={`${isRTL ? 'pr-10' : 'pl-10'} h-12 text-sm sm:text-base bg-background/50 border-primary/20 focus:border-primary/50`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                      <SelectValue placeholder={isRTL ? 'تصفية حسب الفئة' : 'Filter by category'} />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
                      <SelectItem value="Construction Materials">{isRTL ? 'مواد البناء' : 'Construction Materials'}</SelectItem>
                      <SelectItem value="Office Supplies">{isRTL ? 'مستلزمات المكاتب' : 'Office Supplies'}</SelectItem>
                      <SelectItem value="IT Equipment">{isRTL ? 'معدات تكنولوجيا المعلومات' : 'IT Equipment'}</SelectItem>
                      <SelectItem value="Medical Supplies">{isRTL ? 'المستلزمات الطبية' : 'Medical Supplies'}</SelectItem>
                      <SelectItem value="Industrial Equipment">{isRTL ? 'المعدات الصناعية' : 'Industrial Equipment'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Procurement Opportunities */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <CardTitle className={`flex items-center gap-2 text-lg sm:text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  {isRTL ? 'فرص التوريد المتاحة' : 'Available Procurement Opportunities'}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {isRTL ? 'اكتشف فرص التوريد التي تتناسب مع خبرتك' : 'Discover procurement opportunities that match your expertise'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">
                        {isRTL ? 'لا توجد نتائج' : 'No Results Found'}
                      </h3>
                      <p>{isRTL ? 'جرب تعديل معايير البحث' : 'Try adjusting your search criteria'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredRequests.map((request) => (
                      <div key={request.id} className="p-4 sm:p-6 hover:bg-muted/50 transition-all duration-200">
                        <div className="space-y-4">
                          <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className="flex-1 min-w-0">
                              <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className="w-2 h-12 rounded-full bg-lime"></div>
                                <div className="flex-1">
                                  <div className={`flex items-start justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <h3 className="text-base sm:text-lg font-semibold line-clamp-1">{request.title}</h3>
                                    <Badge variant={getUrgencyColor(request.urgency) as any} className={`text-xs ${isRTL ? 'mr-2' : 'ml-2'}`}>
                                      {request.urgency === 'urgent' ? (isRTL ? 'عاجل' : 'Urgent') :
                                       request.urgency === 'high' ? (isRTL ? 'عالي' : 'High') :
                                       request.urgency === 'medium' ? (isRTL ? 'متوسط' : 'Medium') :
                                       (isRTL ? 'منخفض' : 'Low')}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                                  <div className={`flex items-center gap-4 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-sm text-primary font-medium">{request.category}</span>
                                    {request.location && (
                                      <div className={`flex items-center gap-1 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <MapPin className="h-3 w-3" />
                                        <span>{request.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${isRTL ? 'pr-5' : 'pl-5'}`}>
                            <div className={`flex items-center gap-2 p-3 bg-lime/5 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <DollarSign className="h-4 w-4 text-lime flex-shrink-0" />
                              <div className={isRTL ? 'text-right' : 'text-left'}>
                                <p className="text-xs text-muted-foreground">{isRTL ? 'الميزانية' : 'Budget'}</p>
                                <p className="font-semibold text-sm">{formatBudget(request)} {request.currency || 'SAR'}</p>
                              </div>
                            </div>
                            
                            {request.deadline && (
                              <div className={`flex items-center gap-2 p-3 bg-accent/5 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Calendar className="h-4 w-4 text-accent flex-shrink-0" />
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                  <p className="text-xs text-muted-foreground">{isRTL ? 'الموعد النهائي' : 'Deadline'}</p>
                                  <p className="font-semibold text-sm">{new Date(request.deadline).toLocaleDateString()}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className={`flex items-center gap-2 p-3 bg-primary/5 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                              <div className={isRTL ? 'text-right' : 'text-left'}>
                                <p className="text-xs text-muted-foreground">{isRTL ? 'تاريخ النشر' : 'Posted'}</p>
                                <p className="font-semibold text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`flex flex-col sm:flex-row gap-2 ${isRTL ? 'pr-5' : 'pl-5'}`}>
                            <Button 
                              className={`flex-1 sm:flex-initial bg-gradient-to-r from-primary to-accent hover:scale-105 transition-transform ${isRTL ? 'flex-row-reverse' : ''}`}
                              onClick={() => handleSubmitOffer(request.id)}
                            >
                              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {isRTL ? 'تقديم عرض' : 'Submit Offer'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className={`flex-1 sm:flex-initial hover:scale-105 transition-transform ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                              <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {isRTL ? 'عرض التفاصيل' : 'View Details'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
