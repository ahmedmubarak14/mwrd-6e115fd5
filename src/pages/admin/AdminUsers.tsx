
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
import { format } from "date-fns";
import { Users, UserCheck, Clock, TrendingUp, Download, RefreshCw, UserPlus, Mail, Shield, FileCheck, UserCog } from "lucide-react";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VerificationQueue } from "@/components/admin/VerificationQueue";

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkRole, setBulkRole] = useState<string>("");
  const [bulkStatus, setBulkStatus] = useState<string>("");
  const [bulkLoading, setBulkLoading] = useState(false);
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
          title: "Error",
          description: "Failed to fetch users data",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our interface
      const transformedUsers: User[] = (data || []).map(user => ({
        id: user.id,
        user_id: user.user_id,
        full_name: user.full_name || 'No name',
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
        title: "Error",
        description: "Failed to fetch users data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleExport = () => {
    const csvContent = [
      'User ID,Name,Email,Role,Status,Verification,Company,Phone,Created Date',
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
      title: "Export completed",
      description: "Users data has been exported to CSV",
    });
  };

  const handleRefresh = () => {
    fetchUsers();
    toast({
      title: "Data refreshed",
      description: "Users data has been updated",
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
        title: "Success",
        description: `Updated role for ${selectedUsers.length} users`,
      });

      fetchUsers();
      setSelectedUsers([]);
      setBulkRole("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user roles",
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
        title: "Success",
        description: `Updated status for ${selectedUsers.length} users`,
      });

      fetchUsers();
      setSelectedUsers([]);
      setBulkStatus("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExportSelected = () => {
    const exportUsers = filteredUsers.filter(user => selectedUsers.includes(user.id));
    const csvContent = [
      'User ID,Name,Email,Role,Status,Verification,Company,Phone,Created Date',
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
      title: "Export completed",
      description: `Exported ${selectedUsers.length} selected users`,
    });
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
    <AdminPageContainer
      title="User Management"
      description="Manage users, roles, and permissions across the platform"
    >
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">All registered users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">Approved & active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUsers.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">Awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">Admin accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Bulk Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
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
                    Select All ({selectedCount} selected)
                  </label>
                </div>

                {selectedCount > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex gap-2">
                      <Select value={bulkRole} onValueChange={setBulkRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
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
                            Update Role
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
                            <AlertDialogDescription>
                              Update role to "{bulkRole}" for {selectedCount} selected users?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkRoleUpdate}>
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="flex gap-2">
                      <Select value={bulkStatus} onValueChange={setBulkStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
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
                            Update Status
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
                            <AlertDialogDescription>
                              Update status to "{bulkStatus}" for {selectedCount} selected users?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkStatusUpdate}>
                              Confirm
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
                      Export Selected
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Users and Verification Queue */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Verification Queue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No users found</h3>
                    <p className="text-muted-foreground">No users match your current filters</p>
                  </CardContent>
                </Card>
              ) : (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                          />
                          <Users className="h-5 w-5 text-foreground" />
                          <div>
                            <CardTitle className="text-lg">
                              {user.full_name}
                            </CardTitle>
                            <p className="text-sm text-foreground opacity-75">
                              {user.company_name ? `${user.company_name} • ` : ''}{user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">
                              Verification: {user.verification_status}
                            </span>
                          </div>
                        </div>
                        <span className="text-foreground opacity-75">
                          Joined: {format(new Date(user.created_at), 'MMM dd, yyyy')}
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
        </Tabs>
      </div>
    </AdminPageContainer>
  );
}
