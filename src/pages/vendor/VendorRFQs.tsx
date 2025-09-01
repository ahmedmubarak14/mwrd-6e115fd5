import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Clock, FileText, DollarSign, Calendar, MapPin, Eye, Send } from "lucide-react";

export const VendorRFQs = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (userProfile) {
      fetchRFQs();
      fetchBids();
    }
  }, [userProfile]);

  const fetchRFQs = async () => {
    try {
      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          *,
          user_profiles!rfqs_client_id_fkey(full_name, company_name)
        `)
        .in('status', ['published', 'in_progress'])
        .gte('submission_deadline', new Date().toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRfqs(data || []);
    } catch (error) {
      console.error('Error fetching RFQs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch RFQs",
        variant: "destructive"
      });
    }
  };

  const fetchBids = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          rfqs(title, client_id, status, submission_deadline, user_profiles!rfqs_client_id_fkey(full_name, company_name))
        `)
        .eq('vendor_id', userProfile?.user_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your bids",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRFQs = rfqs.filter(rfq => {
    const matchesSearch = rfq.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rfq.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'in_progress': return 'secondary';
      case 'closed': return 'outline';
      case 'submitted': return 'default';
      case 'awarded': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const handleSubmitBid = async (rfqId: string) => {
    toast({
      title: "Bid Submission",
      description: "Opening bid submission form...",
    });
    // Implementation would open bid submission modal
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('vendor.rfqsPage.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('vendor.rfqsPage.description')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('vendor.rfqsPage.availableRFQs')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rfqs.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('vendor.rfqsPage.activeOpportunities')}
              </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Bids</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bids.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Total submitted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awarded Bids</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bids.filter(b => b.status === 'awarded').length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Successful bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bids.length > 0 ? Math.round((bids.filter(b => b.status === 'awarded').length / bids.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Success percentage
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">{t('vendor.rfqsPage.availableRFQsTab')}</TabsTrigger>
          <TabsTrigger value="mybids">{t('vendor.rfqsPage.myBidsTab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Available RFQs</CardTitle>
                  <CardDescription>Browse and bid on active RFQs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder={t('vendor.rfqsPage.searchRFQs')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredRFQs.map((rfq) => {
                  const daysRemaining = getDaysRemaining(rfq.submission_deadline);
                  const hasBid = bids.some(bid => bid.rfq_id === rfq.id);
                  
                  return (
                    <Card key={rfq.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{rfq.title}</h3>
                            <p className="text-muted-foreground mb-3 line-clamp-2">
                              {rfq.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                ${rfq.budget_min || 0} - ${rfq.budget_max || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {daysRemaining} days left
                              </div>
                              {rfq.delivery_location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {rfq.delivery_location}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={getStatusBadgeVariant(rfq.status)}>
                              {rfq.status}
                            </Badge>
                            {daysRemaining < 3 && (
                              <Badge variant="destructive" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            By {rfq.user_profiles?.company_name || rfq.user_profiles?.full_name}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {!hasBid ? (
                              <Button 
                                size="sm" 
                                onClick={() => handleSubmitBid(rfq.id)}
                                disabled={daysRemaining <= 0}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Submit Bid
                              </Button>
                            ) : (
                              <Badge variant="secondary">Bid Submitted</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {filteredRFQs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No RFQs found matching your criteria
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mybids" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Bids</CardTitle>
              <CardDescription>Track the status of your submitted bids</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bids.map((bid) => (
                  <Card key={bid.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{bid.rfqs?.title}</h4>
                        <Badge variant={getStatusBadgeVariant(bid.status)}>
                          {bid.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {bid.proposal.substring(0, 150)}...
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span>Bid Amount: ${Number(bid.total_price).toFixed(2)}</span>
                          <span>Delivery: {bid.delivery_timeline_days} days</span>
                        </div>
                        <span className="text-muted-foreground">
                          Submitted {new Date(bid.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {bids.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    You haven't submitted any bids yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};