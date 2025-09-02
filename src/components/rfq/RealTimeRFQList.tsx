import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow, format } from "date-fns";
import { BidSubmissionModal } from "./BidSubmissionModal";
import { 
  Search, 
  Calendar, 
  DollarSign, 
  Clock, 
  MapPin,
  Building,
  TrendingUp,
  Users,
  Eye,
  Send
} from "lucide-react";

interface RFQData {
  id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  currency: string;
  submission_deadline: string;
  project_start_date?: string;
  delivery_location?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: string;
  created_at: string;
  client_id: string;
  requirements?: any;
  evaluation_criteria?: any;
  category_name?: string;
  category_name_ar?: string;
  client_full_name?: string;
  client_company_name?: string;
  bid_count?: number;
}

interface RealTimeRFQListProps {
  userRole: 'client' | 'vendor';
  showActions?: boolean;
}

export const RealTimeRFQList = ({ userRole, showActions = true }: RealTimeRFQListProps) => {
  const [rfqs, setRfqs] = useState<RFQData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [realTimeUpdates, setRealTimeUpdates] = useState(0);

  const { user } = useAuth();
  const { language } = useLanguage();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch RFQs with real-time updates
  useEffect(() => {
    if (!user) return;

    const fetchRFQs = async () => {
      setLoading(true);
    const fetchRFQs = async () => {
      setLoading(true);
      try {
        // First get the RFQs
        let rfqQuery = supabase
          .from('rfqs')
          .select('*');

        // Filter based on user role
        if (userRole === 'client') {
          rfqQuery = rfqQuery.eq('client_id', user.id);
        } else {
          rfqQuery = rfqQuery
            .eq('is_public', true)
            .eq('status', 'published');
        }

        const { data: rfqData, error: rfqError } = await rfqQuery
          .order('created_at', { ascending: false });

        if (rfqError) {
          console.error('Error fetching RFQs:', rfqError);
          toast({
            title: 'Error',
            description: 'Failed to fetch RFQs',
            variant: 'destructive'
          });
          return;
        }

        if (!rfqData || rfqData.length === 0) {
          setRfqs([]);
          return;
        }

        // Get additional data
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

        const processedRFQs: RFQData[] = rfqData.map(rfq => {
          const category = categories.find(c => c.id === rfq.category_id);
          const profile = profiles.find(p => p.user_id === rfq.client_id);
          
          return {
            ...rfq,
            category_name: category?.name,
            category_name_ar: category?.name_ar,
            client_full_name: profile?.full_name,
            client_company_name: profile?.company_name,
            bid_count: bidCounts[rfq.id] || 0
          };
        });

        setRfqs(processedRFQs);
      } catch (error) {
        console.error('Error in fetchRFQs:', error);
      } finally {
        setLoading(false);
      }
    };
    };

    fetchRFQs();

    // Set up real-time subscription
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
              title: language === 'ar' ? 'طلب جديد' : 'New RFQ',
              description: language === 'ar' ? 'تم إضافة طلب تسعير جديد' : 'A new RFQ has been added'
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userRole, language, realTimeUpdates]);

  // Filter RFQs based on search and filters
  const filteredRFQs = useMemo(() => {
    return rfqs.filter(rfq => {
      const matchesSearch = 
        rfq.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        rfq.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (rfq.client_company_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || rfq.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [rfqs, debouncedSearchTerm, statusFilter, priorityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'hsl(var(--success))';
      case 'draft': return 'hsl(var(--muted-foreground))';
      case 'evaluation': return 'hsl(var(--warning))';
      case 'awarded': return 'hsl(var(--primary))';
      case 'cancelled': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'hsl(var(--destructive))';
      case 'high': return 'hsl(var(--warning))';
      case 'medium': return 'hsl(var(--primary))';
      case 'low': return 'hsl(var(--muted-foreground))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const formatBudget = (min?: number, max?: number, currency = 'SAR') => {
    if (!min && !max) return language === 'ar' ? 'غير محدد' : 'Not specified';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
    if (min) return `${language === 'ar' ? 'من' : 'From'} ${min.toLocaleString()} ${currency}`;
    if (max) return `${language === 'ar' ? 'حتى' : 'Up to'} ${max.toLocaleString()} ${currency}`;
    return language === 'ar' ? 'غير محدد' : 'Not specified';
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ar' ? 'البحث في الطلبات...' : 'Search RFQs...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="published">{language === 'ar' ? 'منشور' : 'Published'}</SelectItem>
                <SelectItem value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</SelectItem>
                <SelectItem value="evaluation">{language === 'ar' ? 'تحت التقييم' : 'Under Evaluation'}</SelectItem>
                <SelectItem value="awarded">{language === 'ar' ? 'تم الترسية' : 'Awarded'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'الأولوية' : 'Priority'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع الأولويات' : 'All Priorities'}</SelectItem>
                <SelectItem value="urgent">{language === 'ar' ? 'عاجل' : 'Urgent'}</SelectItem>
                <SelectItem value="high">{language === 'ar' ? 'عالية' : 'High'}</SelectItem>
                <SelectItem value="medium">{language === 'ar' ? 'متوسطة' : 'Medium'}</SelectItem>
                <SelectItem value="low">{language === 'ar' ? 'منخفضة' : 'Low'}</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              {filteredRFQs.length} {language === 'ar' ? 'طلب' : 'RFQs'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFQ List */}
      <div className="space-y-4">
        {filteredRFQs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                {language === 'ar' ? 'لا توجد طلبات' : 'No RFQs Found'}
              </h3>
              <p className="text-muted-foreground">
                {userRole === 'client' 
                  ? (language === 'ar' ? 'لم تقم بإنشاء أي طلبات بعد' : "You haven't created any RFQs yet")
                  : (language === 'ar' ? 'لا توجد طلبات متاحة حالياً' : 'No RFQs available at the moment')
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRFQs.map((rfq) => {
            const daysLeft = getDaysUntilDeadline(rfq.submission_deadline);
            const bidCount = rfq.bid_count || 0;
            
            return (
              <Card key={rfq.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold line-clamp-2 flex-1 mr-4">
                          {rfq.title}
                        </h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <Badge 
                            variant="outline" 
                            style={{ borderColor: getStatusColor(rfq.status), color: getStatusColor(rfq.status) }}
                          >
                            {language === 'ar' 
                              ? (rfq.status === 'published' ? 'منشور' : 
                                 rfq.status === 'draft' ? 'مسودة' : 
                                 rfq.status === 'evaluation' ? 'تحت التقييم' : 
                                 rfq.status === 'awarded' ? 'تم الترسية' : rfq.status)
                              : rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)
                            }
                          </Badge>
                          <Badge 
                            variant="outline"
                            style={{ borderColor: getPriorityColor(rfq.priority), color: getPriorityColor(rfq.priority) }}
                          >
                            {language === 'ar' 
                              ? (rfq.priority === 'urgent' ? 'عاجل' : 
                                 rfq.priority === 'high' ? 'عالية' : 
                                 rfq.priority === 'medium' ? 'متوسطة' : 'منخفضة')
                              : rfq.priority.charAt(0).toUpperCase() + rfq.priority.slice(1)
                            }
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {rfq.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>{formatBudget(rfq.budget_min, rfq.budget_max, rfq.currency)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className={daysLeft <= 3 ? 'text-destructive font-medium' : ''}>
                            {daysLeft > 0 
                              ? `${daysLeft} ${language === 'ar' ? 'يوم متبقي' : 'days left'}`
                              : (language === 'ar' ? 'انتهت المهلة' : 'Expired')
                            }
                          </span>
                        </div>

                        {rfq.delivery_location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate">{rfq.delivery_location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{bidCount} {language === 'ar' ? 'عرض' : 'bids'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDistanceToNow(new Date(rfq.created_at), { addSuffix: true })}</span>
                          </div>
                            {rfq.client_company_name && (
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                <span>{rfq.client_company_name}</span>
                              </div>
                            )}
                        </div>

                        {showActions && userRole === 'vendor' && rfq.status === 'published' && daysLeft > 0 && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              {language === 'ar' ? 'عرض' : 'View'}
                            </Button>
                            <BidSubmissionModal rfq={rfq as any}>
                              <Button size="sm">
                                <Send className="w-4 h-4 mr-2" />
                                {language === 'ar' ? 'تقديم عرض' : 'Submit Bid'}
                              </Button>
                            </BidSubmissionModal>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};