import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeatureNodeData {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  icon: any;
  color: string;
}

export const FeatureNode = memo(({ data, isConnectable }: NodeProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const nodeData = data as unknown as FeatureNodeData;

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="opacity-0"
      />
      
      <Card className="min-w-[200px] border-0 shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-4">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${nodeData.color}20` }}
            >
              <nodeData.icon className="h-5 w-5" style={{ color: nodeData.color }} />
            </div>
            
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h4 className="font-semibold text-sm mb-1">
                {isRTL ? nodeData.titleAr : nodeData.titleEn}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isRTL ? nodeData.descAr : nodeData.descEn}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="opacity-0"
      />
    </div>
  );
});