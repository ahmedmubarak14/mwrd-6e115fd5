import React from 'react';
import { AdminPageContainer } from '@/components/admin/AdminPageContainer';
import { WorkflowAutomation as WorkflowAutomationComponent } from '@/components/admin/WorkflowAutomation';

export default function WorkflowAutomation() {
  return (
    <AdminPageContainer
      title="Workflow Automation"
      description="Manage automated business processes and intelligent workflows"
    >
      <WorkflowAutomationComponent />
    </AdminPageContainer>
  );
}