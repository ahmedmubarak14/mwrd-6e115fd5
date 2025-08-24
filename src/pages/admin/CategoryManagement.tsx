
import React from 'react';
import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CategoryManagement as CategoryManagementComponent } from "@/components/admin/CategoryManagement";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function CategoryManagement() {
  const { userProfile } = useAuth();
  const { language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isRTL = language === 'ar';

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'font-arabic' : ''}`}>
      <Header onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side={isRTL ? "right" : "left"} className="w-80 p-0 flex flex-col">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </SheetContent>
      </Sheet>

      <div className="rtl-flex">
        {/* Desktop Sidebar - position based on language */}
        <div className="hidden lg:block rtl-order-1">
          <Sidebar userRole={userProfile?.role} userProfile={userProfile} />
        </div>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-full overflow-hidden rtl-order-3">
          <div className="max-w-7xl mx-auto">
            <CategoryManagementComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
