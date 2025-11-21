import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  FileText,
  MessageSquare,
  Eye,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PendingApproval {
  request_id: string;
  title: string;
  description: string;
  budget: number;
  submitted_by: string;
  submitter_name: string;
  submitted_at: string;
  category: string;
  urgency: string;
}

interface ApprovalHistoryItem {
  id: string;
  action: string;
  actor_id: string;
  notes: string;
  created_at: string;
  actor_name?: string;
}

export const ApprovalQueue = () => {
  const { t, isRTL } = useLanguage();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PendingApproval | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'changes'>('approve');
  const [actionNotes, setActionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistoryItem[]>([]);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  useEffect(() => {
    if (userProfile?.id) {
      fetchPendingApprovals();
    }
  }, [userProfile?.id]);

  const fetchPendingApprovals = async () => {
    if (!userProfile?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_pending_approvals_for_user', {
        p_user_id: userProfile.id,
      });

      if (error) throw error;

      setPendingApprovals(data || []);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل تحميل الطلبات المعلقة' : 'Failed to load pending approvals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovalHistory = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('request_approval_history')
        .select(`
          *,
          actor:user_profiles!request_approval_history_actor_id_fkey(full_name)
        `)
        .eq('request_id', requestId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const historyWithNames = data?.map((item: any) => ({
        ...item,
        actor_name: item.actor?.full_name || 'Unknown User',
      })) || [];

      setApprovalHistory(historyWithNames);
    } catch (error) {
      console.error('Error fetching approval history:', error);
    }
  };

  const openApprovalDialog = (request: PendingApproval, action: 'approve' | 'reject' | 'changes') => {
    setSelectedRequest(request);
    setActionType(action);
    setActionNotes('');
    fetchApprovalHistory(request.request_id);
    setShowApprovalDialog(true);
  };

  const handleApprovalAction = async () => {
    if (!selectedRequest) return;

    // Validate notes for reject and changes actions
    if ((actionType === 'reject' || actionType === 'changes') && !actionNotes.trim()) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى تقديم سبب' : 'Please provide a reason',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      let result;

      switch (actionType) {
        case 'approve':
          result = await supabase.rpc('approve_internal_request', {
            p_request_id: selectedRequest.request_id,
            p_notes: actionNotes || null,
          });
          break;
        case 'reject':
          result = await supabase.rpc('reject_internal_request', {
            p_request_id: selectedRequest.request_id,
            p_notes: actionNotes,
          });
          break;
        case 'changes':
          result = await supabase.rpc('request_changes_internal_request', {
            p_request_id: selectedRequest.request_id,
            p_notes: actionNotes,
          });
          break;
      }

      if (result.error) throw result.error;

      const response = result.data as { success: boolean; message: string; error?: string };

      if (!response.success) {
        throw new Error(response.error || 'Action failed');
      }

      toast({
        title: isRTL ? 'نجح' : 'Success',
        description: response.message,
      });

      setShowApprovalDialog(false);
      setSelectedRequest(null);
      setActionNotes('');
      await fetchPendingApprovals();
    } catch (error) {
      console.error('Error processing approval action:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to process action',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'submitted':
      case 'resubmitted':
        return <FileText className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'changes_requested':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getActionLabel = (action: string) => {
    const labels = {
      submitted: isRTL ? 'تم الإرسال' : 'Submitted',
      approved: isRTL ? 'تمت الموافقة' : 'Approved',
      rejected: isRTL ? 'مرفوض' : 'Rejected',
      changes_requested: isRTL ? 'طلب تغييرات' : 'Changes Requested',
      resubmitted: isRTL ? 'أعيد الإرسال' : 'Resubmitted',
    };
    return labels[action as keyof typeof labels] || action;
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text={isRTL ? 'جاري تحميل الطلبات...' : 'Loading approvals...'} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CheckCircle className="h-8 w-8 text-primary" />
          {isRTL ? 'قائمة الموافقات' : 'Approval Queue'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isRTL
            ? 'مراجعة والموافقة على طلبات عروض الأسعار من فريقك'
            : 'Review and approve RFQs from your team'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {isRTL ? 'معلقة' : 'Pending'}
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingApprovals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRTL ? 'طلبات بانتظار المراجعة' : 'Awaiting your review'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {isRTL ? 'عاجل' : 'Urgent'}
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {pendingApprovals.filter((a) => a.urgency === 'urgent').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRTL ? 'يتطلب اهتمامًا فوريًا' : 'Requires immediate attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {isRTL ? 'إجمالي القيمة' : 'Total Value'}
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {pendingApprovals.reduce((sum, a) => sum + (a.budget || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRTL ? 'ريال سعودي' : 'SAR'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals List */}
      {pendingApprovals.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isRTL ? 'لا توجد طلبات معلقة' : 'No Pending Approvals'}
              </h3>
              <p className="text-muted-foreground">
                {isRTL
                  ? 'جميع طلبات عروض الأسعار قد تمت مراجعتها'
                  : 'All RFQs have been reviewed'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((approval) => (
            <Card key={approval.request_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{approval.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {approval.description}
                    </CardDescription>
                  </div>
                  <Badge variant={getUrgencyColor(approval.urgency)}>
                    {approval.urgency}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'المرسل' : 'Submitted by'}
                      </p>
                      <p className="text-sm font-medium">{approval.submitter_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'التاريخ' : 'Submitted'}
                      </p>
                      <p className="text-sm font-medium">
                        {format(new Date(approval.submitted_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'الميزانية' : 'Budget'}
                      </p>
                      <p className="text-sm font-medium">
                        {approval.budget?.toLocaleString() || 'N/A'} {isRTL ? 'ريال' : 'SAR'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {isRTL ? 'الفئة' : 'Category'}
                      </p>
                      <p className="text-sm font-medium">{approval.category || 'General'}</p>
                    </div>
                  </div>
                </div>

                <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                  <Button
                    onClick={() => openApprovalDialog(approval, 'approve')}
                    className="flex-1"
                    variant="default"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isRTL ? 'موافقة' : 'Approve'}
                  </Button>

                  <Button
                    onClick={() => openApprovalDialog(approval, 'changes')}
                    className="flex-1"
                    variant="outline"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {isRTL ? 'طلب تغييرات' : 'Request Changes'}
                  </Button>

                  <Button
                    onClick={() => openApprovalDialog(approval, 'reject')}
                    className="flex-1"
                    variant="destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {isRTL ? 'رفض' : 'Reject'}
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectedRequest(approval);
                      fetchApprovalHistory(approval.request_id);
                      setShowHistoryDialog(true);
                    }}
                    variant="ghost"
                    size="icon"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Approval Action Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && (isRTL ? 'الموافقة على الطلب' : 'Approve Request')}
              {actionType === 'reject' && (isRTL ? 'رفض الطلب' : 'Reject Request')}
              {actionType === 'changes' && (isRTL ? 'طلب تغييرات' : 'Request Changes')}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.title}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">
                <Eye className="h-4 w-4 mr-2" />
                {isRTL ? 'التفاصيل' : 'Details'}
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                {isRTL ? 'السجل' : 'History'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {/* Request Details */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {isRTL ? 'الوصف' : 'Description'}
                    </Label>
                    <p className="text-sm mt-1">{selectedRequest?.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        {isRTL ? 'الفئة' : 'Category'}
                      </Label>
                      <p className="text-sm mt-1">{selectedRequest?.category}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        {isRTL ? 'الميزانية' : 'Budget'}
                      </Label>
                      <p className="text-sm mt-1">
                        {selectedRequest?.budget?.toLocaleString()} {isRTL ? 'ريال' : 'SAR'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">
                      {isRTL ? 'مقدم من' : 'Submitted by'}
                    </Label>
                    <p className="text-sm mt-1">{selectedRequest?.submitter_name}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Notes */}
              <div className="space-y-2">
                <Label htmlFor="action_notes">
                  {actionType === 'approve' && (isRTL ? 'ملاحظات (اختياري)' : 'Notes (Optional)')}
                  {actionType === 'reject' && (isRTL ? 'سبب الرفض *' : 'Rejection Reason *')}
                  {actionType === 'changes' && (isRTL ? 'التغييرات المطلوبة *' : 'Changes Requested *')}
                </Label>
                <Textarea
                  id="action_notes"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder={
                    actionType === 'approve'
                      ? isRTL
                        ? 'أضف أي ملاحظات إضافية...'
                        : 'Add any additional notes...'
                      : isRTL
                      ? 'يرجى تقديم تفاصيل...'
                      : 'Please provide details...'
                  }
                  rows={4}
                  required={actionType !== 'approve'}
                />
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {approvalHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isRTL ? 'لا يوجد سجل' : 'No history yet'}
                </div>
              ) : (
                <div className="space-y-3">
                  {approvalHistory.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          {getActionIcon(item.action)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{getActionLabel(item.action)}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(item.created_at), 'MMM dd, yyyy HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {isRTL ? 'بواسطة' : 'by'} {item.actor_name}
                            </p>
                            {item.notes && (
                              <p className="text-sm mt-2 p-2 bg-muted rounded">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApprovalDialog(false)}
              disabled={submitting}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleApprovalAction} disabled={submitting}>
              {submitting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : actionType === 'approve' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : actionType === 'reject' ? (
                <XCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              {actionType === 'approve' && (isRTL ? 'موافقة' : 'Approve')}
              {actionType === 'reject' && (isRTL ? 'رفض' : 'Reject')}
              {actionType === 'changes' && (isRTL ? 'طلب تغييرات' : 'Request Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isRTL ? 'سجل الموافقات' : 'Approval History'}</DialogTitle>
            <DialogDescription>{selectedRequest?.title}</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {approvalHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {isRTL ? 'لا يوجد سجل' : 'No history yet'}
              </div>
            ) : (
              approvalHistory.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {getActionIcon(item.action)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{getActionLabel(item.action)}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(item.created_at), 'MMM dd, HH:mm')}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isRTL ? 'بواسطة' : 'by'} {item.actor_name}
                        </p>
                        {item.notes && (
                          <p className="text-xs mt-2 p-2 bg-muted rounded">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
