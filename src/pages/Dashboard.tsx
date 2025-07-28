import { Header } from "@/components/ui/layout/Header";
import { Sidebar } from "@/components/ui/layout/Sidebar";
import { ClientDashboard } from "@/components/Dashboard/ClientDashboard";
import { SupplierDashboard } from "@/components/Dashboard/SupplierDashboard";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Dashboard = () => {
  const [userRole, setUserRole] = useState<'client' | 'supplier'>('client');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-8">
          {/* Enhanced Role Switcher */}
          <div className="mb-8 flex gap-3">
            <Button 
              variant={userRole === 'client' ? 'default' : 'outline'}
              onClick={() => setUserRole('client')}
              className={`hover-scale ${userRole === 'client' ? 'bg-gradient-to-r from-primary to-accent shadow-lg' : ''}`}
            >
              Client View
            </Button>
            <Button 
              variant={userRole === 'supplier' ? 'default' : 'outline'}
              onClick={() => setUserRole('supplier')}
              className={`hover-scale ${userRole === 'supplier' ? 'bg-gradient-to-r from-primary to-accent shadow-lg' : ''}`}
            >
              Supplier View
            </Button>
          </div>

          {userRole === 'client' ? <ClientDashboard /> : <SupplierDashboard />}
        </main>
      </div>
    </div>
  );
};