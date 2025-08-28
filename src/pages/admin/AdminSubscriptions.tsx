
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Users, DollarSign, Calendar, CheckCircle, Download, RefreshCw, TrendingUp, CreditCard } from "lucide-react";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan: string;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  amount: number;
  currency: string;
  created_at: string;
  expires_at: string;
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      // Using mock data temporarily - replace with real Supabase query when ready
      const mockSubscriptions: Subscription[] = [
        {
          id: "sub_001",
          user_id: "user_1",
          user_name: "Ahmed Al-Rashid",
          user_email: "ahmed@example.com",
          plan: "Premium",
          status: "active",
          amount: 99,
          currency: "SAR",
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "sub_002", 
          user_id: "user_2",
          user_name: "Sara Mohammed",
          user_email: "sara@example.com",
          plan: "Basic",
          status: "active",
          amount: 49,
          currency: "SAR",
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "sub_003",
          user_id: "user_3", 
          user_name: "Omar Hassan",
          user_email: "omar@example.com",
          plan: "Enterprise",
          status: "past_due",
          amount: 199,
          currency: "SAR",
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "sub_004",
          user_id: "user_4",
          user_name: "Fatima Ali", 
          user_email: "fatima@example.com",
          plan: "Premium",
          status: "cancelled",
          amount: 99,
          currency: "SAR",
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          expires_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setSubscriptions(mockSubscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleExport = () => {
    const csvContent = [
      'Subscription ID,User,Email,Plan,Status,Amount,Currency,Created Date,Expires Date',
      ...filteredSubscriptions.map(sub => 
        `${sub.id},${sub.user_name},${sub.user_email},${sub.plan},${sub.status},${sub.amount},${sub.currency},${format(new Date(sub.created_at), 'yyyy-MM-dd')},${format(new Date(sub.expires_at), 'yyyy-MM-dd')}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export completed",
      description: "Subscriptions data has been exported to CSV",
    });
  };

  const handleRefresh = () => {
    fetchSubscriptions();
    toast({
      title: "Data refreshed", 
      description: "Subscriptions data has been updated",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "secondary",
      inactive: "secondary", 
      cancelled: "destructive",
      past_due: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  // Calculate metrics
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const pastDueSubscriptions = subscriptions.filter(sub => sub.status === 'past_due').length;
  const monthlyRevenue = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.amount, 0);

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const searchMatch = searchTerm === "" || 
      subscription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === "all" || subscription.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AdminPageContainer
      title="Subscription Management"
      description="Monitor and manage user subscriptions across the platform"
    >
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubscriptions.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSubscriptions.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">Currently active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Past Due</CardTitle>
              <Calendar className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastDueSubscriptions.toLocaleString()}</div>
              <p className="text-xs text-foreground opacity-75">Need attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-foreground opacity-75" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyRevenue.toLocaleString()} SAR</div>
              <p className="text-xs text-foreground opacity-75">From active subscriptions</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="past_due">Past Due</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions List */}
        <div className="space-y-4">
          {filteredSubscriptions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No subscriptions found</h3>
                <p className="text-muted-foreground">No subscriptions match your current filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredSubscriptions.map((subscription) => (
              <Card key={subscription.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-foreground" />
                      <div>
                        <CardTitle className="text-lg">
                          {subscription.plan} Plan
                        </CardTitle>
                        <p className="text-sm text-foreground opacity-75">
                          {subscription.user_name} ({subscription.user_email})
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(subscription.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">
                          {subscription.amount.toLocaleString()} {subscription.currency}/month
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">
                          Expires: {format(new Date(subscription.expires_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                    <span className="text-foreground opacity-75">
                      Started: {format(new Date(subscription.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminPageContainer>
  );
}
