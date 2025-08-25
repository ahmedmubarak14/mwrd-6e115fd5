import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  RefreshCw,
  Download,
  Star,
  Eye,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToastFeedback } from '@/hooks/useToastFeedback';

interface VerificationRequest {
  id: string;
  document_type: string;
  document_url: string;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
}

interface UnifiedVerificationStatusProps {
  showActions?: boolean;
  compact?: boolean;
  showAccessLevels?: boolean;
}

export const UnifiedVerificationStatus = ({ 
  showActions = true, 
  compact = false,
  showAccessLevels = true
}: UnifiedVerificationStatusProps) => {
  const { userProfile } = useAuth();
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToastFeedback();

  const fetchVerificationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setVerificationRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching verification requests:', error);
      showError('Failed to load verification status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  if (!userProfile) return null;

  const getVerificationStatus = () => {
    const status = userProfile.verification_status || 'pending';
    const accountStatus = userProfile.status;

    if (status === 'approved' && accountStatus === 'approved') {
      return {
        level: 'verified',
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        title: 'Verified Account',
        description: 'Your account is fully verified and active',
        color: 'bg-green-500/10 text-green-700 border-green-200',
        badgeVariant: 'default' as const
      };
    } else if (status === 'pending' || status === 'under_review') {
      return {
        level: 'pending',
        icon: <Clock className="h-5 w-5 text-yellow-500" />,
        title: 'Verification Pending',
        description: 'Your documents are being reviewed (24-48 hours)',
        color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
        badgeVariant: 'outline' as const
      };
    } else if (status === 'rejected') {
      return {
        level: 'rejected',
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        title: 'Verification Rejected',
        description: 'Please review feedback and resubmit documents',
        color: 'bg-red-500/10 text-red-700 border-red-200',
        badgeVariant: 'destructive' as const
      };
    } else {
      return {
        level: 'unverified',
        icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
        title: 'Verification Required',
        description: 'Complete verification to access all features',
        color: 'bg-gray-500/10 text-gray-700 border-gray-200',
        badgeVariant: 'secondary' as const
      };
    }
  };

  const getAccessLevel = () => {
    const isVerified = userProfile.verification_status === 'approved' && userProfile.status === 'approved';
    const isPending = userProfile.verification_status === 'pending' || userProfile.verification_status === 'under_review';
    
    if (userProfile.role === 'vendor') {
      return {
        canBid: isVerified,
        canMessage: isVerified || isPending,
        canReceiveOrders: isVerified,
        features: isVerified 
          ? ['Submit offers on requests', 'Direct messaging with clients', 'Receive and manage orders', 'Priority support']
          : isPending 
          ? ['Browse opportunities', 'View client profiles', 'Limited messaging']
          : ['View public content only']
      };
    } else {
      return {
        canCreateRequests: isVerified,
        canMessage: isVerified || isPending,
        canManageOrders: isVerified,
        features: isVerified 
          ? ['Create procurement requests', 'Message with vendors', 'Manage orders and projects', 'Full platform access']
          : isPending 
          ? ['Browse vendor profiles', 'View platform content', 'Limited messaging']
          : ['View public content only']
      };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-destructive" />;
      case 'under_review': return <Clock className="h-5 w-5 text-warning" />;
      default: return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="default" className="bg-success">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'under_review': return <Badge variant="outline">Under Review</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const verificationStatus = getVerificationStatus();
  const accessLevel = getAccessLevel();

  // Check if user is fully verified
  const isFullyVerified = userProfile.verification_status === 'approved' && userProfile.status === 'approved';

  // For fully verified users, only show compact version or hide completely
  if (isFullyVerified && !compact) {
    return null; // Hide the full verification status for verified users
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {verificationStatus.icon}
        <Badge variant={verificationStatus.badgeVariant}>
          {verificationStatus.title}
        </Badge>
      </div>
    );
  }

  return (
    <Card className={`border-2 ${verificationStatus.color}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-3">
            {verificationStatus.icon}
            <div>
              <div className="flex items-center gap-2">
                {verificationStatus.title}
                <Badge variant={verificationStatus.badgeVariant}>
                  {verificationStatus.level.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardTitle>
          <CardDescription>{verificationStatus.description}</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchVerificationRequests}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(userProfile.verification_status || 'pending')}
            <div>
              <p className="font-medium">Account Status</p>
              <p className="text-sm text-muted-foreground">
                {userProfile.verification_status === 'approved' ? 'Fully verified and active' :
                 userProfile.verification_status === 'rejected' ? 'Verification rejected' :
                 userProfile.verification_status === 'under_review' ? 'Documents under review' :
                 'Verification pending'}
              </p>
            </div>
          </div>
          {getStatusBadge(userProfile.verification_status || 'pending')}
        </div>

        {/* Verification Notes */}
        {userProfile.verification_notes && (
          <Alert variant={userProfile.verification_status === 'rejected' ? 'destructive' : 'default'}>
            <AlertDescription>
              <strong>Admin Notes:</strong><br />
              {userProfile.verification_notes}
            </AlertDescription>
          </Alert>
        )}

        {/* Current Access Level */}
        {showAccessLevels && (
          <div>
            <h4 className="font-semibold mb-3">Current Access Level:</h4>
            <div className="space-y-2 mb-4">
              {accessLevel.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Access Level Visualization for Vendors */}
            {userProfile.role === 'vendor' && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className={`p-3 rounded-lg ${accessLevel.canBid ? 'bg-green-500/10' : 'bg-gray-100'}`}>
                  <Star className={`h-4 w-4 mx-auto mb-1 ${accessLevel.canBid ? 'text-green-500' : 'text-gray-400'}`} />
                  <div className="text-xs font-medium">Bidding</div>
                  <div className="text-xs text-muted-foreground">
                    {accessLevel.canBid ? 'Enabled' : 'Locked'}
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${accessLevel.canMessage ? 'bg-green-500/10' : 'bg-gray-100'}`}>
                  <FileText className={`h-4 w-4 mx-auto mb-1 ${accessLevel.canMessage ? 'text-green-500' : 'text-gray-400'}`} />
                  <div className="text-xs font-medium">Messaging</div>
                  <div className="text-xs text-muted-foreground">
                    {accessLevel.canMessage ? 'Enabled' : 'Locked'}
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${accessLevel.canReceiveOrders ? 'bg-green-500/10' : 'bg-gray-100'}`}>
                  <CheckCircle className={`h-4 w-4 mx-auto mb-1 ${accessLevel.canReceiveOrders ? 'text-green-500' : 'text-gray-400'}`} />
                  <div className="text-xs font-medium">Orders</div>
                  <div className="text-xs text-muted-foreground">
                    {accessLevel.canReceiveOrders ? 'Enabled' : 'Locked'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Document History */}
        <div className="space-y-3">
          <h4 className="font-medium">Document Submissions</h4>
          
          {verificationRequests.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No documents have been submitted yet. Please upload your Commercial Registration to begin verification.
              </AlertDescription>
            </Alert>
          ) : (
            verificationRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span className="font-medium">Commercial Registration</span>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Submitted: {new Date(request.submitted_at).toLocaleDateString()}</p>
                  {request.reviewed_at && (
                    <p>Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}</p>
                  )}
                </div>

                {request.reviewer_notes && (
                  <Alert variant={request.status === 'rejected' ? 'destructive' : 'default'}>
                    <AlertDescription className="text-sm">
                      <strong>Review Notes:</strong><br />
                      {request.reviewer_notes}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(request.document_url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    View Document
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Next Steps */}
        {verificationStatus.level !== 'verified' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Next Steps:</strong><br />
              {userProfile.verification_status === 'rejected' ? 
                'Please review the feedback above and upload a new Commercial Registration document.' :
                userProfile.verification_status === 'under_review' ?
                'Your documents are being reviewed. You will be notified once the review is complete.' :
                'Upload your Commercial Registration document to begin the verification process.'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        {showActions && verificationStatus.level !== 'verified' && (
          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.href = '/profile'}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              {verificationStatus.level === 'rejected' ? 'Resubmit Documents' : 'Complete Verification'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
