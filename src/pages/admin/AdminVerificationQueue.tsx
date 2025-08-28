
import React from 'react';
import { VerificationQueue } from '@/components/admin/VerificationQueue';
import { AdminPageContainer } from '@/components/admin/AdminPageContainer';

const AdminVerificationQueue: React.FC = () => {
  return (
    <AdminPageContainer
      title="Verification Queue"
      description="Review and manage vendor verification requests"
    >
      <VerificationQueue />
    </AdminPageContainer>
  );
};

export default AdminVerificationQueue;
