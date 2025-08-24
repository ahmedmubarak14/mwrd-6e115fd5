
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, AlertTriangle, FileText, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface VendorVerificationStatusProps {
  showActions?: boolean;
  compact?: boolean;
}

export const VendorVerificationStatus = ({ 
  showActions = true, 
  compact = false 
}: VendorVerificationStatusProps) => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  if (!userProfile || userProfile.role !== 'vendor') {
    return null;
  }

  const getVerificationStatus = () => {
    const status = userProfile.verification_status || 'pending';
    const accountStatus = userProfile.status;

    if (status === 'approved' && accountStatus === 'approved') {
      return {
        level: 'verified',
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        title: 'Verified Vendor',
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

  const verificationStatus = getVerificationStatus();

  const getAccessLevel = () => {
    switch (verificationStatus.level) {
      case 'verified':
        return {
          canBid: true,
          canMessage: true,
          canReceiveOrders: true,
          features: ['Full platform access', 'Priority support', 'Advanced analytics']
        };
      case 'pending':
        return {
          canBid: false,
          canMessage: true,
          canReceiveOrders: false,
          features: ['Browse opportunities', 'View client profiles', 'Basic messaging']
        };
      default:
        return {
          canBid: false,
          canMessage: false,
          canReceiveOrders: false,
          features: ['View public content only']
        };
    }
  };

  const accessLevel = getAccessLevel();

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
      <CardHeader>
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
      </CardHeader>

      <CardContent className="space-y-4">
        {userProfile.verification_notes && verificationStatus.level === 'rejected' && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Rejection Reason:</strong><br />
              {userProfile.verification_notes}
            </AlertDescription>
          </Alert>
        )}

        <div>
          <h4 className="font-semibold mb-2">Current Access Level:</h4>
          <ul className="space-y-1">
            {accessLevel.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

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

        {showActions && verificationStatus.level !== 'verified' && (
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/profile')}
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
