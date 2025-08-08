import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, DollarSign, Clock, Eye, FileText, Filter, Calendar, MapPin } from "lucide-react";
import { useState, useMemo } from "react";
import { useOffers } from "@/hooks/useOffers";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ViewDetailsModal } from "@/components/modals/ViewDetailsModal";
import { RealTimeChatModal } from "@/components/modals/RealTimeChatModal";

export const MyOffers = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isRTL = language === 'ar';
  
  const { offers, loading, formatPrice, getStatusColor } = useOffers();

  // Filter and search logic
  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" || 
        offer.title.toLowerCase().includes(searchLower) ||
        offer.description.toLowerCase().includes(searchLower) ||
        offer.request?.title.toLowerCase().includes(searchLower) ||
        offer.request?.category.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === "all" || offer.client_approval_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [offers, searchTerm, statusFilter]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const stats = {
    total: offers.length,
    approved: offers.filter(o => o.client_approval_status === 'approved').length,
    pending: offers.filter(o => o.client_approval_status === 'pending').length,
    rejected: offers.filter(o => o.client_approval_status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'supplier'} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role || 'supplier'} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">My Offers</h1>
                  <p className="text-muted-foreground text-sm sm:text-base">Track and manage all your submitted offers</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Offers</CardTitle>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stats.total}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Eye className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.approved}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}% success rate
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.pending}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold text-red-600">
                    {stats.rejected}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Need revision</p>
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
                  Search & Filter Offers
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Find specific offers quickly</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by offer title, description, or request..."
                      className="pl-10 h-12 text-sm sm:text-base bg-background/50 border-primary/20 focus:border-primary/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Filter select */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Offers List */}
            <Card className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-lime/5 to-primary/5 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <div className="w-10 h-10 bg-lime/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-lime" />
                  </div>
                  Your Offers ({filteredOffers.length})
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">All your submitted offers and their status</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredOffers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No offers found</h3>
                      <p>Try adjusting your search terms or filters</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredOffers.map((offer) => (
                      <div key={offer.id} className="p-4 sm:p-6 hover:bg-muted/50 transition-colors">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-base sm:text-lg font-semibold line-clamp-1">{offer.title}</h3>
                                <Badge className={getStatusColor(offer.client_approval_status)} variant="secondary">
                                  {offer.client_approval_status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {offer.description}
                              </p>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-primary font-medium">For: {offer.request?.title}</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">{offer.request?.category}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2 p-3 bg-lime/5 rounded-lg">
                              <DollarSign className="h-4 w-4 text-lime" />
                              <div>
                                <p className="text-xs text-muted-foreground">Price</p>
                                <p className="font-semibold text-sm text-lime">{formatPrice(offer)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg">
                              <Clock className="h-4 w-4 text-accent" />
                              <div>
                                <p className="text-xs text-muted-foreground">Delivery</p>
                                <p className="font-semibold text-sm">{offer.delivery_time_days} days</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                              <Calendar className="h-4 w-4 text-primary" />
                              <div>
                                <p className="text-xs text-muted-foreground">Submitted</p>
                                <p className="font-semibold text-sm">{new Date(offer.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                              <MapPin className="h-4 w-4 text-orange-600" />
                              <div>
                                <p className="text-xs text-muted-foreground">Location</p>
                                <p className="font-semibold text-sm">{offer.request?.location || 'Not specified'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Approval Notes */}
                          {offer.client_approval_notes && (
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Client Notes:</p>
                              <p className="text-sm">{offer.client_approval_notes}</p>
                            </div>
                          )}
                          
                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <ViewDetailsModal 
                              item={{
                                id: parseInt(offer.id.slice(-8), 16),
                                title: offer.title,
                                description: offer.description,
                                value: formatPrice(offer),
                                status: offer.client_approval_status
                              }}
                              userRole="supplier"
                            >
                              <Button size="sm" variant="outline" className="flex-1 sm:flex-initial">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </ViewDetailsModal>
                            
                            {offer.request && (
                              <RealTimeChatModal 
                                requestId={offer.request_id}
                                offerId={offer.id}
                                recipientId={offer.request.user_id}
                              >
                                <Button size="sm" className="flex-1 sm:flex-initial bg-gradient-to-r from-primary to-accent">
                                  Chat with Client
                                </Button>
                              </RealTimeChatModal>
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