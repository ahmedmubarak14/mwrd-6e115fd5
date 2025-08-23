import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Key,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useSearchParams } from "react-router-dom";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: 'client' | 'supplier' | 'admin';
  created_at: string;
  avatar_url?: string;
}

interface UserStats {
  total_users: number;
  total_clients: number;
  total_suppliers: number;
  total_admins: number;
}

export const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    full_name: "",
    company_name: "",
    role: "client" as 'client' | 'supplier' | 'admin'
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
    
    // Check if we should open the create user dialog
    if (searchParams.get('action') === 'create') {
      setIsAddUserOpen(true);
    }
  }, [searchParams]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data || []) as UserProfile[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_statistics');
      if (error) throw error;
      if (data && data.length > 0) {
        setStats({
          total_users: data[0].total_users,
          total_clients: data[0].total_clients,
          total_suppliers: data[0].total_vendors,
          total_admins: data[0].total_admins
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            email: newUser.email,
            full_name: newUser.full_name || null,
            company_name: newUser.company_name || null,
            role: newUser.role === 'supplier' ? 'vendor' : newUser.role as 'admin' | 'client' | 'vendor',
            status: 'approved',
            categories: [],
            verification_documents: [],
            subscription_plan: 'free',
            subscription_status: 'active'
          });

        if (profileError) throw profileError;

        toast({
          title: "Success",
          description: "User created successfully.",
        });

        setIsAddUserOpen(false);
        setNewUser({
          email: "",
          password: "",
          full_name: "",
          company_name: "",
          role: "client"
        });
        fetchStats();
        fetchUsers();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully.",
      });

      fetchStats();
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: selectedUser.email
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password reset email sent successfully.",
      });

      setIsResetPasswordOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'supplier': return 'default';
      case 'client': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Enhanced Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-lime text-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-20 h-20 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 sm:w-40 sm:h-40 lg:w-80 lg:h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-3">User Management</h1>
            <p className="text-sm sm:text-base lg:text-xl opacity-90 max-w-2xl leading-relaxed">
              Manage user accounts, roles, and permissions across the platform
            </p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg hover-scale text-sm sm:text-base">
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with specified role and details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Secure password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={newUser.company_name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Company Inc."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: 'client' | 'supplier' | 'admin') => 
                    setNewUser(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
            <CardHeader className="space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {stats.total_users}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
            <CardHeader className="space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Clients</CardTitle>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-lime/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-lime" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-lime to-accent bg-clip-text text-transparent">
                {stats.total_clients}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
            <CardHeader className="space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Suppliers</CardTitle>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                {stats.total_suppliers}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-card/70 backdrop-blur-sm hover-scale">
            <CardHeader className="space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Admins</CardTitle>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-lime bg-clip-text text-transparent">
                {stats.total_admins}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Filters */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Search className="h-5 w-5 text-primary" />
            </div>
            User List
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Search and filter users by role and other criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-sm sm:text-base bg-background/50 border-primary/20 focus:border-primary/50"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-48 h-12 bg-background/50 border-primary/20">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="supplier">Suppliers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Users List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 bg-background/50 gap-3 sm:gap-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm sm:text-base">{user.full_name || 'No name'}</h3>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.company_name && (
                      <p className="text-xs text-muted-foreground">{user.company_name}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-shrink-0">
                  <p className="text-xs text-muted-foreground self-start sm:self-auto">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="hover-scale w-full sm:w-auto">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setIsResetPasswordOpen(true);
                        }}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send a password reset email to {selectedUser?.email}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              Send Reset Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};