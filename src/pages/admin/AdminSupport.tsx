import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Ticket, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User,
  Search,
  Filter,
  Download,
  UserCheck,
  TrendingUp,
  Timer,
  Star,
  MoreHorizontal,
  FileText,
  Calendar,
  Users,
  Activity,
  Target,
  BookOpen,
  Zap,
  MessageCircle,
  Eye,
  Edit3,
  Trash2,
  UserPlus,
  ArrowUpDown,
  RefreshCw
} from "lucide-react";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNavigate } from "react-router-dom";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";
import { DataExporter } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  const { toast } = useToast();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalTickets: 0,
    avgResponseTime: 0,
    resolutionRate: 0,
    satisfactionScore: 0,
    urgentTickets: 0,
    overdueTickets: 0
  });

  // Fetch admin users for assignment
  useEffect(() => {
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

    fetchAdminUsers();
  }, []);

  // Calculate analytics
  useEffect(() => {
    const calculateAnalytics = () => {
      const total = tickets.length;
      const urgent = tickets.filter(t => t.priority === 'urgent').length;
      const closed = tickets.filter(t => t.status === 'closed').length;
      const overdue = tickets.filter(t => {
        const createdDate = new Date(t.created_at);
        const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        return t.status !== 'closed' && daysSinceCreated > 2; // Consider 2+ days as overdue
      }).length;

      const avgResponse = tickets.length > 0 ? 
        tickets.reduce((acc, ticket) => {
          const created = new Date(ticket.created_at);
          const updated = new Date(ticket.updated_at);
          return acc + (updated.getTime() - created.getTime());
        }, 0) / tickets.length / (1000 * 60 * 60) : 0; // in hours

      setAnalyticsData({
        totalTickets: total,
        avgResponseTime: Math.round(avgResponse * 10) / 10,
        resolutionRate: total > 0 ? Math.round((closed / total) * 100) : 0,
        satisfactionScore: 4.2, // Mock score - would come from actual feedback
        urgentTickets: urgent,
        overdueTickets: overdue
      });
    };

    calculateAnalytics();
  }, [tickets]);

  // Redirect non-admins
  useEffect(() => {
    if (!loading && userProfile?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [userProfile, loading, navigate]);

  if (loading) {
    return <LoadingSpinner label={t('common.loading')} />;
  }

  if (userProfile?.role !== 'admin') {
    return null;
  }

  // Filter and sort tickets
  const filteredTickets = tickets
    .filter(ticket => {
      const matchesSearch = 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user_profiles?.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    })
    .sort((a, b) => {
      const aVal = sortBy === 'created_at' ? new Date(a.created_at).getTime() :
                   sortBy === 'priority' ? getPriorityValue(a.priority) :
                   sortBy === 'status' ? a.status :
                   a.subject;
      const bVal = sortBy === 'created_at' ? new Date(b.created_at).getTime() :
                   sortBy === 'priority' ? getPriorityValue(b.priority) :
                   sortBy === 'status' ? b.status :
                   b.subject;
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

  // Group tickets by status
  const openTickets = filteredTickets.filter(t => t.status === 'open');
  const inProgressTickets = filteredTickets.filter(t => t.status === 'in_progress');
  const closedTickets = filteredTickets.filter(t => t.status === 'closed');

  const getPriorityValue = (priority: string): number => {
    switch (priority) {
      case 'urgent': return 4;
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-destructive';
      case 'in_progress': return 'text-warning';
      case 'closed': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    await updateTicketStatus(ticketId, newStatus);
    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${newStatus}`,
    });
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedTickets.length === 0) return;
    
    try {
      await Promise.all(
        selectedTickets.map(ticketId => updateTicketStatus(ticketId, status))
      );
      
      toast({
        title: "Bulk Update Complete",
        description: `Updated ${selectedTickets.length} tickets to ${status}`,
      });
      
      setSelectedTickets([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tickets",
        variant: "destructive",
      });
    }
  };

  const handleBulkAssign = async (adminId: string) => {
    if (selectedTickets.length === 0) return;
    
    try {
      await Promise.all(
        selectedTickets.map(ticketId => assignTicket(ticketId, adminId))
      );
      
      toast({
        title: "Bulk Assignment Complete",
        description: `Assigned ${selectedTickets.length} tickets`,
      });
      
      setSelectedTickets([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign tickets",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTickets.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .in('id', selectedTickets);
      
      if (error) throw error;
      
      toast({
        title: "Tickets Deleted",
        description: `Deleted ${selectedTickets.length} tickets`,
      });
      
      setSelectedTickets([]);
      // Refresh tickets would happen via real-time subscription
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tickets",
        variant: "destructive",
      });
    }
  };

  const handleViewConversation = (ticket: any) => {
    navigate(`/messages?ticket=${ticket.id}`);
  };

  const handleExportTickets = () => {
    try {
      DataExporter.exportTicketsData(filteredTickets);
      toast({
        title: "Export Complete",
        description: "Tickets data has been exported successfully",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export tickets data",
        variant: "destructive",
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const toggleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const getResponseTime = (ticket: any) => {
    const created = new Date(ticket.created_at);
    const updated = new Date(ticket.updated_at);
    const diffHours = Math.floor((updated.getTime() - created.getTime()) / (1000 * 60 * 60));
    return diffHours;
  };

  const isOverdue = (ticket: any) => {
    const created = new Date(ticket.created_at);
    const daysSinceCreated = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
    return ticket.status !== 'closed' && daysSinceCreated > 2;
  };

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive ticket management and customer support analytics
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

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalTickets}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Timer className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.avgResponseTime}h</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">Tickets resolved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.satisfactionScore}/5</div>
            <p className="text-xs text-muted-foreground">Customer rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <Zap className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{analyticsData.urgentTickets}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{analyticsData.overdueTickets}</div>
            <p className="text-xs text-muted-foreground">Past SLA</p>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Ticket Management
            </CardTitle>
            <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportTickets}
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <div className="relative">
              <Search className={cn("absolute top-3 h-4 w-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
              <Input
                placeholder="Search tickets, users, emails..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="account">Account</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="subject">Subject</SelectItem>
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
          {selectedTickets.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedTickets.length} ticket{selectedTickets.length > 1 ? 's' : ''} selected
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
                    <DropdownMenuItem onClick={() => handleBulkStatusChange('open')}>
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange('in_progress')}>
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange('closed')}>
                      Closed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign To
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {adminUsers.map(admin => (
                      <DropdownMenuItem 
                        key={admin.id}
                        onClick={() => handleBulkAssign(admin.user_id)}
                      >
                        <Avatar className="h-4 w-4 mr-2">
                          <AvatarImage src={admin.avatar_url} />
                          <AvatarFallback>{admin.full_name?.[0] || admin.email[0]}</AvatarFallback>
                        </Avatar>
                        {admin.full_name || admin.email}
                      </DropdownMenuItem>
                    ))}
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
                      <AlertDialogTitle>Delete Tickets</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedTickets.length} selected ticket{selectedTickets.length > 1 ? 's' : ''}? 
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
                      checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className={isOverdue(ticket) ? 'bg-red-50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={() => toggleSelectTicket(ticket.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{ticket.subject}</div>
                        <div className="text-sm text-muted-foreground">#{ticket.id.slice(0, 8)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={ticket.user_profiles?.avatar_url} />
                          <AvatarFallback>
                            {ticket.user_profiles?.full_name?.[0] || ticket.user_profiles?.email[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">
                            {ticket.user_profiles?.full_name || ticket.user_profiles?.company_name || 'Unknown'}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {ticket.user_profiles?.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn("flex items-center gap-1", getStatusColor(ticket.status))}>
                        {getStatusIcon(ticket.status)}
                        <span className="capitalize text-sm">{ticket.status.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {ticket.assigned_admin ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={ticket.assigned_admin?.avatar_url} />
                            <AvatarFallback>
                              {ticket.assigned_admin?.full_name?.[0] || ticket.assigned_admin?.email[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate max-w-20">
                            {ticket.assigned_admin?.full_name || ticket.assigned_admin?.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {getResponseTime(ticket)}h
                        {isOverdue(ticket) && (
                          <Badge variant="destructive" className="ml-1 text-xs">Overdue</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(new Date(ticket.created_at))}
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
                          <DropdownMenuItem onClick={() => handleViewConversation(ticket)}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            View Conversation
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'in_progress')}>
                            <Clock className="h-4 w-4 mr-2" />
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, 'closed')}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Close Ticket
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Ticket
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this ticket? This action cannot be undone.
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
            
            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No tickets found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({filteredTickets.length})</TabsTrigger>
            <TabsTrigger value="open">Open ({openTickets.length})</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress ({inProgressTickets.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedTickets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredTickets.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No tickets found</p>
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
      )}
    </div>
  );

  // TicketCard component for card view
  function TicketCard({ ticket }: { ticket: any }) {
    return (
      <Card className={cn("hover:shadow-md transition-shadow", isOverdue(ticket) && "border-destructive")}>
        <CardHeader className="pb-3">
          <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
            <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
              <CardTitle className={cn("text-lg flex items-center gap-2", isRTL && "flex-row-reverse justify-end")}>
                <Checkbox
                  checked={selectedTickets.includes(ticket.id)}
                  onCheckedChange={() => toggleSelectTicket(ticket.id)}
                  className="mr-2"
                />
                {getStatusIcon(ticket.status)}
                {ticket.subject}
                {isOverdue(ticket) && (
                  <Badge variant="destructive" className="ml-2">Overdue</Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                <span className={cn("flex items-center gap-2 text-sm", isRTL && "flex-row-reverse justify-end")}>
                  <User className="h-3 w-3" />
                  {ticket.user_profiles?.full_name || ticket.user_profiles?.company_name || 'Unknown User'}
                  <span>•</span>
                  <span>{ticket.user_profiles?.email}</span>
                  <span>•</span>
                  <span>{getResponseTime(ticket)}h response time</span>
                </span>
              </CardDescription>
            </div>
            <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
              <Badge variant={getPriorityColor(ticket.priority)}>
                {ticket.priority}
              </Badge>
              <Badge variant="outline">
                {ticket.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-4", isRTL ? "text-right" : "text-left")}>
              <div className="text-sm text-muted-foreground">
                Created: {formatDate(new Date(ticket.created_at))}
              </div>
              {ticket.assigned_admin && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ticket.assigned_admin?.avatar_url} />
                    <AvatarFallback>
                      {ticket.assigned_admin?.full_name?.[0] || ticket.assigned_admin?.email[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    Assigned to {ticket.assigned_admin?.full_name || ticket.assigned_admin?.email}
                  </span>
                </div>
              )}
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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewConversation(ticket)}
                className={cn("flex items-center", isRTL && "flex-row-reverse")}
              >
                <MessageSquare className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                View
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleViewConversation(ticket)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Ticket
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
};
