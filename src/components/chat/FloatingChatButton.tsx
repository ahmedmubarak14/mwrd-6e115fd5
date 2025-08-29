import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RealTimeChatInterface } from './RealTimeChatInterface';

interface FloatingChatButtonProps {
  className?: string;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          className
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl w-full h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Messages
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 p-6 pt-0">
            <RealTimeChatInterface height="calc(80vh - 120px)" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};