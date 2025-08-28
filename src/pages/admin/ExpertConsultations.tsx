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
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
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
      
      showSuccess(`Updated ${selectedConsultations.length} consultation(s)`);
      setSelectedConsultations([]);
      await fetchConsultations();
    } catch (error) {
      showError('Failed to update consultations');
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
      
      showSuccess(`Deleted ${selectedConsultations.length} consultation(s)`);
      setSelectedConsultations([]);
      await fetchConsultations();
    } catch (error) {
      showError('Failed to delete consultations');
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

      showSuccess('Consultation scheduled successfully');
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
      ['Name', 'Email', 'Company', 'Event Type', 'Status', 'Created Date', 'Message'],
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
            <h1 className="text-3xl font-bold">Expert Consultations</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive consultation management and customer engagement analytics
            </p>
          </div>
          <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
            <Button 
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button 
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Cards
            </Button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalConsultations}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{analyticsData.pendingConsultations}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{analyticsData.scheduledConsultations}</div>
              <p className="text-xs text-muted-foreground">Active bookings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{analyticsData.completedConsultations}</div>
              <p className="text-xs text-muted-foreground">Successfully finished</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <Timer className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.avgResponseTime}h</div>
              <p className="text-xs text-muted-foreground">Response time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">Completion rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card>
          <CardHeader>
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Consultation Management
              </CardTitle>
              <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportConsultations}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
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
                  placeholder="Search consultations, names, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(isRTL ? "pr-10" : "pl-10")}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Created</SelectItem>
                  <SelectItem value="full_name">Name</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="event_type">Event Type</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedConsultations.length > 0 && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">
                  {selectedConsultations.length} consultation{selectedConsultations.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2 ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Change Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange('pending')}>
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange('scheduled')}>
                        Scheduled
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange('completed')}>
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkStatusChange('cancelled')}>
                        Cancelled
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Consultations</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {selectedConsultations.length} selected consultation{selectedConsultations.length > 1 ? 's' : ''}? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
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
                    <TableHead>Client</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
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
                          <span className="capitalize text-sm">{consultation.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{consultation.company || 'N/A'}</span>
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
                              Email only
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {consultation.scheduled_date ? 
                            formatDateString(consultation.scheduled_date) : 
                            'Not scheduled'
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedConsultation(consultation)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateConsultationStatus(consultation.id, 'scheduled')}>
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateConsultationStatus(consultation.id, 'completed')}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateConsultationStatus(consultation.id, 'cancelled')}>
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Consultation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this consultation? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleBulkDelete()}>Delete</AlertDialogAction>
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
                  <p className="text-muted-foreground">No consultations found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({filteredConsultations.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingConsultations.length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({scheduledConsultations.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedConsultations.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({cancelledConsultations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredConsultations.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No consultations found</p>
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
              <DialogTitle>Consultation Details</DialogTitle>
              <DialogDescription>
                Complete information about the consultation request
              </DialogDescription>
            </DialogHeader>
            {selectedConsultation && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Client Name</Label>
                    <p className="text-sm font-medium">{selectedConsultation.full_name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm">{selectedConsultation.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm">{selectedConsultation.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Company</Label>
                    <p className="text-sm">{selectedConsultation.company || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Event Type</Label>
                    <Badge variant="outline">{selectedConsultation.event_type}</Badge>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={getStatusBadgeVariant(selectedConsultation.status)}>
                      {selectedConsultation.status}
                    </Badge>
                  </div>
                </div>
                
                {selectedConsultation.event_description && (
                  <div>
                    <Label>Event Description</Label>
                    <p className="text-sm bg-muted p-2 rounded">{selectedConsultation.event_description}</p>
                  </div>
                )}
                
                <div>
                  <Label>Message</Label>
                  <p className="text-sm bg-muted p-2 rounded">{selectedConsultation.message}</p>
                </div>
                
                {selectedConsultation.notes && (
                  <div>
                    <Label>Admin Notes</Label>
                    <p className="text-sm bg-muted p-2 rounded">{selectedConsultation.notes}</p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => updateConsultationStatus(selectedConsultation.id, 'scheduled')}>
                    Schedule
                  </Button>
                  <Button variant="outline" onClick={() => updateConsultationStatus(selectedConsultation.id, 'completed')}>
                    Complete
                  </Button>
                  <Button variant="destructive" onClick={() => updateConsultationStatus(selectedConsultation.id, 'cancelled')}>
                    Cancel
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
                {consultation.status}
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
                Created: {formatDateString(consultation.created_at)}
              </span>
            </div>
            
            {consultation.scheduled_date && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Scheduled: {formatDateString(consultation.scheduled_date)}
                </span>
              </div>
            )}
            
            <div className="bg-muted p-2 rounded text-sm">
              <strong>Message:</strong> {consultation.message}
            </div>
            
            {consultation.notes && (
              <div className="bg-blue-50 p-2 rounded text-sm">
                <strong>Admin Notes:</strong> {consultation.notes}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              onClick={() => setSelectedConsultation(consultation)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {consultation.status === 'pending' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateConsultationStatus(consultation.id, 'scheduled')}
                >
                  Schedule
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateConsultationStatus(consultation.id, 'cancelled')}
                >
                  Cancel
                </Button>
              </>
            )}
            {consultation.status === 'scheduled' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateConsultationStatus(consultation.id, 'completed')}
              >
                Complete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
};