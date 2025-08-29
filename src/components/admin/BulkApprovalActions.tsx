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
        title: `Bulk ${action} completed`,
        description: `${selectedItems.length} ${itemType} have been ${action}d`,
        variant: action === 'approve' ? 'default' : 'destructive'
      });
      
      onClearSelection();
      onRefresh();
      setShowBulkDialog(false);
      setNotes('');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} ${itemType}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSelected = async () => {
    try {
      // Create CSV export with selected item IDs
      const headers = ['ID', 'Type', 'Status', 'Created At'];
      const rows = selectedItems.map(id => [
        id,
        itemType.slice(0, -1),
        'pending',
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
        title: 'Success',
        description: `Exported ${selectedItems.length} ${itemType} to CSV`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export data',
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
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Checkbox checked={true} />
          {selectedItems.length} {itemType} selected
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => openBulkDialog('approve')}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <CheckCircle className="h-4 w-4" />
            Bulk Approve
          </Button>
          
          <Button
            onClick={() => openBulkDialog('reject')}
            variant="destructive"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <XCircle className="h-4 w-4" />
            Bulk Reject
          </Button>

          <Button
            onClick={exportSelected}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Selected
          </Button>

          <Button
            onClick={onClearSelection}
            variant="outline"
          >
            Clear Selection
          </Button>
        </div>

        <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {bulkAction === 'approve' ? 'Bulk Approve' : 'Bulk Reject'} {selectedItems.length} {itemType}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-medium">Confirmation Required</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You are about to {bulkAction} {selectedItems.length} {itemType}. 
                  This action will send notifications to all affected users.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={`Add notes for this bulk ${bulkAction} action...`}
                  className="min-h-20"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleBulkAction(bulkAction!)}
                  variant={bulkAction === 'approve' ? 'default' : 'destructive'}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      {bulkAction === 'approve' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      Confirm {bulkAction === 'approve' ? 'Approve' : 'Reject'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};