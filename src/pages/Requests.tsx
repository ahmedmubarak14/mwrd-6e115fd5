
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRequests } from "@/hooks/useRequests";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequestDetailsModal } from "@/components/modals/RequestDetailsModal";
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
  TrendingUp
} from "lucide-react";
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
      active: requests.filter(r => r.status === 'active' || r.status === 'in_progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
      pending: requests.filter(r => r.status === 'new' || r.status === 'pending').length,
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
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t('nav.requests')}
          </h1>
          <p className="text-muted-foreground">
            {t('requests.description')}
          </p>
        </div>
        <Button 
          size="lg" 
          className="w-full md:w-auto gap-2"
          onClick={() => navigate('/requests/create')}
        >
          <Plus className="h-4 w-4" />
          {t('requests.createNew')}
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Requests"
          value={metrics.total}
          icon={FileText}
          trend="up"
          trendValue="15%"
        />
        <MetricCard
          title="Active Requests"
          value={metrics.active}
          icon={TrendingUp}
          trend="up"
          trendValue="5%"
          color="success"
        />
        <MetricCard
          title="Completed"
          value={metrics.completed}
          icon={CheckCircle}
          color="default"
        />
        <MetricCard
          title="Pending"
          value={metrics.pending}
          icon={AlertCircle}
          color="warning"
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
            <RequestDetailsModal
              key={request.id}
              request={request}
              userRole="client"
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    <Badge variant={
                      request.status === 'new' ? 'default' :
                      request.status === 'in_progress' ? 'secondary' :
                      request.status === 'completed' ? 'outline' : 'destructive'
                    }>
                      {request.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {request.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
              </Card>
            </RequestDetailsModal>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title={searchTerm || statusFilter !== "all" ? "No requests found" : t('requests.noRequests')}
          description={
            searchTerm || statusFilter !== "all"
              ? "Try adjusting your search criteria or filters"
              : t('requests.createFirst')
          }
          action={
            !searchTerm && statusFilter === "all" ? (
              <Button onClick={() => navigate('/requests/create')}>
                <Plus className="mr-2 h-4 w-4" />
                {t('requests.createNew')}
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
};

export default Requests;
