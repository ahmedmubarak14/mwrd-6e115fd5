
import { ClientPageContainer } from "@/components/layout/ClientPageContainer";
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRequests } from "@/hooks/useRequests";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequestDetailsModal } from "@/components/modals/RequestDetailsModal";
import { EditRequestModal } from "@/components/modals/EditRequestModal";
import { EmptyState } from "@/components/ui/empty-state";
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
  Edit,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Requests = () => {
  const { t } = useLanguage();
  const { requests, loading } = useRequests();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Request metrics
  const metrics = useMemo(() => {
    if (!requests) return { total: 0, active: 0, completed: 0, pending: 0 };
    
    return {
      total: requests.length,
      active: requests.filter(r => r.status === 'in_progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
      pending: requests.filter(r => r.status === 'new').length,
    };
  }, [requests]);

  // Filter requests based on search and status
  const filteredRequests = useMemo(() => {
    if (!requests) return [];

    return requests.filter((request) => {
      const matchesSearch = request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

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
      title={t('nav.requests')}
      description={t('requests.description')}
      headerActions={
        <Button 
          size="lg" 
          className="w-full md:w-auto gap-2"
          onClick={() => navigate('/requests/create')}
        >
          <Plus className="h-4 w-4" />
          {t('requests.createNew')}
        </Button>
      }
    >

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Requests"
          value={metrics.total}
          icon={FileText}
          trend={{ value: 15, label: "vs last month", isPositive: true }}
        />
        <MetricCard
          title="Active Requests"
          value={metrics.active}
          icon={TrendingUp}
          trend={{ value: 5, label: "this week", isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="Completed"
          value={metrics.completed}
          icon={CheckCircle}
          variant="success"
        />
        <MetricCard
          title="Pending"
          value={metrics.pending}
          icon={AlertCircle}
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
                  placeholder="Search requests..."
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchTerm || statusFilter !== "all") && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {filteredRequests.length} of {metrics.total} requests</span>
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

      {/* Requests Grid */}
      {filteredRequests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{request.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      request.status === 'new' ? 'default' :
                      request.status === 'in_progress' ? 'secondary' :
                      request.status === 'completed' ? 'outline' : 'destructive'
                    }>
                      {request.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <RequestDetailsModal request={request} userRole="client">
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            View Details
                          </DropdownMenuItem>
                        </RequestDetailsModal>
                        <EditRequestModal request={request}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Request
                          </DropdownMenuItem>
                        </EditRequestModal>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {request.description}
                </CardDescription>
              </CardHeader>
              <RequestDetailsModal request={request} userRole="client">
                <CardContent className="cursor-pointer">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{request.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{request.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {request.deadline ? format(new Date(request.deadline), 'MMM dd, yyyy') : 'No deadline'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(request.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </RequestDetailsModal>
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
              {searchTerm || statusFilter !== "all" ? "No requests found" : "Start Your First Request"}
            </h3>
            
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search criteria or filters to find what you're looking for" 
                : "Create your first procurement request to connect with qualified vendors and get competitive offers"}
            </p>

            {!searchTerm && statusFilter === "all" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-w-2xl mx-auto mb-6">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Fast vendor matching</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Competitive offers</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Secure transactions</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full md:w-auto gap-2"
                  onClick={() => navigate('/requests/create')}
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Request
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

export default Requests;
