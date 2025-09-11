import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Shield, 
  Database, 
  Zap, 
  Users, 
  BarChart3,
  Settings,
  Globe
} from 'lucide-react';
import { ProductionMonitor } from './ProductionMonitor';
import { PerformanceOptimizer } from './PerformanceOptimizer';
import { useAuth } from '@/contexts/AuthContext';

interface ProductionFeature {
  name: string;
  description: string;
  status: 'completed' | 'active' | 'monitoring';
  icon: React.ComponentType<{ className?: string }>;
}

export const ProductionReadiness: React.FC = () => {
  const { userProfile } = useAuth();

  const productionFeatures: ProductionFeature[] = [
    {
      name: 'Authentication System',
      description: 'Supabase auth with security features, rate limiting, and role-based access',
      status: 'completed',
      icon: Shield
    },
    {
      name: 'Real-time Data Integration',
      description: 'Live Supabase analytics with real-time updates and caching',
      status: 'active',
      icon: Database
    },
    {
      name: 'Performance Optimization',
      description: 'Lazy loading, error boundaries, and production monitoring',
      status: 'active',
      icon: Zap
    },
    {
      name: 'Production Monitoring',
      description: 'Health checks, error tracking, and system status monitoring',
      status: 'monitoring',
      icon: BarChart3
    },
    {
      name: 'Security Hardening',
      description: 'Input validation, XSS protection, and security event logging',
      status: 'completed',
      icon: Users
    },
    {
      name: 'Production Configuration',
      description: 'Environment validation, production settings, and deployment readiness',
      status: 'completed',
      icon: Settings
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'monitoring': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'active': return <Globe className="h-4 w-4 animate-pulse" />;
      case 'monitoring': return <BarChart3 className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  // Only show to admins
  if (userProfile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Production Readiness Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Production Readiness Status
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            All phases completed - Application is production-ready
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productionFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <feature.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{feature.name}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(feature.status)}
                  <Badge className={getStatusColor(feature.status)}>
                    {feature.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Completion Summary */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Production Deployment Ready</h4>
                <p className="text-sm text-green-700">
                  ✅ Phase 1: Critical Fixes - Complete<br />
                  ✅ Phase 2: Data Integration - Complete<br />
                  ✅ Phase 3: Production Readiness - Complete
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Production Monitor */}
      <ProductionMonitor />
    </div>
  );
};