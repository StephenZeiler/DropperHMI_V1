import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Info, AlertTriangle } from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
}

interface LogsPanelProps {
  logs: LogEntry[];
  isConnected: boolean;
  autoScroll?: boolean;
}

const getLogIcon = (level: LogEntry["level"]) => {
  switch (level) {
    case "error":
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    case "success":
      return <Check className="w-4 h-4 text-success" />;
    default:
      return <Info className="w-4 h-4 text-primary" />;
  }
};

const getLogColor = (level: LogEntry["level"]) => {
  switch (level) {
    case "error":
      return "text-destructive";
    case "warning":
      return "text-warning";
    case "success":
      return "text-success";
    default:
      return "text-primary";
  }
};

export default function LogsPanel({
  logs,
  isConnected,
  autoScroll = true,
}: LogsPanelProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (autoScroll && !isScrolling) {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll, isScrolling]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 50;
    setIsScrolling(!isAtBottom);
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/30">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-success animate-pulse" : "bg-destructive"}`}
          />
          <h3 className="font-semibold text-sm text-foreground">
            Teensy Logs
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {logs.length} entries
        </span>
      </div>

      {/* Logs Container */}
      <div
        className="flex-1 overflow-y-auto text-sm font-mono"
        onScroll={handleScroll}
      >
        {logs.length === 0 ? (
          <div className="p-4 text-muted-foreground text-center h-full flex items-center justify-center">
            <div>
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>
                {isConnected
                  ? "Waiting for logs from Teensy..."
                  : "Not connected to Teensy"}
              </p>
            </div>
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={log.id}
              className={`px-4 py-2 border-b border-border/50 hover:bg-secondary/40 transition-colors ${
                index % 2 === 0 ? "bg-card" : "bg-card/70"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground flex-shrink-0 w-20">
                  {log.timestamp}
                </span>
                <div className="flex-shrink-0 mt-0.5">
                  {getLogIcon(log.level)}
                </div>
                <span className={`flex-shrink-0 w-12 ${getLogColor(log.level)}`}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="text-foreground break-words">{log.message}</span>
              </div>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground bg-secondary/20">
        {isScrolling && logs.length > 0 && (
          <button
            onClick={() => {
              logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
              setIsScrolling(false);
            }}
            className="text-primary hover:underline"
          >
            ↓ Scroll to latest
          </button>
        )}
        {logs.length === 0 && "Initializing..."}
      </div>
    </div>
  );
}
