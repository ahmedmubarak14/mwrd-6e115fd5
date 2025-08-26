import { CleanDashboardLayout } from "@/components/layout/CleanDashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMatchingSystem } from "@/hooks/useMatchingSystem";
import { useCategories } from "@/hooks/useCategories";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, MapPin, Calendar, DollarSign, Clock, Plus, Eye } from "lucide-react";
import { useState } from "react";

const BrowseRequests = () => {
  const { t, language } = useLanguage();
  const { matchedRequests, loading } = useMatchingSystem();
  const { categories, loading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  if (loading || categoriesLoading) {
    return (
      <CleanDashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </CleanDashboardLayout>
    );
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

  // Get all categories including subcategories for the filter
  const getAllCategories = () => {
    const allCats: any[] = [];
    categories.forEach(category => {
      allCats.push(category);
      if (category.children && category.children.length > 0) {
        allCats.push(...category.children);
      }
    });
    return allCats;
  };

  return (
    <CleanDashboardLayout>
      <div className="container mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('browseRequests.title') || 'Browse Requests'}
          </h1>
          <p className="text-muted-foreground">
            {t('browseRequests.subtitle') || 'Find and submit offers for procurement requests'}
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t('browseRequests.searchAndFilter') || 'Search & Filter'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={t('browseRequests.searchPlaceholder') || 'Search requests...'}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('browseRequests.filterByCategory') || 'Filter by category'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getAllCategories().map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {language === 'ar' ? category.name_ar : category.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('browseRequests.noResults') || 'No requests found'}</h3>
              <p className="text-muted-foreground">{t('browseRequests.noResultsDesc') || 'Try adjusting your search criteria'}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold">{request.title}</h3>
                          <Badge variant={getUrgencyColor(request.urgency) as any}>
                            {request.urgency}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{request.description}</p>
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
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">{t('browseRequests.budget') || 'Budget'}</p>
                          <p className="font-semibold text-sm">{formatBudget(request)} {request.currency || 'USD'}</p>
                        </div>
                      </div>
                      
                      {request.deadline && (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">{t('browseRequests.deadline') || 'Deadline'}</p>
                            <p className="font-semibold text-sm">{new Date(request.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">{t('browseRequests.posted') || 'Posted'}</p>
                          <p className="font-semibold text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('browseRequests.submitOffer') || 'Submit Offer'}
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        {t('browseRequests.viewDetails') || 'View Details'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CleanDashboardLayout>
  );
};

export default BrowseRequests;
