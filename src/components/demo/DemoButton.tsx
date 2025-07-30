import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { InteractiveDemo } from './InteractiveDemo';

interface DemoButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const DemoButton = ({ variant = 'default', size = 'default', className }: DemoButtonProps) => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`hover-scale ${className}`}
        onClick={() => setIsDemoOpen(true)}
      >
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Play className="h-4 w-4" />
          <span>
            {isRTL ? 'شاهد كيف تعمل المنصة' : 'Watch Experience'}
          </span>
        </div>
      </Button>

      <InteractiveDemo 
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </>
  );
};