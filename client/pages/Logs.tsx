import { useEffect, useState } from "react";
import LogsPanel, { LogEntry } from "@/components/LogsPanel";
import AppLayout from "@/components/AppLayout";
import { RotateCcw, Trash2, Settings } from "lucide-react";

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    teensyConnected: false,
    teensyLatency: 0,
    systemUptime: "0d 00:00:00",
    memoryUsage: 45,
  });

  useEffect(() => {
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
      setSystemStatus((prev) => ({ ...prev, teensyConnected: true }));
    }, 1000);

    const initialLogs: LogEntry[] = [
      {
        id: "1",
        timestamp: new Date().toLocaleTimeString(),
        level: "info",
        message: "System initialized",
      },
      {
        id: "2",
        timestamp: new Date().toLocaleTimeString(),
        level: "info",
        message: "Teensy communication interface ready",
      },
      {
        id: "3",
        timestamp: new Date().toLocaleTimeString(),
        level: "success",
        message: "Serial connection established",
      },
    ];

    setLogs(initialLogs);

    const logInterval = setInterval(() => {
      const logLevels: Array<LogEntry["level"]> = [
        "info",
        "warning",
        "success",
      ];
      const messages = [
        "ADC reading: 2047",
        "Sensor calibration complete",
        "Temperature: 28.5°C",
        "Humidity: 45.2%",
        "Data packet transmitted",
        "Memory available: 45KB",
        "Interrupt handler executed",
        "PWM signal updated",
        "UART buffer cleared",
        "System status nominal",
      ];

      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level: logLevels[Math.floor(Math.random() * logLevels.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLogs((prev) => [...prev.slice(-99), newLog]);
    }, 2000);

    const latencyInterval = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        teensyLatency: Math.floor(Math.random() * 50) + 5,
      }));
    }, 1000);

    let seconds = 0;
    const uptimeInterval = setInterval(() => {
      seconds++;
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      setSystemStatus((prev) => ({
        ...prev,
        systemUptime: `${days}d ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
      }));
    }, 1000);

    const memoryInterval = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 5)),
      }));
    }, 3000);

    return () => {
      clearTimeout(connectionTimer);
      clearInterval(logInterval);
      clearInterval(latencyInterval);
      clearInterval(uptimeInterval);
      clearInterval(memoryInterval);
    };
  }, []);

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleReconnect = () => {
    setIsConnected(false);
    setLogs([]);
    setTimeout(() => {
      setIsConnected(true);
      setLogs([
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          level: "success",
          message: "Reconnected to Teensy",
        },
      ]);
    }, 1000);
  };

  return (
    <AppLayout systemStatus={systemStatus}>
      {/* Header */}
      <header className="bg-secondary border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-foreground">Teensy Logs</h1>
          <p className="text-xs text-muted-foreground">Real-time log stream</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReconnect}
            className="p-2 hover:bg-border rounded transition-colors text-muted-foreground hover:text-foreground"
            title="Reconnect to Teensy"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleClearLogs}
            className="px-3 py-2 bg-destructive/20 hover:bg-destructive/30 border border-destructive/50 rounded text-sm font-medium text-destructive transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Logs
          </button>
          <button
            className="p-2 hover:bg-border rounded transition-colors text-muted-foreground hover:text-foreground"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-hidden">
        <LogsPanel logs={logs} isConnected={isConnected} autoScroll={true} />
      </div>
    </AppLayout>
  );
}
