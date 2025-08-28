import React from 'react';
import { MobileDrawer } from './MobileDrawer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ActionItem {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'secondary';
  disabled?: boolean;
}

interface MobileActionSheetProps {
  actions: ActionItem[];
  trigger: React.ReactNode;
  title?: string;
  cancelLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const MobileActionSheet = ({
  actions,
  trigger,
  title,
  cancelLabel = "Cancel",
  open,
  onOpenChange
}: MobileActionSheetProps) => {
  const handleActionClick = (action: ActionItem) => {
    action.onClick();
    onOpenChange?.(false);
  };

  return (
    <MobileDrawer
      trigger={trigger}
      title={title}
      side="bottom"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-2 pb-4">
        {actions.map((action, index) => (
          <React.Fragment key={action.id}>
            <Button
              variant={action.variant || 'ghost'}
              size="lg"
              className="w-full h-12 justify-start gap-3 text-left"
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
            >
              {action.icon && <action.icon className="h-5 w-5" />}
              <span>{action.label}</span>
            </Button>
            
            {index < actions.length - 1 && action.variant === 'destructive' && (
              <Separator className="my-2" />
            )}
          </React.Fragment>
        ))}
        
        <Separator className="my-4" />
        
        <Button
          variant="outline"
          size="lg"
          className="w-full h-12"
          onClick={() => onOpenChange?.(false)}
        >
          {cancelLabel}
        </Button>
      </div>
    </MobileDrawer>
  );
};