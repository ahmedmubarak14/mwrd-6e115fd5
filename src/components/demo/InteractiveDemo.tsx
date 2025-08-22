import { useState, useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StepNode } from './StepNode';
import { FeatureNode } from './FeatureNode';
import { initialNodes, initialEdges } from './demoData';

const nodeTypes = {
  step: StepNode,
  feature: FeatureNode,
};

interface InteractiveDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveDemo = ({ isOpen, onClose }: InteractiveDemoProps) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      titleEn: "Welcome to MWRD",
      titleAr: "مرحباً بك في مورد",
      descEn: "Your complete procurement management platform",
      descAr: "منصتك الكاملة لإدارة المشتريات"
    },
    {
      titleEn: "Create an Account",
      titleAr: "إنشاء حساب",
      descEn: "Quick and easy registration process",
      descAr: "عملية تسجيل سريعة وسهلة"
    },
    {
      titleEn: "Dashboard Overview",
      titleAr: "نظرة عامة على لوحة التحكم",
      descEn: "Your centralized control center",
      descAr: "مركز التحكم المركزي الخاص بك"
    },
    {
      titleEn: "Create Service Request",
      titleAr: "إنشاء طلب خدمة",
      descEn: "Request any event service you need",
      descAr: "اطلب أي خدمة فعاليات تحتاجها"
    },
    {
      titleEn: "Browse Suppliers",
      titleAr: "تصفح المورديين",
      descEn: "Find vetted suppliers for your needs",
      descAr: "ابحث عن موردين معتمدين لاحتياجاتك"
    },
    {
      titleEn: "Manage Approvals",
      titleAr: "إدارة الموافقات",
      descEn: "Streamlined approval workflows",
      descAr: "سير عمل موافقات مبسط"
    },
    {
      titleEn: "Track Progress",
      titleAr: "تتبع التقدم",
      descEn: "Monitor your orders in real-time",
      descAr: "راقب طلباتك في الوقت الفعلي"
    }
  ];

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      highlightStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      highlightStep(currentStep - 1);
    }
  };

  const highlightStep = (stepIndex: number) => {
    setNodes((nds) =>
      nds.map((node) => {
        const nodeData = node.data as any;
        if (nodeData.stepNumber !== undefined) {
          return {
            ...node,
            data: {
              ...node.data,
              isActive: nodeData.stepNumber === stepIndex,
              isCompleted: nodeData.stepNumber < stepIndex,
            },
          };
        }
        return node;
      })
    );
  };

  const startTour = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    highlightStep(0);
  };

  const resetTour = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setNodes((nds) =>
      nds.map((node) => {
        const nodeData = node.data as any;
        if (nodeData.stepNumber !== undefined) {
          return {
            ...node,
            data: {
              ...node.data,
              isActive: false,
              isCompleted: false,
            },
          };
        }
        return node;
      })
    );
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b bg-card">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {isRTL ? 'جولة تفاعلية في مورد' : 'Interactive MWRD Tour'}
            </DialogTitle>
            <Badge variant="outline" className="text-sm">
              {currentStep + 1} / {steps.length}
            </Badge>
          </div>
          
          {isPlaying && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">
                  {isRTL ? currentStepData.titleAr : currentStepData.titleEn}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="mb-2" />
              <p className="text-muted-foreground">
                {isRTL ? currentStepData.descAr : currentStepData.descEn}
              </p>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gradient-to-br from-background to-muted/20"
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background color="#e5e7eb" />
            <Controls position="top-right" />
            <MiniMap 
              position="bottom-right"
              className="bg-card border rounded-lg"
              pannable
              zoomable
            />
          </ReactFlow>
        </div>

        <div className="p-6 border-t bg-card">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            {!isPlaying ? (
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button onClick={startTour} className="bg-gradient-to-r from-primary to-accent">
                  {isRTL ? 'ابدأ الجولة' : 'Start Tour'}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  {isRTL ? 'إغلاق' : 'Close'}
                </Button>
              </div>
            ) : (
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                  variant="outline"
                >
                  {isRTL ? 'السابق' : 'Previous'}
                </Button>
                <Button 
                  onClick={currentStep === steps.length - 1 ? resetTour : nextStep}
                  className="bg-gradient-to-r from-primary to-accent"
                >
                  {currentStep === steps.length - 1 
                    ? (isRTL ? 'إعادة تشغيل' : 'Restart')
                    : (isRTL ? 'التالي' : 'Next')
                  }
                </Button>
                <Button variant="ghost" onClick={resetTour}>
                  {isRTL ? 'إيقاف' : 'Stop'}
                </Button>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              {isRTL ? 'اضغط على العقد لمعرفة المزيد' : 'Click on nodes to learn more'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};