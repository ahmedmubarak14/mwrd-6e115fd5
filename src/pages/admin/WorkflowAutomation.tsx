import React from 'react';
import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { WorkflowAutomation as WorkflowAutomationComponent } from '@/components/admin/WorkflowAutomation';
import { useOptionalLanguage } from '@/contexts/useOptionalLanguage';

export default function WorkflowAutomation() {
  const { t } = useOptionalLanguage();
  return (
    <AdminPageContainer
      title={t('admin.workflowAutomation.title')}
      description={t('admin.workflowAutomation.description')}
    >
      <WorkflowAutomationComponent />
    </AdminPageContainer>
  );
}