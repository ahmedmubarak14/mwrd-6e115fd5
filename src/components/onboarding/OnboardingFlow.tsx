
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, ArrowRight, ArrowLeft, X, FileText, Clock, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CRDocumentUpload } from "@/components/verification/CRDocumentUpload";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  completed?: boolean;
  requiresVerification?: boolean;
}

const getOnboardingSteps = (role: string): OnboardingStep[] => {
  const baseSteps = [
    {
      id: "welcome",
      title: "Welcome to MWRD",
      description: "Let's get you started with the basics of our platform.",
    },
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your company information and preferences to get better matches.",
      action: "Complete Profile",
    }
  ];

  if (role === 'client') {
    return [
      ...baseSteps,
      {
        id: "verification",
        title: "Upload Commercial Registration",
        description: "Upload your CR document for account verification and full platform access.",
        action: "Upload CR",
        requiresVerification: true,
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
      }
    ];
  } else {
    return [
      ...baseSteps,
      {
        id: "explore",
        title: "Explore Features",
        description: "Discover how to browse requests, submit offers, and manage communications.",
        action: "Take Tour",
      },
      {
        id: "first-offer",
        title: "Browse Available Requests",
        description: "Start by browsing client requests and submitting your first offer.",
        action: "Browse Requests",
      }
    ];
  }
};

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingFlow = ({ onComplete, onSkip }: OnboardingFlowProps) => {
  const { userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useLocalStorage<string[]>("onboarding-completed", []);
  const [crUploaded, setCrUploaded] = useState(false);
  
  const onboardingSteps = getOnboardingSteps(userProfile?.role || 'client');
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

  const handleActionClick = (stepId: string) => {
    switch (stepId) {
      case "profile":
        window.location.href = "/profile";
        break;
      case "first-request":
        window.location.href = "/create-request";
        break;
      case "first-offer":
        window.location.href = "/browse-requests";
        break;
      default:
        markStepCompleted(stepId);
    }
  };

  const handleCRUploadSuccess = () => {
    setCrUploaded(true);
    markStepCompleted("verification");
  };

  useEffect(() => {
    // Auto-mark welcome step as completed
    if (currentStep === 0) {
      markStepCompleted("welcome");
    }
  }, [currentStep]);

  // Check if current step can proceed
  const canProceed = () => {
    if (currentStepData.id === "verification" && userProfile?.role === 'client') {
      return crUploaded || completedSteps.includes("verification") || 
             ((userProfile as any)?.verification_status === 'approved');
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-2">
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
            {(completedSteps.includes(currentStepData.id) || 
              (currentStepData.id === "verification" && crUploaded)) && (
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
                Welcome {userProfile?.full_name || "User"}! We're excited to help you 
                {userProfile?.role === 'client' ? ' connect with the right suppliers' : ' find great opportunities'}.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete your profile to get personalized recommendations and build trust with other users.
              </p>
            </div>
          )}

          {currentStepData.id === "verification" && userProfile?.role === 'client' && (
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                  <FileText className="text-2xl text-primary-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload your Commercial Registration to verify your company and unlock full platform features.
                </p>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Why verification is required:</strong><br />
                  • Access to RFQ creation and management<br />
                  • Order placement and vendor interactions<br />
                  • Enhanced trust and credibility<br />
                  • Full platform features and support
                </AlertDescription>
              </Alert>

              {((userProfile as any)?.verification_status === 'approved') ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your account has been verified! You have full access to all platform features.
                  </AlertDescription>
                </Alert>
              ) : ((userProfile as any)?.verification_status === 'under_review') ? (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Your Commercial Registration is under review. You'll be notified once verification is complete.
                  </AlertDescription>
                </Alert>
              ) : (
                <CRDocumentUpload
                  onUploadSuccess={handleCRUploadSuccess}
                  isRequired={true}
                />
              )}
            </div>
          )}

          {currentStepData.id === "explore" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore our features: 
                {userProfile?.role === 'client' 
                  ? ' create requests, browse suppliers, and manage communications'
                  : ' browse requests, submit offers, and communicate with clients'
                }.
              </p>
            </div>
          )}

          {(currentStepData.id === "first-request" || currentStepData.id === "first-offer") && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {userProfile?.role === 'client' 
                  ? 'Create your first request to start connecting with qualified suppliers.'
                  : 'Browse available requests and submit your first offer to start earning.'
                }
              </p>
              
              {userProfile?.role === 'client' && ((userProfile as any)?.verification_status !== 'approved') && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    This feature requires account verification. Complete the verification process to create requests.
                  </AlertDescription>
                </Alert>
              )}
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
              {currentStepData.action && currentStepData.id !== "verification" && (
                <Button
                  variant="outline"
                  onClick={() => handleActionClick(currentStepData.id)}
                >
                  {currentStepData.action}
                </Button>
              )}
              
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
                className="rtl-button-gap"
              >
                {currentStep === onboardingSteps.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Help text for verification step */}
          {currentStepData.id === "verification" && !canProceed() && (
            <p className="text-sm text-muted-foreground text-center">
              Please upload your Commercial Registration to continue
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
