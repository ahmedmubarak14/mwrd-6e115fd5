import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartSkeleton } from "@/components/ui/ChartSkeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Send,
  FileText,
  TrendingUp,
  RefreshCw,
  Download,
  Users
} from "lucide-react";

interface RFQ {
  id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  currency: string;
  deadline: Date;
  category: string;
  status: 'open' | 'closed' | 'awarded' | 'published' | 'draft' | 'evaluation';
  client_name: string;
  requirements: string[];
  created_at: Date;
  responses_count: number;
  my_response_status: 'none' | 'submitted' | 'awarded' | 'rejected';
}

export const EnhancedVendorRFQs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [budgetRange, setBudgetRange] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(0);

  const { user, userProfile } = useAuth();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const languageContext = useLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  // Load RFQs from database instead of mock data
  const fetchRFQsFromDB = async (): Promise<RFQ[]> => {
    try {
      // First get the RFQs
      const { data: rfqData, error: rfqError } = await supabase
        .from('rfqs')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (rfqError) {
        console.error('Error fetching RFQs:', rfqError);
        return [];
      }

      if (!rfqData || rfqData.length === 0) {
        return [];
      }

      // Get categories and user profiles separately
      const categoryIds = rfqData.map(rfq => rfq.category_id).filter(Boolean);
      const clientIds = rfqData.map(rfq => rfq.client_id).filter(Boolean);

      const [categoriesResult, profilesResult, bidsResult] = await Promise.all([
        supabase
          .from('procurement_categories')
          .select('id, name, name_ar')
          .in('id', categoryIds),
        supabase
          .from('user_profiles')
          .select('user_id, full_name, company_name')
          .in('user_id', clientIds),
        supabase
          .from('bids')
          .select('rfq_id')
          .in('rfq_id', rfqData.map(rfq => rfq.id))
      ]);

      const categories = categoriesResult.data || [];
      const profiles = profilesResult.data || [];
      const bids = bidsResult.data || [];

      // Count bids per RFQ
      const bidCounts = bids.reduce((acc, bid) => {
        acc[bid.rfq_id] = (acc[bid.rfq_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return rfqData.map(rfq => {
        const category = categories.find(c => c.id === rfq.category_id);
        const profile = profiles.find(p => p.user_id === rfq.client_id);
        
        return {
          id: rfq.id,
          title: rfq.title,
          description: rfq.description,
          budget_min: rfq.budget_min || 0,
          budget_max: rfq.budget_max || 0,
          currency: rfq.currency,
          deadline: new Date(rfq.submission_deadline),
          category: category?.name || 'Other',
          status: (new Date(rfq.submission_deadline) > new Date() ? 'open' : 'closed') as RFQ['status'],
          client_name: profile?.company_name || profile?.full_name || 'Anonymous',
          requirements: Array.isArray(rfq.requirements) && typeof rfq.requirements === 'object' && rfq.requirements !== null
            ? (rfq.requirements as any).requirements || []
            : [],
          created_at: new Date(rfq.created_at),
          responses_count: bidCounts[rfq.id] || 0,
          my_response_status: 'none' as const // TODO: Check if current user has submitted a bid
        };
      });
    } catch (error) {
      console.error('Error in fetchRFQsFromDB:', error);
      return [];
    }
  };

  // Set up real-time updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('rfq-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rfqs'
        },
        (payload) => {
          console.log('RFQ update received:', payload);
          setRealTimeUpdates(prev => prev + 1);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: t('vendor.rfqs.newRFQTitle'),
              description: t('vendor.rfqs.newRFQDesc')
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, t]);

  // Load RFQs from database
  useEffect(() => {
    setLoading(true);
    fetchRFQsFromDB().then(data => {
      setRFQs(data);
      setLoading(false);
    });
  }, [realTimeUpdates]);

  // Filter and sort RFQs
  const filteredAndSortedRFQs = useMemo(() => {
    let filtered = rfqs.filter(rfq => {
      const matchesSearch = rfq.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           rfq.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           rfq.client_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || rfq.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;
      
      let matchesBudget = true;
      if (budgetRange !== 'all') {
        const [min, max] = budgetRange.split('-').map(Number);
        matchesBudget = rfq.budget_max >= min && (max ? rfq.budget_min <= max : true);
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesBudget;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'deadline':
          aValue = new Date(a.deadline).getTime();
          bValue = new Date(b.deadline).getTime();
          break;
        case 'budget':
          aValue = a.budget_max;
          bValue = b.budget_max;
          break;
        case 'responses':
          aValue = a.responses_count;
          bValue = b.responses_count;
          break;
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [rfqs, debouncedSearchTerm, categoryFilter, statusFilter, budgetRange, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = rfqs.length;
    const open = rfqs.filter(r => r.status === 'open').length;
    const myResponses = rfqs.filter(r => r.my_response_status !== 'none').length;
    const awarded = rfqs.filter(r => r.my_response_status === 'awarded').length;
    
    return { total, open, myResponses, awarded };
  }, [rfqs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'hsl(var(--success))';
      case 'closed': return 'hsl(var(--muted-foreground))';
      case 'awarded': return 'hsl(var(--primary))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const getResponseStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'hsl(var(--warning))';
      case 'awarded': return 'hsl(var(--success))';
      case 'rejected': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const handleSubmitResponse = (rfqId: string) => {
    // This would open a modal to submit a response
    toast({
      title: t('vendor.rfqs.responseSubmitted'),
      description: t('vendor.rfqs.responseSubmittedDesc')
    });
    
    // Update the RFQ status locally
    setRFQs(prev => prev.map(rfq => 
      rfq.id === rfqId 
        ? { ...rfq, my_response_status: 'submitted', responses_count: rfq.responses_count + 1 }
        : rfq
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <ChartSkeleton key={i} height="h-24" />
          ))}
        </div>
        <ChartSkeleton height="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {t('vendor.rfqs.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('vendor.rfqs.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.refresh')}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t('common.export')}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('vendor.rfqs.totalRFQs')}
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('vendor.rfqs.openRFQs')}
                </p>
                <p className="text-2xl font-bold text-success">{stats.open}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('vendor.rfqs.myResponses')}
                </p>
                <p className="text-2xl font-bold text-warning">{stats.myResponses}</p>
              </div>
              <Send className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('vendor.rfqs.awarded')}
                </p>
                <p className="text-2xl font-bold text-primary">{stats.awarded}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('vendor.rfqs.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('vendor.rfqs.category')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="Construction">{t('common.categories.construction')}</SelectItem>
                <SelectItem value="Engineering">{t('common.categories.engineering')}</SelectItem>
                <SelectItem value="Technology">{t('common.categories.technology')}</SelectItem>
                <SelectItem value="Marketing">{t('common.categories.marketing')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('vendor.rfqs.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="open">{t('vendor.rfqs.open')}</SelectItem>
                <SelectItem value="closed">{t('vendor.rfqs.closed')}</SelectItem>
                <SelectItem value="awarded">{t('vendor.rfqs.awarded')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={budgetRange} onValueChange={setBudgetRange}>
              <SelectTrigger>
                <SelectValue placeholder={t('vendor.rfqs.budget')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="0-25000">$0 - $25K</SelectItem>
                <SelectItem value="25000-100000">$25K - $100K</SelectItem>
                <SelectItem value="100000-500000">$100K - $500K</SelectItem>
                <SelectItem value="500000">$500K+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">{t('vendor.rfqs.newest')}</SelectItem>
                <SelectItem value="created_at-asc">{t('vendor.rfqs.oldest')}</SelectItem>
                <SelectItem value="deadline-asc">{t('vendor.rfqs.deadlineSoon')}</SelectItem>
                <SelectItem value="budget-desc">{t('vendor.rfqs.budgetHigh')}</SelectItem>
                <SelectItem value="responses-asc">{t('vendor.rfqs.leastCompetitive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* RFQ Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('vendor.rfqs.availableRFQs')} ({filteredAndSortedRFQs.length})</span>
            <Badge variant="outline">
              {t('vendor.rfqs.lastUpdated')}: {formatDistanceToNow(new Date(), { addSuffix: true })}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedRFQs.map((rfq) => {
              const daysLeft = Math.ceil((new Date(rfq.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={rfq.id}
                  className="border rounded-lg p-6 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{rfq.title}</h3>
                      <p className="text-muted-foreground text-sm mb-1">{rfq.client_name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {rfq.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{rfq.category}</Badge>
                      <Badge 
                        variant={rfq.status === 'open' ? 'default' : 'secondary'}
                        style={{ backgroundColor: getStatusColor(rfq.status) + '20' }}
                      >
                        {rfq.status}
                      </Badge>
                      {rfq.my_response_status !== 'none' && (
                        <Badge 
                          variant="outline"
                          style={{ borderColor: getResponseStatusColor(rfq.my_response_status) }}
                        >
                          {rfq.my_response_status}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>${rfq.budget_min.toLocaleString()} - ${rfq.budget_max.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className={daysLeft <= 7 ? 'text-destructive font-medium' : ''}>
                        {formatDistanceToNow(new Date(rfq.deadline), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{rfq.responses_count} responses</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Posted {formatDistanceToNow(new Date(rfq.created_at), { addSuffix: true })}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRFQ(rfq)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t('vendor.rfqs.viewDetails')}
                      </Button>
                      {rfq.status === 'open' && rfq.my_response_status === 'none' && (
                        <Button
                          size="sm"
                          onClick={() => handleSubmitResponse(rfq.id)}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          {t('vendor.rfqs.respond')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredAndSortedRFQs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {t('vendor.rfqs.noRFQsFound')}
                </h3>
                <p className="text-muted-foreground">
                  {t('vendor.rfqs.noRFQsDesc')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* RFQ Detail Modal */}
      {selectedRFQ && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedRFQ.title}</CardTitle>
                  <p className="text-muted-foreground">{selectedRFQ.client_name}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedRFQ(null)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{t('vendor.rfqs.description')}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedRFQ.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">{t('vendor.rfqs.budget')}</h4>
                  <p className="text-sm">
                    ${selectedRFQ.budget_min.toLocaleString()} - ${selectedRFQ.budget_max.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">{t('vendor.rfqs.deadline')}</h4>
                  <p className="text-sm">
                    {selectedRFQ.deadline.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium">{t('vendor.rfqs.requirements')}</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                  {selectedRFQ.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{selectedRFQ.category}</Badge>
                  <Badge 
                    variant={selectedRFQ.status === 'open' ? 'default' : 'secondary'}
                  >
                    {selectedRFQ.status}
                  </Badge>
                </div>
                {selectedRFQ.status === 'open' && selectedRFQ.my_response_status === 'none' && (
                  <Button onClick={() => handleSubmitResponse(selectedRFQ.id)}>
                    <Send className="w-4 h-4 mr-2" />
                    {t('vendor.rfqs.submitResponse')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};