
import React from 'react';
import { VerificationQueue } from '@/components/admin/VerificationQueue';

const AdminVerificationQueue: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          Verification Queue
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          Review and manage vendor verification requests
        </p>
      </div>
      <VerificationQueue />
    </div>
  );
};

export default AdminVerificationQueue;
