import { useCallback } from "react";

// Safe toast hook that doesn't break if called outside React context
export const useSafeToastFeedback = () => {
  const showSuccess = useCallback((message: string) => {
    try {
      // Try to import and use toast dynamically
      import("@/hooks/use-toast").then(({ toast }) => {
        toast({
          title: "Success",
          description: message,
          variant: "default",
        });
      }).catch(() => {
        // Fallback to console if toast isn't available
        console.log("Success:", message);
      });
    } catch (error) {
      console.log("Success:", message);
    }
  }, []);

  const showError = useCallback((message: string) => {
    try {
      import("@/hooks/use-toast").then(({ toast }) => {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }).catch(() => {
        console.error("Error:", message);
      });
    } catch (error) {
      console.error("Error:", message);
    }
  }, []);

  const showWarning = useCallback((message: string) => {
    try {
      import("@/hooks/use-toast").then(({ toast }) => {
        toast({
          title: "Warning",
          description: message,
        });
      }).catch(() => {
        console.warn("Warning:", message);
      });
    } catch (error) {
      console.warn("Warning:", message);
    }
  }, []);

  const showInfo = useCallback((message: string) => {
    try {
      import("@/hooks/use-toast").then(({ toast }) => {
        toast({
          title: "Info",
          description: message,
        });
      }).catch(() => {
        console.info("Info:", message);
      });
    } catch (error) {
      console.info("Info:", message);
    }
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};