import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MessageSquare,
  Filter,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { BulkApprovalActions } from './BulkApprovalActions';
import { WorkflowAutomation } from './WorkflowAutomation';
import { RequestApprovalCard } from './RequestApprovalCard';
import { OfferApprovalCard } from './OfferApprovalCard';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

interface ApprovalMetrics {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalOffers: number;
  pendingOffers: number;
  approvedOffers: number;
  rejectedOffers: number;
  avgProcessingTime: number;
  approvalRate: number;
  weeklyTrend: number;
}

interface PendingItem {
  id: string;
  title: string;
  type: 'request' | 'offer';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  urgency_score: number;
  user_name?: string;
  budget?: number;
  price?: number;
}

export const ApprovalDashboard = () => {
  const { toast } = useToast();
  const { t } = useOptionalLanguage();
  const [metrics, setMetrics] = useState<ApprovalMetrics>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalOffers: 0,
    pendingOffers: 0,
    approvedOffers: 0,
    rejectedOffers: 0,
    avgProcessingTime: 0,
    approvalRate: 0,
    weeklyTrend: 0
  });

  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchMetrics = async () => {
    try {
      // Fetch real approval metrics from database
      const [requestsResponse, offersResponse] = await Promise.all([
        supabase
          .from('requests')
          .select('id, admin_approval_status, created_at'),
        supabase
          .from('offers')
          .select('id, admin_approval_status, client_approval_status, created_at')
      ]);

      const requests = requestsResponse.data || [];
      const offers = offersResponse.data || [];

      // Calculate request metrics
      const totalRequests = requests.length;
      const pendingRequests = requests.filter(r => r.admin_approval_status === 'pending').length;
      const approvedRequests = requests.filter(r => r.admin_approval_status === 'approved').length;
      const rejectedRequests = requests.filter(r => r.admin_approval_status === 'rejected').length;

      // Calculate offer metrics
      const totalOffers = offers.length;
      const pendingOffers = offers.filter(o => 
        o.admin_approval_status === 'pending' || o.client_approval_status === 'pending'
      ).length;
      const approvedOffers = offers.filter(o => 
        o.admin_approval_status === 'approved' && o.client_approval_status === 'approved'
      ).length;
      const rejectedOffers = offers.filter(o => 
        o.admin_approval_status === 'rejected' || o.client_approval_status === 'rejected'
      ).length;

      // Calculate processing time (simplified)
      const processedItems = [...requests, ...offers].filter(item => 
        item.admin_approval_status !== 'pending'
      );
      const avgProcessingTime = processedItems.length > 0 ? 
        processedItems.reduce((acc, item) => {
          const created = new Date(item.created_at);
          const now = new Date();
          return acc + (now.getTime() - created.getTime()) / (1000 * 60 * 60);
        }, 0) / processedItems.length : 0;

      const totalApproved = approvedRequests + approvedOffers;
      const totalItems = totalRequests + totalOffers;
      const approvalRate = totalItems > 0 ? (totalApproved / totalItems) * 100 : 0;

      // Calculate weekly trend (compare this week vs last week)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const thisWeekItems = [...requests, ...offers].filter(item => 
        new Date(item.created_at) >= oneWeekAgo
      ).length;
      
      const lastWeekItems = [...requests, ...offers].filter(item => {
        const created = new Date(item.created_at);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        return created >= twoWeeksAgo && created < oneWeekAgo;
      }).length;

      const weeklyTrend = lastWeekItems > 0 ? 
        ((thisWeekItems - lastWeekItems) / lastWeekItems) * 100 : 0;

      setMetrics({
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        totalOffers,
        pendingOffers,
        approvedOffers,
        rejectedOffers,
        avgProcessingTime: Math.round(avgProcessingTime),
        approvalRate: Math.round(approvalRate * 10) / 10,
        weeklyTrend: Math.round(weeklyTrend * 10) / 10
      });

    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch approval metrics',
        variant: 'destructive'
      });
    }
  };

  const fetchPendingItems = async () => {
    try {
      // Fetch real pending requests and offers
      const [requestsResponse, offersResponse] = await Promise.all([
        supabase
          .from('requests')
          .select(`
            id,
            title,
            admin_approval_status,
            created_at,
            urgency,
            budget_max,
            user_profiles!inner(full_name)
          `)
          .eq('admin_approval_status', 'pending')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('offers')
          .select(`
            id,
            title,
            admin_approval_status,
            client_approval_status,
            created_at,
            price,
            user_profiles!inner(full_name)
          `)
          .or('admin_approval_status.eq.pending,client_approval_status.eq.pending')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      const pendingRequests = (requestsResponse.data || []).map(request => ({
        id: request.id,
        title: request.title,
        type: 'request' as const,
        priority: (request.urgency === 'high' || request.urgency === 'medium' || request.urgency === 'low' || request.urgency === 'urgent' ? request.urgency : 'medium') as 'low' | 'medium' | 'high' | 'urgent',
        created_at: request.created_at,
        urgency_score: getPriorityScore(request.urgency || 'medium'),
        user_name: request.user_profiles?.full_name || 'Unknown User',
        budget: request.budget_max ? parseFloat(request.budget_max.toString()) : undefined
      }));

      const pendingOffers = (offersResponse.data || []).map(offer => ({
        id: offer.id,
        title: offer.title,
        type: 'offer' as const,
        priority: 'medium' as const,
        created_at: offer.created_at,
        urgency_score: 75,
        user_name: offer.user_profiles?.full_name || 'Unknown User', 
        price: offer.price ? parseFloat(offer.price.toString()) : undefined
      }));

      const allPendingItems = [...pendingRequests, ...pendingOffers]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20);

      setPendingItems(allPendingItems);
    } catch (error) {
      console.error('Error fetching pending items:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pending items',
        variant: 'destructive'
      });
    }
  };

  const getPriorityScore = (priority: string): number => {
    switch (priority) {
      case 'high': return 120;
      case 'medium': return 80;
      case 'low': return 40;
      default: return 60;
    }
  };

  const calculateUrgencyScore = (createdAt: string, urgency: string = 'medium') => {
    const hoursOld = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    const urgencyMultiplier = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1
    }[urgency] || 2;
    
    return hoursOld * urgencyMultiplier;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkApproval = async (action: 'approve' | 'reject') => {
    // Implementation handled by BulkApprovalActions component
    await fetchMetrics();
    await fetchPendingItems();
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMetrics(), fetchPendingItems()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground opacity-75">{t('admin.approvals.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.approvals.title')}</h1>
          <p className="text-foreground opacity-75">
            {t('admin.approvals.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t('admin.approvals.exportReport')}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t('admin.approvals.advancedFilters')}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground opacity-75">{t('admin.approvals.pendingItems')}</p>
                <p className="text-3xl font-bold text-warning">
                  {metrics.pendingRequests + metrics.pendingOffers}
                </p>
                <p className="text-xs text-foreground opacity-75 mt-1">
                  {metrics.pendingRequests} {t('admin.approvals.requestsLabel')}, {metrics.pendingOffers} {t('admin.approvals.offersLabel')}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground opacity-75">{t('admin.approvals.approvalRate')}</p>
                <p className="text-3xl font-bold text-success">
                  {metrics.approvalRate.toFixed(1)}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {metrics.weeklyTrend >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className="text-xs text-foreground opacity-75">
                    {Math.abs(metrics.weeklyTrend)}% {t('admin.approvals.thisWeek')}
                  </span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-success/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground opacity-75">{t('admin.approvals.avgProcessing')}</p>
                <p className="text-3xl font-bold">{metrics.avgProcessingTime}h</p>
                <p className="text-xs text-foreground opacity-75 mt-1">
                  {t('admin.approvals.avgResponseTime')}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground opacity-75">{t('admin.approvals.totalProcessed')}</p>
                <p className="text-3xl font-bold">
                  {metrics.approvedRequests + metrics.approvedOffers + metrics.rejectedRequests + metrics.rejectedOffers}
                </p>
                <p className="text-xs text-foreground opacity-75 mt-1">
                  {t('admin.approvals.totalProcessedDesc')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.approvals.progressTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('admin.approvals.requests')}</span>
                <span className="text-sm text-foreground opacity-75">
                  {metrics.approvedRequests + metrics.rejectedRequests} / {metrics.totalRequests}
                </span>
              </div>
              <Progress 
                value={metrics.totalRequests > 0 ? ((metrics.approvedRequests + metrics.rejectedRequests) / metrics.totalRequests) * 100 : 0} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-foreground opacity-75">
                <span>{metrics.pendingRequests} {t('admin.approvals.pending')}</span>
                <span>{metrics.approvedRequests} {t('admin.approvals.approved')}</span>
                <span>{metrics.rejectedRequests} {t('admin.approvals.rejected')}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('admin.approvals.offers')}</span>
                <span className="text-sm text-foreground opacity-75">
                  {metrics.approvedOffers + metrics.rejectedOffers} / {metrics.totalOffers}
                </span>
              </div>
              <Progress 
                value={metrics.totalOffers > 0 ? ((metrics.approvedOffers + metrics.rejectedOffers) / metrics.totalOffers) * 100 : 0} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-foreground opacity-75">
                <span>{metrics.pendingOffers} {t('admin.approvals.pending')}</span>
                <span>{metrics.approvedOffers} {t('admin.approvals.approved')}</span>
                <span>{metrics.rejectedOffers} {t('admin.approvals.rejected')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('admin.approvals.queue')} ({pendingItems.length})</TabsTrigger>
          <TabsTrigger value="requests">{t('admin.approvals.requests')} ({metrics.pendingRequests})</TabsTrigger>
          <TabsTrigger value="offers">{t('admin.approvals.offers')} ({metrics.pendingOffers})</TabsTrigger>
          <TabsTrigger value="automation">{t('admin.approvals.automation')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {selectedItems.length > 0 && (
            <BulkApprovalActions
              selectedItems={selectedItems}
              itemType={selectedItems[0]?.startsWith('req') ? 'requests' : 'offers'}
              onRefresh={() => {
                fetchMetrics();
                fetchPendingItems();
              }}
              onClearSelection={() => setSelectedItems([])}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.approvals.priorityQueue')}</CardTitle>
              <p className="text-sm text-foreground opacity-75">
                {t('admin.approvals.sortedByUrgency')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingItems.slice(0, 10).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getPriorityColor(item.priority)}>
                          {item.type}
                        </Badge>
                        <Badge variant="outline">
                          {item.priority}
                        </Badge>
                        <h3 className="font-medium">{item.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-foreground opacity-75">
                        <span>{item.user_name}</span>
                        <span>•</span>
                        <span>{format(new Date(item.created_at), 'MMM dd, HH:mm')}</span>
                        <span>•</span>
                        <span>
                          {item.type === 'request' ? 
                            `Budget: ${item.budget?.toLocaleString()} SAR` : 
                            `Price: ${item.price?.toLocaleString()} SAR`
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {pendingItems.length === 0 && (
                  <div className="text-center py-8 text-foreground opacity-75">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t('admin.approvals.allCaughtUp')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">{t('admin.approvals.requestInterface')}</p>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">{t('admin.approvals.offerInterface')}</p>
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <WorkflowAutomation />
        </TabsContent>
      </Tabs>
    </div>
  );
};