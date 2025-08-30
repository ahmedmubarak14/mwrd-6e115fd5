
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Users, UserCheck, Clock, TrendingUp, Download, RefreshCw, UserPlus, Mail, Shield, FileCheck, UserCog, Edit, Trash2, BarChart3, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VerificationQueue } from "@/components/admin/VerificationQueue";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'client' | 'vendor';
  status: 'pending' | 'approved' | 'blocked' | 'rejected';
  verification_status: 'pending' | 'approved' | 'rejected' | 'under_review';
  company_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminUsers() {
  const languageContext = useOptionalLanguage();
  const { t, isRTL, formatDate } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false,
    formatDate: (date: Date) => date.toLocaleDateString()
  };
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkRole, setBulkRole] = useState<string>("");
  const [bulkStatus, setBulkStatus] = useState<string>("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    role: "client" as 'admin' | 'client' | 'vendor',
    company_name: "",
    phone: ""
  });
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    newThisMonth: 0,
    activeThisWeek: 0,
    growthRate: 0
  });
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch real users from Supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: t('common.error'),
          description: t('admin.fetchUsersError') || "Failed to fetch users data",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our interface
      const transformedUsers: User[] = (data || []).map(user => ({
        id: user.id,
        user_id: user.user_id,
        full_name: user.full_name || t('admin.userDetails.noName'),
        email: user.email,
        role: user.role,
        status: user.status,
        verification_status: (user.verification_status as User['verification_status']) || 'pending',
        company_name: user.company_name,
        phone: user.phone,
        created_at: user.created_at,
        updated_at: user.updated_at
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t('common.error'),
        description: t('admin.fetchUsersError') || "Failed to fetch users data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Get current month users
      const { data: newThisMonth } = await supabase
        .from('user_profiles')
        .select('id')
        .gte('created_at', monthStart.toISOString());

      // Get active users this week (based on recent updates)
      const { data: activeThisWeek } = await supabase
        .from('user_profiles')
        .select('id')
        .gte('updated_at', weekStart.toISOString());

      // Get last month users for growth calculation
      const { data: lastMonthUsers } = await supabase
        .from('user_profiles')
        .select('id')
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString());

      const growthRate = lastMonthUsers?.length 
        ? ((newThisMonth?.length || 0) - lastMonthUsers.length) / lastMonthUsers.length * 100
        : 0;

      setAnalytics({
        totalUsers: users.length,
        newThisMonth: newThisMonth?.length || 0,
        activeThisWeek: activeThisWeek?.length || 0,
        growthRate: Math.round(growthRate * 100) / 100
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    const csvContent = [
      t('admin.csvHeaders'),
      ...filteredUsers.map(user => 
        `${user.id},${user.full_name},${user.email},${user.role},${user.status},${user.verification_status},${user.company_name || ''},${user.phone || ''},${format(new Date(user.created_at), 'yyyy-MM-dd')}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: t('common.exportCompleted'),
      description: t('admin.exportDescription') || "Users data has been exported to CSV",
    });
  };

  const handleRefresh = () => {
    fetchUsers();
    toast({
      title: t('common.dataRefreshed'),
      description: t('admin.dataUpdated') || "Users data has been updated",
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBulkRoleUpdate = async () => {
    if (!bulkRole || selectedUsers.length === 0) return;

    setBulkLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: bulkRole as 'admin' | 'client' | 'vendor' })
        .in('id', selectedUsers);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('admin.bulkRoleUpdateSuccess').replace('{count}', selectedUsers.length.toString()),
      });

      fetchUsers();
      setSelectedUsers([]);
      setBulkRole("");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('admin.bulkRoleUpdateError'),
        variant: "destructive",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedUsers.length === 0) return;

    setBulkLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: bulkStatus as 'pending' | 'approved' | 'blocked' | 'rejected' })
        .in('id', selectedUsers);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('admin.bulkStatusUpdateSuccess').replace('{count}', selectedUsers.length.toString()),
      });

      fetchUsers();
      setSelectedUsers([]);
      setBulkStatus("");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('admin.bulkStatusUpdateError'),
        variant: "destructive",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExportSelected = () => {
    const exportUsers = filteredUsers.filter(user => selectedUsers.includes(user.id));
    const csvContent = [
      t('admin.csvHeaders'),
      ...exportUsers.map(user => 
        `${user.id},${user.full_name},${user.email},${user.role},${user.status},${user.verification_status},${user.company_name || ''},${user.phone || ''},${format(new Date(user.created_at), 'yyyy-MM-dd')}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected-users-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: t('common.exportCompleted'),
      description: t('admin.exportSelectedSuccess').replace('{count}', selectedUsers.length.toString()),
    });
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.full_name) {
        toast({
          title: t('common.error'),
          description: t('admin.fillRequiredFields'),
          variant: "destructive",
        });
      return;
    }

    try {
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', newUser.email)
        .single();

      if (existingUser) {
        toast({
          title: t('common.error'),
          description: t('admin.userExistsError'),
          variant: "destructive",
        });
        return;
      }

      // Create the user profile directly (since we don't have auth user creation in this context)
      const { error } = await supabase
        .from('user_profiles')
        .insert([{
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
          company_name: newUser.company_name,
          phone: newUser.phone,
          status: 'pending',
          verification_status: 'pending',
          user_id: crypto.randomUUID() // Generate a temporary UUID
        }]);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('admin.userAddedSuccess'),
      });

      setIsAddUserOpen(false);
      setNewUser({
        full_name: "",
        email: "",
        role: "client",
        company_name: "",
        phone: ""
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: editingUser.full_name,
          email: editingUser.email,
          role: editingUser.role,
          status: editingUser.status,
          company_name: editingUser.company_name,
          phone: editingUser.phone
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('admin.userUpdatedSuccess'),
      });

      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('admin.userDeletedSuccess').replace('{name}', userName),
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "secondary",
      blocked: "destructive",
      rejected: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "destructive",
      vendor: "default", 
      client: "secondary"
    } as const;

    return (
      <Badge variant={variants[role as keyof typeof variants] || "secondary"}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  // Calculate metrics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'approved').length;
  const pendingUsers = users.filter(user => user.status === 'pending').length;
  const adminUsers = users.filter(user => user.role === 'admin').length;

  const filteredUsers = users.filter(user => {
    const searchMatch = searchTerm === "" || 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const roleMatch = roleFilter === "all" || user.role === roleFilter;
    const statusMatch = statusFilter === "all" || user.status === statusFilter;
    
    return searchMatch && roleMatch && statusMatch;
  });

  const selectedCount = selectedUsers.length;
  const allSelected = selectedCount === filteredUsers.length && filteredUsers.length > 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={cn("p-6 space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          {t('admin.userManagement')}
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          {t('admin.userManagementDescription')}
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.totalUsers')}</CardTitle>
              <Users className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">{t('admin.allRegisteredUsers')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.activeUsers')}</CardTitle>
              <UserCheck className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">{t('admin.approvedUsers')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.pending')}</CardTitle>
              <Clock className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUsers.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">{t('admin.awaitingApproval')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.adminUsers')}</CardTitle>
              <Shield className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">{t('admin.systemAdministrators')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Bulk Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.filtersAndSearch')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-4">
              <Input
                placeholder={t('admin.searchUsers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.filterByRole')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.allRoles')}</SelectItem>
                  <SelectItem value="admin">{t('admin.admin')}</SelectItem>
                  <SelectItem value="vendor">{t('admin.vendor')}</SelectItem>
                  <SelectItem value="client">{t('admin.client')}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.allStatus')}</SelectItem>
                  <SelectItem value="approved">{t('admin.approved')}</SelectItem>
                  <SelectItem value="pending">{t('admin.pending')}</SelectItem>
                  <SelectItem value="blocked">{t('admin.blocked')}</SelectItem>
                  <SelectItem value="rejected">{t('admin.rejected')}</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('admin.refresh')}
              </Button>
              
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                {t('admin.exportUsers')}
              </Button>
              
              <Button variant="outline" onClick={() => setIsAddUserOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                {t('admin.addUser')}
              </Button>
            </div>

            {/* Bulk Actions */}
            {filteredUsers.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    {t('admin.selectAllUsers').replace('{count}', selectedCount.toString())}
                  </label>
                </div>

                {selectedCount > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                     <div className="flex flex-col sm:flex-row gap-2">
                        <Select value={bulkRole} onValueChange={setBulkRole}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.selectRole')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">{t('admin.client')}</SelectItem>
                            <SelectItem value="vendor">{t('admin.vendor')}</SelectItem>
                            <SelectItem value="admin">{t('admin.admin')}</SelectItem>
                          </SelectContent>
                        </Select>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={!bulkRole || bulkLoading}
                          >
                            <UserCog className="h-4 w-4 mr-2" />
                            {t('admin.updateRoleAction')}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('admin.bulkActionConfirm')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('admin.bulkRoleConfirm').replace('{role}', bulkRole).replace('{count}', selectedCount.toString())}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkRoleUpdate}>
                              {t('common.confirm')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Select value={bulkStatus} onValueChange={setBulkStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('admin.selectStatus')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">{t('admin.pendingStatus')}</SelectItem>
                            <SelectItem value="approved">{t('admin.approvedStatus')}</SelectItem>
                            <SelectItem value="blocked">{t('admin.blockedStatus')}</SelectItem>
                            <SelectItem value="rejected">{t('admin.rejectedStatus')}</SelectItem>
                          </SelectContent>
                        </Select>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={!bulkStatus || bulkLoading}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            {t('admin.updateStatusAction')}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('admin.bulkActionConfirm')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('admin.bulkStatusConfirm').replace('{status}', bulkStatus).replace('{count}', selectedCount.toString())}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkStatusUpdate}>
                              {t('common.confirm')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportSelected}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('admin.exportSelectedAction')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Users, Verification Queue, and Analytics */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('admin.users')}
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              {t('admin.verificationQueueTab')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t('admin.analyticsTab')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t('admin.noUsersFound')}</h3>
                    <p className="text-muted-foreground">{t('admin.noUsersMatchFilters')}</p>
                  </CardContent>
                </Card>
              ) : (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                     <CardHeader className="pb-3">
                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                         <div className="flex items-center gap-3">
                           <Checkbox
                             checked={selectedUsers.includes(user.id)}
                             onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                           />
                           <Users className="h-5 w-5 text-foreground" />
                           <div className="min-w-0 flex-1">
                             <CardTitle className="text-base sm:text-lg truncate">
                               {user.full_name}
                             </CardTitle>
                             <p className="text-sm text-foreground opacity-75 truncate">
                               {user.company_name ? `${user.company_name} • ` : ''}{user.email}
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
                           <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                             {getRoleBadge(user.role)}
                             {getStatusBadge(user.status)}
                           </div>
                           <div className="flex gap-1">
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => setEditingUser(user)}
                               className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3"
                             >
                               <Edit className="h-4 w-4" />
                               <span className="sr-only sm:not-sr-only sm:ml-2">{t('common.edit')}</span>
                             </Button>
                             <AlertDialog>
                               <AlertDialogTrigger asChild>
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3"
                                 >
                                   <Trash2 className="h-4 w-4" />
                                   <span className="sr-only sm:not-sr-only sm:ml-2">{t('common.delete')}</span>
                                 </Button>
                               </AlertDialogTrigger>
                            <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>{t('admin.deleteUserTitle')}</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   {t('admin.deleteUserConfirm').replace('{name}', user.full_name)}
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                 <AlertDialogAction
                                   onClick={() => handleDeleteUser(user.id, user.full_name)}
                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                 >
                                   {t('common.delete')}
                                 </AlertDialogAction>
                               </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                           </div>
                         </div>
                       </div>
                     </CardHeader>
                     <CardContent>
                       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                         <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                           {user.phone && (
                             <div className="flex items-center gap-2">
                               <span className="font-medium">{user.phone}</span>
                             </div>
                           )}
                           <div className="flex items-center gap-2">
                             <Mail className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">
                                {t('admin.verificationText').replace('{status}', user.verification_status)}
                              </span>
                           </div>
                         </div>
                          <span className="text-foreground opacity-75 text-xs sm:text-sm">
                            {t('admin.joinedText').replace('{date}', format(new Date(user.created_at), 'MMM dd, yyyy'))}
                          </span>
                       </div>
                     </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="verification">
            <VerificationQueue />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Enhanced Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('admin.newThisMonthAnalytics')}</CardTitle>
                    <TrendingUp className="h-4 w-4 text-foreground opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.newThisMonth}</div>
                    <p className="text-xs text-foreground opacity-75">{t('admin.usersRegisteredAnalytics')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('admin.activeThisWeekAnalytics')}</CardTitle>
                    <Activity className="h-4 w-4 text-foreground opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.activeThisWeek}</div>
                    <p className="text-xs text-foreground opacity-75">{t('admin.usersWithActivityAnalytics')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('admin.growthRateAnalytics')}</CardTitle>
                    <BarChart3 className="h-4 w-4 text-foreground opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.growthRate > 0 ? '+' : ''}{analytics.growthRate}%
                    </div>
                    <p className="text-xs text-foreground opacity-75">{t('admin.vsLastMonthAnalytics')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('admin.totalUsersAnalytics')}</CardTitle>
                    <Users className="h-4 w-4 text-foreground opacity-75" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalUsers}</div>
                    <p className="text-xs text-foreground opacity-75">{t('admin.allTimeAnalytics')}</p>
                  </CardContent>
                </Card>
              </div>

              {/* User Distribution by Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.userDistributionByRole')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{t('admin.clients')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{users.filter(u => u.role === 'client').length}</Badge>
                        <span className="text-sm text-foreground opacity-75">
                          {Math.round((users.filter(u => u.role === 'client').length / users.length) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('admin.vendors')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{users.filter(u => u.role === 'vendor').length}</Badge>
                        <span className="text-sm text-foreground opacity-75">
                          {Math.round((users.filter(u => u.role === 'vendor').length / users.length) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('admin.admins')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{users.filter(u => u.role === 'admin').length}</Badge>
                        <span className="text-sm text-foreground opacity-75">
                          {Math.round((users.filter(u => u.role === 'admin').length / users.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.userStatusOverview')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{t('admin.approvedStatus')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{users.filter(u => u.status === 'approved').length}</Badge>
                        <span className="text-sm text-foreground opacity-75">
                          {Math.round((users.filter(u => u.status === 'approved').length / users.length) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('admin.pendingStatus')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{users.filter(u => u.status === 'pending').length}</Badge>
                        <span className="text-sm text-foreground opacity-75">
                          {Math.round((users.filter(u => u.status === 'pending').length / users.length) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('admin.blockedStatus')}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">{users.filter(u => u.status === 'blocked').length}</Badge>
                        <span className="text-sm text-foreground opacity-75">
                          {Math.round((users.filter(u => u.status === 'blocked').length / users.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add User Modal */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.addNewUser')}</DialogTitle>
              <DialogDescription>
                {t('admin.addNewUserDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">{t('admin.fullNameRequired')}</Label>
                <Input
                  id="full_name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder={t('admin.enterFullName')}
                />
              </div>
              <div>
                <Label htmlFor="email">{t('admin.emailRequired')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder={t('admin.enterEmailAddress')}
                />
              </div>
              <div>
                <Label htmlFor="role">{t('admin.roleLabel')}</Label>
                <Select value={newUser.role} onValueChange={(value: 'admin' | 'client' | 'vendor') => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">{t('admin.clientRole')}</SelectItem>
                    <SelectItem value="vendor">{t('admin.vendorRole')}</SelectItem>
                    <SelectItem value="admin">{t('admin.adminRole')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="company_name">{t('admin.companyName')}</Label>
                <Input
                  id="company_name"
                  value={newUser.company_name}
                  onChange={(e) => setNewUser({ ...newUser, company_name: e.target.value })}
                  placeholder={t('admin.enterCompanyNameOptional')}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t('common.phone')}</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder={t('admin.enterPhoneOptional')}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddUser} className="flex-1">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('admin.addUser')}
                </Button>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.editUser')}</DialogTitle>
              <DialogDescription>
                {t('admin.editUserDescription')}
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit_full_name">{t('admin.editFullName')}</Label>
                  <Input
                    id="edit_full_name"
                    value={editingUser.full_name}
                    onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_email">{t('admin.editEmail')}</Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_role">{t('admin.editRole')}</Label>
                    <Select value={editingUser.role} onValueChange={(value: 'admin' | 'client' | 'vendor') => setEditingUser({ ...editingUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">{t('admin.clientRole')}</SelectItem>
                        <SelectItem value="vendor">{t('admin.vendorRole')}</SelectItem>
                        <SelectItem value="admin">{t('admin.adminRole')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_status">{t('admin.editStatus')}</Label>
                    <Select value={editingUser.status} onValueChange={(value: 'pending' | 'approved' | 'blocked' | 'rejected') => setEditingUser({ ...editingUser, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{t('admin.pendingStatus')}</SelectItem>
                        <SelectItem value="approved">{t('admin.approvedStatus')}</SelectItem>
                        <SelectItem value="blocked">{t('admin.blockedStatus')}</SelectItem>
                        <SelectItem value="rejected">{t('admin.rejectedStatus')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_company_name">{t('admin.editCompanyName')}</Label>
                  <Input
                    id="edit_company_name"
                    value={editingUser.company_name || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, company_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_phone">{t('admin.editPhone')}</Label>
                  <Input
                    id="edit_phone"
                    value={editingUser.phone || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleEditUser} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    {t('admin.updateUser')}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingUser(null)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
