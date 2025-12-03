import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  AlertTriangle,
  AlertCircle,
  Droplet,
  Wind,
  Pipette,
  Zap,
  X,
} from "lucide-react";

export interface ErrorItem {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  dismissible?: boolean;
}

const ERROR_ICONS: Record<string, any> = {
  "missing-bulb": Droplet,
  "low-air": Wind,
  "broken-pipet": Pipette,
  "power-issue": Zap,
  "sensor-error": AlertCircle,
  "calibration-failed": AlertTriangle,
};

const DEMO_ERRORS: ErrorItem[] = [
  {
    id: "1",
    type: "critical",
    title: "Missing Bulb",
    message: "No bulb detected in slot 3. Assembly cannot continue.",
    timestamp: new Date(Date.now() - 2 * 60000).toLocaleTimeString(),
    dismissible: true,
  },
  {
    id: "2",
    type: "critical",
    title: "Low Air Pressure",
    message: "Air pressure dropped below 50 PSI. Check compressor.",
    timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
    dismissible: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Broken Pipet",
    message: "Pipet in assembly line shows signs of damage. Recommend replacement.",
    timestamp: new Date(Date.now() - 10 * 60000).toLocaleTimeString(),
    dismissible: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Sensor Calibration Needed",
    message: "Sensor drift detected. Run calibration routine soon.",
    timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString(),
    dismissible: false,
  },
  {
    id: "5",
    type: "info",
    title: "Component Nearing End of Life",
    message: "Cap supply at 20% capacity. Plan for replacement.",
    timestamp: new Date(Date.now() - 30 * 60000).toLocaleTimeString(),
    dismissible: true,
  },
];

export default function Errors() {
  const [errors, setErrors] = useState<ErrorItem[]>(DEMO_ERRORS);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">(
    "all"
  );

  const filteredErrors = errors.filter((error) =>
    filter === "all" ? true : error.type === filter
  );

  const criticalCount = errors.filter((e) => e.type === "critical").length;
  const warningCount = errors.filter((e) => e.type === "warning").length;
  const infoCount = errors.filter((e) => e.type === "info").length;

  const handleDismissError = (id: string) => {
    setErrors(errors.filter((error) => error.id !== id));
  };

  const handleClearAll = () => {
    setErrors([]);
  };

  const getErrorColor = (type: ErrorItem["type"]) => {
    switch (type) {
      case "critical":
        return "border-destructive/50 bg-destructive/10";
      case "warning":
        return "border-warning/50 bg-warning/10";
      default:
        return "border-primary/50 bg-primary/10";
    }
  };

  const getErrorIcon = (type: ErrorItem["type"]) => {
    switch (type) {
      case "critical":
        return AlertTriangle;
      case "warning":
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const getErrorTextColor = (type: ErrorItem["type"]) => {
    switch (type) {
      case "critical":
        return "text-destructive";
      case "warning":
        return "text-warning";
      default:
        return "text-primary";
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-secondary border-b border-border px-6 py-4 flex-shrink-0">
        <h1 className="text-lg font-bold text-foreground">System Errors</h1>
        <p className="text-xs text-muted-foreground">
          Monitor and manage system alerts
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          {/* Error Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="hmi-card border-destructive/50 bg-destructive/10">
              <p className="text-xs text-muted-foreground mb-1">Critical</p>
              <p className="text-3xl font-bold text-destructive">
                {criticalCount}
              </p>
            </div>
            <div className="hmi-card border-warning/50 bg-warning/10">
              <p className="text-xs text-muted-foreground mb-1">Warnings</p>
              <p className="text-3xl font-bold text-warning">{warningCount}</p>
            </div>
            <div className="hmi-card border-primary/50 bg-primary/10">
              <p className="text-xs text-muted-foreground mb-1">Info</p>
              <p className="text-3xl font-bold text-primary">{infoCount}</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            {(["all", "critical", "warning", "info"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary border border-border hover:bg-secondary/80"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Errors List */}
          {filteredErrors.length === 0 ? (
            <div className="hmi-card text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-foreground font-semibold mb-1">No Errors</p>
              <p className="text-xs text-muted-foreground">
                {errors.length === 0
                  ? "All systems operational"
                  : "No errors match the selected filter"}
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {filteredErrors.map((error) => {
                const IconComponent = getErrorIcon(error.type);
                return (
                  <div
                    key={error.id}
                    className={`hmi-card border-2 ${getErrorColor(error.type)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 mt-0.5 ${getErrorTextColor(error.type)}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3
                              className={`font-semibold mb-1 ${getErrorTextColor(error.type)}`}
                            >
                              {error.title}
                            </h3>
                            <p className="text-sm text-foreground mb-2">
                              {error.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {error.timestamp}
                            </p>
                          </div>
                          {error.dismissible && (
                            <button
                              onClick={() => handleDismissError(error.id)}
                              className="flex-shrink-0 p-1 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-foreground"
                              title="Dismiss"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Clear All Button */}
          {errors.length > 0 && (
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-secondary border border-border rounded font-medium hover:bg-secondary/80 transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
