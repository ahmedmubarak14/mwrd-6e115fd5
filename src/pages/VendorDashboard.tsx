
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, TrendingUp, Clock, Eye, DollarSign, Package, MapPin, Calendar, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMatchingSystem } from "@/hooks/useMatchingSystem";
import { useOffers } from "@/hooks/useOffers";
import { useCategories } from "@/hooks/useCategories";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CreateOfferModal } from "@/components/modals/CreateOfferModal";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { UnifiedVerificationStatus } from "@/components/verification/UnifiedVerificationStatus";

export const VendorDashboard = () => {
  const { userProfile } = useAuth();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const isRTL = language === 'ar';
  
  const { matchedRequests, loading: matchingLoading, getMatchLevel } = useMatchingSystem();
  const { offers, loading: offersLoading, formatPrice, getStatusColor } = useOffers();
  const { categories, loading: categoriesLoading } = useCategories();

  if (matchingLoading || offersLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Check if user needs verification guidance
  const needsVerificationGuidance = userProfile && (
    userProfile.verification_status !== 'approved' || 
    userProfile.status !== 'approved'
  );

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
    if (!request.budget_min && !request.budget_max) return t('vendor.budget') + ' ' + t('vendor.negotiable');
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()}`;
    }
    return t('vendor.negotiable');
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

  // Get all categories including subcategories for the filter dropdown
  const getAllCategoriesForFilter = () => {
    const allCats: any[] = [];
    categories.forEach(category => {
      allCats.push(category);
      if (category.children && category.children.length > 0) {
        category.children.forEach(child => {
          allCats.push({ ...child, isChild: true, parentName: language === 'ar' ? category.name_ar : category.name_en });
        });
      }
    });
    return allCats;
  };

  return (
    <DashboardLayout className={isRTL ? 'font-arabic' : ''}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('vendor.welcome')}
          </h1>
          <p className="text-muted-foreground">{t('vendor.subtitle')}</p>
        </div>

        {/* Verification Status - Only show for non-verified users */}
        {needsVerificationGuidance && (
          <UnifiedVerificationStatus 
            showActions={true}
            showAccessLevels={true}
            compact={false}
          />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('vendor.totalOffers')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOffers}</div>
              <p className="text-xs text-muted-foreground">{t('vendor.submittedThisMonth')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('vendor.acceptedOffers')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedOffers}</div>
              <p className="text-xs text-muted-foreground">{t('vendor.successRate')}: {Math.round((stats.approvedOffers / Math.max(stats.totalOffers, 1)) * 100)}%</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('vendor.pendingOffers')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOffers}</div>
              <p className="text-xs text-muted-foreground">{t('vendor.awaitingClientResponse')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.completedProjects')}</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers.filter(o => o.status === 'accepted').length}</div>
              <p className="text-xs text-muted-foreground">{t('vendor.successfullyWon')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t('browseRequests.searchAndFilter')}
            </CardTitle>
            <CardDescription>{t('browseRequests.filterDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t('vendor.searchRequests')}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('vendor.filterByCategory')} />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="all">{t('common.all')} {t('browseRequests.filterByCategory')}</SelectItem>
                {categoriesLoading ? (
                  <SelectItem value="" disabled>
                    <LoadingSpinner size="sm" />
                  </SelectItem>
                ) : (
                  getAllCategoriesForFilter().map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.isChild && "  ↳ "}
                      {language === 'ar' ? category.name_ar : category.name_en}
                      {category.isChild && ` (${category.parentName})`}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <p className="text-sm text-muted-foreground">
              {filteredRequests.length} {t('vendor.opportunitiesFound')}
            </p>
          </CardContent>
        </Card>

        {/* Available Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('vendor.availableRequests')}
            </CardTitle>
            <CardDescription>{t('dashboard.findOpportunities')}</CardDescription>
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
                  <div key={request.id} className="p-6 hover:bg-muted/50 transition-colors">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold">{request.title}</h3>
                            <Badge variant={getUrgencyColor(request.urgency) as any} className="ml-2">
                              {request.urgency}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{request.description}</p>
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-sm font-medium">{request.category}</span>
                            {request.location && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{request.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">{t('browseRequests.budget')}</p>
                            <p className="font-semibold text-sm">{formatBudget(request)} {request.currency || 'USD'}</p>
                          </div>
                        </div>
                        
                        {request.deadline && (
                          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">{t('browseRequests.deadline')}</p>
                              <p className="font-semibold text-sm">{new Date(request.deadline).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">{t('browseRequests.posted')}</p>
                            <p className="font-semibold text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          className="flex-1 sm:flex-initial"
                          onClick={() => handleSubmitOffer(request.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t('vendor.submitOffer')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 sm:flex-initial"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t('vendor.viewDetails')}
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
    </DashboardLayout>
  );
};
