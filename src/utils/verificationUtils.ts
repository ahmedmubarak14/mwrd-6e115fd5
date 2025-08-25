
import { UserProfile } from '@/types/database';

export interface VerificationStatusInfo {
  isFullyVerified: boolean;
  isRejected: boolean;
  isPending: boolean;
  isUnverified: boolean;
  level: 'verified' | 'pending' | 'rejected' | 'unverified';
  statusText: string;
  description: string;
}

export const getVerificationStatus = (userProfile: UserProfile | null): VerificationStatusInfo => {
  if (!userProfile) {
    return {
      isFullyVerified: false,
      isRejected: false,
      isPending: false,
      isUnverified: true,
      level: 'unverified',
      statusText: 'Not Verified',
      description: 'Profile not loaded'
    };
  }

  const verificationStatus = userProfile.verification_status || 'pending';
  const accountStatus = userProfile.status;
  
  const isFullyVerified = verificationStatus === 'approved' && accountStatus === 'approved';
  const isRejected = verificationStatus === 'rejected';
  const isPending = verificationStatus === 'pending' || verificationStatus === 'under_review';
  const isUnverified = !verificationStatus || verificationStatus === 'pending';

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      isRejected: false,
      isPending: false,
      isUnverified: false,
      level: 'verified',
      statusText: 'Fully Verified',
      description: 'Your account is fully verified and active'
    };
  }

  if (isRejected) {
    return {
      isFullyVerified: false,
      isRejected: true,
      isPending: false,
      isUnverified: false,
      level: 'rejected',
      statusText: 'Verification Rejected',
      description: 'Please review feedback and resubmit documents'
    };
  }

  if (isPending) {
    return {
      isFullyVerified: false,
      isRejected: false,
      isPending: true,
      isUnverified: false,
      level: 'pending',
      statusText: 'Verification Pending',
      description: 'Your documents are being reviewed (24-48 hours)'
    };
  }

  return {
    isFullyVerified: false,
    isRejected: false,
    isPending: false,
    isUnverified: true,
    level: 'unverified',
    statusText: 'Verification Required',
    description: 'Complete verification to access all features'
  };
};

export const getUserAccessLevel = (userProfile: UserProfile | null) => {
  const verification = getVerificationStatus(userProfile);
  
  if (!userProfile) {
    return {
      canCreateRequests: false,
      canBid: false,
      canMessage: false,
      canManageOrders: false,
      canReceiveOrders: false,
      features: ['View public content only']
    };
  }

  const { isFullyVerified, isPending } = verification;
  
  if (userProfile.role === 'vendor') {
    return {
      canBid: isFullyVerified,
      canMessage: isFullyVerified || isPending,
      canReceiveOrders: isFullyVerified,
      features: isFullyVerified 
        ? ['Submit offers on requests', 'Direct messaging with clients', 'Receive and manage orders', 'Priority support']
        : isPending 
        ? ['Browse opportunities', 'View client profiles', 'Limited messaging']
        : ['View public content only']
    };
  }

  // Client role
  return {
    canCreateRequests: isFullyVerified,
    canMessage: isFullyVerified || isPending,
    canManageOrders: isFullyVerified,
    features: isFullyVerified 
      ? ['Create procurement requests', 'Message with vendors', 'Manage orders and projects', 'Full platform access']
      : isPending 
      ? ['Browse vendor profiles', 'View platform content', 'Limited messaging']
      : ['View public content only']
  };
};
