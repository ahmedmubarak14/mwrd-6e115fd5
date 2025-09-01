import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MetricCard } from "@/components/ui/MetricCard";
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
  Edit,
  DollarSign,
  Package,
  Star,
  Shield,
  BarChart3,
  Award,
  Users,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useVendorStats } from "@/hooks/useVendorStats";
import { VendorBreadcrumbs } from "./VendorBreadcrumbs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const EnhancedVendorDashboard = () => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { isRTL, formatCurrency, formatNumber } = languageContext || { 
    isRTL: false, 
    formatCurrency: (amount: number) => `$${amount.toLocaleString()}`,
    formatNumber: (num: number) => num.toLocaleString()
  };
  const t = languageContext?.t || ((key: string) => key);
  const navigate = useNavigate();
  const { stats, loading, error, refetch } = useVendorStats();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const quickActions = [
    {
      title: t('vendor.cr.updateCR'),
      description: t('vendor.cr.verificationRequired'),
      icon: FileText,
      href: "/vendor/cr-management",
      color: "bg-primary",
      count: stats.crStatus === 'pending' ? 1 : undefined
    },
    {
      title: t('vendor.projects.add'),
      description: t('vendor.projects.addFirst'),
      icon: Plus,
      href: "/vendor/projects/new",
      color: "bg-success"
    },
    {
      title: t('vendor.categories.manage'),
      description: t('vendor.categories.select'),
      icon: Tags,
      href: "/vendor/categories",
      color: "bg-warning"
    },
    {
      title: t('vendor.profile.title'),
      description: t('vendor.profile.basicInfo'),
      icon: User,
      href: "/vendor/profile",
      color: "bg-info",
      count: stats.profileCompletion < 100 ? 1 : undefined
    }
  ];

  if (loading) {
    return (
      <div className={cn("space-y-8", isRTL && "rtl")}>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <MetricCard key={i} title="" value="" loading={true} />
          ))}
        </div>
      </div>
    );
  }

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

      {/* CR Status Alert */}
      {stats.crStatus !== 'approved' && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div>
                <h3 className="font-semibold text-warning">{t('vendor.cr.verificationRequired')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('vendor.cr.completeVerification')}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="ml-auto">
                <Link to="/vendor/cr-management">{t('vendor.cr.updateCR')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="CR Verification Status"
          value={t(`vendor.cr.${stats.crStatus}`)}
          description="Commercial Registration status"
          icon={getStatusIcon(stats.crStatus)}
          variant={getStatusVariant(stats.crStatus) as any}
          loading={loading}
        />
        
        <MetricCard
          title="Profile Completion"
          value={`${stats.profileCompletion}%`}
          description="Complete to attract more clients"
          icon={User}
          trend={{
            value: stats.profileCompletion > 80 ? 5 : -5,
            label: stats.profileCompletion > 80 ? "Good" : "Needs work",
            isPositive: stats.profileCompletion > 80
          }}
          loading={loading}
        />
        
        <MetricCard
          title="Active Offers"
          value={formatNumber(stats.activeOffers)}
          description="Pending client decisions"
          icon={Package}
          variant="warning"
          loading={loading}
        />
        
        <MetricCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          description="Offers accepted by clients"
          icon={Award}
          variant="success"
          loading={loading}
        />
      </div>

      {/* Business Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Earnings"
          value={formatCurrency(stats.totalEarnings)}
          description="All-time revenue"
          icon={DollarSign}
          trend={{
            value: 12,
            label: "vs last month",
            isPositive: true
          }}
          loading={loading}
        />
        
        <MetricCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyEarnings)}
          description="Current month earnings"
          icon={TrendingUp}
          variant="success"
          loading={loading}
        />
        
        <MetricCard
          title="Completed Projects"
          value={formatNumber(stats.completedProjects)}
          description="Successfully delivered"
          icon={CheckCircle}
          loading={loading}
        />
        
        <MetricCard
          title="Client Rating"
          value={`${stats.clientSatisfaction}/5`}
          description="Average client satisfaction"
          icon={Star}
          variant="success"
          loading={loading}
        />
      </div>

      {/* Performance Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('vendor.dashboard.offerTrends')}</CardTitle>
          <CardDescription>
            {t('vendor.dashboard.offerTrendsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.offerTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="offers"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle>{t('vendor.dashboard.quickActions')}</CardTitle>
          <CardDescription>
            {t('common.getStartedActions')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", action.color)}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                        {action.count && (
                          <Badge variant="secondary" className="mt-1">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.crStatus !== 'approved' && (
              <div className="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div>
                  <p className="font-medium">Complete CR Verification</p>
                  <p className="text-sm text-foreground opacity-75">
                    Upload required documents for approval
                  </p>
                </div>
                <Link to="/vendor/cr-management">
                  <Button size="sm" variant="outline">Update</Button>
                </Link>
              </div>
            )}
            
            {stats.profileCompletion < 100 && (
              <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div>
                  <p className="font-medium">Complete Profile</p>
                  <p className="text-sm text-foreground opacity-75">
                    {100 - stats.profileCompletion}% remaining
                  </p>
                </div>
                <Link to="/vendor/profile">
                  <Button size="sm" variant="outline">Complete</Button>
                </Link>
              </div>
            )}

            {stats.activeOffers > 0 && (
              <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                <div>
                  <p className="font-medium">Active Offers</p>
                  <p className="text-sm text-foreground opacity-75">
                    {formatNumber(stats.activeOffers)} offers awaiting response
                  </p>
                </div>
                <Link to="/vendor/offers">
                  <Button size="sm" variant="outline">View</Button>
                </Link>
              </div>
            )}

            {stats.crStatus === 'approved' && stats.profileCompletion === 100 && stats.activeOffers === 0 && (
              <div className="text-center py-6 text-foreground opacity-75">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                <p>All set! Ready for new opportunities.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-success" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button onClick={() => navigate('/vendor/browse-requests')} className="h-auto p-4 justify-start">
                <Eye className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Browse Requests</div>
                  <div className="text-xs opacity-75">Find new opportunities</div>
                </div>
              </Button>
              
              <Button variant="outline" onClick={() => navigate('/vendor/projects')} className="h-auto p-4 justify-start">
                <FolderOpen className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Manage Projects</div>
                  <div className="text-xs opacity-75">View your portfolio</div>
                </div>
              </Button>

              <Button variant="outline" onClick={() => navigate('/vendor/messages')} className="h-auto p-4 justify-start">
                <MessageSquare className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Messages</div>
                  <div className="text-xs opacity-75">Communicate with clients</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Performance Overview */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Business Performance</CardTitle>
          <CardDescription>Your vendor activity overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Offer Success Rate</span>
                <span className="text-sm text-success">
                  {stats.successRate}%
                </span>
              </div>
              <Progress 
                value={stats.successRate} 
                className="w-full" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm text-primary">
                  {stats.profileCompletion}%
                </span>
              </div>
              <Progress 
                value={stats.profileCompletion} 
                className="w-full" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Client Satisfaction</span>
                <span className="text-sm text-success">
                  {stats.clientSatisfaction}/5
                </span>
              </div>
              <Progress 
                value={(stats.clientSatisfaction / 5) * 100} 
                className="w-full" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};