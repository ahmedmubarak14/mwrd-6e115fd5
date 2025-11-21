import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  FileText,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SpendingData {
  period: string;
  total_spent: number;
  order_count: number;
  avg_order_value: number;
}

interface SpendingBySupplier {
  vendor_id: string;
  vendor_name: string;
  total_spent: number;
  order_count: number;
}

interface SpendingByCategory {
  category: string;
  total_spent: number;
  percentage: number;
}

interface BudgetSettings {
  id?: string;
  client_id: string;
  monthly_budget: number;
  quarterly_budget: number;
  alert_threshold_80: boolean;
  alert_threshold_100: boolean;
  created_at?: string;
  updated_at?: string;
}

const COLORS = ['#004F54', '#66023C', '#765A3F', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const SpendManagementDashboard = () => {
  const { t, isRTL } = useLanguage();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const [spendingData, setSpendingData] = useState<SpendingData[]>([]);
  const [spendingBySupplier, setSpendingBySupplier] = useState<SpendingBySupplier[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<SpendingByCategory[]>([]);
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings | null>(null);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    monthly_budget: 0,
    quarterly_budget: 0,
    alert_threshold_80: true,
    alert_threshold_100: true,
  });

  useEffect(() => {
    if (userProfile?.id) {
      fetchAllData();
    }
  }, [userProfile?.id, timeframe]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSpendingData(),
        fetchSpendingBySupplier(),
        fetchSpendingByCategory(),
        fetchBudgetSettings(),
      ]);
    } catch (error) {
      console.error('Error fetching spend management data:', error);
      toast({
        title: t('common.error'),
        description: t('spendManagement.failedToLoadData'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSpendingData = async () => {
    if (!userProfile?.id) return;

    const { data, error } = await supabase.rpc('get_client_spending_by_period', {
      p_client_id: userProfile.id,
      p_timeframe: timeframe,
    });

    if (error) {
      console.error('Error fetching spending data:', error);
      return;
    }

    setSpendingData(data || []);
  };

  const fetchSpendingBySupplier = async () => {
    if (!userProfile?.id) return;

    const { data, error } = await supabase.rpc('get_client_spending_by_vendor', {
      p_client_id: userProfile.id,
      p_timeframe: timeframe,
    });

    if (error) {
      console.error('Error fetching spending by supplier:', error);
      return;
    }

    setSpendingBySupplier(data || []);
  };

  const fetchSpendingByCategory = async () => {
    if (!userProfile?.id) return;

    const { data, error } = await supabase.rpc('get_client_spending_by_category', {
      p_client_id: userProfile.id,
      p_timeframe: timeframe,
    });

    if (error) {
      console.error('Error fetching spending by category:', error);
      return;
    }

    setSpendingByCategory(data || []);
  };

  const fetchBudgetSettings = async () => {
    if (!userProfile?.id) return;

    const { data, error } = await supabase
      .from('client_budget_settings')
      .select('*')
      .eq('client_id', userProfile.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching budget settings:', error);
      return;
    }

    if (data) {
      setBudgetSettings(data);
      setBudgetForm({
        monthly_budget: data.monthly_budget,
        quarterly_budget: data.quarterly_budget,
        alert_threshold_80: data.alert_threshold_80,
        alert_threshold_100: data.alert_threshold_100,
      });
    }
  };

  const saveBudgetSettings = async () => {
    if (!userProfile?.id) return;

    const budgetData: BudgetSettings = {
      client_id: userProfile.id,
      ...budgetForm,
    };

    const { data, error } = await supabase
      .from('client_budget_settings')
      .upsert(budgetData, { onConflict: 'client_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving budget settings:', error);
      toast({
        title: t('common.error'),
        description: t('spendManagement.failedToSaveBudget'),
        variant: 'destructive',
      });
      return;
    }

    setBudgetSettings(data);
    setShowBudgetDialog(false);
    toast({
      title: t('common.success'),
      description: t('spendManagement.budgetSavedSuccessfully'),
    });
  };

  const calculateTotalSpending = useMemo(() => {
    return spendingData.reduce((sum, item) => sum + item.total_spent, 0);
  }, [spendingData]);

  const calculateTotalOrders = useMemo(() => {
    return spendingData.reduce((sum, item) => sum + item.order_count, 0);
  }, [spendingData]);

  const calculateAverageOrderValue = useMemo(() => {
    if (calculateTotalOrders === 0) return 0;
    return calculateTotalSpending / calculateTotalOrders;
  }, [calculateTotalSpending, calculateTotalOrders]);

  const getBudgetStatus = () => {
    if (!budgetSettings) return null;

    const budget = timeframe === 'month'
      ? budgetSettings.monthly_budget
      : timeframe === 'quarter'
      ? budgetSettings.quarterly_budget
      : budgetSettings.monthly_budget * 12;

    if (budget === 0) return null;

    const percentage = (calculateTotalSpending / budget) * 100;

    if (percentage >= 100) {
      return {
        status: 'exceeded',
        percentage,
        message: isRTL ? 'تجاوزت الميزانية!' : 'Budget Exceeded!',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: AlertTriangle,
      };
    } else if (percentage >= 80) {
      return {
        status: 'warning',
        percentage,
        message: isRTL ? 'اقتربت من حد الميزانية' : 'Approaching Budget Limit',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        icon: AlertTriangle,
      };
    } else {
      return {
        status: 'good',
        percentage,
        message: isRTL ? 'ضمن الميزانية' : 'Within Budget',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: CheckCircle,
      };
    }
  };

  const exportSpendingData = () => {
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Period,Total Spent (SAR),Order Count,Avg Order Value (SAR)\n';

    spendingData.forEach(item => {
      csvContent += `${item.period},${item.total_spent},${item.order_count},${item.avg_order_value}\n`;
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `spending_report_${timeframe}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: t('common.success'),
      description: t('spendManagement.reportExported'),
    });
  };

  const budgetStatus = getBudgetStatus();

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text={isRTL ? 'جاري تحميل بيانات الإنفاق...' : 'Loading spending data...'} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-primary" />
            {isRTL ? 'إدارة الإنفاق والميزانية' : 'Spend Management & Budgeting'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRTL
              ? 'تتبع نفقاتك وإدارة ميزانيتك بفعالية'
              : 'Track your expenses and manage your budget effectively'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">{isRTL ? 'شهري' : 'Monthly'}</SelectItem>
              <SelectItem value="quarter">{isRTL ? 'ربع سنوي' : 'Quarterly'}</SelectItem>
              <SelectItem value="year">{isRTL ? 'سنوي' : 'Yearly'}</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={exportSpendingData}>
            <Download className="h-4 w-4 mr-2" />
            {isRTL ? 'تصدير' : 'Export'}
          </Button>

          <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                {isRTL ? 'إعدادات الميزانية' : 'Budget Settings'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isRTL ? 'إعدادات الميزانية' : 'Budget Settings'}</DialogTitle>
                <DialogDescription>
                  {isRTL
                    ? 'قم بتعيين حدود الميزانية والتنبيهات'
                    : 'Set budget limits and alert thresholds'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_budget">
                    {isRTL ? 'الميزانية الشهرية (ريال سعودي)' : 'Monthly Budget (SAR)'}
                  </Label>
                  <Input
                    id="monthly_budget"
                    type="number"
                    value={budgetForm.monthly_budget}
                    onChange={(e) => setBudgetForm({ ...budgetForm, monthly_budget: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quarterly_budget">
                    {isRTL ? 'الميزانية الربع سنوية (ريال سعودي)' : 'Quarterly Budget (SAR)'}
                  </Label>
                  <Input
                    id="quarterly_budget"
                    type="number"
                    value={budgetForm.quarterly_budget}
                    onChange={(e) => setBudgetForm({ ...budgetForm, quarterly_budget: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <p className="font-medium text-sm">{isRTL ? 'التنبيهات' : 'Alert Settings'}</p>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={budgetForm.alert_threshold_80}
                      onChange={(e) => setBudgetForm({ ...budgetForm, alert_threshold_80: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">
                      {isRTL ? 'تنبيه عند 80% من الميزانية' : 'Alert at 80% of budget'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={budgetForm.alert_threshold_100}
                      onChange={(e) => setBudgetForm({ ...budgetForm, alert_threshold_100: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">
                      {isRTL ? 'تنبيه عند 100% من الميزانية' : 'Alert at 100% of budget'}
                    </span>
                  </label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBudgetDialog(false)}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={saveBudgetSettings}>
                  {isRTL ? 'حفظ' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Status Alert */}
      {budgetStatus && (
        <Card className={cn('border-2', budgetStatus.bgColor)}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <budgetStatus.icon className={cn('h-6 w-6', budgetStatus.color)} />
                <div>
                  <h3 className={cn('font-bold text-lg', budgetStatus.color)}>
                    {budgetStatus.message}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isRTL
                      ? `استخدمت ${budgetStatus.percentage.toFixed(1)}% من ميزانيتك`
                      : `You've used ${budgetStatus.percentage.toFixed(1)}% of your budget`}
                  </p>
                </div>
              </div>
              <Badge variant={budgetStatus.status === 'exceeded' ? 'destructive' : 'default'} className="text-lg px-4 py-2">
                {budgetStatus.percentage.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {isRTL ? 'إجمالي الإنفاق' : 'Total Spending'}
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {calculateTotalSpending.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRTL ? `لفترة ${timeframe === 'month' ? 'الشهر' : timeframe === 'quarter' ? 'الربع' : 'السنة'}` : `For the ${timeframe}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {isRTL ? 'عدد الطلبات' : 'Total Orders'}
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {calculateTotalOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRTL ? 'طلبات مكتملة' : 'Completed orders'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {isRTL ? 'متوسط قيمة الطلب' : 'Avg Order Value'}
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {calculateAverageOrderValue.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRTL ? 'لكل طلب' : 'Per order'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Spending Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'اتجاهات الإنفاق' : 'Spending Trends'}</CardTitle>
          <CardDescription>
            {isRTL ? 'نظرة عامة على الإنفاق بمرور الوقت' : 'Overview of spending over time'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_spent" name={isRTL ? 'الإنفاق' : 'Spending'} fill="#004F54" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Spending by Supplier and Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Supplier */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'الإنفاق حسب المورد' : 'Spending by Supplier'}</CardTitle>
            <CardDescription>
              {isRTL ? 'أعلى الموردين حسب الإنفاق' : 'Top suppliers by spending'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spendingBySupplier.slice(0, 5).map((supplier, index) => (
                <div key={supplier.vendor_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{supplier.vendor_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {supplier.order_count} {isRTL ? 'طلب' : 'orders'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{supplier.total_spent.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Category */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'الإنفاق حسب الفئة' : 'Spending by Category'}</CardTitle>
            <CardDescription>
              {isRTL ? 'توزيع الإنفاق حسب نوع الخدمة' : 'Spending distribution by service type'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  dataKey="total_spent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="text-sm">
                {isRTL
                  ? '💡 نصيحة: استخدم إعدادات الميزانية لتلقي تنبيهات تلقائية عندما تقترب من حدود الإنفاق الخاصة بك. هذا يساعدك على التحكم بشكل أفضل في نفقات المشتريات الخاصة بك.'
                  : '💡 Tip: Use budget settings to receive automatic alerts when you approach your spending limits. This helps you better control your procurement expenses.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
