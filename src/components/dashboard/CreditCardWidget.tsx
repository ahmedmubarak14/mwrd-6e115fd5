import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CreditCard, AlertTriangle, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreditAccount {
  credit_ceiling: number;
  credit_utilization: number;
  available_credit: number;
  payment_period_days: number;
  account_status: string;
  days_overdue: number;
  overdue_amount: number;
}

export const CreditCardWidget = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [creditAccount, setCreditAccount] = useState<CreditAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreditAccount();
  }, [user]);

  const fetchCreditAccount = async () => {
    try {
      const { data, error } = await supabase
        .from('client_credit_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setCreditAccount(data);
    } catch (error) {
      console.error('Failed to fetch credit account:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>{t('widgets.credit.loading')}</div>;
  if (!creditAccount) return null;

  const utilizationPercentage = (creditAccount.credit_utilization / creditAccount.credit_ceiling) * 100;
  const isNearLimit = utilizationPercentage > 80;
  const isOnHold = creditAccount.account_status === 'on_hold' || creditAccount.account_status === 'suspended';
  const hasOverdue = creditAccount.days_overdue > 0;

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t('widgets.credit.title')}
          </div>
          <Badge variant={isOnHold ? 'destructive' : hasOverdue ? 'warning' : 'default'}>
            {creditAccount.account_status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Credit Ceiling */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{t('widgets.credit.creditLimit')}</span>
            <span className="font-bold">SAR {creditAccount.credit_ceiling.toLocaleString()}</span>
          </div>

          {/* Utilization Bar */}
          <div className="space-y-1">
            <Progress 
              value={utilizationPercentage} 
              className={isNearLimit ? 'bg-red-100' : ''}
            />
            <div className="flex justify-between text-xs">
              <span>{t('widgets.credit.used')}: SAR {creditAccount.credit_utilization.toLocaleString()}</span>
              <span className={isNearLimit ? 'text-red-600 font-semibold' : 'text-green-600'}>
                {t('widgets.credit.available')}: SAR {creditAccount.available_credit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{t('widgets.credit.paymentPeriod')}:</span>
          <span className="font-semibold">{creditAccount.payment_period_days} {t('widgets.credit.days')}</span>
        </div>

        {/* Warnings */}
        {isNearLimit && (
          <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
            <AlertTriangle className="w-4 h-4" />
            <span>{t('widgets.credit.approachingLimit')} ({utilizationPercentage.toFixed(1)}%)</span>
          </div>
        )}

        {hasOverdue && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {creditAccount.days_overdue} {t('widgets.credit.daysOverdue')} | SAR {creditAccount.overdue_amount.toLocaleString()}
            </span>
          </div>
        )}

        {isOnHold && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-100 p-2 rounded font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>{t('widgets.credit.accountOnHold')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
