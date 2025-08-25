
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  TrendingUp,
  FileText,
  Users
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ClientQuickActionsProps {
  recentActivity?: {
    newMessages: number;
    pendingRequests: number;
    activeOffers: number;
  };
  className?: string;
}

export const ClientQuickActions: React.FC<ClientQuickActionsProps> = ({
  recentActivity = {
    newMessages: 0,
    pendingRequests: 0,
    activeOffers: 0
  },
  className
}) => {
  const { t, isRTL } = useLanguage();

  const quickActions = [
    {
      title: t('dashboard.createRequest'),
      description: t('dashboard.createRequestDescription'),
      icon: Plus,
      href: '/create-request',
      variant: 'default' as const
    },
    {
      title: t('dashboard.browseVendors'),
      description: t('dashboard.browseVendorsDescription'),
      icon: Search,
      href: '/vendors',
      variant: 'outline' as const
    },
    {
      title: t('dashboard.viewMessages'),
      description: t('dashboard.viewMessagesDescription'),
      icon: MessageSquare,
      href: '/messages',
      variant: 'outline' as const,
      badge: recentActivity.newMessages > 0 ? recentActivity.newMessages : undefined
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('dashboard.quickActions')}
          </CardTitle>
          <CardDescription>
            {t('dashboard.quickActionsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action) => (
            <div key={action.title} className={cn(
              "flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors",
              isRTL && "flex-row-reverse"
            )}>
              <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <div className={cn(isRTL ? "text-right" : "text-left")}>
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
              <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                {action.badge && (
                  <Badge variant="destructive" className="text-xs">
                    {action.badge}
                  </Badge>
                )}
                <Button asChild variant={action.variant} size="sm">
                  <Link to={action.href}>{t('common.view')}</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <FileText className="h-5 w-5 text-blue-600" />
            {t('dashboard.recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className={cn("text-center p-3 bg-blue-50 rounded-lg", isRTL ? "text-right" : "text-left")}>
              <p className="text-2xl font-bold text-blue-600">{recentActivity.pendingRequests}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.pendingRequests')}</p>
            </div>
            <div className={cn("text-center p-3 bg-green-50 rounded-lg", isRTL ? "text-right" : "text-left")}>
              <p className="text-2xl font-bold text-green-600">{recentActivity.activeOffers}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.activeOffers')}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button asChild variant="outline" className="w-full">
              <Link to="/requests">{t('dashboard.viewAllRequests')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
