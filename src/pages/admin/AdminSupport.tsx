import { useState, useEffect } from 'react';
import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Clock, User, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  assigned_admin_id?: string;
  user_profiles?: {
    full_name: string;
    email: string;
  };
}

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [response, setResponse] = useState('');
  const { toast } = useToast();
  
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch user profiles separately and merge
      const ticketsWithProfiles = await Promise.all(
        (data || []).map(async (ticket) => {
          let userProfile = null;
          if (ticket.user_id) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('full_name, email')
              .eq('user_id', ticket.user_id)
              .single();
            userProfile = profile;
          }
          
          return {
            ...ticket,
            priority: ticket.priority as 'low' | 'medium' | 'high',
            status: ticket.status as 'open' | 'in_progress' | 'resolved' | 'closed',
            user_profiles: userProfile
          };
        })
      );
      
      setTickets(ticketsWithProfiles);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: t('admin.support.error'),
        description: t('admin.support.fetchError'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status })
        .eq('id', ticketId);

      if (error) throw error;
      
      await fetchTickets();
      toast({
        title: t('admin.support.success'),
        description: t('admin.support.updateSuccess')
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: t('admin.support.error'),
        description: t('admin.support.updateError'),
        variant: 'destructive'
      });
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user_profiles?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'outline';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <AdminPageContainer title={t('admin.support.title')} description={t('admin.support.description')}>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <AdminPageContainer title={t('admin.support.title')} description={t('admin.support.description')}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.support.totalTickets')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.support.openTickets')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {tickets.filter(t => t.status === 'open').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.support.inProgress')}</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {tickets.filter(t => t.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.support.resolved')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {tickets.filter(t => t.status === 'resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('admin.support.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t('admin.support.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.support.allStatus')}</SelectItem>
                <SelectItem value="open">{t('admin.support.open')}</SelectItem>
                <SelectItem value="in_progress">{t('admin.support.inProgress')}</SelectItem>
                <SelectItem value="resolved">{t('admin.support.resolved')}</SelectItem>
                <SelectItem value="closed">{t('admin.support.closed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">{t('admin.support.noTicketsFound')}</p>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? t('admin.support.adjustSearchFilters')
                  : t('admin.support.allTicketsAppearHere')
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                      <Badge variant={getStatusBadgeVariant(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{ticket.user_profiles?.full_name || ticket.user_profiles?.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{t('admin.support.created')}: {new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm">{t('admin.support.category')}: {ticket.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          {t('admin.support.viewDetails')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{t('admin.support.ticketDetails')}</DialogTitle>
                          <DialogDescription>
                            {t('admin.support.manageTicket')}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedTicket && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">{t('admin.support.status')}</label>
                                <Select 
                                  value={selectedTicket.status} 
                                  onValueChange={(value) => updateTicketStatus(selectedTicket.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">{t('admin.support.open')}</SelectItem>
                                    <SelectItem value="in_progress">{t('admin.support.inProgress')}</SelectItem>
                                    <SelectItem value="resolved">{t('admin.support.resolved')}</SelectItem>
                                    <SelectItem value="closed">{t('admin.support.closed')}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium">{t('admin.support.priority')}</label>
                                <Badge variant={getPriorityBadgeVariant(selectedTicket.priority)} className="ml-2">
                                  {t(`admin.support.${selectedTicket.priority}`)}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">{t('admin.support.customer')}</label>
                              <p className="text-sm text-muted-foreground">
                                {selectedTicket.user_profiles?.full_name || selectedTicket.user_profiles?.email}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">{t('admin.support.addResponse')}</label>
                              <Textarea
                                placeholder={t('admin.support.responsePlaceholder')}
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                rows={4}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setResponse('')}>
                                {t('admin.support.clear')}
                              </Button>
                              <Button onClick={() => {
                                toast({
                                  title: t('admin.support.responseSent'),
                                  description: t('admin.support.customerNotified')
                                });
                                setResponse('');
                              }}>
                                {t('admin.support.sendResponse')}
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    {ticket.status === 'open' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                      >
                        {t('admin.support.takeTicket')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </AdminPageContainer>
    </div>
  );
}