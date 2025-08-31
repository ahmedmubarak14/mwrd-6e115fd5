
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, UserCheck, UserX, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BulkUserActions } from "./BulkUserActions";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";
import { DataErrorBoundary } from "./DataErrorBoundary";
import { ResponsiveDataTable } from "./ResponsiveDataTable";

export const AdvancedUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: t('common.error'),
          description: t('common.fetchError'),
          variant: "destructive",
        });
        return;
      }

      if (data) {
        // Cast to any to avoid type issues, then transform to proper UserProfile
        const rawUsers = data as any[];
        const transformedUsers: UserProfile[] = rawUsers.map(user => ({
          id: user.id,
          user_id: user.user_id || user.id,
          email: user.email,
          full_name: user.full_name,
          company_name: user.company_name,
          role: user.role,
          status: user.status || 'pending',
          avatar_url: user.avatar_url,
          phone: user.phone,
          address: user.address,
          bio: user.bio,
          portfolio_url: user.portfolio_url,
          verification_documents: user.verification_documents || [],
          categories: user.categories || [],
          subscription_plan: user.subscription_plan || 'free',
          subscription_status: user.subscription_status || 'inactive',
          subscription_expires_at: user.subscription_expires_at,
          verification_status: user.verification_status || 'pending',
          verification_notes: user.verification_notes,
          verified_at: user.verified_at,
          verified_by: user.verified_by,
          created_at: user.created_at,
          updated_at: user.updated_at
        }));
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t('common.error'),
        description: t('common.fetchError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const updateUserStatus = async (userId: string, newStatus: 'pending' | 'approved' | 'blocked' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newStatus as any })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user status:', error);
        toast({
          title: t('common.error'),
          description: t('common.updateError'),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t('common.success'),
        description: t('common.updateSuccess'),
      });

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: t('common.error'),
        description: t('common.updateError'),
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'client' | 'vendor') => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        toast({
          title: t('common.error'),
          description: t('common.updateError'),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t('common.success'),
        description: t('common.updateSuccess'),
      });

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: t('common.error'),
        description: t('common.updateError'),
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      blocked: "destructive",
      rejected: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {t(`users.${status}`)}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "destructive",
      client: "default",
      vendor: "secondary"
    } as const;

    return (
      <Badge variant={variants[role as keyof typeof variants] || "secondary"}>
        {t(`users.${role}`)}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'user',
      title: t('admin.userDetails.user'),
      render: (value: any, user: UserProfile) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center admin-caption font-medium">
            {user.full_name?.[0] || user.email?.[0] || 'U'}
          </div>
          <div>
            <p className="admin-body font-medium text-foreground">{user.full_name || 'No Name'}</p>
            <p className="admin-caption text-foreground opacity-80">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'company_name',
      title: t('admin.userDetails.company'),
      render: (value: string) => (
        <span className="text-foreground">{value || t('common.notSpecified')}</span>
      )
    },
    {
      key: 'role',
      title: t('admin.userDetails.role'),
      render: (value: string) => (
        <Badge variant="outline" className="capitalize text-foreground border-border">
          {t(`admin.userDetails.${value}`) || value}
        </Badge>
      )
    },
    {
      key: 'status',
      title: t('admin.userDetails.status'),
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'created_at',
      title: t('admin.userDetails.joinedDate'),
      render: (value: string) => (
        <span className="text-foreground">{new Date(value).toLocaleDateString()}</span>
      )
    }
  ];

  const actions = [
    {
      label: t('common.edit'),
      onClick: (user: UserProfile) => {
      toast({
        title: t('admin.users.editUser'),
        description: `${t('admin.users.editing')} ${user.full_name || user.email}`
      });
      }
    },
    {
      label: t('common.delete'),
      variant: 'destructive' as const,
      onClick: (user: UserProfile) => {
      toast({
        title: t('admin.users.deleteUser'),
        description: `${t('admin.users.deleting')} ${user.full_name || user.email}`,
        variant: 'destructive'
      });
      }
    }
  ];

  if (loading) {
    return (
      <ResponsiveDataTable
        data={[]}
        columns={columns}
        loading={true}
        title={t('admin.userDetails.title')}
        description={t('admin.userDetails.description')}
      />
    );
  }

  return (
    <DataErrorBoundary 
      title={t('common.errors.userManagement')}
      description="Failed to load user data. Please try again."
      onRetry={fetchUsers}
    >
      <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
        <ResponsiveDataTable
          data={filteredUsers}
          columns={columns}
          actions={actions}
          selectable={true}
          selectedRows={selectedUsers}
          onSelectionChange={setSelectedUsers}
          getRowId={(user) => user.id}
          searchValue={searchTerm}
          onSearch={setSearchTerm}
          searchPlaceholder={t('admin.userDetails.searchPlaceholder')}
          paginated={true}
          pageSize={10}
          exportable={true}
          onExport={() => {
            toast({
              title: t('admin.users.exportUsers'),
              description: t('admin.users.exportSuccess')
            });
          }}
          title={t('admin.userDetails.title')}
          description={t('admin.userDetails.description')}
          emptyMessage={t('admin.userDetails.noUsers')}
          className="w-full"
        />
      </div>
    </DataErrorBoundary>
  );
};
