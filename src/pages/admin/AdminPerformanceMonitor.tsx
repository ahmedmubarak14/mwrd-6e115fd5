import { PerformanceMonitor } from '@/components/admin/PerformanceMonitor';

export default function AdminPerformanceMonitor() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          Performance Monitor
        </h1>
        <p className="text-foreground opacity-75 text-sm sm:text-base max-w-2xl">
          Real-time performance metrics and optimization insights for your application
        </p>
      </div>
      <PerformanceMonitor />
    </div>
  );
}