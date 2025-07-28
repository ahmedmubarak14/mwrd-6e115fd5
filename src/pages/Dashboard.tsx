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
        <main className="flex-1 p-6">
          {/* Role Switcher for Demo */}
          <div className="mb-6 flex gap-2">
            <Button 
              variant={userRole === 'client' ? 'default' : 'outline'}
              onClick={() => setUserRole('client')}
            >
              Client View
            </Button>
            <Button 
              variant={userRole === 'supplier' ? 'default' : 'outline'}
              onClick={() => setUserRole('supplier')}
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