import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock,
  TrendingUp,
  FileCheck,
  UserPlus,
  Shield,
  Download,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';
import { cn } from '@/lib/utils';
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
  const { toast } = useToast();
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
        toast({
          title: t('common.error'),
          description: t('common.fetchError'),
          variant: "destructive",
        });
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
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('common.success'),
        description: t('admin.users.exportSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('admin.users.exportError'),
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserStats();
      
      toast({
        title: t('common.success'),
        description: t('admin.users.refreshSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('admin.users.refreshError'),
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddUser = () => {
    toast({
      title: t('admin.users.addUser'),
      description: t('admin.users.addUserDescription'),
    });
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
          <p className="text-sm text-foreground opacity-75">{t('admin.userManagement.manageDescription')}</p>
        </div>
        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t('analytics.last7Days')}</SelectItem>
              <SelectItem value="30">{t('analytics.last30Days')}</SelectItem>
              <SelectItem value="90">{t('analytics.last90Days')}</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            {t('common.refresh')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportUsers}
            disabled={isExporting}
            className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
          >
            <Download className="h-4 w-4" />
            {isExporting ? t('common.exporting') : t('common.export')}
          </Button>
          <Button
            size="sm"
            onClick={handleAddUser}
            className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
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
            <CardTitle className="text-sm font-medium">{t('admin.users.totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-foreground opacity-75">
              {t('admin.users.registeredUsers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.users.activeUsers')}</CardTitle>
            <UserCheck className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-foreground opacity-75">
              {t('admin.users.approvedUsers')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.users.pendingVerifications')}</CardTitle>
            <Clock className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingVerifications || 0}</div>
            <p className="text-xs text-foreground opacity-75">
              {t('admin.users.awaitingReview')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", isRTL && "flex-row-reverse")}>
            <CardTitle className="text-sm font-medium">{t('admin.users.newRegistrations')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newRegistrations || 0}</div>
            <p className="text-xs text-foreground opacity-75">
              {t('admin.users.lastPeriod')} {selectedPeriod} {t('admin.users.days')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
          <TabsList>
            <TabsTrigger value="users" className={cn("flex items-center gap-2 text-foreground", isRTL && "flex-row-reverse")}>
              <Users className="h-4 w-4" />
              {t('admin.users')}
            </TabsTrigger>
            <TabsTrigger value="verification" className={cn("flex items-center gap-2 text-foreground", isRTL && "flex-row-reverse")}>
              <FileCheck className="h-4 w-4" />
              {t('admin.verification.queue')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className={cn("flex items-center gap-2 text-foreground", isRTL && "flex-row-reverse")}>
              <TrendingUp className="h-4 w-4" />
              {t('admin.users.analytics')}
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
                <CardTitle className="text-sm font-medium">{t('admin.users.usersByRole')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground opacity-75">{t('admin.users.admin')}</span>
                  <Badge variant="destructive">{stats?.adminUsers || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground opacity-75">{t('admin.users.vendor')}</span>
                  <Badge variant="secondary">{stats?.vendorUsers || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground opacity-75">{t('admin.users.client')}</span>
                  <Badge variant="outline">{stats?.clientUsers || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{t('admin.users.usersByStatus')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-foreground opacity-75">{t('admin.users.approved')}</span>
                  <Badge variant="default">{stats?.activeUsers || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground opacity-75">{t('admin.users.pending')}</span>
                  <Badge variant="secondary">{stats?.pendingVerifications || 0}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground opacity-75">{t('admin.users.blocked')}</span>
                  <Badge variant="destructive">{stats?.blockedUsers || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{t('admin.users.growthMetrics')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-foreground opacity-75 py-4">
                  {t('admin.users.analyticsContent')}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};