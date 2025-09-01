import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  FolderOpen, 
  Tags, 
  User, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const EnhancedVendorDashboard = () => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { isRTL: false };
  const t = languageContext?.t || ((key: string) => key);

  // Mock data for CR-focused metrics
  const crStatus = userProfile?.verification_status || 'unverified';
  const profileCompletion = 75; // Calculate based on filled fields
  const recentProjects = 3; // Fetch from vendor_projects table
  const activeOffers = 5; // Fetch from offers table
  const totalEarnings = 125000; // Fetch from completed orders

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success';
      case 'pending': return 'text-warning';
      case 'rejected': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const quickActions = [
    {
      title: t('vendor.cr.updateCR'),
      description: t('vendor.cr.verificationRequired'),
      icon: FileText,
      href: "/vendor/cr-management",
      color: "border-primary/20 hover:border-primary/40"
    },
    {
      title: t('vendor.projects.add'),
      description: t('vendor.projects.addFirst'),
      icon: Plus,
      href: "/vendor/projects/new",
      color: "border-success/20 hover:border-success/40"
    },
    {
      title: t('vendor.categories.manage'),
      description: t('vendor.categories.select'),
      icon: Tags,
      href: "/vendor/categories",
      color: "border-warning/20 hover:border-warning/40"
    },
    {
      title: t('vendor.profile.title'),
      description: t('vendor.profile.basicInfo'),
      icon: User,
      href: "/vendor/profile",
      color: "border-info/20 hover:border-info/40"
    }
  ];

  return (
    <div className={cn("space-y-8", isRTL && "rtl")}>
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('vendor.dashboard.welcome')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {userProfile?.company_name || userProfile?.full_name}
        </p>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('vendor.cr.status')}
            </CardTitle>
            {getStatusIcon(crStatus)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="outline" className={getStatusColor(crStatus)}>
                {t(`vendor.cr.${crStatus}`)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('vendor.dashboard.completionRate')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <Progress value={profileCompletion} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('vendor.dashboard.recentProjects')}
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentProjects}</div>
            <p className="text-xs text-muted-foreground">
              {t('common.thisMonth')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('common.activeOffers')}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOffers}</div>
            <p className="text-xs text-muted-foreground">
              {totalEarnings.toLocaleString()} {t('common.sar')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('vendor.dashboard.quickActions')}</CardTitle>
          <CardDescription>
            {t('common.getStartedActions')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} to={action.href}>
                  <Card className={cn(
                    "p-4 transition-all duration-200 cursor-pointer",
                    action.color,
                    "hover:shadow-lg"
                  )}>
                    <div className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm text-foreground">
                          {action.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('vendor.dashboard.recentProjects')}</CardTitle>
            <CardDescription>
              {t('common.yourLatestWork')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock recent projects */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        {t('common.mockProject')} {i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('common.completed')} • 2 {t('common.daysAgo')}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/vendor/projects">
                  {t('common.viewAll')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('common.recentActivity')}</CardTitle>
            <CardDescription>
              {t('common.latestUpdates')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock recent activity */}
              {[
                { type: 'offer', message: 'New offer received', time: '2h' },
                { type: 'profile', message: 'Profile updated', time: '1d' },
                { type: 'project', message: 'Project completed', time: '3d' }
              ].map((activity, i) => (
                <div key={i} className="flex items-start space-x-3 rtl:space-x-reverse p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time} {t('common.ago')}
                    </p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/activity">
                  {t('common.viewAllActivity')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};