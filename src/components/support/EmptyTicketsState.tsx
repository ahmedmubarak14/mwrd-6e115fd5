import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyTicketsStateProps {
  onCreateTicket: () => void;
  isRTL?: boolean;
  t: (key: string) => string;
}

export const EmptyTicketsState = ({ onCreateTicket, isRTL = false, t }: EmptyTicketsStateProps) => {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="rounded-full bg-muted/30 p-4 mb-6">
          <Ticket className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h3 className={cn(
          "text-lg font-semibold text-foreground mb-2",
          isRTL && "text-right"
        )}>
          {t('support.emptyState.title')}
        </h3>
        
        <p className={cn(
          "text-sm text-muted-foreground mb-6 max-w-sm",
          isRTL && "text-right"
        )}>
          {t('support.emptyState.description')}
        </p>
        
        <Button
          onClick={onCreateTicket}
          className={cn(
            "gap-2 min-h-[44px] px-6", // Minimum touch target size
            isRTL && "flex-row-reverse"
          )}
          aria-label={t('support.emptyState.cta')}
        >
          <Plus className="h-4 w-4" />
          {t('support.emptyState.cta')}
        </Button>
      </CardContent>
    </Card>
  );
};