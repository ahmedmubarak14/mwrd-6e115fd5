
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Users, UserCheck, Clock, TrendingUp, Download, RefreshCw, UserPlus, Mail, Shield } from "lucide-react";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Using mock data temporarily - replace with real Supabase query when ready
      const mockUsers: User[] = [
        {
          id: "user_001",
          user_id: "auth_1",
          full_name: "Ahmed Al-Rashid",
          email: "ahmed@example.com",
          role: "client",
          status: "approved",
          verification_status: "approved",
          company_name: "Al-Rashid Construction",
          phone: "+966501234567",
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "user_002",
          user_id: "auth_2",
          full_name: "Sara Mohammed",
          email: "sara@example.com", 
          role: "vendor",
          status: "approved",
          verification_status: "approved",
          company_name: "Sara Tech Solutions",
          phone: "+966502345678",
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "user_003",
          user_id: "auth_3",
          full_name: "Omar Hassan",
          email: "omar@example.com",
          role: "vendor",
          status: "pending",
          verification_status: "pending",
          company_name: "Hassan Engineering",
          phone: "+966503456789",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "user_004",
          user_id: "auth_4",
          full_name: "Fatima Ali",
          email: "fatima@example.com",
          role: "client",
          status: "blocked",
          verification_status: "rejected",
          company_name: "Ali Trading",
          phone: "+966504567890",
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "user_005",
          user_id: "auth_5",
          full_name: "System Admin",
          email: "admin@example.com",
          role: "admin",
          status: "approved",
          verification_status: "approved",
          phone: "+966505678901",
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
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

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          </CardContent>
        </Card>

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
      </div>
    </AdminPageContainer>
  );
}
