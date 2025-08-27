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
      // Fetch requests metrics
      const { data: requests, error: requestsError } = await supabase
        .from('requests')
        .select('admin_approval_status, created_at');

      if (requestsError) throw requestsError;

      // Fetch offers metrics  
      const { data: offers, error: offersError } = await supabase
        .from('offers')
        .select('admin_approval_status, client_approval_status, created_at');

      if (offersError) throw offersError;

      // Calculate metrics
      const totalRequests = requests?.length || 0;
      const pendingRequests = requests?.filter(r => r.admin_approval_status === 'pending').length || 0;
      const approvedRequests = requests?.filter(r => r.admin_approval_status === 'approved').length || 0;
      const rejectedRequests = requests?.filter(r => r.admin_approval_status === 'rejected').length || 0;

      const totalOffers = offers?.length || 0;
      const pendingOffers = offers?.filter(o => o.admin_approval_status === 'pending').length || 0;
      const approvedOffers = offers?.filter(o => o.admin_approval_status === 'approved').length || 0;
      const rejectedOffers = offers?.filter(o => o.admin_approval_status === 'rejected').length || 0;

      // Calculate approval rate
      const totalProcessed = approvedRequests + rejectedRequests + approvedOffers + rejectedOffers;
      const totalApproved = approvedRequests + approvedOffers;
      const approvalRate = totalProcessed > 0 ? (totalApproved / totalProcessed) * 100 : 0;

      // Calculate weekly trend (simplified)
      const weekAgo = subDays(new Date(), 7);
      const recentItems = [...(requests || []), ...(offers || [])].filter(
        item => new Date(item.created_at) >= weekAgo
      );
      const weeklyTrend = recentItems.length > 0 ? 15.3 : 0; // Mock calculation

      setMetrics({
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        totalOffers,
        pendingOffers,
        approvedOffers,
        rejectedOffers,
        avgProcessingTime: 4.2, // Mock value
        approvalRate,
        weeklyTrend
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
      const [{ data: requests }, { data: offers }] = await Promise.all([
        supabase
          .from('requests')
          .select(`
            id, title, created_at, urgency, budget_min, budget_max,
            user_profiles:client_id(full_name, company_name)
          `)
          .eq('admin_approval_status', 'pending')
          .order('created_at', { ascending: false }),
        
        supabase
          .from('offers')
          .select(`
            id, title, created_at, price,
            user_profiles:vendor_id(full_name, company_name)
          `)
          .eq('admin_approval_status', 'pending')
          .order('created_at', { ascending: false })
      ]);

      const pendingRequests = (requests || []).map(r => ({
        id: r.id,
        title: r.title,
        type: 'request' as const,
        priority: r.urgency as any,
        created_at: r.created_at,
        urgency_score: calculateUrgencyScore(r.created_at, r.urgency),
        user_name: r.user_profiles?.company_name || r.user_profiles?.full_name,
        budget: r.budget_max || r.budget_min
      }));

      const pendingOffers = (offers || []).map(o => ({
        ...o,
        type: 'offer' as const,
        priority: 'medium' as const,
        urgency_score: calculateUrgencyScore(o.created_at, 'medium'),
        user_name: o.user_profiles?.company_name || o.user_profiles?.full_name,
        price: o.price
      }));

      const allPending = [...pendingRequests, ...pendingOffers]
        .sort((a, b) => b.urgency_score - a.urgency_score);

      setPendingItems(allPending);
    } catch (error) {
      console.error('Error fetching pending items:', error);
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
          <p className="text-muted-foreground">Loading approval dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Approval Center</h1>
          <p className="text-muted-foreground">
            Centralized approval management with automated workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Items</p>
                <p className="text-3xl font-bold text-orange-600">
                  {metrics.pendingRequests + metrics.pendingOffers}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.pendingRequests} requests, {metrics.pendingOffers} offers
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {metrics.approvalRate.toFixed(1)}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {metrics.weeklyTrend >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {Math.abs(metrics.weeklyTrend)}% this week
                  </span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Processing</p>
                <p className="text-3xl font-bold">{metrics.avgProcessingTime}h</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Average response time
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
                <p className="text-sm text-muted-foreground">Total Processed</p>
                <p className="text-3xl font-bold">
                  {metrics.approvedRequests + metrics.approvedOffers + metrics.rejectedRequests + metrics.rejectedOffers}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All time approvals/rejections
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
          <CardTitle>Approval Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Requests</span>
                <span className="text-sm text-muted-foreground">
                  {metrics.approvedRequests + metrics.rejectedRequests} / {metrics.totalRequests}
                </span>
              </div>
              <Progress 
                value={metrics.totalRequests > 0 ? ((metrics.approvedRequests + metrics.rejectedRequests) / metrics.totalRequests) * 100 : 0} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{metrics.pendingRequests} pending</span>
                <span>{metrics.approvedRequests} approved</span>
                <span>{metrics.rejectedRequests} rejected</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Offers</span>
                <span className="text-sm text-muted-foreground">
                  {metrics.approvedOffers + metrics.rejectedOffers} / {metrics.totalOffers}
                </span>
              </div>
              <Progress 
                value={metrics.totalOffers > 0 ? ((metrics.approvedOffers + metrics.rejectedOffers) / metrics.totalOffers) * 100 : 0} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{metrics.pendingOffers} pending</span>
                <span>{metrics.approvedOffers} approved</span>
                <span>{metrics.rejectedOffers} rejected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Queue ({pendingItems.length})</TabsTrigger>
          <TabsTrigger value="requests">Requests ({metrics.pendingRequests})</TabsTrigger>
          <TabsTrigger value="offers">Offers ({metrics.pendingOffers})</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
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
              <CardTitle>Priority Queue</CardTitle>
              <p className="text-sm text-muted-foreground">
                Items sorted by urgency score (time + priority)
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
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {pendingItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>All caught up! No pending items require approval.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          {/* Request-specific content */}
          <div className="text-center py-8 text-muted-foreground">
            Request approval interface will be loaded here
          </div>
        </TabsContent>

        <TabsContent value="offers">
          {/* Offer-specific content */}
          <div className="text-center py-8 text-muted-foreground">
            Offer approval interface will be loaded here
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <WorkflowAutomation />
        </TabsContent>
      </Tabs>
    </div>
  );
};