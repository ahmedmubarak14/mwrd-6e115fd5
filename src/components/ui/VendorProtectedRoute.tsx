import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProductionLoadingSpinner } from './ProductionLoadingSpinner';
import { ProductionErrorBoundary } from './ProductionErrorBoundary';
import { Navigate } from 'react-router-dom';

interface VendorProtectedRouteProps {
  children: React.ReactNode;
}

export const VendorProtectedRoute: React.FC<VendorProtectedRouteProps> = ({ children }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <ProductionLoadingSpinner 
        size="lg" 
        text="Verifying vendor access..." 
        fullScreen={true}
      />
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User exists but no profile or not a vendor
  if (!userProfile || userProfile.role !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Vendor Access Required
          </h1>
          <p className="text-muted-foreground mb-6">
            You need vendor privileges to access this area. Please contact support if you believe this is an error.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductionErrorBoundary showDetails={true} showHomeButton={true}>
      {children}
    </ProductionErrorBoundary>
  );
};