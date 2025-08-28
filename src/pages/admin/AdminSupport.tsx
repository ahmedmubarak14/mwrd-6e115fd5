import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Ticket, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User,
  Search,
  Filter,
  Download
} from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";
import { DataExporter } from "@/utils/exportUtils";

export const AdminSupport = () => {
  const { tickets, loading, updateTicketStatus, assignTicket } = useSupportTickets();
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { t, isRTL, formatDate } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false,
    formatDate: (date: Date) => date.toLocaleDateString()
  };
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Redirect non-admins
  useEffect(() => {
    if (!loading && userProfile?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [userProfile, loading, navigate]);

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  if (userProfile?.role !== 'admin') {
    return null;
  }

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user_profiles?.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Group tickets by status
  const openTickets = filteredTickets.filter(t => t.status === 'open');
  const inProgressTickets = filteredTickets.filter(t => t.status === 'in_progress');
  const closedTickets = filteredTickets.filter(t => t.status === 'closed');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      default: return <Ticket className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicketStatus(ticketId, newStatus);
  };

  const handleViewConversation = (ticket: any) => {
    // Navigate to messages with the conversation for this ticket
    navigate('/messages');
  };

  const handleExportTickets = () => {
    try {
      DataExporter.exportTicketsData(filteredTickets);
      // Remove the old toast, it's now handled in the export function
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const TicketCard = ({ ticket }: { ticket: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
          <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
            <CardTitle className={cn("text-lg flex items-center gap-2", isRTL && "flex-row-reverse justify-end")}>
              {getStatusIcon(ticket.status)}
              {ticket.subject}
            </CardTitle>
            <CardDescription className="mt-1">
              <div className={cn("flex items-center gap-2 text-sm", isRTL && "flex-row-reverse justify-end")}>
                <User className="h-3 w-3" />
                {ticket.user_profiles?.full_name || ticket.user_profiles?.company_name || t('admin.adminUser')}
                <span>•</span>
                <span>{ticket.user_profiles?.email}</span>
              </div>
            </CardDescription>
          </div>
          <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
            <Badge variant={getPriorityColor(ticket.priority)}>
              {t(`requests.priority.${ticket.priority}`)}
            </Badge>
            <Badge variant="outline">
              {ticket.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <div className={cn("text-sm text-foreground opacity-75", isRTL ? "text-right" : "text-left")}>
            {t('common.date')}: {formatDate(new Date(ticket.created_at))}
          </div>
          <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
            <Select
              value={ticket.status}
              onValueChange={(value) => handleStatusChange(ticket.id, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">{t('common.open')}</SelectItem>
                <SelectItem value="in_progress">{t('status.active')}</SelectItem>
                <SelectItem value="closed">{t('common.close')}</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewConversation(ticket)}
              className={cn("flex items-center", isRTL && "flex-row-reverse")}
            >
              <MessageSquare className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t('common.view')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h1 className="text-3xl font-bold">{t('admin.supportTickets')}</h1>
        <p className="text-foreground opacity-75 mt-2">
          {t('admin.supportTicketsDescription')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('common.open')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('status.active')}</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('status.completed')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {closedTickets.filter(t => 
                new Date(t.updated_at).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.supportTickets')}</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Filter className="h-5 w-5" />
            {t('common.filter')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className={cn("absolute top-3 h-4 w-4 text-foreground opacity-60", isRTL ? "right-3" : "left-3")} />
              <Input
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(isRTL ? "pr-10 text-right" : "pl-10 text-left")}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.status')}</SelectItem>
                <SelectItem value="open">{t('common.open')}</SelectItem>
                <SelectItem value="in_progress">{t('status.active')}</SelectItem>
                <SelectItem value="closed">{t('common.close')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('requests.priority.high')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('requests.priority.high')}</SelectItem>
                <SelectItem value="urgent">{t('requests.priority.high')}</SelectItem>
                <SelectItem value="high">{t('requests.priority.high')}</SelectItem>
                <SelectItem value="medium">{t('requests.priority.medium')}</SelectItem>
                <SelectItem value="low">{t('requests.priority.low')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.category')}</SelectItem>
                <SelectItem value="general">{t('common.info')}</SelectItem>
                <SelectItem value="technical">{t('common.info')}</SelectItem>
                <SelectItem value="billing">{t('common.info')}</SelectItem>
                <SelectItem value="account">{t('common.info')}</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('all');
              }}
            >
              {t('search.clearFilters')}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportTickets}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Tickets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('common.status')} ({filteredTickets.length})</TabsTrigger>
          <TabsTrigger value="open">{t('common.open')} ({openTickets.length})</TabsTrigger>
          <TabsTrigger value="in_progress">{t('status.active')} ({inProgressTickets.length})</TabsTrigger>
          <TabsTrigger value="closed">{t('common.close')} ({closedTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Ticket className="h-12 w-12 mx-auto mb-4 text-foreground opacity-60" />
                <p className="text-foreground opacity-75">{t('search.noResults')}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="open" className="space-y-4">
          <div className="grid gap-4">
            {openTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          <div className="grid gap-4">
            {inProgressTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          <div className="grid gap-4">
            {closedTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
