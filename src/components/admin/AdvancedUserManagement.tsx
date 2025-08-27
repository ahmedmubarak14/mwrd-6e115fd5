
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, UserCheck, UserX, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

export const AdvancedUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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
        // Transform the data to match our UserProfile interface by casting verification_status
        const transformedUsers: UserProfile[] = data.map(user => ({
          ...user,
          verification_status: user.verification_status as 'pending' | 'approved' | 'rejected' | 'under_review'
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
        .update({ status: newStatus })
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Users className="h-5 w-5" />
            {t('users.advancedManagement')}
          </CardTitle>
          <CardDescription className={cn(isRTL ? "text-right" : "text-left")}>
            {t('users.manageDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className={cn("flex flex-col sm:flex-row gap-4 mb-6", isRTL && "sm:flex-row-reverse")}>
            <div className="flex-1">
              <div className="relative">
                <Search className={cn("absolute top-2.5 h-4 w-4 text-muted-foreground", isRTL ? "right-2" : "left-2")} />
                <Input
                  placeholder={t('users.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(isRTL ? "pr-8" : "pl-8")}
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('users.filterByRole')}>
                  {roleFilter === "all" ? t('users.filterByRole') : t(`users.${roleFilter}`)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                <SelectItem value="all">{t('users.allRoles')}</SelectItem>
                <SelectItem value="client">{t('users.clients')}</SelectItem>
                <SelectItem value="vendor">{t('users.vendors')}</SelectItem>
                <SelectItem value="admin">{t('users.admins')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('users.filterByStatus')}>
                  {statusFilter === "all" ? t('users.filterByStatus') : t(`users.${statusFilter}`)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                <SelectItem value="all">{t('users.allStatus')}</SelectItem>
                <SelectItem value="pending">{t('users.pending')}</SelectItem>
                <SelectItem value="approved">{t('users.approved')}</SelectItem>
                <SelectItem value="blocked">{t('users.blocked')}</SelectItem>
                <SelectItem value="rejected">{t('users.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className={cn("font-semibold text-foreground", isRTL ? "text-right" : "text-left")}>{t('users.user')}</TableHead>
                  <TableHead className={cn("font-semibold text-foreground", isRTL ? "text-right" : "text-left")}>{t('users.role')}</TableHead>
                  <TableHead className={cn("font-semibold text-foreground", isRTL ? "text-right" : "text-left")}>{t('users.status')}</TableHead>
                  <TableHead className={cn("font-semibold text-foreground", isRTL ? "text-right" : "text-left")}>{t('users.verification')}</TableHead>
                  <TableHead className={cn("font-semibold text-foreground", isRTL ? "text-right" : "text-left")}>{t('users.created')}</TableHead>
                  <TableHead className={cn("font-semibold text-foreground", isRTL ? "text-right" : "text-left")}>{t('users.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className={cn(isRTL ? "text-right" : "text-left")}>
                        <div className="font-medium">
                          {user.full_name || user.email}
                        </div>
                        <div className="text-sm text-foreground/70">
                          {user.email}
                        </div>
                        {user.company_name && (
                          <div className="text-sm text-foreground/70">
                            {user.company_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                     <TableCell>
                       <Select
                         value={user.role}
                         onValueChange={(value) => updateUserRole(user.id, value as 'admin' | 'client' | 'vendor')}
                       >
                         <SelectTrigger className="w-[100px]">
                           <SelectValue>
                             {t(`users.${user.role}`) || user.role}
                           </SelectValue>
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-md z-50">
                           <SelectItem value="client">{t('users.client')}</SelectItem>
                           <SelectItem value="vendor">{t('users.vendor')}</SelectItem>
                           <SelectItem value="admin">{t('users.admin')}</SelectItem>
                         </SelectContent>
                       </Select>
                     </TableCell>
                     <TableCell>
                       <Select
                         value={user.status}
                         onValueChange={(value) => updateUserStatus(user.id, value as 'pending' | 'approved' | 'blocked' | 'rejected')}
                       >
                         <SelectTrigger className="w-[120px]">
                           <SelectValue>
                             {t(`users.${user.status}`) || user.status}
                           </SelectValue>
                         </SelectTrigger>
                         <SelectContent className="bg-background border shadow-md z-50">
                           <SelectItem value="pending">{t('users.pending')}</SelectItem>
                           <SelectItem value="approved">{t('users.approved')}</SelectItem>
                           <SelectItem value="blocked">{t('users.blocked')}</SelectItem>
                           <SelectItem value="rejected">{t('users.rejected')}</SelectItem>
                         </SelectContent>
                       </Select>
                     </TableCell>
                    <TableCell>
                      {getStatusBadge(user.verification_status || 'pending')}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateUserStatus(user.id, user.status === 'approved' ? 'blocked' : 'approved')}
                        >
                          {user.status === 'approved' ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className={cn("text-center py-8 text-foreground/60", isRTL ? "text-right" : "text-left")}>
              {t('users.noUsersFound')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
