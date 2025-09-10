import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  DollarSign, 
  MapPin, 
  Calendar,
  FileText,
  Package,
  Users,
  Award,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Download,
  Send,
  Edit,
  Trash2,
  Plus,
  Building2,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RFQ {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  location: string;
  client: {
    name: string;
    company: string;
    rating: number;
  };
  requirements: string[];
  documents: string[];
  status: 'open' | 'closed' | 'awarded';
  bidsCount: number;
  createdAt: string;
  tags: string[];
}

interface Bid {
  id: string;
  rfqId: string;
  technicalProposal: string;
  commercialProposal: {
    totalPrice: number;
    currency: string;
    paymentTerms: string;
    warranty: string;
    timeline: string;
  };
  supportingDocuments: string[];
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submittedAt?: string;
  createdAt: string;
}

const RFQ_CATEGORIES = [
  'Construction & Building',
  'Electrical Services',
  'Plumbing & HVAC',
  'Interior Design',
  'Landscaping',
  'Cleaning Services',
  'Security Services',
  'IT & Technology',
  'Catering & Food Services',
  'Transportation & Logistics',
  'Professional Services',
  'Marketing & Advertising'
];

const PAYMENT_TERMS = [
  '30% upfront, 70% on completion',
  '50% upfront, 50% on completion',
  '100% on completion',
  'Monthly installments',
  'Custom terms'
];

const WARRANTY_OPTIONS = [
  '1 year',
  '2 years',
  '3 years',
  '5 years',
  'Lifetime',
  'Custom warranty'
];

