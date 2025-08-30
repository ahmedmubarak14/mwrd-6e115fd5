import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, Filter, MessageSquare, Calendar, User, Phone, Clock, CheckCircle, 
  AlertCircle, TrendingUp, Users, Building, DollarSign, Activity, Download, 
  RefreshCw, MoreHorizontal, Edit3, Trash2, Eye, UserPlus, FileText, BookOpen,
  Star, Zap, Target, Timer, ArrowUpDown, Mail, MapPin
} from "lucide-react";
import { useToastFeedback } from "@/hooks/useToastFeedback";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Consultation {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  event_type: string;
  event_description?: string;
  scheduled_date?: string;
  message: string;
  status: string;
  notes?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  user_profiles?: {
    full_name?: string;
    email?: string;
    company_name?: string;
    avatar_url?: string;
  };
}

export const ExpertConsultations = () => {
  const { t, isRTL, formatDate } = useLanguage();
  
  // Helper function to translate status
  const getTranslatedStatus = (status: string) => {
    return t(`expertConsultations.${status}`);
  };
  const { showSuccess, showError } = useToastFeedback();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedConsultations, setSelectedConsultations] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalConsultations: 0,
    pendingConsultations: 0,
    scheduledConsultations: 0,
    completedConsultations: 0,
    avgResponseTime: 0,
    conversionRate: 0
  });

  useEffect(() => {
    fetchConsultations();
    fetchAdminUsers();
  }, []);

  // Calculate analytics
  useEffect(() => {
    const calculateAnalytics = () => {
      const total = consultations.length;
      const pending = consultations.filter(c => c.status === 'pending').length;
      const scheduled = consultations.filter(c => c.status === 'scheduled').length;
      const completed = consultations.filter(c => c.status === 'completed').length;
      
      const avgResponse = consultations.length > 0 ? 
        consultations.reduce((acc, consultation) => {
          const created = new Date(consultation.created_at);
          const updated = new Date(consultation.updated_at);
          return acc + (updated.getTime() - created.getTime());
        }, 0) / consultations.length / (1000 * 60 * 60) : 0; // in hours

      const conversion = total > 0 ? Math.round((completed / total) * 100) : 0;

      setAnalyticsData({
        totalConsultations: total,
        pendingConsultations: pending,
        scheduledConsultations: scheduled,
        completedConsultations: completed,
        avgResponseTime: Math.round(avgResponse * 10) / 10,
        conversionRate: conversion
      });
    };

    calculateAnalytics();
  }, [consultations]);

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_id, full_name, email, avatar_url')
        .eq('role', 'admin')
        .eq('status', 'approved');
      
      if (!error && data) {
        setAdminUsers(data);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
    }
  };

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
            company_name,
            avatar_url
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

  const updateConsultationStatus = async (consultationId: string, status: string, notes?: string) => {
    try {
      const updateData: any = { status, updated_at: new Date().toISOString() };
      if (notes) updateData.notes = notes;

      const { error } = await supabase
        .from('expert_consultations')
        .update(updateData)
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

  const handleBulkStatusChange = async (status: string) => {
    if (selectedConsultations.length === 0) return;
    
    try {
      await Promise.all(
        selectedConsultations.map(id => 
          supabase
            .from('expert_consultations')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
        )
      );
      
        showSuccess(`${t('success.updated')} ${selectedConsultations.length} ${t('expertConsultations.updatedConsultations')}`);
        setSelectedConsultations([]);
        await fetchConsultations();
      } catch (error) {
        showError(t('expertConsultations.failedToUpdate'));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedConsultations.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('expert_consultations')
        .delete()
        .in('id', selectedConsultations);
      
      if (error) throw error;
      
      showSuccess(`${t('expertConsultations.deletedConsultationsCount').replace('{count}', selectedConsultations.length.toString())}`);
      setSelectedConsultations([]);
      await fetchConsultations();
    } catch (error) {
      showError(t('expertConsultations.deleteFailed'));
    }
  };

  const handleScheduleConsultation = async (consultationId: string, scheduledDate: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('expert_consultations')
        .update({ 
          status: 'scheduled', 
          scheduled_date: scheduledDate,
          notes: notes || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', consultationId);

      if (error) {
        showError(t('error.general'));
        return;
      }

      showSuccess(t('expertConsultations.scheduleSuccess'));
      await fetchConsultations();
    } catch (error) {
      showError(t('error.general'));
    }
  };

  const toggleSelectConsultation = (consultationId: string) => {
    setSelectedConsultations(prev => 
      prev.includes(consultationId)
        ? prev.filter(id => id !== consultationId)
        : [...prev, consultationId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedConsultations(
      selectedConsultations.length === filteredConsultations.length 
        ? [] 
        : filteredConsultations.map(c => c.id)
    );
  };

  const handleExportConsultations = () => {
    const csvContent = [
      [t('expertConsultations.csvName'), t('expertConsultations.csvEmail'), t('expertConsultations.csvCompany'), t('expertConsultations.csvEventType'), t('expertConsultations.csvStatus'), t('expertConsultations.csvCreatedDate'), t('expertConsultations.csvMessage')],
      ...filteredConsultations.map(c => [
        c.full_name,
        c.email,
        c.company || '',
        c.event_type,
        c.status,
        format(new Date(c.created_at), 'yyyy-MM-dd HH:mm'),
        c.message.replace(/,/g, ';') // Replace commas to avoid CSV issues
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expert-consultations-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = searchTerm === "" || 
      consultation.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || consultation.status === statusFilter;
    const matchesEventType = eventTypeFilter === "all" || consultation.event_type === eventTypeFilter;
    
    return matchesSearch && matchesStatus && matchesEventType;
  }).sort((a, b) => {
    const aVal = sortBy === 'created_at' ? new Date(a.created_at).getTime() :
                 sortBy === 'full_name' ? a.full_name :
                 sortBy === 'status' ? a.status :
                 sortBy === 'event_type' ? a.event_type :
                 a.full_name;
    
    const bVal = sortBy === 'created_at' ? new Date(b.created_at).getTime() :
                 sortBy === 'full_name' ? b.full_name :
                 sortBy === 'status' ? b.status :
                 sortBy === 'event_type' ? b.event_type :
                 b.full_name;
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  // Group consultations by status
  const pendingConsultations = filteredConsultations.filter(c => c.status === 'pending');
  const scheduledConsultations = filteredConsultations.filter(c => c.status === 'scheduled');
  const completedConsultations = filteredConsultations.filter(c => c.status === 'completed');
  const cancelledConsultations = filteredConsultations.filter(c => c.status === 'cancelled');

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-warning';
      case 'scheduled': return 'text-blue-500';
      case 'completed': return 'text-success';
      case 'cancelled': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const formatDateString = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <AdminPageContainer>
      <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
          <div className={cn(isRTL ? "text-right" : "text-left")}>
            <h1 className="text-3xl font-bold">{t('expertConsultations.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('expertConsultations.description')}
            </p>
          </div>
          <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('expertConsultations.table')}
            </Button>
            <Button 
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {t('expertConsultations.cards')}
            </Button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('expertConsultations.totalConsultations')}</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalConsultations}</div>
              <p className="text-xs text-muted-foreground">{t('expertConsultations.allTime')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('common.pending')}</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{analyticsData.pendingConsultations}</div>
              <p className="text-xs text-muted-foreground">{t('expertConsultations.awaitingResponse')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('common.scheduled')}</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{analyticsData.scheduledConsultations}</div>
              <p className="text-xs text-muted-foreground">{t('expertConsultations.activeBookings')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('common.completed')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{analyticsData.completedConsultations}</div>
              <p className="text-xs text-muted-foreground">{t('expertConsultations.successfullyFinished')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('expertConsultations.avgResponseTime')}</CardTitle>
              <Timer className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.avgResponseTime}{t('expertConsultations.hoursUnit')}</div>
              <p className="text-xs text-muted-foreground">{t('expertConsultations.responseTime')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('expertConsultations.conversionRate')}</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">{t('expertConsultations.completionRate')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card>
          <CardHeader>
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t('expertConsultations.consultationManagement')}
              </CardTitle>
              <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportConsultations}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t('expertConsultations.export')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('expertConsultations.refresh')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="relative">
                <Search className={cn("absolute top-3 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
                <Input
                  placeholder={t('expertConsultations.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(isRTL ? "pr-10" : "pl-10")}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('expertConsultations.status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('expertConsultations.allStatus')}</SelectItem>
                    <SelectItem value="pending">{t('expertConsultations.pending')}</SelectItem>
                    <SelectItem value="scheduled">{t('expertConsultations.scheduled')}</SelectItem>
                    <SelectItem value="completed">{t('expertConsultations.completed')}</SelectItem>
                    <SelectItem value="cancelled">{t('expertConsultations.cancelled')}</SelectItem>
                  </SelectContent>
              </Select>
              
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('expertConsultations.eventType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('expertConsultations.allEvents')}</SelectItem>
                    <SelectItem value="consultation">{t('expertConsultations.consultation')}</SelectItem>
                    <SelectItem value="meeting">{t('expertConsultations.meeting')}</SelectItem>
                    <SelectItem value="presentation">{t('expertConsultations.presentation')}</SelectItem>
                    <SelectItem value="workshop">{t('expertConsultations.workshop')}</SelectItem>
                  </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('expertConsultations.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">{t('expertConsultations.dateCreated')}</SelectItem>
                    <SelectItem value="full_name">{t('expertConsultations.name')}</SelectItem>
                    <SelectItem value="status">{t('expertConsultations.status')}</SelectItem>
                    <SelectItem value="event_type">{t('expertConsultations.eventType')}</SelectItem>
                  </SelectContent>
              </Select>
              
              <Button 
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === 'asc' ? t('expertConsultations.asc') : t('expertConsultations.desc')}
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedConsultations.length > 0 && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedConsultations.length} {selectedConsultations.length > 1 ? t('expertConsultations.consultationsSelected') : t('expertConsultations.consultationSelected')}
                </span>
                <div className="flex gap-2 ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {t('expertConsultations.changeStatus')}
                      </Button>
                    </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleBulkStatusChange('pending')}>
                          {t('expertConsultations.pending')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkStatusChange('scheduled')}>
                          {t('expertConsultations.scheduled')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkStatusChange('completed')}>
                          {t('expertConsultations.completed')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkStatusChange('cancelled')}>
                          {t('expertConsultations.cancelled')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('expertConsultations.delete')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('expertConsultations.deleteConsultations')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('expertConsultations.deleteConsultationConfirm')} {selectedConsultations.length} {selectedConsultations.length > 1 ? t('expertConsultations.consultationsSelected') : t('expertConsultations.consultationSelected')}? 
                          {t('expertConsultations.cannotUndo')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('expertConsultations.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>{t('expertConsultations.delete')}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        {viewMode === 'table' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedConsultations.length === filteredConsultations.length && filteredConsultations.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>{t('expertConsultations.fullName')}</TableHead>
                    <TableHead>{t('expertConsultations.eventType')}</TableHead>
                    <TableHead>{t('expertConsultations.status')}</TableHead>
                    <TableHead>{t('expertConsultations.company')}</TableHead>
                    <TableHead>{t('common.contact')}</TableHead>
                    <TableHead>{t('common.scheduledDate')}</TableHead>
                    <TableHead>{t('expertConsultations.createdAt')}</TableHead>
                    <TableHead className="w-12">{t('expertConsultations.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedConsultations.includes(consultation.id)}
                          onCheckedChange={() => toggleSelectConsultation(consultation.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={consultation.user_profiles?.avatar_url} />
                            <AvatarFallback>
                              {consultation.full_name[0] || consultation.email[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{consultation.full_name}</div>
                            <div className="text-sm text-muted-foreground truncate">{consultation.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{consultation.event_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className={cn("flex items-center gap-1", getStatusColor(consultation.status))}>
                          {getStatusIcon(consultation.status)}
                          <span className="capitalize text-sm">{getTranslatedStatus(consultation.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{consultation.company || t('expertConsultations.notProvided')}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {consultation.phone ? (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {consultation.phone}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {t('common.emailOnly')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {consultation.scheduled_date ? 
                            formatDateString(consultation.scheduled_date) : 
                            t('common.notScheduled')
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDateString(consultation.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('expertConsultations.actions')}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedConsultation(consultation)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t('expertConsultations.viewDetails')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateConsultationStatus(consultation.id, 'scheduled')}>
                              <Calendar className="h-4 w-4 mr-2" />
                              {t('expertConsultations.schedule')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateConsultationStatus(consultation.id, 'completed')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {t('expertConsultations.complete')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateConsultationStatus(consultation.id, 'cancelled')}>
                              <AlertCircle className="h-4 w-4 mr-2" />
                              {t('expertConsultations.cancel')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                               <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                   <Trash2 className="h-4 w-4 mr-2" />
                                   {t('expertConsultations.delete')}
                                 </DropdownMenuItem>
                               </AlertDialogTrigger>
                               <AlertDialogContent>
                                 <AlertDialogHeader>
                                   <AlertDialogTitle>{t('expertConsultations.deleteConsultationTitle')}</AlertDialogTitle>
                                   <AlertDialogDescription>
                                     {t('expertConsultations.deleteConsultationMessage')}
                                   </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                   <AlertDialogCancel>{t('expertConsultations.cancel')}</AlertDialogCancel>
                                   <AlertDialogAction onClick={() => handleBulkDelete()}>{t('expertConsultations.delete')}</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredConsultations.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{t('expertConsultations.noConsultationsFoundMessage')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">{t('expertConsultations.allTab')} ({filteredConsultations.length})</TabsTrigger>
              <TabsTrigger value="pending">{t('expertConsultations.pending')} ({pendingConsultations.length})</TabsTrigger>
              <TabsTrigger value="scheduled">{t('expertConsultations.scheduled')} ({scheduledConsultations.length})</TabsTrigger>
              <TabsTrigger value="completed">{t('expertConsultations.completed')} ({completedConsultations.length})</TabsTrigger>
              <TabsTrigger value="cancelled">{t('expertConsultations.cancelled')} ({cancelledConsultations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredConsultations.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{t('expertConsultations.noConsultationsFoundCard')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredConsultations.map((consultation) => (
                    <ConsultationCard key={consultation.id} consultation={consultation} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="grid gap-4">
                {pendingConsultations.map((consultation) => (
                  <ConsultationCard key={consultation.id} consultation={consultation} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <div className="grid gap-4">
                {scheduledConsultations.map((consultation) => (
                  <ConsultationCard key={consultation.id} consultation={consultation} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <div className="grid gap-4">
                {completedConsultations.map((consultation) => (
                  <ConsultationCard key={consultation.id} consultation={consultation} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              <div className="grid gap-4">
                {cancelledConsultations.map((consultation) => (
                  <ConsultationCard key={consultation.id} consultation={consultation} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Consultation Details Modal */}
        <Dialog open={!!selectedConsultation} onOpenChange={() => setSelectedConsultation(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('expertConsultations.consultationDetailsTitle')}</DialogTitle>
              <DialogDescription>
                {t('expertConsultations.consultationDetailsDescription')}
              </DialogDescription>
            </DialogHeader>
            {selectedConsultation && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('expertConsultations.clientName')}</Label>
                    <p className="text-sm font-medium">{selectedConsultation.full_name}</p>
                  </div>
                  <div>
                    <Label>{t('expertConsultations.email')}</Label>
                    <p className="text-sm">{selectedConsultation.email}</p>
                  </div>
                  <div>
                    <Label>{t('expertConsultations.clientPhone')}</Label>
                    <p className="text-sm">{selectedConsultation.phone || t('expertConsultations.notProvided')}</p>
                  </div>
                  <div>
                    <Label>{t('expertConsultations.clientCompany')}</Label>
                    <p className="text-sm">{selectedConsultation.company || t('expertConsultations.notProvided')}</p>
                  </div>
                  <div>
                    <Label>{t('expertConsultations.eventType')}</Label>
                    <Badge variant="outline">{selectedConsultation.event_type}</Badge>
                  </div>
                  <div>
                    <Label>{t('expertConsultations.status')}</Label>
                        <Badge variant={getStatusBadgeVariant(selectedConsultation.status)}>
                          {getTranslatedStatus(selectedConsultation.status)}
                        </Badge>
                  </div>
                </div>
                
                {selectedConsultation.event_description && (
                  <div>
                    <Label>{t('expertConsultations.eventDescription')}</Label>
                    <p className="text-sm bg-muted p-2 rounded">{selectedConsultation.event_description}</p>
                  </div>
                )}
                
                <div>
                  <Label>{t('expertConsultations.consultationMessage')}</Label>
                  <p className="text-sm bg-muted p-2 rounded">{selectedConsultation.message}</p>
                </div>
                
                {selectedConsultation.notes && (
                  <div>
                    <Label>{t('expertConsultations.modalAdminNotes')}</Label>
                    <p className="text-sm bg-muted p-2 rounded">{selectedConsultation.notes}</p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => updateConsultationStatus(selectedConsultation.id, 'scheduled')}>
                    {t('expertConsultations.schedule')}
                  </Button>
                  <Button variant="outline" onClick={() => updateConsultationStatus(selectedConsultation.id, 'completed')}>
                    {t('expertConsultations.complete')}
                  </Button>
                  <Button variant="destructive" onClick={() => updateConsultationStatus(selectedConsultation.id, 'cancelled')}>
                    {t('expertConsultations.cancel')}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageContainer>
  );

  // ConsultationCard component for card view
  function ConsultationCard({ consultation }: { consultation: Consultation }) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className={cn("flex justify-between items-start gap-4", isRTL && "flex-row-reverse")}>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={consultation.user_profiles?.avatar_url} />
                <AvatarFallback>
                  {consultation.full_name[0] || consultation.email[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{consultation.full_name}</CardTitle>
                <CardDescription>{consultation.email}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(consultation.status)}>
                {getTranslatedStatus(consultation.status)}
              </Badge>
              <Badge variant="outline">{consultation.event_type}</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {consultation.company && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{consultation.company}</span>
              </div>
            )}
            
            {consultation.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{consultation.phone}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {t('expertConsultations.created')} {formatDateString(consultation.created_at)}
              </span>
            </div>
            
            {consultation.scheduled_date && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {t('expertConsultations.scheduledCard')} {formatDateString(consultation.scheduled_date)}
                </span>
              </div>
            )}
            
            <div className="bg-muted p-2 rounded text-sm">
              <strong>{t('expertConsultations.messageLabel')}</strong> {consultation.message}
            </div>
            
            {consultation.notes && (
              <div className="bg-blue-50 p-2 rounded text-sm">
                <strong>{t('expertConsultations.adminNotesLabel')}</strong> {consultation.notes}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              onClick={() => setSelectedConsultation(consultation)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {t('expertConsultations.view')}
            </Button>
            {consultation.status === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateConsultationStatus(consultation.id, 'scheduled')}
                >
                  {t('expertConsultations.schedule')}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateConsultationStatus(consultation.id, 'cancelled')}
                >
                  {t('expertConsultations.cancel')}
                </Button>
              </>
            )}
            {consultation.status === 'scheduled' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateConsultationStatus(consultation.id, 'completed')}
              >
                {t('expertConsultations.complete')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
};