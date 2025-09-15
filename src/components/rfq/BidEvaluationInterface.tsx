import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Bid } from '@/hooks/useBids';
import { supabase } from '@/integrations/supabase/client';
import { 
  Award, 
  Star, 
  Clock, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Shield,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface BidEvaluationInterfaceProps {
  rfqId: string;
  bids: Bid[];
  onAwarded?: (winningBidId: string) => void;
}

interface EvaluationCriteria {
  price: number;
  timeline: number;
  quality: number;
  experience: number;
}

export const BidEvaluationInterface = ({ rfqId, bids, onAwarded }: BidEvaluationInterfaceProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [selectedBids, setSelectedBids] = useState<string[]>([]);
  const [evaluationNotes, setEvaluationNotes] = useState('');
  const [selectedWinner, setSelectedWinner] = useState<string>('');
  const [awardingBid, setAwardingBid] = useState(false);
  const [showAwardDialog, setShowAwardDialog] = useState(false);
  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriteria>({
    price: 40,
    timeline: 30,
    quality: 20,
    experience: 10
  });

  // Calculate scores for each bid
  const scoredBids = useMemo(() => {
    if (bids.length === 0) return [];

    const minPrice = Math.min(...bids.map(b => b.total_price));
    const maxPrice = Math.max(...bids.map(b => b.total_price));
    const minTimeline = Math.min(...bids.map(b => b.delivery_timeline_days));
    const maxTimeline = Math.max(...bids.map(b => b.delivery_timeline_days));

    return bids.map(bid => {
      // Price score (lower is better)
      const priceScore = maxPrice > minPrice 
        ? ((maxPrice - bid.total_price) / (maxPrice - minPrice)) * 100
        : 100;

      // Timeline score (faster is better)  
      const timelineScore = maxTimeline > minTimeline
        ? ((maxTimeline - bid.delivery_timeline_days) / (maxTimeline - minTimeline)) * 100
        : 100;

      // Quality score (assuming 5-star rating system)
      const qualityScore = 80; // Default quality score - would be based on vendor ratings

      // Experience score (based on vendor history)
      const experienceScore = 75; // Default experience score - would be based on vendor track record

      // Calculate weighted total score
      const totalScore = (
        (priceScore * evaluationCriteria.price / 100) +
        (timelineScore * evaluationCriteria.timeline / 100) +
        (qualityScore * evaluationCriteria.quality / 100) +
        (experienceScore * evaluationCriteria.experience / 100)
      );

      return {
        ...bid,
        scores: {
          price: priceScore,
          timeline: timelineScore,
          quality: qualityScore,
          experience: experienceScore,
          total: totalScore
        }
      };
    }).sort((a, b) => b.scores.total - a.scores.total);
  }, [bids, evaluationCriteria]);

  const handleBidSelection = (bidId: string, selected: boolean) => {
    setSelectedBids(prev => 
      selected 
        ? [...prev, bidId]
        : prev.filter(id => id !== bidId)
    );
  };

  const handleAwardBid = async () => {
    if (!selectedWinner) return;

    try {
      setAwardingBid(true);

      // Use Edge Function to perform award with proper permissions
      const { data, error } = await supabase.functions.invoke('award_bid', {
        body: {
          rfq_id: rfqId,
          bid_id: selectedWinner,
          notes: evaluationNotes
        }
      });

      if (error) throw error;

      toast({
        title: language === 'ar' ? 'تم ربح العرض' : 'Bid Awarded',
        description: language === 'ar' ? 'تم ترسية العرض بنجاح' : 'Bid has been awarded successfully',
      });

      setShowAwardDialog(false);
      onAwarded?.(selectedWinner);
    } catch (error) {
      console.error('Error awarding bid:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'فشل في ترسية العرض' : 'Failed to award bid',
        variant: 'destructive'
      });
    } finally {
      setAwardingBid(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under_review': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  if (bids.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Award className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {language === 'ar' ? 'لا توجد عروض للتقييم' : 'No Bids to Evaluate'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'لم يتم تقديم أي عروض لهذا الطلب حتى الآن' : 'No bids have been submitted for this RFQ yet'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Evaluation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {language === 'ar' ? 'معايير التقييم' : 'Evaluation Criteria'}
          </CardTitle>
          <CardDescription>
            {language === 'ar' ? 'اضبط أوزان معايير التقييم لحساب النتائج' : 'Adjust evaluation criteria weights to calculate scores'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>{language === 'ar' ? 'السعر' : 'Price'} ({evaluationCriteria.price}%)</Label>
              <Select 
                value={evaluationCriteria.price.toString()} 
                onValueChange={(value) => setEvaluationCriteria(prev => ({ ...prev, price: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50, 60].map(val => (
                    <SelectItem key={val} value={val.toString()}>{val}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{language === 'ar' ? 'الجدول الزمني' : 'Timeline'} ({evaluationCriteria.timeline}%)</Label>
              <Select 
                value={evaluationCriteria.timeline.toString()}
                onValueChange={(value) => setEvaluationCriteria(prev => ({ ...prev, timeline: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map(val => (
                    <SelectItem key={val} value={val.toString()}>{val}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{language === 'ar' ? 'الجودة' : 'Quality'} ({evaluationCriteria.quality}%)</Label>
              <Select 
                value={evaluationCriteria.quality.toString()}
                onValueChange={(value) => setEvaluationCriteria(prev => ({ ...prev, quality: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40].map(val => (
                    <SelectItem key={val} value={val.toString()}>{val}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{language === 'ar' ? 'الخبرة' : 'Experience'} ({evaluationCriteria.experience}%)</Label>
              <Select 
                value={evaluationCriteria.experience.toString()}
                onValueChange={(value) => setEvaluationCriteria(prev => ({ ...prev, experience: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 30].map(val => (
                    <SelectItem key={val} value={val.toString()}>{val}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bid Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {language === 'ar' ? 'مقارنة العروض' : 'Bid Comparison'}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedBids([])}
                disabled={selectedBids.length === 0}
              >
                {language === 'ar' ? 'إلغاء التحديد' : 'Clear Selection'}
              </Button>
              <Dialog open={showAwardDialog} onOpenChange={setShowAwardDialog}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    disabled={selectedBids.length === 0}
                    className="gap-2"
                  >
                    <Award className="h-4 w-4" />
                    {language === 'ar' ? 'ترسية العرض' : 'Award Bid'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {language === 'ar' ? 'ترسية العرض' : 'Award Bid'}
                    </DialogTitle>
                    <DialogDescription>
                      {language === 'ar' ? 'اختر العرض الفائز وأضف ملاحظات التقييم' : 'Select the winning bid and add evaluation notes'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>{language === 'ar' ? 'العرض الفائز' : 'Winning Bid'}</Label>
                      <Select value={selectedWinner} onValueChange={setSelectedWinner}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'ar' ? 'اختر العرض الفائز' : 'Select winning bid'} />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedBids.map(bidId => {
                            const bid = scoredBids.find(b => b.id === bidId);
                            return (
                              <SelectItem key={bidId} value={bidId}>
                                {bid?.total_price.toLocaleString()} {bid?.currency} - {bid?.delivery_timeline_days} {language === 'ar' ? 'يوم' : 'days'}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{language === 'ar' ? 'ملاحظات التقييم' : 'Evaluation Notes'}</Label>
                      <Textarea
                        value={evaluationNotes}
                        onChange={(e) => setEvaluationNotes(e.target.value)}
                        placeholder={language === 'ar' ? 'أضف ملاحظات حول قرار الترسية...' : 'Add notes about the award decision...'}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAwardDialog(false)}>
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </Button>
                    <Button onClick={handleAwardBid} disabled={!selectedWinner || awardingBid}>
                      {awardingBid ? (language === 'ar' ? 'جاري الترسية...' : 'Awarding...') : (language === 'ar' ? 'تأكيد الترسية' : 'Confirm Award')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scoredBids.map((bid, index) => (
              <Card key={bid.id} className={`transition-all ${selectedBids.includes(bid.id) ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedBids.includes(bid.id)}
                        onCheckedChange={(checked) => handleBidSelection(bid.id, checked as boolean)}
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={index === 0 ? 'default' : 'secondary'}>
                            #{index + 1} {index === 0 && (language === 'ar' ? 'الأفضل' : 'Best')}
                          </Badge>
                          {getStatusIcon(bid.status)}
                          <span className="text-sm font-medium capitalize">{bid.status.replace('_', ' ')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'مقدم في' : 'Submitted on'} {format(new Date(bid.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{Math.round(bid.scores.total)}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'النتيجة الإجمالية' : 'Total Score'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-semibold">{bid.total_price.toLocaleString()} {bid.currency}</p>
                        <p className={`text-xs ${getScoreColor(bid.scores.price)}`}>
                          {language === 'ar' ? 'نقاط السعر' : 'Price Score'}: {Math.round(bid.scores.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-semibold">{bid.delivery_timeline_days} {language === 'ar' ? 'يوم' : 'days'}</p>
                        <p className={`text-xs ${getScoreColor(bid.scores.timeline)}`}>
                          {language === 'ar' ? 'نقاط الوقت' : 'Time Score'}: {Math.round(bid.scores.timeline)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <div>
                        <p className="font-semibold">{language === 'ar' ? 'جيد' : 'Good'}</p>
                        <p className={`text-xs ${getScoreColor(bid.scores.quality)}`}>
                          {language === 'ar' ? 'نقاط الجودة' : 'Quality Score'}: {Math.round(bid.scores.quality)}
                        </p>
                      </div>
                    </div>
                    {bid.warranty_period_months && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-semibold">{bid.warranty_period_months} {language === 'ar' ? 'شهر' : 'months'}</p>
                          <p className="text-xs text-muted-foreground">{language === 'ar' ? 'ضمان' : 'Warranty'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      {language === 'ar' ? 'تفاصيل العرض' : 'Proposal Details'}
                    </p>
                    <p className="text-sm">{bid.proposal}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};