import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartSkeleton } from "@/components/ui/ChartSkeleton";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
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
  status: 'open' | 'closed' | 'awarded';
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
  const languageContext = useOptionalLanguage();
  const { t, isRTL } = languageContext || { 
    t: (key: string) => key, 
    isRTL: false 
  };

  const mockRFQs: RFQ[] = [
    {
      id: '1',
      title: t('vendor.rfqs.sampleRfq1Title') || 'Construction Project - Office Building',
      description: t('vendor.rfqs.sampleRfq1Description') || 'We need a construction company to build a 5-story office building in downtown area.',
      budget_min: 500000,
      budget_max: 750000,
      currency: 'USD',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      category: 'Construction',
      status: 'open',
      client_name: 'ABC Corporation',
      requirements: [
        t('vendor.rfqs.sampleRequirement1') || 'Licensed contractor', 
        t('vendor.rfqs.sampleRequirement2') || 'Insurance coverage', 
        t('vendor.rfqs.sampleRequirement3') || '5+ years experience'
      ],
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      responses_count: 12,
      my_response_status: 'none'
    },
    {
      id: '2', 
      title: t('vendor.rfqs.sampleRfq2Title') || 'Engineering Services - Bridge Design',
      description: t('vendor.rfqs.sampleRfq2Description') || 'Looking for structural engineering services for a new bridge project.',
      budget_min: 75000,
      budget_max: 100000,
      currency: 'USD',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      category: 'Engineering',
      status: 'open',
      client_name: 'City Planning Department',
      requirements: [
        t('vendor.rfqs.sampleRequirement4') || 'PE license required', 
        t('vendor.rfqs.sampleRequirement5') || 'Bridge design experience', 
        t('vendor.rfqs.sampleRequirement6') || 'CAD proficiency'
      ],
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      responses_count: 8,
      my_response_status: 'submitted'
    },
    {
      id: '3',
      title: t('vendor.rfqs.sampleRfq3Title') || 'IT Consulting - System Upgrade',
      description: t('vendor.rfqs.sampleRfq3Description') || 'Need IT consulting services for upgrading our legacy systems.',
      budget_min: 25000,
      budget_max: 40000,
      currency: 'USD',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      category: 'Technology',
      status: 'open',
      client_name: 'TechCorp Industries',
      requirements: [
        t('vendor.rfqs.sampleRequirement7') || 'Certified consultants', 
        t('vendor.rfqs.sampleRequirement8') || 'Legacy system experience', 
        t('vendor.rfqs.sampleRequirement9') || 'Available for on-site work'
      ],
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      responses_count: 15,
      my_response_status: 'none'
    },
    {
      id: '4',
      title: t('vendor.rfqs.sampleRfq4Title') || 'Marketing Campaign - Product Launch',
      description: t('vendor.rfqs.sampleRfq4Description') || 'Seeking creative agency for comprehensive marketing campaign.',
      budget_min: 50000,
      budget_max: 80000,
      currency: 'USD',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      category: 'Marketing',
      status: 'closed',
      client_name: 'Innovation Startup',
      requirements: [
        t('vendor.rfqs.sampleRequirement10') || 'Portfolio of successful campaigns', 
        t('vendor.rfqs.sampleRequirement11') || 'Digital marketing expertise', 
        t('vendor.rfqs.sampleRequirement12') || 'Brand development'
      ],
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      responses_count: 22,
      my_response_status: 'rejected'
    }
  ];

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

  // Load RFQs
  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setRFQs(mockRFQs);
      setLoading(false);
    }, 1000);
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