export const EnhancedRFQBidding: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('open');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  
  // Mock data - in real app, this would come from API
  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: '1',
      title: 'Office Renovation Project',
      description: 'Complete office renovation including flooring, lighting, and furniture installation for 2000 sq ft space.',
      category: 'Interior Design',
      budget: { min: 50000, max: 75000, currency: 'SAR' },
      deadline: '2024-02-15',
      location: 'Riyadh, Saudi Arabia',
      client: { name: 'Ahmed Al-Rashid', company: 'Tech Solutions Inc.', rating: 4.8 },
      requirements: ['3+ years experience', 'Valid commercial registration', 'Insurance coverage'],
      documents: ['floor_plan.pdf', 'requirements_spec.pdf'],
      status: 'open',
      bidsCount: 12,
      createdAt: '2024-01-20',
      tags: ['office', 'renovation', 'interior']
    },
    {
      id: '2',
      title: 'LED Lighting Installation',
      description: 'Install energy-efficient LED lighting system for commercial building with smart controls.',
      category: 'Electrical Services',
      budget: { min: 15000, max: 25000, currency: 'SAR' },
      deadline: '2024-02-20',
      location: 'Jeddah, Saudi Arabia',
      client: { name: 'Sarah Johnson', company: 'Green Building Co.', rating: 4.6 },
      requirements: ['Electrical license', '5+ years experience', 'Energy efficiency certification'],
      documents: ['electrical_plan.pdf', 'specifications.pdf'],
      status: 'open',
      bidsCount: 8,
      createdAt: '2024-01-18',
      tags: ['electrical', 'led', 'smart', 'energy']
    }
  ]);

  const [bids, setBids] = useState<Bid[]>([]);
  const [currentBid, setCurrentBid] = useState<Bid>({
    id: '',
    rfqId: '',
    technicalProposal: '',
    commercialProposal: {
      totalPrice: 0,
      currency: 'SAR',
      paymentTerms: '',
      warranty: '',
      timeline: ''
    },
    supportingDocuments: [],
    status: 'draft',
    createdAt: new Date().toISOString()
  });

  const filteredRFQs = useMemo(() => {
    return rfqs.filter(rfq => {
      const matchesSearch = rfq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rfq.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rfq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || rfq.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;
      
      let matchesBudget = true;
      if (budgetFilter !== 'all') {
        const budget = rfq.budget.min;
        switch (budgetFilter) {
          case 'low': matchesBudget = budget < 10000; break;
          case 'medium': matchesBudget = budget >= 10000 && budget < 50000; break;
          case 'high': matchesBudget = budget >= 50000; break;
        }
      }
      
      return matchesSearch && matchesCategory && matchesStatus && matchesBudget;
    });
  }, [rfqs, searchTerm, categoryFilter, budgetFilter, statusFilter]);

  const handleViewRFQ = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setCurrentBid({
      id: '',
      rfqId: rfq.id,
      technicalProposal: '',
      commercialProposal: {
        totalPrice: 0,
        currency: rfq.budget.currency,
        paymentTerms: '',
        warranty: '',
        timeline: ''
      },
      supportingDocuments: [],
      status: 'draft',
      createdAt: new Date().toISOString()
    });
    setShowBidForm(true);
  };

  const handleSubmitBid = () => {
    if (!currentBid.technicalProposal || !currentBid.commercialProposal.totalPrice) {
      toast({
        title: t('common.error'),
        description: t('vendor.bidding.requiredFields'),
        variant: 'destructive'
      });
      return;
    }

    const newBid: Bid = {
      ...currentBid,
      id: Date.now().toString(),
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    setBids(prev => [...prev, newBid]);
    setShowBidForm(false);
    setSelectedRFQ(null);
    
    toast({
      title: t('common.success'),
      description: t('vendor.bidding.bidSubmitted')
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'awarded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('vendor.bidding.title')}</h1>
          <p className="text-muted-foreground">{t('vendor.bidding.description')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab('browse')}>
            <Eye className="h-4 w-4 mr-2" />
            {t('vendor.bidding.browseRFQs')}
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('myBids')}>
            <FileText className="h-4 w-4 mr-2" />
            {t('vendor.bidding.myBids')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">{t('vendor.bidding.browseRFQs')}</TabsTrigger>
          <TabsTrigger value="myBids">{t('vendor.bidding.myBids')}</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('vendor.bidding.searchRFQs')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('vendor.bidding.filterByCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    {RFQ_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('vendor.bidding.filterByBudget')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="low">{t('vendor.bidding.budgetLow')}</SelectItem>
                    <SelectItem value="medium">{t('vendor.bidding.budgetMedium')}</SelectItem>
                    <SelectItem value="high">{t('vendor.bidding.budgetHigh')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('vendor.bidding.filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="open">{t('common.open')}</SelectItem>
                    <SelectItem value="closed">{t('common.closed')}</SelectItem>
                    <SelectItem value="awarded">{t('common.awarded')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* RFQs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRFQs.map((rfq) => (
              <Card key={rfq.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg line-clamp-1">{rfq.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{rfq.description}</CardDescription>
                    </div>
                    <Badge className={cn("gap-1", getStatusColor(rfq.status))}>
                      {rfq.status === 'open' && <CheckCircle className="h-3 w-3" />}
                      {rfq.status === 'closed' && <AlertCircle className="h-3 w-3" />}
                      {rfq.status === 'awarded' && <Award className="h-3 w-3" />}
                      {t(`common.${rfq.status}`)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatCurrency(rfq.budget.min, rfq.budget.currency)} - {formatCurrency(rfq.budget.max, rfq.budget.currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(rfq.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{rfq.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{rfq.bidsCount} {t('vendor.bidding.bids')}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {rfq.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-sm text-muted-foreground">
                      {t('vendor.bidding.by')} {rfq.client.company}
                    </div>
                    <Button onClick={() => handleViewRFQ(rfq)} size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      {t('vendor.bidding.viewDetails')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRFQs.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('vendor.bidding.noRFQs')}</h3>
                <p className="text-muted-foreground text-center">
                  {t('vendor.bidding.noRFQsDescription')}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="myBids" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {bids.map((bid) => {
              const rfq = rfqs.find(r => r.id === bid.rfqId);
              return (
                <Card key={bid.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{rfq?.title}</h3>
                        <p className="text-muted-foreground">{rfq?.client.company}</p>
                      </div>
                      <Badge className={cn("gap-1", getBidStatusColor(bid.status))}>
                        {t(`vendor.bidding.status.${bid.status}`)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">{t('vendor.bidding.bidPrice')}:</span>
                        <span className="ml-2">{formatCurrency(bid.commercialProposal.totalPrice, bid.commercialProposal.currency)}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('vendor.bidding.timeline')}:</span>
                        <span className="ml-2">{bid.commercialProposal.timeline}</span>
                      </div>
                      <div>
                        <span className="font-medium">{t('vendor.bidding.submitted')}:</span>
                        <span className="ml-2">{bid.submittedAt ? formatDate(bid.submittedAt) : t('common.draft')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {bids.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('vendor.bidding.noBids')}</h3>
                <p className="text-muted-foreground text-center">
                  {t('vendor.bidding.noBidsDescription')}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Bid Submission Dialog */}
      <Dialog open={showBidForm} onOpenChange={setShowBidForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('vendor.bidding.submitBid')}</DialogTitle>
            <DialogDescription>
              {t('vendor.bidding.submitBidDescription')} - {selectedRFQ?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Technical Proposal */}
            <div>
              <Label htmlFor="technicalProposal" className="text-base font-medium">
                {t('vendor.bidding.technicalProposal')} *
              </Label>
              <Textarea
                id="technicalProposal"
                value={currentBid.technicalProposal}
                onChange={(e) => setCurrentBid(prev => ({ ...prev, technicalProposal: e.target.value }))}
                placeholder={t('vendor.bidding.technicalProposalPlaceholder')}
                rows={6}
                className="mt-2"
              />
            </div>

            {/* Commercial Proposal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalPrice">{t('vendor.bidding.totalPrice')} *</Label>
                <Input
                  id="totalPrice"
                  type="number"
                  value={currentBid.commercialProposal.totalPrice}
                  onChange={(e) => setCurrentBid(prev => ({
                    ...prev,
                    commercialProposal: {
                      ...prev.commercialProposal,
                      totalPrice: parseFloat(e.target.value) || 0
                    }
                  }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="currency">{t('vendor.bidding.currency')}</Label>
                <Select 
                  value={currentBid.commercialProposal.currency} 
                  onValueChange={(value) => setCurrentBid(prev => ({
                    ...prev,
                    commercialProposal: { ...prev.commercialProposal, currency: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">SAR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentTerms">{t('vendor.bidding.paymentTerms')}</Label>
                <Select 
                  value={currentBid.commercialProposal.paymentTerms} 
                  onValueChange={(value) => setCurrentBid(prev => ({
                    ...prev,
                    commercialProposal: { ...prev.commercialProposal, paymentTerms: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('vendor.bidding.selectPaymentTerms')} />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TERMS.map(term => (
                      <SelectItem key={term} value={term}>{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="warranty">{t('vendor.bidding.warranty')}</Label>
                <Select 
                  value={currentBid.commercialProposal.warranty} 
                  onValueChange={(value) => setCurrentBid(prev => ({
                    ...prev,
                    commercialProposal: { ...prev.commercialProposal, warranty: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('vendor.bidding.selectWarranty')} />
                  </SelectTrigger>
                  <SelectContent>
                    {WARRANTY_OPTIONS.map(warranty => (
                      <SelectItem key={warranty} value={warranty}>{warranty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="timeline">{t('vendor.bidding.timeline')}</Label>
              <Input
                id="timeline"
                value={currentBid.commercialProposal.timeline}
                onChange={(e) => setCurrentBid(prev => ({
                  ...prev,
                  commercialProposal: { ...prev.commercialProposal, timeline: e.target.value }
                }))}
                placeholder={t('vendor.bidding.timelinePlaceholder')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowBidForm(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmitBid}>
              <Send className="h-4 w-4 mr-2" />
              {t('vendor.bidding.submitBid')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
