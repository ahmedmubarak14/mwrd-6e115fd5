
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedUserManagement } from "@/components/admin/AdvancedUserManagement";
import { VerificationQueue } from "@/components/admin/VerificationQueue";
import { Users, FileCheck } from "lucide-react";

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, roles, and verification requests
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Verification Queue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <AdvancedUserManagement />
        </TabsContent>

        <TabsContent value="verification">
          <VerificationQueue />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;
