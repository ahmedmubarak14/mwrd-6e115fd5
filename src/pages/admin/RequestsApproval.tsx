
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min?: number;
  budget_max?: number;
  currency: string;
  deadline?: string;
  urgency: string;
  admin_approval_status: string;
  created_at: string;
  user_profiles?: any;
}

export const RequestsApproval = () => {
  const { t, isRTL, formatCurrency } = useLanguage();
  const { showSuccess, showError } = useToastFeedback();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          user_profiles!requests_user_id_fkey (
            full_name,
            email,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
        showError(t('error.general'));
        return;
      }

      const formattedRequests = (data || []).map(request => ({
        ...request,
        currency: request.currency || 'USD'
      }));
      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      showError(t('error.general'));
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ admin_approval_status: status })
        .eq('id', requestId);

      if (error) {
        showError(t('error.general'));
        return;
      }

      showSuccess(t('success.updated'));
      await fetchRequests();
    } catch (error) {
      showError(t('error.general'));
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === "" || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_profiles?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.admin_approval_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatBudget = (request: Request) => {
    if (!request.budget_min && !request.budget_max) return t('common.price');
    if (request.budget_min && request.budget_max) {
      return `${request.budget_min.toLocaleString()} - ${request.budget_max.toLocaleString()} ${request.currency}`;
    }
    return t('common.price');
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h1 className="text-3xl font-bold">{t('admin.requestsApproval')}</h1>
        <p className="text-muted-foreground">{t('admin.requestsApprovalDesc')}</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Filter className="h-5 w-5" />
            {t('common.filter')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={cn("absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
              <Input
                placeholder={t('common.search')}
                className={cn(isRTL ? "pr-10 text-right" : "pl-10 text-left")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.status')}</SelectItem>
                <SelectItem value="pending">{t('status.pending')}</SelectItem>
                <SelectItem value="approved">{t('status.approved')}</SelectItem>
                <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('search.noResults')}</h3>
              <p className="text-muted-foreground text-center">
                {t('search.noResults')}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={cn("flex justify-between items-start gap-4", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                    <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse justify-end")}>
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <Badge variant={getStatusBadgeVariant(request.admin_approval_status)}>
                        {t(`status.${request.admin_approval_status}`)}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {request.description}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <span className="text-muted-foreground">{t('common.name')}:</span>
                    <p className="font-medium">
                      {request.user_profiles?.full_name || request.user_profiles?.email}
                    </p>
                    {request.user_profiles?.company_name && (
                      <p className="text-muted-foreground text-xs">
                        {request.user_profiles.company_name}
                      </p>
                    )}
                  </div>
                  
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <span className="text-muted-foreground">{t('common.category')}:</span>
                    <p className="font-medium">{request.category}</p>
                    <span className="text-muted-foreground">{t('common.price')}:</span>
                    <p className="font-medium">{formatBudget(request)}</p>
                  </div>
                  
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <span className="text-muted-foreground">{t('requests.priority.high')}:</span>
                    <p className="font-medium">{request.urgency}</p>
                    <span className="text-muted-foreground">{t('common.date')}:</span>
                    <p className="font-medium">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              {request.admin_approval_status === 'pending' && (
                <CardContent className="pt-0">
                  <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                    <Button
                      size="sm"
                      onClick={() => updateRequestStatus(request.id, 'approved')}
                      className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t('status.approved')}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateRequestStatus(request.id, 'rejected')}
                      className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}
                    >
                      <XCircle className="h-4 w-4" />
                      {t('status.rejected')}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
