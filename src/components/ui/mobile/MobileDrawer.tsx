import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, Menu, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileDrawerProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  fullHeight?: boolean;
}

export const MobileDrawer = ({
  children,
  trigger,
  title,
  description,
  side = 'bottom',
  className,
  open,
  onOpenChange,
  showBackButton = false,
  onBack,
  fullHeight = false
}: MobileDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const actualOpen = open !== undefined ? open : isOpen;

  return (
    <Sheet open={actualOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <SheetTrigger asChild>
          {trigger}
        </SheetTrigger>
      )}
      
      <SheetContent 
        side={side} 
        className={cn(
          "w-full border-0 p-0",
          side === 'bottom' && [
            fullHeight ? "h-full" : "h-[90vh] rounded-t-xl",
            "bottom-0"
          ],
          side === 'top' && "h-[90vh] rounded-b-xl top-0",
          side === 'left' && "w-[90vw] h-full rounded-r-xl",
          side === 'right' && "w-[90vw] h-full rounded-l-xl",
          className
        )}
      >
        {/* Handle for bottom drawer */}
        {side === 'bottom' && (
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
        )}

        {/* Header */}
        {(title || showBackButton) && (
          <SheetHeader className="px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={onBack || (() => handleOpenChange(false))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              
              <div className="flex-1 text-left">
                {title && (
                  <SheetTitle className="text-base font-semibold">
                    {title}
                  </SheetTitle>
                )}
                {description && (
                  <SheetDescription className="text-sm text-muted-foreground">
                    {description}
                  </SheetDescription>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => handleOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>
        )}

        {/* Content */}
        <div className={cn(
          "flex-1 overflow-auto",
          (title || showBackButton) ? "p-4" : "p-4 pt-0"
        )}>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Quick action drawer for common mobile patterns
export const QuickActionDrawer = ({
  actions,
  trigger,
  title = "Quick Actions"
}: {
  actions: Array<{
    icon: React.ComponentType<any>;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'secondary';
  }>;
  trigger: React.ReactNode;
  title?: string;
}) => {
  return (
    <MobileDrawer
      trigger={trigger}
      title={title}
      side="bottom"
    >
      <div className="grid gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'ghost'}
            size="lg"
            className="h-12 justify-start gap-3 text-left"
            onClick={action.onClick}
          >
            <action.icon className="h-5 w-5" />
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </MobileDrawer>
  );
};