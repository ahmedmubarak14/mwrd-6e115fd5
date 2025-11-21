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
            {t('approval.submitForApproval')}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('approval.submitForInternalApproval')}
            </DialogTitle>
            <DialogDescription>
              {t('approval.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">
                  {t('approval.whatHappensNext')}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>{t('approval.adminWillBeNotified')}</li>
                <li>{t('approval.adminWillReview')}</li>
                <li>{t('approval.autoPostedAfterApproval')}</li>
                <li>{t('approval.youWillBeNotified')}</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 {t('approval.tip')}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={submitting}
            >
              {t('approval.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('approval.submitting')}
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  {t('approval.submitForApproval')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
