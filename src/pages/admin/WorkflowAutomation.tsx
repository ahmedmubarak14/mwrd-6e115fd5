import React from 'react';
import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { WorkflowAutomation as WorkflowAutomationComponent } from '@/components/admin/WorkflowAutomation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WorkflowAutomation() {
  const { t } = useLanguage();
  return (
    <AdminPageContainer
      title={t('admin.workflowAutomation.title')}
      description={t('admin.workflowAutomation.description')}
    >
      <WorkflowAutomationComponent />
    </AdminPageContainer>
  );
}