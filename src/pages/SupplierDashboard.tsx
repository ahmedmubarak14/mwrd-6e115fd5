import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, TrendingUp, Clock, Eye, DollarSign, FileText, Users, Award, Search, Package, MapPin, Calendar, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMatchingSystem } from "@/hooks/useMatchingSystem";
import { useOffers } from "@/hooks/useOffers";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CreateOfferModal } from "@/components/modals/CreateOfferModal";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { Footer } from "@/components/ui/layout/Footer";

export const SupplierDashboard = () => {
  const { userProfile } = useAuth();
  const { language, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const isRTL = language === 'ar';
  
  const { matchedRequests, loading: matchingLoading, getMatchLevel } = useMatchingSystem();
  const { offers, loading: offersLoading, formatPrice, getStatusColor } = useOffers();

  if (matchingLoading || offersLoading) {
    return <LoadingSpinner />;
  }

  const topMatches = matchedRequests.slice(0, 3);
  const recentOffers = offers.slice(0, 3);
  const filteredRequests = matchedRequests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      request.title.toLowerCase().includes(searchLower) ||
      request.category.toLowerCase().includes(searchLower);
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatBudget = (request: any) => {
    if (!request.budget_min && !request.budget_max) return 'Budget not specified';
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()}`;
    }
    return 'Budget negotiable';
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
    avgResponseTime: '2 hours',
    rating: 4.8,
    completedProjects: 25
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'vendor'} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role || 'vendor'} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    {t('supplier.welcome')}
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">{t('supplier.subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('supplier.totalOffers')}</CardTitle>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stats.totalOffers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Submitted this month</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('supplier.acceptedOffers')}</CardTitle>
                  <div className="w-10 h-10 bg-lime/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-lime" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-lime to-primary bg-clip-text text-transparent">
                    {stats.approvedOffers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Success rate: {Math.round((stats.approvedOffers / Math.max(stats.totalOffers, 1)) * 100)}%</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('supplier.pendingOffers')}</CardTitle>
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent to-lime bg-clip-text text-transparent">
                    {stats.pendingOffers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting client response</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.completedProjects')}</CardTitle>
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-lime bg-clip-text text-transparent">
                    {offers.filter(o => o.status === 'accepted').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Successfully won</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  {t('browseRequests.searchAndFilter')}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">{t('browseRequests.filterDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={t('supplier.searchRequests')}
                      className="pl-10 h-12 text-sm sm:text-base bg-background/50 border-primary/20 focus:border-primary/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                      <SelectValue placeholder={t('supplier.filterByCategory')} />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="AVL">AVL Equipment</SelectItem>
                      <SelectItem value="Hospitality">Hospitality</SelectItem>
                      <SelectItem value="Booth Stands">Booth Stands</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Requests List */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  {t('supplier.availableRequests')}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">{t('dashboard.findOpportunities')}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">{t('browseRequests.noResults')}</h3>
                      <p>{t('browseRequests.noResultsDesc')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredRequests.map((request) => (
                      <div key={request.id} className="p-4 sm:p-6 hover:bg-muted/50 transition-all duration-200">
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-12 rounded-full bg-lime"></div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-base sm:text-lg font-semibold line-clamp-1">{request.title}</h3>
                                    <Badge variant={getUrgencyColor(request.urgency) as any} className="ml-2 text-xs">
                                      {request.urgency}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                                  <div className="flex items-center gap-4 mb-2">
                                    <span className="text-sm text-primary font-medium">{request.category}</span>
                                    {request.location && (
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        <span>{request.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-5">
                            <div className="flex items-center gap-2 p-3 bg-lime/5 rounded-lg">
                              <DollarSign className="h-4 w-4 text-lime" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('browseRequests.budget')}</p>
                                <p className="font-semibold text-sm">{formatBudget(request)} {request.currency || 'USD'}</p>
                              </div>
                            </div>
                            
                            {request.deadline && (
                              <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg">
                                <Calendar className="h-4 w-4 text-accent" />
                                <div>
                                  <p className="text-xs text-muted-foreground">{t('browseRequests.deadline')}</p>
                                  <p className="font-semibold text-sm">{new Date(request.deadline).toLocaleDateString()}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                              <Clock className="h-4 w-4 text-primary" />
                              <div>
                                <p className="text-xs text-muted-foreground">{t('browseRequests.posted')}</p>
                                <p className="font-semibold text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 pl-5">
                             <Button 
                              className="flex-1 sm:flex-initial bg-gradient-to-r from-primary to-accent hover-scale rtl-button-gap"
                              onClick={() => handleSubmitOffer(request.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              {t('supplier.submitOffer')}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 sm:flex-initial hover-scale rtl-button-gap"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {t('supplier.viewDetails')}
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