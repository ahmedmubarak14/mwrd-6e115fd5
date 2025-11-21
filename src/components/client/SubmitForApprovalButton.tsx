import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApprovalWorkflow } from '@/hooks/useApprovalWorkflow';
import { CheckCircle, UserCheck } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface SubmitForApprovalButtonProps {
  requestId: string;
  onSuccess?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

export const SubmitForApprovalButton = ({
  requestId,
  onSuccess,
  disabled = false,
  variant = 'outline',
  size = 'default',
}: SubmitForApprovalButtonProps) => {
  const { t, isRTL } = useLanguage();
  const { submitForApproval, submitting } = useApprovalWorkflow();
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = async () => {
    const result = await submitForApproval(requestId);

    if (result.success) {
      setShowDialog(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={disabled || submitting}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            {isRTL ? 'إرسال للموافقة' : 'Submit for Approval'}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL ? 'إرسال للموافقة الداخلية' : 'Submit for Internal Approval'}
            </DialogTitle>
            <DialogDescription>
              {isRTL
                ? 'سيتم إرسال هذا الطلب إلى مدير في مؤسستك للمراجعة قبل نشره في السوق.'
                : 'This request will be sent to an admin in your organization for review before being posted to the marketplace.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">
                  {isRTL ? 'ما سيحدث بعد ذلك:' : 'What happens next:'}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>
                  {isRTL
                    ? '• سيتم إخطار مدير في مؤسستك'
                    : '• An admin in your organization will be notified'}
                </li>
                <li>
                  {isRTL
                    ? '• سيقوم بمراجعة الطلب والموافقة عليه أو رفضه أو طلب تغييرات'
                    : '• They will review and approve, reject, or request changes'}
                </li>
                <li>
                  {isRTL
                    ? '• بعد الموافقة، سيتم نشر الطلب تلقائياً في السوق'
                    : '• Once approved, the request will be automatically posted to the marketplace'}
                </li>
                <li>
                  {isRTL
                    ? '• ستتلقى إشعاراً بالقرار'
                    : '• You will be notified of the decision'}
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 {isRTL
                  ? 'نصيحة: تأكد من أن جميع تفاصيل طلبك كاملة ودقيقة قبل الإرسال للموافقة.'
                  : 'Tip: Make sure all your request details are complete and accurate before submitting for approval.'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={submitting}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  {isRTL ? 'إرسال للموافقة' : 'Submit for Approval'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
