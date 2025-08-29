import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRFQs } from "@/hooks/useRFQs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricCard } from "@/components/ui/MetricCard";
import { 
  Calendar, 
  Package, 
  MapPin, 
  Clock, 
  Plus, 
  Search,
  Filter,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Edit2,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { RFQCard } from "@/components/rfq/RFQCard";

const RFQManagement = () => {
  const { t } = useLanguage();
  const { rfqs, loading } = useRFQs();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // RFQ metrics
  const metrics = useMemo(() => {
    if (!rfqs) return { total: 0, published: 0, in_progress: 0, draft: 0 };
    
    return {
      total: rfqs.length,
      published: rfqs.filter(r => r.status === 'published').length,
      in_progress: rfqs.filter(r => r.status === 'in_progress').length,
      draft: rfqs.filter(r => r.status === 'draft').length,
    };
  }, [rfqs]);

  // Filter RFQs based on search and status
  const filteredRFQs = useMemo(() => {
    if (!rfqs) return [];

    return rfqs.filter((rfq) => {
      const matchesSearch = rfq.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rfq.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || rfq.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [rfqs, searchTerm, statusFilter]);

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

  return (
    <ClientPageContainer
      title="RFQ Management"
      description="Manage your Request for Quotations and track vendor responses"
      headerActions={
        <Button 
          size="lg" 
          className="w-full md:w-auto gap-2"
          onClick={() => navigate('/rfqs/create')}
        >
          <Plus className="h-4 w-4" />
          Create New RFQ
        </Button>
      }
    >

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total RFQs"
          value={metrics.total}
          icon={FileText}
          trend={{ value: 15, label: "vs last month", isPositive: true }}
        />
        <MetricCard
          title="Published"
          value={metrics.published}
          icon={TrendingUp}
          trend={{ value: 5, label: "this week", isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="In Progress"
          value={metrics.in_progress}
          icon={Users}
          variant="default"
        />
        <MetricCard
          title="Draft"
          value={metrics.draft}
          icon={Edit2}
          variant="warning"
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="evaluation">Evaluation</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || statusFilter !== "all") && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filteredRFQs.length} of {metrics.total} RFQs</span>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* RFQs Grid */}
      {filteredRFQs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRFQs.map((rfq) => (
            <RFQCard
              key={rfq.id}
              rfq={rfq}
              showActions={true}
              onEdit={() => navigate(`/rfqs/${rfq.id}/edit`)}
              onView={() => navigate(`/rfqs/${rfq.id}`)}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm || statusFilter !== "all" ? "No RFQs found" : "Create Your First RFQ"}
            </h3>
            
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search criteria or filters to find what you're looking for" 
                : "Create your first Request for Quotation to get competitive bids from qualified vendors"}
            </p>

            {!searchTerm && statusFilter === "all" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-w-2xl mx-auto mb-6">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Structured procurement</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Transparent bidding</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Easy comparison</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full md:w-auto gap-2"
                  onClick={() => navigate('/rfqs/create')}
                >
                  <Plus className="h-4 w-4" />
                  Create Your First RFQ
                </Button>
              </div>
            )}

            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
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

export default RFQManagement;