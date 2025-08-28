
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { supabase } from '@/integrations/supabase/client';
import { Users, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { cn } from "@/lib/utils";

export const SubscriptionManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToastFeedback();
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
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
    <div className={cn("space-y-6", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={cn(isRTL ? "text-right" : "text-left")}>
        <h3 className="text-lg font-semibold">{t('admin.subscriptions')}</h3>
        <p className="text-sm text-foreground opacity-75">{t('admin.subscriptionsDescription')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-foreground opacity-75">{t('analytics.registeredUsers')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('analytics.activeSubscriptions')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-foreground opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.subscription_status === 'active').length}
            </div>
            <p className="text-xs text-foreground opacity-75">{t('analytics.currentlyActive')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.userSubscriptions')}</CardTitle>
          <CardDescription>{t('admin.subscriptionsOverview')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className={cn("flex items-center justify-between p-4 border rounded-lg", isRTL && "flex-row-reverse")}>
                <div className={cn(isRTL ? "text-right" : "text-left")}>
                  <h4 className="font-medium">{user.full_name || user.email}</h4>
                  <p className="text-sm text-foreground opacity-75">{user.email}</p>
                </div>
                <div className={cn("flex items-center space-x-2", isRTL && "flex-row-reverse space-x-reverse")}>
                  <Badge variant={user.subscription_status === 'active' ? 'default' : 'secondary'}>
                    {user.subscription_plan} - {user.subscription_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
