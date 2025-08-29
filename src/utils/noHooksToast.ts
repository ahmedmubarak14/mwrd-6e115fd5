// Toast utilities that don't use any React hooks
export const noHooksToast = {
  showSuccess: (message: string) => {
    console.log("✅ Success:", message);
    
    // Try to show toast if available, but don't fail if not
    try {
      // Use setTimeout to defer the toast call
      setTimeout(() => {
        import("@/hooks/use-toast").then(({ toast }) => {
          toast({
            title: "Success",
            description: message,
            variant: "default",
          });
        }).catch(() => {
          // Silent fallback - already logged
        });
      }, 0);
    } catch (error) {
      // Silent fallback - already logged
    }
  },

  showError: (message: string) => {
    console.error("❌ Error:", message);
    
    try {
      setTimeout(() => {
        import("@/hooks/use-toast").then(({ toast }) => {
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
        }).catch(() => {
          // Silent fallback - already logged
        });
      }, 0);
    } catch (error) {
      // Silent fallback - already logged
    }
  },

  showWarning: (message: string) => {
    console.warn("⚠️ Warning:", message);
    
    try {
      setTimeout(() => {
        import("@/hooks/use-toast").then(({ toast }) => {
          toast({
            title: "Warning",
            description: message,
          });
        }).catch(() => {
          // Silent fallback - already logged
        });
      }, 0);
    } catch (error) {
      // Silent fallback - already logged
    }
  },

  showInfo: (message: string) => {
    console.info("ℹ️ Info:", message);
    
    try {
      setTimeout(() => {
        import("@/hooks/use-toast").then(({ toast }) => {
          toast({
            title: "Info",
            description: message,
          });
        }).catch(() => {
          // Silent fallback - already logged
        });
      }, 0);
    } catch (error) {
      // Silent fallback - already logged
    }
  }
};