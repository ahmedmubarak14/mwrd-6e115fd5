import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StepNodeData {
  stepNumber: number;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  isActive?: boolean;
  isCompleted?: boolean;
  icon?: any;
}

export const StepNode = memo(({ data, isConnectable }: NodeProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const nodeData = data as unknown as StepNodeData;
  
  const getStatusIcon = () => {
    if (nodeData.isCompleted) {
      return <CheckCircle className="h-5 w-5 text-primary" />;
    }
    if (nodeData.isActive) {
      return <Play className="h-5 w-5 text-accent" />;
    }
    return <Circle className="h-5 w-5 text-muted-foreground" />;
  };

  const getCardClassName = () => {
    let baseClass = "min-w-[280px] transition-all duration-300 border-2 cursor-pointer";
    
    if (nodeData.isActive) {
      return `${baseClass} border-accent shadow-lg scale-105 bg-accent/5`;
    }
    if (nodeData.isCompleted) {
      return `${baseClass} border-primary/50 bg-primary/5`;
    }
    return `${baseClass} border-border hover:border-muted-foreground/50`;
  };

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="opacity-0"
      />
      
      <Card className={getCardClassName()}>
        <CardContent className="p-4">
          <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon()}
            </div>
            
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {nodeData.stepNumber + 1}
                </Badge>
                {nodeData.icon && <nodeData.icon className="h-4 w-4 text-primary" />}
              </div>
              
              <h3 className="font-semibold text-sm mb-1">
                {isRTL ? nodeData.titleAr : nodeData.titleEn}
              </h3>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isRTL ? nodeData.descAr : nodeData.descEn}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="opacity-0"
      />
    </div>
  );
});