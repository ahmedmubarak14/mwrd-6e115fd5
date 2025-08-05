import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Package, TrendingUp, Clock, Eye, Search, Plus, MapPin, Calendar, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  currency: string;
  location?: string;
  deadline?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  user_id: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  delivery_time_days: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  request_id: string;
}

export const SupplierDashboard = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [requests, setRequests] = useState<Request[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
    fetchMyOffers();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests((data || []) as Request[]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOffers = async () => {
    if (!userProfile?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('supplier_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers((data || []) as Offer[]);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const formatBudget = (request: Request) => {
    if (!request.budget_min && !request.budget_max) return 'Budget not specified';
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()}`;
    }
    if (request.budget_min) return `From ${request.budget_min.toLocaleString()}`;
    if (request.budget_max) return `Up to ${request.budget_max.toLocaleString()}`;
    return 'Budget not specified';
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

  const filteredRequests = requests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      request.title.toLowerCase().includes(searchLower) ||
      request.category.toLowerCase().includes(searchLower) ||
      request.description.toLowerCase().includes(searchLower);

    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleSubmitOffer = (requestId: string) => {
    toast({
      title: "Submit Offer",
      description: "Opening offer submission form...",
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role || 'supplier'} />
        </SheetContent>
      </Sheet>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar userRole={userProfile?.role || 'supplier'} />
        </div>
        
        <main className="flex-1 p-4 lg:p-8 max-w-full overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-lime/10 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Supplier Dashboard</h1>
                  <p className="text-muted-foreground text-sm sm:text-base">Browse requests and manage your offers</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Available Requests</CardTitle>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {filteredRequests.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Open for offers</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">My Offers</CardTitle>
                  <div className="w-10 h-10 bg-lime/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-lime" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-lime to-primary bg-clip-text text-transparent">
                    {offers.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total submitted</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl font-bold bg-gradient-to-r from-accent to-lime bg-clip-text text-transparent">
                    {offers.filter(o => o.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
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
                  Browse Available Requests
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Find requests that match your expertise</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by title, category, or description..."
                      className="pl-10 h-12 text-sm sm:text-base bg-background/50 border-primary/20 focus:border-primary/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 bg-background/50 border-primary/20">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
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
                  Available Requests
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Submit offers for requests that match your services</CardDescription>
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
                                <p className="text-xs text-muted-foreground">Budget</p>
                                <p className="font-semibold text-sm">{formatBudget(request)} {request.currency}</p>
                              </div>
                            </div>
                            
                            {request.deadline && (
                              <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-lg">
                                <Calendar className="h-4 w-4 text-accent" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Deadline</p>
                                  <p className="font-semibold text-sm">{new Date(request.deadline).toLocaleDateString()}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                              <Clock className="h-4 w-4 text-primary" />
                              <div>
                                <p className="text-xs text-muted-foreground">Posted</p>
                                <p className="font-semibold text-sm">{new Date(request.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2 pl-5">
                            <Button 
                              className="flex-1 sm:flex-initial bg-gradient-to-r from-primary to-accent hover-scale"
                              onClick={() => handleSubmitOffer(request.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Submit Offer
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 sm:flex-initial hover-scale"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
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
    </div>
  );
};