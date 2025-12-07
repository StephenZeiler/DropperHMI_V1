import { memo, useEffect, useRef, useCallback } from "react";
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

const LogEntry = memo(({ log, index }: { log: LogEntry; index: number }) => (
  <div
    className={`px-3 py-1 border-b border-border/50 hover:bg-secondary/40 ${
      index % 2 === 0 ? "bg-card" : "bg-card/70"
    }`}
  >
    <div className="flex items-start gap-1.5 text-xs font-mono">
      <span className="text-muted-foreground flex-shrink-0 w-16">
        {log.timestamp}
      </span>
      <div className="flex-shrink-0 mt-0.5">{getLogIcon(log.level)}</div>
      <span className={`flex-shrink-0 w-11 ${getLogColor(log.level)}`}>
        [{log.level.toUpperCase().slice(0, 3)}]
      </span>
      <span className="text-foreground break-words line-clamp-1">
        {log.message}
      </span>
    </div>
  </div>
));

LogEntry.displayName = "LogEntry";

function LogsPanelContent({
  logs,
  isConnected,
}: Omit<LogsPanelProps, "autoScroll">) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const scrollToLatest = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg shadow-lg">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-secondary/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-success animate-pulse" : "bg-destructive"}`}
          />
          <h3 className="font-semibold text-xs text-foreground">Teensy Logs</h3>
        </div>
        <span className="text-xs text-muted-foreground">{logs.length}</span>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-4 text-muted-foreground text-center h-full flex items-center justify-center text-xs">
            <div>
              <Info className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p>{isConnected ? "Waiting for logs..." : "Not connected"}</p>
            </div>
          </div>
        ) : (
          logs.map((log, index) => (
            <LogEntry key={log.id} log={log} index={index} />
          ))
        )}
      </div>

      <div className="px-3 py-1 border-t border-border text-xs text-muted-foreground bg-secondary/20 flex-shrink-0">
        <button
          onClick={scrollToLatest}
          className="text-primary hover:underline"
        >
          ↓ Latest
        </button>
      </div>
    </div>
  );
}

const LogsPanelMemo = memo(LogsPanelContent);

export default function LogsPanel(props: LogsPanelProps) {
  return <LogsPanelMemo logs={props.logs} isConnected={props.isConnected} />;
}
