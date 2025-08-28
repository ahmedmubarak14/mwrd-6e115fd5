import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Clock,
  TrendingUp,
  Download,
  RefreshCw,
  UserPlus,
  FileCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';
import { DataExporter } from '@/utils/exportUtils';
import { AddUserModal } from './AddUserModal';
import { AdvancedUserManagement } from './AdvancedUserManagement';
import { VerificationQueue } from './VerificationQueue';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingVerifications: number;
  newRegistrations: number;
  adminUsers: number;
  vendorUsers: number;
  clientUsers: number;
  blockedUsers: number;
}

export const UserManagementDashboard: React.FC = () => {
  const { showSuccess, showError } = useToastFeedback();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };
  
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    fetchUserStats();
  }, [selectedPeriod]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        showError(t('common.fetchError') || error.message);
        return;
      }

      if (users) {
        const now = new Date();
        const periodDays = parseInt(selectedPeriod);
        const periodStart = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

        const newRegistrations = users.filter(user => 
          new Date(user.created_at) >= periodStart
        ).length;

        setStats({
          totalUsers: users.length,
          activeUsers: users.filter(user => user.status === 'approved').length,
          pendingVerifications: users.filter(user => user.verification_status === 'pending').length,
          newRegistrations,
          adminUsers: users.filter(user => user.role === 'admin').length,
          vendorUsers: users.filter(user => user.role === 'vendor').length,
          clientUsers: users.filter(user => user.role === 'client').length,
          blockedUsers: users.filter(user => user.status === 'blocked').length,
        });
      }
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = async () => {
    setIsExporting(true);
    try {
      // Fetch all users for export
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!users || users.length === 0) {
        showError(t('admin.users.noUsersFound'));
        return;
      }

      DataExporter.exportUserData(users);
      showSuccess(t('admin.users.exportSuccess'));
    } catch (error: any) {
      showError(t('admin.users.exportError') || error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserStats();
      showSuccess(t('admin.users.refreshSuccess'));
    } catch (error: any) {
      showError(t('admin.users.refreshError') || error.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUserAdded = () => {
    fetchUserStats(); // Refresh stats after adding user
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Actions */}
      <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
        <div className={cn(isRTL ? "text-right" : "text-left")}>
          <h3 className="text-lg font-semibold">{t('admin.userManagement.management')}</h3>
          <p className="text-sm text-foreground/75">{t('admin.userManagement.manageDescription')}</p>
        </div>
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t('time.last7days')}</SelectItem>
              <SelectItem value="30">{t('time.last30days')}</SelectItem>
              <SelectItem value="90">{t('time.last3months')}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className={cn("gap-2", isRTL && "flex-row-reverse")}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            {t('common.refresh')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportUsers}
            disabled={isExporting}
            className={cn("gap-2", isRTL && "flex-row-reverse")}
          >
            <Download className="h-4 w-4" />
            {isExporting ? t('common.loading') : t('common.export')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddUserModal(true)}
            className={cn("gap-2", isRTL && "flex-row-reverse")}
          >
            <UserPlus className="h-4 w-4" />
            {t('admin.users.addUser')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-foreground/75">
              {t('admin.users.totalUsers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.users.activeUsers')}</CardTitle>
            <UserCheck className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-foreground/75">
              {t('admin.users.weeklyGrowth')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.users.pendingVerifications')}</CardTitle>
            <Clock className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingVerifications || 0}</div>
            <p className="text-xs text-foreground/75">
              {t('admin.users.awaitingVerification')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.users.newRegistrations')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-foreground/75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newRegistrations || 0}</div>
            <p className="text-xs text-foreground/75">
              {t('admin.users.thisWeek')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
          <TabsList>
            <TabsTrigger value="users" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <Users className="h-4 w-4" />
              {t('admin.users.user')}
            </TabsTrigger>
            <TabsTrigger value="verification" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <FileCheck className="h-4 w-4" />
              {t('admin.verification.queue')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <TrendingUp className="h-4 w-4" />
              {t('admin.analytics')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users">
          <AdvancedUserManagement />
        </TabsContent>

        <TabsContent value="verification">
          <VerificationQueue />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{t('admin.users.role')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground/75">{t('admin.users.admin')}</span>
                  <Badge variant="destructive">{stats?.adminUsers || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/75">{t('admin.users.vendor')}</span>
                  <Badge variant="secondary">{stats?.vendorUsers || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/75">{t('admin.users.client')}</span>
                  <Badge variant="outline">{stats?.clientUsers || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{t('admin.users.status')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground/75">{t('admin.users.approved')}</span>
                  <Badge variant="default">{stats?.activeUsers || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/75">{t('admin.users.pending')}</span>
                  <Badge variant="secondary">{stats?.pendingVerifications || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/75">{t('admin.users.blocked')}</span>
                  <Badge variant="destructive">{stats?.blockedUsers || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{t('admin.analytics')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-foreground/75 py-4">
                  {t('common.noResults')}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};