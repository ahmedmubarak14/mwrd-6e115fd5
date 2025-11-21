import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  CheckCircle,
  Clock,
  TrendingUp,
  RefreshCw,
  Star,
  Award,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';

export interface SupplierPerformanceMetrics {
  vendor_id: string;
  order_completion_rate: number;
  on_time_delivery_rate: number;
  avg_quote_response_time_hours: number;
  repeat_business_rate: number;
  total_completed_orders: number;
  total_quotes_submitted: number;
  avg_rating: number;
  last_updated: string;
}

interface SupplierPerformanceScorecard Props {
  vendorId: string;
  compact?: boolean;
  className?: string;
}

export const SupplierPerformanceScorecard = ({
  vendorId,
  compact = false,
  className
}: SupplierPerformanceScorecardProps) => {
  const { t, isRTL } = useLanguage();
  const [metrics, setMetrics] = useState<SupplierPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPerformanceMetrics();
  }, [vendorId]);

  const fetchPerformanceMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the database function to calculate metrics
      const { data, error: fetchError } = await supabase.rpc(
        'calculate_vendor_performance_metrics',
        { p_vendor_id: vendorId }
      );

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        setMetrics(data[0]);
      } else {
        // No data yet - vendor is new
        setMetrics({
          vendor_id: vendorId,
          order_completion_rate: 0,
          on_time_delivery_rate: 0,
          avg_quote_response_time_hours: 0,
          repeat_business_rate: 0,
          total_completed_orders: 0,
          total_quotes_submitted: 0,
          avg_rating: 0,
          last_updated: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load performance metrics');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceRating = (rate: number): { label: string; color: string; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
    if (rate >= 95) return {
      label: isRTL ? 'ممتاز' : 'Excellent',
      color: 'text-green-600',
      badgeVariant: 'default'
    };
    if (rate >= 85) return {
      label: isRTL ? 'جيد جداً' : 'Very Good',
      color: 'text-blue-600',
      badgeVariant: 'default'
    };
    if (rate >= 75) return {
      label: isRTL ? 'جيد' : 'Good',
      color: 'text-yellow-600',
      badgeVariant: 'secondary'
    };
    if (rate >= 60) return {
      label: isRTL ? 'مقبول' : 'Fair',
      color: 'text-orange-600',
      badgeVariant: 'secondary'
    };
    return {
      label: isRTL ? 'يحتاج تحسين' : 'Needs Improvement',
      color: 'text-red-600',
      badgeVariant: 'destructive'
    };
  };

  const getResponseTimeRating = (hours: number): { label: string; color: string } => {
    if (hours <= 2) return {
      label: isRTL ? 'سريع جداً' : 'Very Fast',
      color: 'text-green-600'
    };
    if (hours <= 6) return {
      label: isRTL ? 'سريع' : 'Fast',
      color: 'text-blue-600'
    };
    if (hours <= 24) return {
      label: isRTL ? 'مقبول' : 'Acceptable',
      color: 'text-yellow-600'
    };
    if (hours <= 48) return {
      label: isRTL ? 'بطيء' : 'Slow',
      color: 'text-orange-600'
    };
    return {
      label: isRTL ? 'بطيء جداً' : 'Very Slow',
      color: 'text-red-600'
    };
  };

  const formatResponseTime = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return isRTL ? `${minutes} دقيقة` : `${minutes} min`;
    }
    if (hours < 24) {
      return isRTL ? `${hours.toFixed(1)} ساعة` : `${hours.toFixed(1)} hrs`;
    }
    const days = Math.round(hours / 24);
    return isRTL ? `${days} يوم` : `${days} days`;
  };

  const calculateOverallScore = (): number => {
    if (!metrics) return 0;

    // Weighted average of all metrics
    const weights = {
      completion: 0.3,
      onTime: 0.3,
      response: 0.2,
      repeat: 0.2,
    };

    // Response time scoring (inverse - lower is better)
    const responseScore = Math.max(0, 100 - (metrics.avg_quote_response_time_hours / 48) * 100);

    const overallScore =
      (metrics.order_completion_rate * weights.completion) +
      (metrics.on_time_delivery_rate * weights.onTime) +
      (responseScore * weights.response) +
      (metrics.repeat_business_rate * weights.repeat);

    return Math.round(overallScore);
  };

  if (loading) {
    return (
      <Card className={cn('', className)}>
        <CardContent className="pt-6">
          <LoadingSpinner size="sm" text={isRTL ? 'جاري تحميل بيانات الأداء...' : 'Loading performance data...'} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('border-destructive', className)}>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const overallScore = calculateOverallScore();
  const overallRating = getPerformanceRating(overallScore);
  const completionRating = getPerformanceRating(metrics.order_completion_rate);
  const onTimeRating = getPerformanceRating(metrics.on_time_delivery_rate);
  const responseRating = getResponseTimeRating(metrics.avg_quote_response_time_hours);
  const repeatRating = getPerformanceRating(metrics.repeat_business_rate);

  // Compact view for supplier directory listings
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-sm">{overallScore}%</span>
        </div>
        <Badge variant={overallRating.badgeVariant} className="text-xs">
          {overallRating.label}
        </Badge>
        <span className="text-xs text-muted-foreground">
          ({metrics.total_completed_orders} {isRTL ? 'طلب' : 'orders'})
        </span>
      </div>
    );
  }

  // Full scorecard view
  return (
    <Card className={cn('', className)} dir={isRTL ? 'rtl' : 'ltr'}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {isRTL ? 'بطاقة أداء المورد' : 'Supplier Performance Scorecard'}
            </CardTitle>
            <CardDescription>
              {isRTL ? 'مقاييس موضوعية يتم التحقق منها من قبل المنصة' : 'Objective, platform-verified metrics'}
            </CardDescription>
          </div>
          <Badge variant={overallRating.badgeVariant} className="text-lg px-4 py-2">
            <Star className="h-4 w-4 mr-1" />
            {overallScore}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {isRTL ? 'التقييم الإجمالي' : 'Overall Rating'}
            </span>
            <span className={cn('text-sm font-bold', overallRating.color)}>
              {overallRating.label}
            </span>
          </div>
          <Progress value={overallScore} className="h-3" />
        </div>

        {/* Individual Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Completion Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className={cn('h-4 w-4', completionRating.color)} />
                <span className="text-sm font-medium">
                  {isRTL ? 'معدل إتمام الطلبات' : 'Order Completion Rate'}
                </span>
              </div>
              <Badge variant={completionRating.badgeVariant} className="text-xs">
                {metrics.order_completion_rate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={metrics.order_completion_rate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {metrics.total_completed_orders} {isRTL ? 'من أصل' : 'of'} {metrics.total_completed_orders} {isRTL ? 'طلب' : 'orders'}
            </p>
          </div>

          {/* On-Time Delivery Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={cn('h-4 w-4', onTimeRating.color)} />
                <span className="text-sm font-medium">
                  {isRTL ? 'معدل التسليم في الوقت المحدد' : 'On-Time Delivery Rate'}
                </span>
              </div>
              <Badge variant={onTimeRating.badgeVariant} className="text-xs">
                {metrics.on_time_delivery_rate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={metrics.on_time_delivery_rate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'يتم التسليم في الوقت المحدد أو قبله' : 'Delivered on or before agreed date'}
            </p>
          </div>

          {/* Average Quote Response Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className={cn('h-4 w-4', responseRating.color)} />
                <span className="text-sm font-medium">
                  {isRTL ? 'متوسط وقت الرد' : 'Avg Quote Response Time'}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {formatResponseTime(metrics.avg_quote_response_time_hours)}
              </Badge>
            </div>
            <p className={cn('text-xs font-medium', responseRating.color)}>
              {responseRating.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {metrics.total_quotes_submitted} {isRTL ? 'عرض مقدم' : 'quotes submitted'}
            </p>
          </div>

          {/* Repeat Business Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className={cn('h-4 w-4', repeatRating.color)} />
                <span className="text-sm font-medium">
                  {isRTL ? 'معدل تكرار الأعمال' : 'Repeat Business Rate'}
                </span>
              </div>
              <Badge variant={repeatRating.badgeVariant} className="text-xs">
                {metrics.repeat_business_rate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={metrics.repeat_business_rate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {isRTL ? 'نسبة العملاء الذين يعودون' : 'Clients who return for more'}
            </p>
          </div>
        </div>

        {/* Platform Verification Badge */}
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <BarChart3 className="h-4 w-4 text-primary" />
          <p className="text-xs text-muted-foreground">
            {isRTL
              ? 'هذه المقاييس يتم حسابها تلقائياً من قبل منصة MWRD ولا يمكن للمورد تعديلها، مما يضمن الموضوعية والثقة.'
              : 'These metrics are automatically calculated by the MWRD platform and cannot be edited by the supplier, ensuring objectivity and trust.'}
          </p>
        </div>

        {/* Last Updated */}
        {metrics.last_updated && (
          <p className="text-xs text-muted-foreground text-center">
            {isRTL ? 'آخر تحديث: ' : 'Last updated: '}
            {new Date(metrics.last_updated).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
