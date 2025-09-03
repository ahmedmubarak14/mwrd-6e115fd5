import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileTabs } from '@/components/ui/mobile/MobileTabs';
import { PullToRefresh } from '@/components/ui/mobile/PullToRefresh';
import { MobileBottomNavSpacer } from '@/components/navigation/MobileBottomNav';
import { SwipeableCard, MessageSwipeCard } from '@/components/ui/mobile/SwipeableCard';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Plus,
  MessageSquare,
  Package,
  FileText,
  Users,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { useAutomatedTasks } from '@/hooks/useWorkflowAutomation';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { consoleCleanupGuide } from '@/utils/cleanupConsoleStats';

interface QuickStat {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<any>;
  color?: string;
}

export const MobileDashboard = () => {
  const { userProfile } = useAuth();
  const { notifications, loading: notificationsLoading } = useNotifications();
  const { tasks, loading: tasksLoading } = useAutomatedTasks();
  const { isMobile } = useMobileDetection();
  const logger = consoleCleanupGuide.createLogger('MobileDashboard');

  const handleRefresh = async () => {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  const getQuickStats = (): QuickStat[] => {
    if (userProfile?.role === 'admin') {
      return [
        { label: 'Active Users', value: '2.4K', change: '+12%', icon: Users, color: 'text-blue-500' },
        { label: 'Total Revenue', value: '$125K', change: '+8%', icon: DollarSign, color: 'text-green-500' },
        { label: 'Pending Tasks', value: tasks.filter(t => t.status === 'pending').length, icon: Clock, color: 'text-orange-500' },
        { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle, color: 'text-green-500' }
      ];
    } else if ((userProfile as any)?.role === 'supplier') {
      return [
        { label: 'Active Offers', value: '12', icon: Package, color: 'text-blue-500' },
        { label: 'Won Projects', value: '8', change: '+2', icon: CheckCircle, color: 'text-green-500' },
        { label: 'Pending', value: '4', icon: Clock, color: 'text-orange-500' },
        { label: 'Revenue', value: '$45K', change: '+15%', icon: DollarSign, color: 'text-green-500' }
      ];
    } else {
      return [
        { label: 'Active Requests', value: '6', icon: FileText, color: 'text-blue-500' },
        { label: 'Received Offers', value: '18', change: '+3', icon: Package, color: 'text-green-500' },
        { label: 'In Progress', value: '2', icon: Clock, color: 'text-orange-500' },
        { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-green-500' }
      ];
    }
  };

  const quickStats = getQuickStats();
  const recentNotifications = notifications.slice(0, 5);
  const pendingTasks = tasks.filter(t => t.status === 'pending').slice(0, 3);

  const overviewContent = (
    <div className="space-y-4">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold mt-1">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      {stat.change}
                    </p>
                  )}
                </div>
                <stat.icon className={cn("h-8 w-8", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full justify-start h-12" size="lg">
            <Plus className="h-4 w-4 mr-3" />
            {(userProfile as any)?.role === 'supplier' ? 'Submit New Offer' : 'Create Request'}
          </Button>
          <Button variant="outline" className="w-full justify-start h-12" size="lg">
            <MessageSquare className="h-4 w-4 mr-3" />
            Open Messages
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const notificationsContent = (
    <div className="space-y-3">
      {notificationsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : recentNotifications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No notifications yet</p>
        </div>
      ) : (
        recentNotifications.map((notification) => (
          <MessageSwipeCard
            key={notification.id}
            onStar={() => logger.debug('Star notification:', notification.id)}
            onDelete={() => logger.debug('Delete notification:', notification.id)}
          >
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(notification.created_at), 'MMM d, HH:mm')}
                </p>
              </div>
            </div>
          </MessageSwipeCard>
        ))
      )}
    </div>
  );

  const tasksContent = (
    <div className="space-y-3">
      {tasksLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : pendingTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No pending tasks</p>
        </div>
      ) : (
        pendingTasks.map((task) => (
          <SwipeableCard
            key={task.id}
            rightActions={[
              {
                icon: CheckCircle,
                label: 'Complete',
                color: 'success',
                onClick: () => logger.debug('Complete task:', task.id)
              }
            ]}
          >
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {task.priority}
                  </Badge>
                  {task.due_date && (
                    <span>Due: {format(new Date(task.due_date), 'MMM d')}</span>
                  )}
                </div>
              </div>
            </div>
          </SwipeableCard>
        ))
      )}
    </div>
  );

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      content: overviewContent
    },
    {
      id: 'notifications',
      label: 'Updates',
      icon: MessageSquare,
      content: notificationsContent,
      badge: notifications.filter(n => !n.read_at).length
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: Clock,
      content: tasksContent,
      badge: pendingTasks.length
    }
  ];

  return (
    <div className="h-full">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">
              Welcome back{userProfile?.full_name ? `, ${userProfile.full_name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              {userProfile?.role === 'admin' ? 'Manage your platform' :
               (userProfile as any)?.role === 'supplier' ? 'Track your business' :
               'Manage your procurement'}
            </p>
          </div>

          <MobileTabs tabs={tabs} stickyTabs={true} />
        </div>
        <MobileBottomNavSpacer />
      </PullToRefresh>
    </div>
  );
};