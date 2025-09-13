import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRealTimeRequests } from '@/hooks/useRealTimeRequests';
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
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const Requests = () => {
  const { t, formatDate, formatNumber } = useLanguage();
  const { requests, loading } = useRealTimeRequests();
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
      <div className="p-6 space-y-6">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="p-6 space-y-6">
        <Helmet>
          <title>{t('nav.requests')}</title>
          <meta name="description" content={t('requests.description')} />
          <link rel="canonical" href="/client/requests" />
        </Helmet>
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
              {t('nav.requests')}
            </h1>
            <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
              {t('requests.description')}
            </p>
          </div>
          <Button 
            size="lg" 
            className="w-full md:w-auto gap-2"
            onClick={() => navigate('/client/requests/create')}
          >
            <Plus className="h-4 w-4" />
            {t('requests.createNew')}
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title={t('requests.metrics.total')}
            value={metrics.total}
            icon={FileText}
            trend={{ value: 15, label: t('common.vsLastMonth'), isPositive: true }}
          />
          <MetricCard
            title={t('requests.metrics.active')}
            value={metrics.active}
            icon={TrendingUp}
            trend={{ value: 5, label: t('common.thisWeek'), isPositive: true }}
            variant="success"
          />
          <MetricCard
            title={t('requests.metrics.completed')}
            value={metrics.completed}
            icon={CheckCircle}
            variant="success"
          />
          <MetricCard
            title={t('requests.metrics.pending')}
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
              {t('requests.filters.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('requests.filters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('requests.filters.statusPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('requests.filters.statuses.all')}</SelectItem>
                  <SelectItem value="new">{t('requests.filters.statuses.new')}</SelectItem>
                  <SelectItem value="in_progress">{t('requests.filters.statuses.in_progress')}</SelectItem>
                  <SelectItem value="completed">{t('requests.filters.statuses.completed')}</SelectItem>
                  <SelectItem value="cancelled">{t('requests.filters.statuses.cancelled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || statusFilter !== "all") && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {t('requests.filters.showing')} {formatNumber(filteredRequests.length)} {t('requests.filters.of')} {formatNumber(metrics.total)} {t('requests.filters.requests')}
                </span>
                {(searchTerm || statusFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                  >
                    {t('requests.filters.clear')}
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
                        {request.status === 'new' ? t('requests.status.new') : request.status === 'in_progress' ? t('common.inProgress') : request.status === 'completed' ? t('common.completed') : request.status === 'cancelled' ? t('common.cancelled') : request.status}
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
                              {t('requests.card.viewDetails')}
                            </DropdownMenuItem>
                          </RequestDetailsModal>
                          <EditRequestModal request={request}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t('requests.card.editRequest')}
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
                        <span>{request.location || t('requests.card.notSpecified')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {request.deadline ? formatDate(new Date(request.deadline)) : t('requests.card.noDeadline')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(new Date(request.created_at))}</span>
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
                {searchTerm || statusFilter !== "all" ? t('requests.empty.noResultsTitle') : t('requests.empty.startTitle')}
              </h3>
              
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" 
                  ? t('requests.empty.noResultsDesc') 
                  : t('requests.empty.startDesc')}
              </p>

              {!searchTerm && statusFilter === "all" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-w-2xl mx-auto mb-6">
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>{t('requests.empty.features.match')}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>{t('requests.empty.features.offers')}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>{t('requests.empty.features.secure')}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate('/client/requests/create')} 
                    className="w-full md:w-auto gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t('requests.empty.createFirst')}
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
                  {t('requests.filters.clear')}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </HelmetProvider>
  );
};

export default Requests;