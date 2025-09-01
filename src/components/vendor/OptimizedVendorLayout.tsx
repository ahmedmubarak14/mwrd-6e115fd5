import React, { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOptionalLanguage } from "@/contexts/useOptionalLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductionVendorHeader } from "./ProductionVendorHeader";
import { ProductionVendorSidebar } from "./ProductionVendorSidebar";
import { VendorMobileSidebar } from "./VendorMobileSidebar";
import { VendorProtectedRoute } from "@/components/ui/VendorProtectedRoute";
import { cn } from "@/lib/utils";

interface OptimizedVendorLayoutProps {
  children: React.ReactNode;
}

export const OptimizedVendorLayout = ({ children }: OptimizedVendorLayoutProps) => {
  const { userProfile } = useAuth();
  const languageContext = useOptionalLanguage();
  const { isRTL } = languageContext || { isRTL: false };
  const isMobile = useIsMobile();
  
  // Optimized state management
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vendor-sidebar-open');
      return stored ? JSON.parse(stored) : !isMobile;
    }
    return !isMobile;
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((prev: boolean) => {
      const newState = !prev;
      localStorage.setItem('vendor-sidebar-open', JSON.stringify(newState));
      return newState;
    });
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Memoized sidebar props to prevent unnecessary re-renders
  const sidebarProps = useMemo(() => ({
    collapsed: !sidebarOpen,
    onToggle: handleSidebarToggle,
    onItemClick: handleMobileMenuClose
  }), [sidebarOpen, handleSidebarToggle, handleMobileMenuClose]);

  const headerProps = useMemo(() => ({
    sidebarOpen,
    onSidebarToggle: handleSidebarToggle,
    onMobileMenuToggle: handleMobileMenuToggle,
    isCollapsed: !sidebarOpen
  }), [sidebarOpen, handleSidebarToggle, handleMobileMenuToggle]);

  return (
    <VendorProtectedRoute>
      <div className={cn(
        "min-h-screen bg-background font-sans antialiased",
        isRTL && "rtl"
      )}>
        <ProductionVendorHeader {...headerProps} />
        
        {/* Verification Banner - Removed missing import */}

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className={cn(
              "border-r bg-muted/40 transition-all duration-300 ease-in-out will-change-transform",
              sidebarOpen ? "w-64" : "w-16",
              isRTL && "border-l border-r-0"
            )}>
              <ProductionVendorSidebar {...sidebarProps} />
            </aside>
          )}

          {/* Mobile Sidebar */}
          <VendorMobileSidebar
            isOpen={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
          />

          {/* Main Content */}
          <main className={cn(
            "flex-1 overflow-auto bg-background",
            "safe-area-inset-x safe-area-inset-bottom" // iOS safe areas
          )}>
            <div className="p-4 lg:p-6 max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </VendorProtectedRoute>
  );
};