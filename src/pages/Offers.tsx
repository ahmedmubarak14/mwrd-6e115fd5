
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, Filter, Eye, MessageSquare, Plus, BarChart3, CheckCircle, XCircle, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CreateOfferModal } from "@/components/modals/CreateOfferModal";
import { OfferDetailsModal } from "@/components/modals/OfferDetailsModal";
import { RealTimeChatModal } from "@/components/modals/RealTimeChatModal";
import { OfferComparisonModal } from "@/components/enhanced/OfferComparisonModal";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/ui/layout/Footer";
import { useOffers } from "@/hooks/useOffers";
import { Checkbox } from "@/components/ui/checkbox";

export const Offers = () => {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

  const { offers, loading: offersLoading, error: offersError, updateOfferStatus, refetch } = useOffers();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    if (isRTL) {
      switch (status) {
        case 'approved': return 'مقبول';
        case 'rejected': return 'مرفوض';
        case 'pending': return 'قيد المراجعة';
        default: return status;
      }
    } else {
      switch (status) {
        case 'approved': return 'Approved';
        case 'rejected': return 'Rejected';
        case 'pending': return 'Pending';
        default: return status;
      }
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.request?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.vendor?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.vendor?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || offer.client_approval_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOfferSelection = (offerId: string, selected: boolean) => {
    if (selected) {
      setSelectedOffers(prev => [...prev, offerId]);
    } else {
      setSelectedOffers(prev => prev.filter(id => id !== offerId));
    }
  };

  const handleSelectAll = () => {
    if (selectedOffers.length === filteredOffers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(filteredOffers.map(offer => offer.id));
    }
  };

  const handleOfferAction = async (offerId: string, action: 'approved' | 'rejected', notes?: string) => {
    const success = await updateOfferStatus(offerId, action, notes);
    if (success) {
      setSelectedOffers(prev => prev.filter(id => id !== offerId));
      await refetch();
    }
  };

  const getOfferStats = () => {
    const total = offers.length;
    const pending = offers.filter(o => o.client_approval_status === 'pending').length;
    const approved = offers.filter(o => o.client_approval_status === 'approved').length;
    const rejected = offers.filter(o => o.client_approval_status === 'rejected').length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getOfferStats();

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-arabic' : ''}`}>
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h1 className="text-3xl font-bold mb-2">
                  {isRTL ? 'إدارة العروض' : 'Offers Management'}
                </h1>
                <p className="text-muted-foreground">
                  {userProfile?.role === 'vendor' 
                    ? (isRTL ? 'إدارة عروضك المقدمة للعملاء' : 'Manage your submitted offers to clients')
                    : (isRTL ? 'مراجعة والموافقة على العروض المقدمة' : 'Review and approve submitted offers')
                  }
                </p>
              </div>
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {selectedOffers.length > 1 && userProfile?.role === 'client' && (
                  <OfferComparisonModal 
                    offers={offers.filter(o => selectedOffers.includes(o.id))}
                    onOfferAction={handleOfferAction}
                  >
                    <Button className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                      <BarChart3 className="h-4 w-4" />
                      {isRTL ? `مقارنة (${selectedOffers.length})` : `Compare (${selectedOffers.length})`}
                    </Button>
                  </OfferComparisonModal>
                )}
                {userProfile?.role === 'vendor' && (
                  <CreateOfferModal>
                    <Button className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}>
                      <Plus className="h-4 w-4" />
                      {isRTL ? 'عرض جديد' : 'New Offer'}
                    </Button>
                  </CreateOfferModal>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'إجمالي العروض' : 'Total Offers'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'قيد المراجعة' : 'Pending'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'مقبول' : 'Approved'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'مرفوض' : 'Rejected'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''} flex-wrap items-center`}>
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-muted-foreground`} />
                      <Input
                        placeholder={isRTL ? "البحث في العروض..." : "Search offers..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={isRTL ? "حالة العرض" : "Offer Status"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                      <SelectItem value="pending">{isRTL ? 'قيد المراجعة' : 'Pending'}</SelectItem>
                      <SelectItem value="approved">{isRTL ? 'مقبول' : 'Approved'}</SelectItem>
                      <SelectItem value="rejected">{isRTL ? 'مرفوض' : 'Rejected'}</SelectItem>
                    </SelectContent>
                  </Select>
                  {userProfile?.role === 'client' && filteredOffers.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                    >
                      <Checkbox 
                        checked={selectedOffers.length === filteredOffers.length}
                        onCheckedChange={handleSelectAll}
                      />
                      {selectedOffers.length === filteredOffers.length 
                        ? (isRTL ? 'إلغاء الكل' : 'Deselect All')
                        : (isRTL ? 'تحديد الكل' : 'Select All')
                      }
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {offersLoading && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            )}

            {offersError && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {isRTL ? 'حدث خطأ' : 'Error Loading Offers'}
                  </h3>
                  <p className="text-muted-foreground">{offersError}</p>
                </CardContent>
              </Card>
            )}

            {!offersLoading && !offersError && (
              <div className="grid gap-4">
                {filteredOffers.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {isRTL ? 'لا توجد عروض' : 'No Offers Found'}
                      </h3>
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== 'all' 
                          ? (isRTL ? 'لم يتم العثور على عروض تطابق معايير البحث' : 'No offers match your search criteria')
                          : userProfile?.role === 'vendor'
                            ? (isRTL ? 'لم تقم بتقديم أي عروض بعد. ابدأ بإنشاء عرض جديد.' : 'You haven\'t submitted any offers yet. Start by creating a new offer.')
                            : (isRTL ? 'لم يتم تقديم عروض لطلباتك بعد.' : 'No offers have been submitted for your requests yet.')
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredOffers.map((offer) => (
                    <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-start gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {userProfile?.role === 'client' && (
                              <Checkbox
                                checked={selectedOffers.includes(offer.id)}
                                onCheckedChange={(checked) => handleOfferSelection(offer.id, checked as boolean)}
                                className="mt-1"
                              />
                            )}
                            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                              <CardTitle className="text-lg mb-2">{offer.title}</CardTitle>
                              <CardDescription className="mb-2">
                                {isRTL ? 'للطلب: ' : 'For Request: '}{offer.request?.title}
                              </CardDescription>
                              {offer.vendor && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {isRTL ? 'المورد: ' : 'Vendor: '}{offer.vendor.company_name || offer.vendor.full_name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className={`flex flex-col items-end gap-2 ${isRTL ? 'items-start' : ''}`}>
                            <Badge variant={getStatusColor(offer.client_approval_status)}>
                              {getStatusText(offer.client_approval_status)}
                            </Badge>
                            <div className="text-lg font-bold text-primary">
                              {offer.price.toLocaleString()} {offer.currency}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {offer.delivery_time_days} {isRTL ? 'أيام' : 'days'}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {offer.description}
                        </p>
                        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''} flex-wrap`}>
                          <OfferDetailsModal 
                            offerId={offer.id} 
                            userRole={userProfile?.role as any}
                            onUpdated={refetch}
                          >
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                            >
                              <Eye className="h-4 w-4" />
                              {isRTL ? 'عرض التفاصيل' : 'View Details'}
                            </Button>
                          </OfferDetailsModal>
                          
                          {offer.vendor && (
                            <RealTimeChatModal 
                              recipientId={offer.vendor_id}
                              recipientName={offer.vendor.company_name || offer.vendor.full_name}
                              requestId={offer.request_id}
                              offerId={offer.id}
                            >
                              <Button 
                                variant="outline" 
                                size="sm"
                                className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                              >
                                <MessageSquare className="h-4 w-4" />
                                {isRTL ? 'مراسلة المورد' : 'Message Vendor'}
                              </Button>
                            </RealTimeChatModal>
                          )}

                          {userProfile?.role === 'client' && offer.client_approval_status === 'pending' && (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => handleOfferAction(offer.id, 'approved')}
                                className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                              >
                                <CheckCircle className="h-4 w-4" />
                                {isRTL ? 'قبول' : 'Accept'}
                              </Button>
                              <Button 
                                variant="destructive"
                                size="sm"
                                onClick={() => handleOfferAction(offer.id, 'rejected')}
                                className={`${isRTL ? 'flex-row-reverse' : ''} gap-2`}
                              >
                                <XCircle className="h-4 w-4" />
                                {isRTL ? 'رفض' : 'Reject'}
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Offers;
