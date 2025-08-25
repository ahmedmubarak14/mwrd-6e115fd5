
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Package, 
  MessageSquare 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const AdminNavigationGrid: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const navigationItems = [
    {
      to: '/admin/users',
      icon: Users,
      label: t('admin.manageUsers'),
    },
    {
      to: '/admin/requests',
      icon: FileText,
      label: t('admin.viewRequests'),
    },
    {
      to: '/admin/offers',
      icon: Package,
      label: t('admin.reviewOffers'),
    },
    {
      to: '/admin/support',
      icon: MessageSquare,
      label: t('admin.supportCenter'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(isRTL ? "text-right" : "text-left")}>{t('admin.quickAccess')}</CardTitle>
        <CardDescription className={cn(isRTL ? "text-right" : "text-left")}>
          {t('admin.jumpToKeyFunctions')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {navigationItems.map((item) => (
            <Button 
              key={item.to}
              asChild 
              variant="outline" 
              className={cn("h-20 flex-col", isRTL && "text-center")}
            >
              <Link to={item.to} className={cn("flex flex-col items-center", isRTL && "text-center")}>
                <item.icon className="h-6 w-6 mb-2" />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
