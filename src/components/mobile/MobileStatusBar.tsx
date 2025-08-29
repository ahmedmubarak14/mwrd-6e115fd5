import { useEffect, useState } from "react";
import { useCapacitor } from "@/hooks/useCapacitor";
import { cn } from "@/lib/utils";

export const MobileStatusBar = () => {
  const { isNative, networkStatus } = useCapacitor();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isNative) return null;

  return (
    <div className={cn(
      "h-6 bg-background border-b flex items-center justify-between px-2 text-xs font-medium",
      "status-bar safe-area-padding-top"
    )}>
      {/* Left - Time */}
      <div className="flex items-center">
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      {/* Right - Status Icons */}
      <div className="flex items-center gap-1">
        {/* Network Status */}
        <div className={cn(
          "w-2 h-2 rounded-full",
          networkStatus?.connected ? "bg-green-500" : "bg-red-500"
        )} />
        
        {/* Battery (placeholder) */}
        <div className="flex items-center">
          <div className="w-5 h-2 border border-foreground/50 rounded-sm relative">
            <div className="w-4/5 h-full bg-green-500 rounded-sm" />
          </div>
          <div className="w-1 h-1 bg-foreground/50 rounded-r ml-px" />
        </div>
      </div>
    </div>
  );
};