
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CategoryManagement } from '@/components/admin/CategoryManagement';

const AdminCategoryManagement: React.FC = () => {
  return (
    <AdminLayout>
      <CategoryManagement />
    </AdminLayout>
  );
};

export default AdminCategoryManagement;
