import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, MessageSquare, Calendar, User, Phone } from "lucide-react";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
  const { t, language } = useLanguage();
  const { showSuccess, showError } = useToastFeedback();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isRTL = language === 'ar';

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
        showError('Failed to load consultations');
        return;
      }

      setConsultations(data || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      showError('Failed to load consultations');
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
        showError('Failed to update consultation status');
        return;
      }

      showSuccess(`Consultation status updated to ${status}`);
      await fetchConsultations();
    } catch (error) {
      showError('Failed to update consultation status');
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expert Consultations</h1>
        <p className="text-muted-foreground">Manage consultation requests and appointments</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, company, event type..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
              <h3 className="text-lg font-semibold mb-2">No consultations found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredConsultations.map((consultation) => (
            <Card key={consultation.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{consultation.full_name}</CardTitle>
                      <Badge variant={getStatusBadgeVariant(consultation.status)}>
                        {consultation.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {consultation.event_type}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Contact:</span>
                    </div>
                    <p className="font-medium">{consultation.email}</p>
                    {consultation.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{consultation.phone}</span>
                      </div>
                    )}
                    {consultation.company && (
                      <p className="text-muted-foreground text-xs">{consultation.company}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Event Details:</span>
                    </div>
                    {consultation.event_date && (
                      <p className="font-medium">
                        {new Date(consultation.event_date).toLocaleDateString()}
                      </p>
                    )}
                    {consultation.location && (
                      <p className="text-sm text-muted-foreground">{consultation.location}</p>
                    )}
                    {consultation.budget_range && (
                      <p className="text-sm font-medium">Budget: {consultation.budget_range}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Message:</span>
                    <p className="text-sm bg-muted/50 p-2 rounded">{consultation.message}</p>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-4">
                  Submitted: {new Date(consultation.created_at).toLocaleDateString()}
                </div>
              </CardHeader>
              
              {consultation.status === 'pending' && (
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateConsultationStatus(consultation.id, 'scheduled')}
                    >
                      Mark as Scheduled
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateConsultationStatus(consultation.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              )}
              
              {consultation.status === 'scheduled' && (
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateConsultationStatus(consultation.id, 'completed')}
                    >
                      Mark as Completed
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