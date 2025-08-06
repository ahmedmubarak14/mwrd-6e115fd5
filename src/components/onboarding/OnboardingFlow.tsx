import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  completed?: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Supplify",
    description: "Let's get you started with the basics of our platform.",
  },
  {
    id: "profile",
    title: "Complete Your Profile",
    description: "Add your company information and preferences to get better matches.",
    action: "Complete Profile",
  },
  {
    id: "explore",
    title: "Explore Features",
    description: "Discover how to create requests, browse suppliers, and manage communications.",
    action: "Take Tour",
  },
  {
    id: "first-request",
    title: "Create Your First Request",
    description: "Start by posting your first service request to connect with suppliers.",
    action: "Create Request",
  },
];

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingFlow = ({ onComplete, onSkip }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useLocalStorage<string[]>("onboarding-completed", []);
  const { userProfile } = useAuth();

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  useEffect(() => {
    // Auto-mark welcome step as completed
    if (currentStep === 0) {
      markStepCompleted("welcome");
    }
  }, [currentStep]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={onSkip}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">
              Step {currentStep + 1} of {onboardingSteps.length}
            </Badge>
            {completedSteps.includes(currentStepData.id) && (
              <CheckCircle className="h-5 w-5 text-primary" />
            )}
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step-specific content */}
          {currentStep === 0 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl text-primary-foreground">👋</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Welcome {userProfile?.full_name || "User"}! We're excited to help you connect with the right suppliers.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete your profile to get personalized supplier recommendations.
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore our features: search, filter, communicate, and track your requests.
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create your first request to start connecting with qualified suppliers.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="rtl-button-gap"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStepData.action && (
                <Button
                  variant="outline"
                  onClick={() => markStepCompleted(currentStepData.id)}
                >
                  {currentStepData.action}
                </Button>
              )}
              
              <Button onClick={handleNext} className="rtl-button-gap">
                {currentStep === onboardingSteps.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};