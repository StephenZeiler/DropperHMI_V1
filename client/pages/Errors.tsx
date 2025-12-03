import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { AlertCircle, X } from "lucide-react";

export interface ErrorItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  dismissible?: boolean;
}

const DEMO_ERRORS: ErrorItem[] = [
  {
    id: "1",
    title: "Missing Bulb",
    message: "No bulb detected in slot 3. Assembly cannot continue.",
    timestamp: new Date(Date.now() - 2 * 60000).toLocaleTimeString(),
    dismissible: true,
  },
  {
    id: "2",
    title: "Low Air Pressure",
    message: "Air pressure dropped below 50 PSI. Check compressor.",
    timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
    dismissible: false,
  },
  {
    id: "3",
    title: "Broken Pipet",
    message: "Pipet in assembly line shows signs of damage. Recommend replacement.",
    timestamp: new Date(Date.now() - 10 * 60000).toLocaleTimeString(),
    dismissible: true,
  },
  {
    id: "4",
    title: "Low Pipet Supply",
    message: "Low pipet supply - slowing down machine",
    timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString(),
    dismissible: true,
  },
];

export default function Errors() {
  const [errors, setErrors] = useState<ErrorItem[]>(DEMO_ERRORS);

  const handleDismissError = (id: string) => {
    setErrors(errors.filter((error) => error.id !== id));
  };

  const handleClearAll = () => {
    setErrors([]);
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
          {/* Error Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {errors.length} {errors.length === 1 ? "error" : "errors"} found
            </p>
          </div>

          {/* Errors List */}
          {errors.length === 0 ? (
            <div className="hmi-card text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-foreground font-semibold mb-1">No Errors</p>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className="hmi-card border-2 border-warning/50 bg-warning/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5 text-warning">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold mb-1 text-warning">
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
              ))}
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
