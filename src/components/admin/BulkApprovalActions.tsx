import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRequestApprovals } from '@/hooks/useRequestApprovals';
import { useOfferApprovals } from '@/hooks/useOfferApprovals';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface BulkApprovalActionsProps {
  selectedItems: string[];
  itemType: 'requests' | 'offers';
  onRefresh: () => void;
  onClearSelection: () => void;
}

export const BulkApprovalActions = ({ 
  selectedItems, 
  itemType, 
  onRefresh, 
  onClearSelection 
}: BulkApprovalActionsProps) => {
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | null>(null);
  
  // Get the appropriate hooks based on item type
  const { bulkApproveRequests, bulkRejectRequests } = useRequestApprovals();
  const { approveOffer, rejectOffer } = useOfferApprovals();

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedItems.length === 0) return;
    
    setLoading(true);
    try {
      if (itemType === 'requests') {
        if (action === 'approve') {
          await bulkApproveRequests(selectedItems, notes);
        } else {
          await bulkRejectRequests(selectedItems, notes);
        }
      } else if (itemType === 'offers') {
        // For offers, we need to process individually since there's no bulk operation
        for (const offerId of selectedItems) {
          if (action === 'approve') {
            await approveOffer(offerId, notes);
          } else {
            await rejectOffer(offerId, notes);
          }
        }
      }
      
      toast({
        title: t(`admin.actions.bulkApproved`),
        description: t('admin.actions.bulkActionCompleted'),
        variant: action === 'approve' ? 'default' : 'destructive'
      });
      
      onClearSelection();
      onRefresh();
      setShowBulkDialog(false);
      setNotes('');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('admin.actions.bulkActionFailed'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSelected = async () => {
    try {
      // Create CSV export with selected item IDs
      const headers = [t('common.id'), t('common.type'), t('common.status'), t('common.createdAt')];
      const rows = selectedItems.map(id => [
        id,
        itemType.slice(0, -1),
        t('common.pending'),
        new Date().toISOString()
      ]);
      
      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${itemType}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: t('common.success'),
        description: t('admin.actions.exportSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('admin.actions.exportFailed'),
        variant: 'destructive'
      });
    }
  };

  const openBulkDialog = (action: 'approve' | 'reject') => {
    setBulkAction(action);
    setShowBulkDialog(true);
  };

  if (selectedItems.length === 0) return null;

  return (
    <div className={cn(isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className={cn("text-lg flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Checkbox checked={true} />
            {t('admin.actions.itemsSelected')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("flex flex-wrap gap-2", isRTL && "flex-row-reverse")}>
            <Button
              onClick={() => openBulkDialog('approve')}
              className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
              disabled={loading}
            >
              <CheckCircle className="h-4 w-4" />
              {t('admin.actions.bulkApprove')}
            </Button>
            
            <Button
              onClick={() => openBulkDialog('reject')}
              variant="destructive"
              className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
              disabled={loading}
            >
              <XCircle className="h-4 w-4" />
              {t('admin.actions.bulkReject')}
            </Button>

            <Button
              onClick={exportSelected}
              variant="outline"
              className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
            >
              <Download className="h-4 w-4" />
              {t('admin.actions.exportSelected')}
            </Button>

            <Button
              onClick={onClearSelection}
              variant="outline"
            >
              {t('admin.actions.clearSelection')}
            </Button>
          </div>

        <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t(`admin.actions.bulkApproveTitle`)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse")}>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-medium">{t('admin.actions.confirmationRequired')}</span>
                </div>
                <p className={cn("text-sm text-muted-foreground", isRTL ? "text-right" : "text-left")}>
                  {t('admin.actions.bulkActionWarning')}
                </p>
              </div>

              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isRTL ? "text-right" : "text-left")}>
                  {t('admin.actions.notesOptional')}
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('admin.actions.addNotesPlaceholder')}
                  className="min-h-20"
                />
              </div>

              <div className={cn("flex gap-2 justify-end", isRTL && "flex-row-reverse justify-start")}>
                <Button
                  variant="outline"
                  onClick={() => setShowBulkDialog(false)}
                  disabled={loading}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={() => handleBulkAction(bulkAction!)}
                  variant={bulkAction === 'approve' ? 'default' : 'destructive'}
                  disabled={loading}
                  className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
                >
                  {loading ? (
                    t('common.processing')
                  ) : (
                    <>
                      {bulkAction === 'approve' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      {t(`admin.actions.confirm${bulkAction === 'approve' ? 'Approve' : 'Reject'}`)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
    </div>
  );
};