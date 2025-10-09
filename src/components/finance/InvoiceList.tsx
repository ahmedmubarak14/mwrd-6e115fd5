import { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Plus, Search, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface InvoiceListProps {
  userRole: 'client' | 'vendor';
}

export const InvoiceList = ({ userRole }: InvoiceListProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const { invoices, isLoading } = useInvoices(userRole);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'secondary',
      sent: 'default',
      viewed: 'default',
      partial: 'warning',
      paid: 'success',
      overdue: 'destructive',
      cancelled: 'secondary',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      draft: { en: 'Draft', ar: 'مسودة' },
      sent: { en: 'Sent', ar: 'مرسلة' },
      viewed: { en: 'Viewed', ar: 'تم الاطلاع' },
      partial: { en: 'Partially Paid', ar: 'مدفوعة جزئياً' },
      paid: { en: 'Paid', ar: 'مدفوعة' },
      overdue: { en: 'Overdue', ar: 'متأخرة' },
      cancelled: { en: 'Cancelled', ar: 'ملغاة' },
    };
    return isRTL ? labels[status]?.ar : labels[status]?.en;
  };

  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesSearch = invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>{isRTL ? 'الفواتير' : 'Invoices'}</CardTitle>
          </div>
          {userRole === 'vendor' && (
            <Button onClick={() => navigate('/vendor/invoices/new')}>
              <Plus className="h-4 w-4 mr-2" />
              {isRTL ? 'فاتورة جديدة' : 'New Invoice'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? 'البحث برقم الفاتورة...' : 'Search by invoice number...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'كل الحالات' : 'All Statuses'}</SelectItem>
              <SelectItem value="draft">{isRTL ? 'مسودة' : 'Draft'}</SelectItem>
              <SelectItem value="sent">{isRTL ? 'مرسلة' : 'Sent'}</SelectItem>
              <SelectItem value="partial">{isRTL ? 'مدفوعة جزئياً' : 'Partial'}</SelectItem>
              <SelectItem value="paid">{isRTL ? 'مدفوعة' : 'Paid'}</SelectItem>
              <SelectItem value="overdue">{isRTL ? 'متأخرة' : 'Overdue'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredInvoices && filteredInvoices.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isRTL ? 'رقم الفاتورة' : 'Invoice #'}</TableHead>
                  <TableHead>{isRTL ? 'تاريخ الإصدار' : 'Issue Date'}</TableHead>
                  <TableHead>{isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}</TableHead>
                  <TableHead>{isRTL ? 'المبلغ' : 'Amount'}</TableHead>
                  <TableHead>{isRTL ? 'المدفوع' : 'Paid'}</TableHead>
                  <TableHead>{isRTL ? 'المتبقي' : 'Balance'}</TableHead>
                  <TableHead>{isRTL ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead>{isRTL ? 'الإجراءات' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow 
                    key={invoice.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/${userRole}/invoices/${invoice.id}`)}
                  >
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{format(new Date(invoice.issue_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      {invoice.total_amount.toLocaleString()} {invoice.currency}
                    </TableCell>
                    <TableCell>
                      {invoice.paid_amount.toLocaleString()} {invoice.currency}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {invoice.balance_due.toLocaleString()} {invoice.currency}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(invoice.status) as any}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{isRTL ? 'لا توجد فواتير' : 'No invoices found'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
