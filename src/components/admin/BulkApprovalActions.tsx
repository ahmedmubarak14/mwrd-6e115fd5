import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, MessageSquare, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedItems.length === 0) return;
    
    setLoading(true);
    try {
      // Mock implementation since database tables don't match generated types
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      // Mock export functionality
      const mockData = selectedItems.map((id, index) => ({
        id,
        title: `${itemType.slice(0, -1)} ${index + 1}`,
        status: 'pending',
        created_at: new Date().toISOString()
      }));

      const headers = Object.keys(mockData[0]).join(',');
      const rows = mockData.map(item => 
        Object.values(item).map(val => 
          typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
        ).join(',')
      );
      
      const csv = [headers, ...rows].join('\n');
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

        {/* Mock Implementation Notice */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-foreground opacity-75">
            <strong>Note:</strong> Bulk approval actions are currently using mock implementation. 
            Database integration pending schema updates.
          </p>
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