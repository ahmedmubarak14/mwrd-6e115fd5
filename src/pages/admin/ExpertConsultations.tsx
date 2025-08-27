
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, MessageSquare, Calendar, User, Phone } from "lucide-react";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

interface Consultation {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  event_type: string;
  event_date?: string;
  budget_range?: string;
  location?: string;
  message: string;
  status: string;
  created_at: string;
  user_profiles?: any;
}

export const ExpertConsultations = () => {
  const languageContext = useOptionalLanguage();
  const { t, isRTL, formatDate } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false,
    formatDate: (date: Date) => date.toLocaleDateString()
  };
  const { showSuccess, showError } = useToastFeedback();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expert_consultations')
        .select(`
          *,
          user_profiles!expert_consultations_user_id_fkey (
            full_name,
            email,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching consultations:', error);
        showError(t('error.general'));
        return;
      }

      setConsultations(data || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      showError(t('error.general'));
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (consultationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('expert_consultations')
        .update({ status })
        .eq('id', consultationId);

      if (error) {
        showError(t('error.general'));
        return;
      }

      showSuccess(t('success.updated'));
      await fetchConsultations();
    } catch (error) {
      showError(t('error.general'));
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = searchTerm === "" || 
      consultation.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.event_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || consultation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h1 className="text-3xl font-bold">{t('admin.expertConsultations')}</h1>
        <p className="text-muted-foreground">{t('admin.expertConsultations')}</p>
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
                <SelectItem value="scheduled">{t('status.active')}</SelectItem>
                <SelectItem value="completed">{t('status.completed')}</SelectItem>
                <SelectItem value="cancelled">{t('status.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsultations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('search.noResults')}</h3>
              <p className="text-muted-foreground text-center">
                {t('search.noResults')}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredConsultations.map((consultation) => (
            <Card key={consultation.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={cn("flex justify-between items-start gap-4", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                    <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse justify-end")}>
                      <CardTitle className="text-lg">{consultation.full_name}</CardTitle>
                      <Badge variant={getStatusBadgeVariant(consultation.status)}>
                        {t(`status.${consultation.status}`)}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {consultation.event_type}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div className={cn("space-y-2", isRTL ? "text-right" : "text-left")}>
                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse justify-end")}>
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('vendors.contact')}:</span>
                    </div>
                    <p className="font-medium">{consultation.email}</p>
                    {consultation.phone && (
                      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse justify-end")}>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{consultation.phone}</span>
                      </div>
                    )}
                    {consultation.company && (
                      <p className="text-muted-foreground text-xs">{consultation.company}</p>
                    )}
                  </div>
                  
                  <div className={cn("space-y-2", isRTL ? "text-right" : "text-left")}>
                    <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse justify-end")}>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('common.details')}:</span>
                    </div>
                    {consultation.event_date && (
                      <p className="font-medium">
                        {formatDate(new Date(consultation.event_date))}
                      </p>
                    )}
                    {consultation.location && (
                      <p className="text-sm text-muted-foreground">{consultation.location}</p>
                    )}
                    {consultation.budget_range && (
                      <p className="text-sm font-medium">{t('common.price')}: {consultation.budget_range}</p>
                    )}
                  </div>
                  
                  <div className={cn("space-y-2", isRTL ? "text-right" : "text-left")}>
                    <span className="text-sm text-muted-foreground">{t('messages.title')}:</span>
                    <p className="text-sm bg-muted/50 p-2 rounded">{consultation.message}</p>
                  </div>
                </div>
                
                <div className={cn("text-xs text-muted-foreground mt-4", isRTL ? "text-right" : "text-left")}>
                  {t('common.date')}: {formatDate(new Date(consultation.created_at))}
                </div>
              </CardHeader>
              
              {consultation.status === 'pending' && (
                <CardContent className="pt-0">
                  <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                    <Button
                      size="sm"
                      onClick={() => updateConsultationStatus(consultation.id, 'scheduled')}
                    >
                      {t('status.active')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateConsultationStatus(consultation.id, 'cancelled')}
                    >
                      {t('status.cancelled')}
                    </Button>
                  </div>
                </CardContent>
              )}
              
              {consultation.status === 'scheduled' && (
                <CardContent className="pt-0">
                  <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                    <Button
                      size="sm"
                      onClick={() => updateConsultationStatus(consultation.id, 'completed')}
                    >
                      {t('status.completed')}
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
