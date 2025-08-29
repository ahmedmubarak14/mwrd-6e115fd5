import { AdminAutomationCenter as AutomationCenterComponent } from '@/components/admin/AdminAutomationCenter';

export default function AdminAutomationCenter() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          Automation Center
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          Manage automated workflows and business processes
        </p>
      </div>
      <AutomationCenterComponent />
    </div>
  );
}