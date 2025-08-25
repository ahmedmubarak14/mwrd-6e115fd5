import React, { useState } from 'react';
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, TrendingUp, Clock, Eye, DollarSign, AlertTriangle, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMatchingSystem } from "@/hooks/useMatchingSystem";
import { useOffers } from "@/hooks/useOffers";
import { useCategories } from "@/hooks/useCategories";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Footer } from "@/components/ui/layout/Footer";
import { UnifiedVerificationStatus } from '@/components/verification/UnifiedVerificationStatus';
import { VerificationGuard } from '@/components/verification/VerificationGuard';

export const EnhancedVendorDashboard = () => {
  const { userProfile } = useAuth();
  const { language, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const isRTL = language === 'ar';
  
  const { matchedRequests, loading: matchingLoading } = useMatchingSystem();
  const { offers, loading: offersLoading } = useOffers();
  const { categories, loading: categoriesLoading } = useCategories();

  if (matchingLoading || offersLoading) {
    return <LoadingSpinner />;
  }

  const isVerified = userProfile?.verification_status === 'approved' && userProfile?.status === 'approved';
  
  const filteredRequests = matchedRequests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      request.title.toLowerCase().includes(searchLower) ||
      request.category.toLowerCase().includes(searchLower);
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;
    const matchesUrgency = urgencyFilter === "all" || request.urgency === urgencyFilter;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const stats = {
    totalOffers: offers.length,
    approvedOffers: offers.filter(o => o.client_approval_status === 'approved').length,
    pendingOffers: offers.filter(o => o.client_approval_status === 'pending').length,
    winRate: offers.length > 0 ? Math.round((offers.filter(o => o.client_approval_status === 'approved').length / offers.length) * 100) : 0,
    avgResponseTime: '2 hours',
    rating: 4.8,
    completedProjects: offers.filter(o => o.status === 'accepted').length
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
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'vendor'} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar */}
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
                    {t('vendor.welcome')}
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">{t('vendor.subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <UnifiedVerificationStatus showActions={true} showAccessLevels={true} />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('vendor.totalOffers')}</CardTitle>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stats.totalOffers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('vendor.submittedThisMonth')}</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('vendor.winRate')}</CardTitle>
                  <div className="w-10 h-10 bg-lime/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-lime" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-lime to-primary bg-clip-text text-transparent">
                    {stats.winRate}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.approvedOffers} {t('common.of')} {stats.totalOffers} {t('vendor.offersWon')}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('vendor.pendingReviews')}</CardTitle>
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent to-lime bg-clip-text text-transparent">
                    {stats.pendingOffers}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('vendor.awaitingClientResponse')}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('vendor.activeProjects')}</CardTitle>
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-lime bg-clip-text text-transparent">
                    {stats.completedProjects}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t('vendor.inProgressCompleted')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Search and Filters */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Filter className="h-5 w-5 text-primary" />
                  {t('vendor.findOpportunities')}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {t('vendor.filterDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Input 
                      placeholder={t('vendor.searchRequests')}
                      className="pl-10 h-12 text-sm sm:text-base bg-background/50 border-primary/20 focus:border-primary/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                      <SelectValue placeholder={t('browseRequests.filterByCategory')} />
                    </SelectTrigger>
                    <SelectContent>
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

                  <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                      <SelectValue placeholder={t('common.urgency')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.all')} {t('common.urgency')}</SelectItem>
                      <SelectItem value="urgent">{t('common.urgent')}</SelectItem>
                      <SelectItem value="high">{t('common.high')}</SelectItem>
                      <SelectItem value="medium">{t('common.medium')}</SelectItem>
                      <SelectItem value="low">{t('common.low')}</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="text-sm text-muted-foreground flex items-center">
                    {filteredRequests.length} {t('vendor.opportunitiesFound')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities List with Verification Guard */}
            <VerificationGuard
              requireVerification={false}
              allowViewOnly={true}
              fallbackMessage={t('vendor.completeVerificationToSubmit')}
            >
              <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Star className="h-5 w-5 text-primary" />
                    {t('vendor.availableOpportunities')}
                  </CardTitle>
                  <CardDescription>
                    {isVerified ? t('vendor.submitOffersToWin') : t('vendor.completeVerificationToSubmit')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredRequests.map((request) => (
                      <div key={request.id} className="p-4 sm:p-6 hover:bg-muted/50 transition-all duration-200">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">{request.title}</h3>
                                <Badge variant={getUrgencyColor(request.urgency) as any}>
                                  {request.urgency}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mb-2">{request.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="text-primary font-medium">{request.category}</span>
                                <span>{new Date(request.created_at).toLocaleDateString()}</span>
                                {request.deadline && (
                                  <span>{t('vendor.due')}: {new Date(request.deadline).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-lime" />
                              <span className="font-semibold">
                                {t('vendor.budget')}: {request.budget_min ? `${request.budget_min.toLocaleString()} - ${request.budget_max?.toLocaleString() || t('vendor.open')}` : t('vendor.negotiable')} {request.currency || 'SAR'}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-2" />
                                {t('vendor.viewDetails')}
                              </Button>
                              
                              {isVerified ? (
                                <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                                  <Plus className="h-4 w-4 mr-2" />
                                  {t('vendor.submitOffer')}
                                </Button>
                              ) : (
                                <Button size="sm" disabled>
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  {t('vendor.verificationRequired')}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </VerificationGuard>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
