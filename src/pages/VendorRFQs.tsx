import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRFQs, RFQ } from "@/hooks/useRFQs";
import { useBids } from "@/hooks/useBids";
import { useCategories } from "@/hooks/useCategories";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/ui/MetricCard";
import { BidSubmissionModal } from "@/components/rfq/BidSubmissionModal";
import { 
  Calendar, 
  Package, 
  MapPin, 
  Clock, 
  Search,
  Filter,
  FileText,
  AlertCircle,
  TrendingUp,
  Eye,
  Send,
  DollarSign,
  Users
} from "lucide-react";
import { format } from "date-fns";

const VendorRFQs = () => {
  const { t } = useLanguage();
  const { rfqs, loading: rfqsLoading } = useRFQs();
  const { bids, loading: bidsLoading } = useBids();
  const { categories, loading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter RFQs for vendors (only published and public RFQs)
  const availableRFQs = useMemo(() => {
    if (!rfqs) return [];
    
    return rfqs.filter(rfq => 
      rfq.status === 'published' && 
      rfq.is_public && 
      new Date(rfq.submission_deadline) > new Date()
    );
  }, [rfqs]);

  // Check which RFQs the vendor has already bid on
  const rfqsWithBidStatus = useMemo(() => {
    if (!availableRFQs || !bids) return [];
    
    return availableRFQs.map(rfq => ({
      ...rfq,
      hasBid: bids.some(bid => bid.rfq_id === rfq.id)
    }));
  }, [availableRFQs, bids]);

  // RFQ metrics
  const metrics = useMemo(() => {
    if (!rfqsWithBidStatus) return { total: 0, newThisWeek: 0, highPriority: 0, submitted: 0 };
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: rfqsWithBidStatus.length,
      newThisWeek: rfqsWithBidStatus.filter(r => new Date(r.created_at) > weekAgo).length,
      highPriority: rfqsWithBidStatus.filter(r => r.priority === 'high' || r.priority === 'urgent').length,
      submitted: rfqsWithBidStatus.filter(r => r.hasBid).length,
    };
  }, [rfqsWithBidStatus]);

  // Filter RFQs based on search, status, and category
  const filteredRFQs = useMemo(() => {
    if (!rfqsWithBidStatus) return [];

    return rfqsWithBidStatus.filter((rfq) => {
      const matchesSearch = rfq.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rfq.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === "available") {
        matchesStatus = !rfq.hasBid;
      } else if (statusFilter === "submitted") {
        matchesStatus = rfq.hasBid;
      }
      
      const matchesCategory = categoryFilter === "all" || rfq.category_id === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [rfqsWithBidStatus, searchTerm, statusFilter, categoryFilter]);

  const loading = rfqsLoading || bidsLoading || categoriesLoading;

  if (loading) {
    return (
      <ClientPageContainer>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </ClientPageContainer>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <ClientPageContainer
      title="Available RFQs"
      description="Browse and submit bids for Request for Quotations"
    >

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Available RFQs"
          value={metrics.total}
          icon={FileText}
          trend={{ value: 15, label: "vs last month", isPositive: true }}
        />
        <MetricCard
          title="New This Week"
          value={metrics.newThisWeek}
          icon={TrendingUp}
          trend={{ value: 5, label: "this week", isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="High Priority"
          value={metrics.highPriority}
          icon={AlertCircle}
          variant="warning"
        />
        <MetricCard
          title="Bids Submitted"
          value={metrics.submitted}
          icon={Send}
          variant="default"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search RFQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All RFQs</SelectItem>
                <SelectItem value="available">Available to Bid</SelectItem>
                <SelectItem value="submitted">Already Submitted</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filteredRFQs.length} of {metrics.total} RFQs</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RFQs Grid */}
      {filteredRFQs.length > 0 ? (
        <div className="space-y-4">
          {filteredRFQs.map((rfq) => (
            <Card key={rfq.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{rfq.title}</h3>
                        <div className="flex gap-2">
                          <Badge variant={getPriorityColor(rfq.priority) as any}>
                            {rfq.priority}
                          </Badge>
                          {rfq.hasBid && (
                            <Badge variant="outline" className="text-success border-success">
                              Bid Submitted
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2 line-clamp-2">{rfq.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-semibold text-sm">
                          {rfq.budget_min && rfq.budget_max 
                            ? `${rfq.budget_min.toLocaleString()} - ${rfq.budget_max.toLocaleString()}`
                            : 'Negotiable'
                          } {rfq.currency}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Deadline</p>
                        <p className="font-semibold text-sm">
                          {format(new Date(rfq.submission_deadline), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-semibold text-sm">{rfq.delivery_location || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Posted</p>
                        <p className="font-semibold text-sm">
                          {format(new Date(rfq.created_at), 'MMM dd')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {!rfq.hasBid ? (
                      <BidSubmissionModal rfq={rfq}>
                        <Button className="flex-1 gap-2">
                          <Send className="h-4 w-4" />
                          Submit Bid
                        </Button>
                      </BidSubmissionModal>
                    ) : (
                      <Button variant="outline" className="flex-1 gap-2" disabled>
                        <Send className="h-4 w-4" />
                        Bid Already Submitted
                      </Button>
                    )}
                    <Button variant="outline" className="gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" 
                ? "No RFQs found" 
                : "No Available RFQs"
              }
            </h3>
            
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search criteria or filters to find available RFQs" 
                : "There are currently no published RFQs available for bidding. Check back later for new opportunities."
              }
            </p>

            {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                }}
                className="gap-2"
              >
                <Package className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </ClientPageContainer>
  );
};

export default VendorRFQs;