import { Cloud, Wifi, AlertCircle, Check } from "lucide-react";

interface SystemStatus {
  teensyConnected: boolean;
  teensyLatency?: number;
  systemUptime?: string;
  memoryUsage?: number;
}

interface StatusBarProps {
  status: SystemStatus;
}

export default function StatusBar({ status }: StatusBarProps) {
  return (
    <div className="w-full bg-secondary border-t border-border px-4 py-3 grid grid-cols-4 gap-4 text-xs">
      {/* Teensy Connection */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${status.teensyConnected ? "bg-success animate-pulse" : "bg-destructive"}`}
        />
        <span className="text-muted-foreground">Teensy:</span>
        <span className={status.teensyConnected ? "text-success" : "text-destructive"}>
          {status.teensyConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      {/* Latency */}
      {status.teensyLatency !== undefined && (
        <div className="flex items-center gap-2">
          <Wifi className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">Latency:</span>
          <span className="text-foreground">{status.teensyLatency}ms</span>
        </div>
      )}

      {/* Uptime */}
      {status.systemUptime !== undefined && (
        <div className="flex items-center gap-2">
          <Cloud className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">Uptime:</span>
          <span className="text-foreground">{status.systemUptime}</span>
        </div>
      )}

      {/* Memory Usage */}
      {status.memoryUsage !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Memory:</span>
          <div className="w-12 h-1.5 bg-secondary border border-border rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                status.memoryUsage > 80
                  ? "bg-destructive"
                  : status.memoryUsage > 50
                    ? "bg-warning"
                    : "bg-success"
              }`}
              style={{ width: `${status.memoryUsage}%` }}
            />
          </div>
          <span className="text-foreground w-8 text-right">
            {Math.round(status.memoryUsage)}%
          </span>
        </div>
      )}
    </div>
  );
}
