import { AdminRealTimeMonitor as RealTimeMonitorComponent } from '@/components/admin/AdminRealTimeMonitor';

export default function AdminRealTimeMonitor() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          Real-Time Monitor
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          Monitor system health and performance metrics in real-time
        </p>
      </div>
      <RealTimeMonitorComponent />
    </div>
  );
}