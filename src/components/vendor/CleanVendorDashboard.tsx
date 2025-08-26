
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
import { UnifiedVerificationStatus } from "@/components/verification/UnifiedVerificationStatus";

export const CleanVendorDashboard = () => {
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
        <div className="flex justify-center items-center min-h-[400px] bg-white">
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
      case 'urgent': return 'bg-red-50 text-red-700 border-red-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'low': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleSubmitOffer = (requestId: string) => {
    console.log('Submit offer for request:', requestId);
  };

  const stats = {
    totalOffers: offers.length,
    approvedOffers: offers.filter(o => o.client_approval_status === 'approved').length,
    pendingOffers: offers.filter(o => o.client_approval_status === 'pending').length,
    completedProjects: offers.filter(o => o.status === 'accepted').length
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
    <div className="min-h-screen bg-white">
      <DashboardLayout className="bg-white">
        <div className="max-w-7xl mx-auto p-6 space-y-8 bg-white">
          {/* Clean Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {t('vendor.welcome')}
            </h1>
            <p className="text-gray-600 text-lg">{t('vendor.subtitle')}</p>
          </div>

          {/* Verification Status */}
          {needsVerificationGuidance && (
            <div className="mb-8">
              <UnifiedVerificationStatus 
                showActions={true}
                showAccessLevels={true}
                compact={false}
              />
            </div>
          )}

          {/* Clean Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.totalOffers}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{t('vendor.totalOffers')}</h3>
              <p className="text-xs text-gray-500">{t('vendor.submittedThisMonth')}</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.approvedOffers}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{t('vendor.acceptedOffers')}</h3>
              <p className="text-xs text-gray-500">
                {t('vendor.successRate')}: {Math.round((stats.approvedOffers / Math.max(stats.totalOffers, 1)) * 100)}%
              </p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.pendingOffers}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{t('vendor.pendingOffers')}</h3>
              <p className="text-xs text-gray-500">{t('vendor.awaitingClientResponse')}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.completedProjects}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{t('dashboard.completedProjects')}</h3>
              <p className="text-xs text-gray-500">{t('vendor.successfullyWon')}</p>
            </div>
          </div>

          {/* Clean Search and Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('browseRequests.searchAndFilter')}</h2>
                <p className="text-gray-600">{t('browseRequests.filterDescription')}</p>
              </div>
              <Filter className="h-5 w-5 text-gray-400 mt-1" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder={t('vendor.searchRequests')}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={t('vendor.filterByCategory')} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
              
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{filteredRequests.length}</span>
                <span className="ml-1">{t('vendor.opportunitiesFound')}</span>
              </div>
            </div>
          </div>

          {/* Clean Available Requests */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('vendor.availableRequests')}</h2>
                  <p className="text-gray-600">{t('dashboard.findOpportunities')}</p>
                </div>
                <Package className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {filteredRequests.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('browseRequests.noResults')}</h3>
                <p className="text-gray-600">{t('browseRequests.noResultsDesc')}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(request.urgency)}`}>
                              {request.urgency}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="font-medium text-blue-600">{request.category}</span>
                            {request.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{request.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">{t('browseRequests.budget')}</p>
                            <p className="font-semibold text-sm text-gray-900">
                              {formatBudget(request)} {request.currency || 'USD'}
                            </p>
                          </div>
                        </div>
                        
                        {request.deadline && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">{t('browseRequests.deadline')}</p>
                              <p className="font-semibold text-sm text-gray-900">
                                {new Date(request.deadline).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">{t('browseRequests.posted')}</p>
                            <p className="font-semibold text-sm text-gray-900">
                              {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                          onClick={() => handleSubmitOffer(request.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t('vendor.submitOffer')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium"
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
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};
