import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export const useToastFeedback = () => {
  const { toast } = useToast();

  const showSuccess = useCallback((message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  }, [toast]);

  const showError = useCallback((message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }, [toast]);

  const showWarning = useCallback((message: string) => {
    toast({
      title: "Warning",
      description: message,
    });
  }, [toast]);

  const showInfo = useCallback((message: string) => {
    toast({
      title: "Info",
      description: message,
    });
  }, [toast]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};