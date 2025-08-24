import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Package, TrendingUp, Users, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ProcurementClientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Track your procurement requests, vendor performance, and overall efficiency.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$23,456</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest procurement activities and updates.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ul className="list-none space-y-2">
            <li className="py-2 border-b last:border-none">
              <p className="text-sm font-medium">New request: IT Equipment</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </li>
            <li className="py-2 border-b last:border-none">
              <p className="text-sm font-medium">Offer received: Construction Materials</p>
              <p className="text-xs text-muted-foreground">5 hours ago</p>
            </li>
            <li className="py-2 border-b last:border-none">
              <p className="text-sm font-medium">Budget approved: Office Supplies</p>
              <p className="text-xs text-muted-foreground">1 day ago</p>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your procurement tasks efficiently.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full">Create New Request</Button>
          <Button variant="secondary" className="w-full">View Pending Offers</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Requests
            </CardTitle>
            <CardDescription>Your recently submitted procurement requests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">IT Equipment</p>
                <p className="text-sm text-muted-foreground">Due: 2023-12-15</p>
              </div>
              <Badge>Pending</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Office Supplies</p>
                <p className="text-sm text-muted-foreground">Due: 2023-12-20</p>
              </div>
              <Badge variant="success">Approved</Badge>
            </div>
            
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View All Requests
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Top Vendors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Tech Solutions Inc</p>
                  <p className="text-sm text-muted-foreground">IT Equipment</p>
                </div>
              </div>
              <Badge>4.9★</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-medium">Industrial Supply Co</p>
                  <p className="text-sm text-muted-foreground">Manufacturing</p>
                </div>
              </div>
              <Badge>4.8★</Badge>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => navigate('/vendors')}>
              <Building2 className="mr-2 h-4 w-4" />
              View All Vendors
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
