import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface ExtendedUserProfile {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  role: 'client' | 'supplier' | 'admin';
  created_at: string;
  avatar_url?: string;
  last_seen?: string;
  subscription_status?: string;
  total_requests?: number;
  total_offers?: number;
  total_spent?: number;
}

interface UserAction {
  type: 'suspend' | 'unsuspend' | 'change_role' | 'send_notification';
  userId: string;
  reason?: string;
  newRole?: string;
  message?: string;
}

export const AdvancedUserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<ExtendedUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<UserAction | null>(null);
  const [bulkSelectedUsers, setBulkSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch user profiles with additional data
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Enhance user data with subscription and activity information
      const enhancedUsers = await Promise.all(
        (profiles || []).map(async (user) => {
          // Get subscription status
          const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get request count
          const { count: requestCount } = await supabase
            .from('requests')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

          // Get offer count
          const { count: offerCount } = await supabase
            .from('offers')
            .select('*', { count: 'exact', head: true })
            .eq('supplier_id', user.id);

          return {
            ...user,
            role: user.role as 'client' | 'supplier' | 'admin',
            subscription_status: subscription?.status || 'none',
            total_requests: requestCount || 0,
            total_offers: offerCount || 0,
            total_spent: 0 // TODO: Calculate from financial_transactions
          };
        })
      );

      setUsers(enhancedUsers);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action: UserAction) => {
    try {
      switch (action.type) {
        case 'change_role':
          const { error: roleError } = await supabase
            .from('user_profiles')
            .update({ role: action.newRole })
            .eq('id', action.userId);
          
          if (roleError) throw roleError;
          
          toast({
            title: "Success",
            description: "User role updated successfully.",
          });
          break;

        case 'send_notification':
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              user_id: action.userId,
              type: 'admin_message',
              title: 'Message from Admin',
              message: action.message,
              category: 'system',
              priority: 'high'
            });

          if (notificationError) throw notificationError;

          toast({
            title: "Success",
            description: "Notification sent successfully.",
          });
          break;

        default:
          toast({
            title: "Info",
            description: "Action completed successfully.",
          });
      }

      setIsActionDialogOpen(false);
      setCurrentAction(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Company', 'Created At', 'Subscription Status', 'Total Requests', 'Total Offers'],
      ...filteredUsers.map(user => [
        user.full_name || '',
        user.email,
        user.role,
        user.company_name || '',
        user.created_at,
        user.subscription_status || '',
        user.total_requests?.toString() || '0',
        user.total_offers?.toString() || '0'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.subscription_status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getSubscriptionBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'trialing': return 'secondary';
      case 'past_due': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'supplier': return 'secondary';
      case 'client': return 'default';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Advanced User Management</h3>
          <p className="text-sm text-muted-foreground">Comprehensive user management with advanced features</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="client">Clients</SelectItem>
            <SelectItem value="supplier">Suppliers</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trialing">Trialing</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="none">No Subscription</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">User List</TabsTrigger>
          <TabsTrigger value="analytics">User Analytics</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{user.full_name || 'No Name'}</h4>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subscription:</span>
                    <Badge variant={getSubscriptionBadgeVariant(user.subscription_status || 'none')}>
                      {user.subscription_status || 'none'}
                    </Badge>
                  </div>
                  
                  {user.company_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.company_name}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-medium">{user.total_requests}</div>
                      <div className="text-muted-foreground">Requests</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="font-medium">{user.total_offers}</div>
                      <div className="text-muted-foreground">Offers</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentAction({
                          type: 'send_notification',
                          userId: user.id
                        });
                        setIsActionDialogOpen(true);
                      }}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentAction({
                          type: 'change_role',
                          userId: user.id
                        });
                        setIsActionDialogOpen(true);
                      }}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>User engagement and behavior analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                User analytics dashboard will be implemented here.
                <br />
                This will include user engagement metrics, retention rates, and behavioral insights.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
              <CardDescription>Perform actions on multiple users simultaneously</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Bulk actions interface will be implemented here.
                <br />
                This will allow selecting multiple users and performing batch operations.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAction?.type === 'send_notification' && 'Send Notification'}
              {currentAction?.type === 'change_role' && 'Change User Role'}
            </DialogTitle>
            <DialogDescription>
              {currentAction?.type === 'send_notification' && 'Send a notification to the selected user'}
              {currentAction?.type === 'change_role' && 'Change the role of the selected user'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {currentAction?.type === 'send_notification' && (
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message..."
                  value={currentAction.message || ''}
                  onChange={(e) => setCurrentAction({ ...currentAction, message: e.target.value })}
                />
              </div>
            )}

            {currentAction?.type === 'change_role' && (
              <div>
                <Label htmlFor="role">New Role</Label>
                <Select
                  value={currentAction.newRole || ''}
                  onValueChange={(value) => setCurrentAction({ ...currentAction, newRole: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select new role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setIsActionDialogOpen(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => currentAction && handleUserAction(currentAction)} 
                className="flex-1"
                disabled={
                  (currentAction?.type === 'send_notification' && !currentAction.message) ||
                  (currentAction?.type === 'change_role' && !currentAction.newRole)
                }
              >
                Execute Action
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};