import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, MessageSquare, Download, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      const statusField = itemType === 'requests' ? 'admin_approval_status' : 'admin_approval_status';
      const notesField = itemType === 'requests' ? 'admin_approval_notes' : 'admin_approval_notes';
      const dateField = itemType === 'requests' ? 'admin_approval_date' : 'admin_approval_date';
      
      const { error } = await supabase
        .from(itemType)
        .update({
          [statusField]: action === 'approve' ? 'approved' : 'rejected',
          [notesField]: notes || `Bulk ${action}ed by admin`,
          [dateField]: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .in('id', selectedItems);

      if (error) throw error;

      // Create bulk notification for affected users
      if (itemType === 'requests') {
        await sendBulkNotifications(selectedItems, action, 'client_id');
      } else {
        await sendBulkNotifications(selectedItems, action, 'vendor_id');
      }

      toast({
        title: 'Success',
        description: `${selectedItems.length} ${itemType} ${action}ed successfully`,
      });

      onRefresh();
      onClearSelection();
      setShowBulkDialog(false);
      setNotes('');
    } catch (error) {
      console.error(`Error bulk ${action}ing ${itemType}:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} ${itemType}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const sendBulkNotifications = async (itemIds: string[], action: string, userIdField: string) => {
    try {
      // Get all affected users
      const { data: items, error } = await supabase
        .from(itemType)
        .select(`id, title, ${userIdField}`)
        .in('id', itemIds);

      if (error || !items) return;

      // Create notifications for each user
      const notifications = items.map((item: any) => ({
        user_id: item[userIdField as keyof typeof item],
        type: `${itemType.slice(0, -1)}_${action}ed`,
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1, -1)} ${action.charAt(0).toUpperCase() + action.slice(1)}ed`,
        message: `Your ${itemType.slice(0, -1)} "${item.title}" has been ${action}ed by admin.`,
        category: itemType,
        priority: action === 'approved' ? 'high' : 'medium',
        data: { 
          [`${itemType.slice(0, -1)}_id`]: item.id,
          action,
          bulk: true
        }
      }));

      await supabase
        .from('notifications')
        .insert(notifications);
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
    }
  };

  const exportSelected = async () => {
    try {
      const { data, error } = await supabase
        .from(itemType)
        .select('*')
        .in('id', selectedItems);

      if (error) throw error;

      // Convert to CSV
      if (data && data.length > 0) {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(item => 
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
      }
    } catch (error) {
      console.error('Error exporting data:', error);
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
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
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