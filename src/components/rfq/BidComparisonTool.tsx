import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  Users,
  Building,
  MapPin,
  Filter,
  ArrowUpDown,
  BarChart3,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react";

interface BidData {
  id: string;
  rfq_id: string;
  vendor_id: string;
  total_price: number;
  currency: string;
  delivery_timeline_days: number;
  proposal: string;
  technical_specifications?: any;
  warranty_period_months?: number;
  payment_terms?: string;
  status: string;
  submitted_at: string;
  vendor_full_name?: string;
  vendor_company_name?: string;
  vendor_address?: string;
  completion_rate?: number;
  quality_score?: number;
  response_time_avg_hours?: number;
  total_completed_orders?: number;
}

interface BidComparisonToolProps {
  rfqId: string;
  onBidSelect?: (bidId: string, action: 'accept' | 'reject') => void;
}

export const BidComparisonTool = ({ rfqId, onBidSelect }: BidComparisonToolProps) => {
  const [bids, setBids] = useState<BidData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBids, setSelectedBids] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'timeline' | 'rating' | 'submitted'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { language } = useLanguage();

  useEffect(() => {
    fetchBids();
  }, [rfqId]);

  const fetchBids = async () => {
    setLoading(true);
    try {
      // First get the bids
      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .select('*')
        .eq('rfq_id', rfqId)
        .order('submitted_at', { ascending: false });

      if (bidError) {
        console.error('Error fetching bids:', bidError);
        toast({
          title: 'Error',
          description: 'Failed to fetch bids',
          variant: 'destructive'
        });
        return;
      }

      if (!bidData || bidData.length === 0) {
        setBids([]);
        return;
      }

      // Get vendor profiles and performance metrics
      const vendorIds = bidData.map(bid => bid.vendor_id).filter(Boolean);

      const [profilesResult, metricsResult] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('user_id, full_name, company_name, address')
          .in('user_id', vendorIds),
        supabase
          .from('vendor_performance_metrics')
          .select('vendor_id, completion_rate, quality_score, response_time_avg_hours, total_completed_orders')
          .in('vendor_id', vendorIds)
      ]);

      const profiles = profilesResult.data || [];
      const metrics = metricsResult.data || [];

      const processedBids: BidData[] = bidData.map(bid => {
        const profile = profiles.find(p => p.user_id === bid.vendor_id);
        const metric = metrics.find(m => m.vendor_id === bid.vendor_id);
        
        return {
          ...bid,
          vendor_full_name: profile?.full_name,
          vendor_company_name: profile?.company_name,
          vendor_address: profile?.address,
          completion_rate: metric?.completion_rate,
          quality_score: metric?.quality_score,
          response_time_avg_hours: metric?.response_time_avg_hours,
          total_completed_orders: metric?.total_completed_orders
        };
      });

      setBids(processedBids);
    } catch (error) {
      console.error('Error in fetchBids:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort bids
  const filteredAndSortedBids = [...bids]
    .filter(bid => filterStatus === 'all' || bid.status === filterStatus)
    .sort((a, b) => {
      let aValue: number, bValue: number;

      switch (sortBy) {
        case 'price':
          aValue = a.total_price;
          bValue = b.total_price;
          break;
        case 'timeline':
          aValue = a.delivery_timeline_days;
          bValue = b.delivery_timeline_days;
          break;
        case 'rating':
          aValue = a.quality_score || 0;
          bValue = b.quality_score || 0;
          break;
        case 'submitted':
          aValue = new Date(a.submitted_at).getTime();
          bValue = new Date(b.submitted_at).getTime();
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const toggleBidSelection = (bidId: string) => {
    setSelectedBids(prev => 
      prev.includes(bidId) 
        ? prev.filter(id => id !== bidId)
        : [...prev, bidId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'hsl(var(--primary))';
      case 'under_review': return 'hsl(var(--warning))';
      case 'accepted': return 'hsl(var(--success))';
      case 'rejected': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'hsl(var(--success))';
    if (rating >= 4.0) return 'hsl(var(--primary))';
    if (rating >= 3.5) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const calculateScore = (bid: BidData) => {
    if (!bid.completion_rate && !bid.quality_score) return 0;

    // Simple scoring algorithm (can be enhanced)
    const priceScore = Math.max(0, 100 - (bid.total_price / 10000)); // Lower price = higher score
    const timelineScore = Math.max(0, 100 - bid.delivery_timeline_days); // Faster delivery = higher score
    const qualityScore = (bid.quality_score || 0) * 20; // Quality rating out of 5 * 20
    const completionScore = bid.completion_rate || 0; // Completion rate as percentage

    return Math.round((priceScore * 0.3 + timelineScore * 0.2 + qualityScore * 0.3 + completionScore * 0.2));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {language === 'ar' ? 'مقارنة العروض' : 'Bid Comparison'}
            </span>
            <Badge variant="outline">
              {filteredAndSortedBids.length} {language === 'ar' ? 'عرض' : 'Bids'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={language === 'ar' ? 'تصفية بالحالة' : 'Filter by Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="submitted">{language === 'ar' ? 'مقدم' : 'Submitted'}</SelectItem>
                <SelectItem value="under_review">{language === 'ar' ? 'تحت المراجعة' : 'Under Review'}</SelectItem>
                <SelectItem value="accepted">{language === 'ar' ? 'مقبول' : 'Accepted'}</SelectItem>
                <SelectItem value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">{language === 'ar' ? 'السعر (الأقل أولاً)' : 'Price (Low to High)'}</SelectItem>
                <SelectItem value="price-desc">{language === 'ar' ? 'السعر (الأعلى أولاً)' : 'Price (High to Low)'}</SelectItem>
                <SelectItem value="timeline-asc">{language === 'ar' ? 'المدة الزمنية (الأقصر أولاً)' : 'Timeline (Shortest First)'}</SelectItem>
                <SelectItem value="timeline-desc">{language === 'ar' ? 'المدة الزمنية (الأطول أولاً)' : 'Timeline (Longest First)'}</SelectItem>
                <SelectItem value="rating-desc">{language === 'ar' ? 'التقييم (الأعلى أولاً)' : 'Rating (Highest First)'}</SelectItem>
                <SelectItem value="submitted-desc">{language === 'ar' ? 'الأحدث أولاً' : 'Most Recent'}</SelectItem>
              </SelectContent>
            </Select>

            {selectedBids.length > 0 && (
              <Button variant="outline" onClick={() => setSelectedBids([])}>
                {language === 'ar' ? 'إلغاء التحديد' : 'Clear Selection'}
              </Button>
            )}
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">
                {language === 'ar' ? 'عرض قائمة' : 'List View'}
              </TabsTrigger>
              <TabsTrigger value="comparison">
                {language === 'ar' ? 'مقارنة مفصلة' : 'Detailed Comparison'}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                {language === 'ar' ? 'التحليلات' : 'Analytics'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {filteredAndSortedBids.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'ar' ? 'لا توجد عروض' : 'No Bids Found'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'ar' ? 'لم يتم تقديم أي عروض لهذا الطلب بعد' : 'No bids have been submitted for this RFQ yet'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAndSortedBids.map((bid) => {
                  const score = calculateScore(bid);
                  
                  return (
                    <Card key={bid.id} className={`transition-all ${selectedBids.includes(bid.id) ? 'ring-2 ring-primary' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedBids.includes(bid.id)}
                              onCheckedChange={() => toggleBidSelection(bid.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">
                                  {bid.vendor_company_name || bid.vendor_full_name}
                                </h3>
                                <Badge 
                                  variant="outline"
                                  style={{ borderColor: getStatusColor(bid.status), color: getStatusColor(bid.status) }}
                                >
                                  {language === 'ar' 
                                    ? (bid.status === 'submitted' ? 'مقدم' : 
                                       bid.status === 'under_review' ? 'تحت المراجعة' : 
                                       bid.status === 'accepted' ? 'مقبول' : 
                                       bid.status === 'rejected' ? 'مرفوض' : bid.status)
                                    : bid.status.replace('_', ' ').toUpperCase()
                                  }
                                </Badge>
                                {bid.quality_score && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4" style={{ color: getRatingColor(bid.quality_score) }} />
                                    <span className="text-sm" style={{ color: getRatingColor(bid.quality_score) }}>
                                      {bid.quality_score?.toFixed(1) || 'N/A'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {bid.total_price.toLocaleString()} {bid.currency}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span>{bid.delivery_timeline_days} {language === 'ar' ? 'يوم' : 'days'}</span>
                                </div>

                                {bid.warranty_period_months && (
                                  <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-muted-foreground" />
                                    <span>{bid.warranty_period_months} {language === 'ar' ? 'شهر ضمان' : 'months warranty'}</span>
                                  </div>
                                )}

                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                  <span>{language === 'ar' ? 'نقاط' : 'Score'}: {score}/100</span>
                                </div>
                              </div>

                              {bid.completion_rate && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground mb-3">
                                  <div>{language === 'ar' ? 'معدل الإنجاز' : 'Completion Rate'}: {bid.completion_rate}%</div>
                                  <div>{language === 'ar' ? 'المشاريع المكتملة' : 'Completed Projects'}: {bid.total_completed_orders}</div>
                                  <div>{language === 'ar' ? 'متوسط الاستجابة' : 'Avg Response'}: {bid.response_time_avg_hours}h</div>
                                </div>
                              )}

                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {bid.proposal}
                              </p>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {language === 'ar' ? 'قُدم' : 'Submitted'} {formatDistanceToNow(new Date(bid.submitted_at), { addSuffix: true })}
                                </span>
                                {bid.vendor_address && (
                                  <>
                                    <MapPin className="w-3 h-3 ml-2" />
                                    <span>{bid.vendor_address}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {onBidSelect && bid.status === 'submitted' && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onBidSelect(bid.id, 'reject')}
                              >
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                {language === 'ar' ? 'رفض' : 'Reject'}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onBidSelect(bid.id, 'accept')}
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {language === 'ar' ? 'قبول' : 'Accept'}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="comparison">
              {selectedBids.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'ar' ? 'اختر العروض للمقارنة' : 'Select Bids to Compare'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'ar' ? 'اختر عرضين أو أكثر من القائمة أعلاه لمقارنتها' : 'Select two or more bids from the list above to compare them side by side'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {selectedBids.map(bidId => {
                    const bid = bids.find(b => b.id === bidId);
                    if (!bid) return null;

                    const score = calculateScore(bid);

                    return (
                      <Card key={bidId} className="border-2 border-primary/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            {bid.vendor_company_name || bid.vendor_full_name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">{language === 'ar' ? 'السعر' : 'Price'}</span>
                              <span className="font-medium">{bid.total_price.toLocaleString()} {bid.currency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">{language === 'ar' ? 'مدة التسليم' : 'Timeline'}</span>
                              <span>{bid.delivery_timeline_days} {language === 'ar' ? 'يوم' : 'days'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">{language === 'ar' ? 'النقاط' : 'Score'}</span>
                              <span className="font-medium">{score}/100</span>
                            </div>
                            {bid.quality_score && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">{language === 'ar' ? 'التقييم' : 'Rating'}</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3" style={{ color: getRatingColor(bid.quality_score) }} />
                                    <span>{bid.quality_score?.toFixed(1) || 'N/A'}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">{language === 'ar' ? 'معدل الإنجاز' : 'Completion'}</span>
                                  <span>{bid.completion_rate}%</span>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{filteredAndSortedBids.length}</div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'إجمالي العروض' : 'Total Bids'}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {filteredAndSortedBids.length > 0 
                        ? Math.round(filteredAndSortedBids.reduce((sum, bid) => sum + bid.total_price, 0) / filteredAndSortedBids.length).toLocaleString()
                        : 0
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'متوسط السعر' : 'Average Price'}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {filteredAndSortedBids.length > 0 
                        ? Math.round(filteredAndSortedBids.reduce((sum, bid) => sum + bid.delivery_timeline_days, 0) / filteredAndSortedBids.length)
                        : 0
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">{language === 'ar' ? 'متوسط المدة' : 'Average Timeline'} ({language === 'ar' ? 'أيام' : 'days'})</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'توزيع العروض' : 'Bid Distribution'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredAndSortedBids.map((bid, index) => {
                      const maxPrice = Math.max(...filteredAndSortedBids.map(b => b.total_price));
                      const percentage = maxPrice > 0 ? (bid.total_price / maxPrice) * 100 : 0;
                      
                      return (
                        <div key={bid.id} className="flex items-center gap-4">
                          <div className="w-24 text-sm truncate">
                            {bid.vendor_company_name || bid.vendor_full_name}
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-24 text-sm text-right">
                            {bid.total_price.toLocaleString()} {bid.currency}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};