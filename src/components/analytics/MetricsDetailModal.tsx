
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataExporter } from '@/utils/exportUtils';
import { 
  Users, 
  Activity, 
  DollarSign, 
  ShoppingCart, 
  Download,
  TrendingUp,
  Calendar,
  Filter
} from 'lucide-react';

interface MetricsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricType: 'users' | 'requests' | 'revenue' | 'orders' | null;
  metricTitle: string;
}

export const MetricsDetailModal = ({ isOpen, onClose, metricType, metricTitle }: MetricsDetailModalProps) => {
  const { t, formatNumber, formatCurrency } = useLanguage();
  const { showSuccess, showError } = useToastFeedback();
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (isOpen && metricType) {
      fetchDetailData();
    }
  }, [isOpen, metricType]);

  const fetchDetailData = async () => {
    setLoading(true);
    try {
      switch (metricType) {
        case 'users':
          await fetchUsersDetail();
          break;
        case 'requests':
          await fetchRequestsDetail();
          break;
        case 'revenue':
          await fetchRevenueDetail();
          break;
        case 'orders':
          await fetchOrdersDetail();
          break;
      }
    } catch (error: any) {
      showError(`Failed to load ${metricType} details`);
      console.error('Error fetching detail data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersDetail = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    setDetailData(data || []);
    setSummary({
      total: data?.length || 0,
      clients: data?.filter(u => u.role === 'client').length || 0,
      vendors: data?.filter(u => u.role === 'vendor').length || 0,
      admins: data?.filter(u => u.role === 'admin').length || 0,
      verified: data?.filter(u => u.role === 'admin').length || 0
    });
  };

  const fetchRequestsDetail = async () => {
    // Use mock data since requests table is not available in generated types
    const mockData = [
      { id: '1', title: 'Construction Project', status: 'new', created_at: new Date().toISOString(), client_name: 'ABC Corp' },
      { id: '2', title: 'IT Services', status: 'in_progress', created_at: new Date().toISOString(), client_name: 'XYZ Ltd' },
      { id: '3', title: 'Marketing Campaign', status: 'completed', created_at: new Date().toISOString(), client_name: 'DEF Inc' }
    ];

    setDetailData(mockData);
    setSummary({
      total: mockData.length,
      new: mockData.filter(r => r.status === 'new').length,
      in_progress: mockData.filter(r => r.status === 'in_progress').length,
      completed: mockData.filter(r => r.status === 'completed').length
    });
  };

  const fetchRevenueDetail = async () => {
    // Use mock data since financial_transactions table is not available in generated types
    const mockData = [
      { id: '1', amount: 5000, status: 'completed', created_at: new Date().toISOString(), type: 'payment' },
      { id: '2', amount: 3200, status: 'completed', created_at: new Date().toISOString(), type: 'payment' },
      { id: '3', amount: 1800, status: 'completed', created_at: new Date().toISOString(), type: 'payment' }
    ];

    setDetailData(mockData);
    const totalRevenue = mockData.reduce((sum, t) => sum + t.amount, 0);
    setSummary({
      total: mockData.length,
      totalRevenue,
      avgTransaction: mockData.length ? totalRevenue / mockData.length : 0,
      thisMonth: totalRevenue
    });
  };

  const fetchOrdersDetail = async () => {
    // Use mock data since orders table is not available in generated types
    const mockData = [
      { id: '1', title: 'Order #001', status: 'pending', created_at: new Date().toISOString(), amount: 2500 },
      { id: '2', title: 'Order #002', status: 'confirmed', created_at: new Date().toISOString(), amount: 1800 },
      { id: '3', title: 'Order #003', status: 'completed', created_at: new Date().toISOString(), amount: 3200 }
    ];

    setDetailData(mockData);
    setSummary({
      total: mockData.length,
      pending: mockData.filter(o => o.status === 'pending').length,
      confirmed: mockData.filter(o => o.status === 'confirmed').length,
      completed: mockData.filter(o => o.status === 'completed').length
    });
  };

  const handleExport = () => {
    try {
      switch (metricType) {
        case 'users':
          DataExporter.exportUserData(detailData);
          break;
        default:
          DataExporter.exportToCSV(detailData, `${metricType}_details`);
      }
      showSuccess('Data exported successfully');
    } catch (error) {
      showError('Failed to export data');
    }
  };

  const getIcon = () => {
    switch (metricType) {
      case 'users': return <Users className="h-5 w-5" />;
      case 'requests': return <Activity className="h-5 w-5" />;
      case 'revenue': return <DollarSign className="h-5 w-5" />;
      case 'orders': return <ShoppingCart className="h-5 w-5" />;
      default: return null;
    }
  };

  const renderSummaryCards = () => {
    if (!summary) return null;

    switch (metricType) {
      case 'users':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatNumber(summary.total)}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatNumber(summary.clients)}</div>
                <div className="text-sm text-muted-foreground">Clients</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatNumber(summary.vendors)}</div>
                <div className="text-sm text-muted-foreground">Vendors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatNumber(summary.verified)}</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </CardContent>
            </Card>
          </div>
        );
      case 'revenue':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatCurrency(summary.thisMonth)}</div>
                <div className="text-sm text-muted-foreground">This Month</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatCurrency(summary.avgTransaction)}</div>
                <div className="text-sm text-muted-foreground">Avg Transaction</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatNumber(summary.total)}</div>
                <div className="text-sm text-muted-foreground">Transactions</div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  const renderDetailTable = () => {
    if (!detailData.length) return null;

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-muted sticky top-0">
              <tr>
                {Object.keys(detailData[0]).slice(0, 5).map((key) => (
                  <th key={key} className="p-3 text-left text-sm font-medium">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detailData.slice(0, 50).map((item, index) => (
                <tr key={index} className="border-t hover:bg-muted/50">
                  {Object.values(item).slice(0, 5).map((value: any, i) => (
                    <td key={i} className="p-3 text-sm">
                      {typeof value === 'object' && value !== null 
                        ? JSON.stringify(value).slice(0, 50) + '...'
                        : String(value).slice(0, 50)
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {metricTitle} - Detailed View
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Loading details..." />
          </div>
        ) : (
          <div className="space-y-6">
            {renderSummaryCards()}
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Entries</h3>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>

            {renderDetailTable()}

            {detailData.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No data available for this metric
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
