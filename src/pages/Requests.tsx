import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, FileText, Clock, Eye, Search, Filter, Calendar, DollarSign, MapPin, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { CreateRequestModal } from "@/components/modals/CreateRequestModal";
import { useRequests } from "@/hooks/useRequests";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { RequestOffersModal } from "@/components/modals/RequestOffersModal";
import { CATEGORIES, getCategoryLabel } from "@/constants/categories";

export const Requests = () => {
  const { t, language } = useLanguage();
  const { userProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isRTL = language === 'ar';
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();
  const { requests, loading, refetch, formatBudget, getOffersCount } = useRequests();

  const handleEditRequest = (requestTitle: string) => {
    toast({
      title: "Edit Request",
      description: `Opening editor for: ${requestTitle}`,
    });
  };

  const handleViewOffers = (offersCount: number) => {
    toast({
      title: "View Offers",
      description: `Showing ${offersCount} offers received for this request`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-lime/20 text-lime-foreground';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" || 
        request.title.toLowerCase().includes(searchLower) ||
        request.category.toLowerCase().includes(searchLower) ||
        request.description.toLowerCase().includes(searchLower) ||
        request.location.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;

      // Category filter
      const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [requests, searchTerm, statusFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role || 'client'} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Enhanced Header with gradient background like dashboard */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{t('nav.requests')}</h1>
                  <p className="text-muted-foreground text-sm sm:text-base">Manage your service requests and track offers</p>
                </div>
                <CreateRequestModal>
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 py-3 shadow-lg hover-scale w-full sm:w-auto">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    {t('request.create')}
                  </Button>
                </CreateRequestModal>
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  Search & Filter Requests
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Find specific requests quickly</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by title, category, or location..."
                      className="pl-10 h-12 text-sm sm:text-base bg-background/50 border-primary/20 focus:border-primary/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Filter selects */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{isRTL ? 'كل الفئات' : 'All Categories'}</SelectItem>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {isRTL ? cat.labelAr : cat.labelEn}
                          </SelectItem>
                        ))}

                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Stats - Dashboard style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Requests</CardTitle>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {filteredRequests.filter(r => r.status === 'open').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Currently open</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Offers</CardTitle>
                  <div className="w-10 h-10 bg-lime/10 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5 text-lime" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-lime to-primary bg-clip-text text-transparent">
                    {filteredRequests.reduce((sum, r) => sum + getOffersCount(r), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total offers received</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent to-lime bg-clip-text text-transparent">
                    {filteredRequests.filter(r => r.status === 'completed').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Requests List - More user-friendly */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  Your Service Requests
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Track and manage all your requests in one place</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                      <p>Try adjusting your search terms or filters</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredRequests.map((request, index) => (
                    <div key={request.id} className="p-4 sm:p-6 hover:bg-muted/50 transition-all duration-200">
                      {/* Mobile-first layout */}
                      <div className="space-y-4">
                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-12 rounded-full ${
                                request.status === 'open' ? 'bg-lime' :
                                request.status === 'in_progress' ? 'bg-accent' : 'bg-primary'
                              }`}></div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-base sm:text-lg font-semibold line-clamp-1">{request.title}</h3>
                                  <Badge variant={getUrgencyColor(request.urgency) as any} className="ml-2 text-xs">
                                    {request.urgency}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                                <div className="flex items-center gap-4 mb-2">
                                  <span className="text-sm text-primary font-medium">{getCategoryLabel(request.category, language as any)}</span>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{request.location}</span>
                                  </div>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Details grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-5">
                          <div className="flex items-center gap-2 p-3 bg-lime/5 rounded-lg">
                          <div className="flex items-center gap-1">
                            <span className="text-lime text-lg font-bold">{formatBudget(request)}</span>
                            <span className="text-lime text-sm">{request.currency}</span>
                          </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg">
                            <Clock className="h-4 w-4 text-accent" />
                            <div>
                              <p className="text-xs text-muted-foreground">Deadline</p>
                              <p className="font-semibold text-sm">{request.deadline}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                            <Eye className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Offers</p>
                              <p className="font-semibold text-sm">{getOffersCount(request)} received</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 pl-5">
                          <ViewDetailsModal 
                            item={{
                              id: parseInt(request.id.slice(-8), 16),
                              title: request.title,
                              description: `Category: ${request.category}`,
                              value: formatBudget(request),
                              status: request.status
                            }}
                            userRole={userProfile?.role as any}
                          >
                            <Button size="sm" className="flex-1 sm:flex-initial bg-gradient-to-r from-primary to-accent hover-scale">
                              <Eye className="h-4 w-4 mr-2" />
                              {t('common.view')}
                            </Button>
                          </ViewDetailsModal>
                          {request.status === 'open' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 sm:flex-initial hover-scale"
                              onClick={() => handleEditRequest(request.title)}
                            >
                              {t('common.edit')}
                            </Button>
                          )}
                          {getOffersCount(request) > 0 && (
                            <RequestOffersModal requestId={request.id} requestTitle={request.title}>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 sm:flex-initial bg-lime/10 border-lime/20 text-lime hover:bg-lime/20 hover-scale"
                              >
                                {isRTL ? 'عرض العروض' : 'View Offers'} ({getOffersCount(request)})
                              </Button>
                            </RequestOffersModal>

                          )}
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
    </div>
  );
};