import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Slider } from "@/components/ui/slider";
import { Play, Square, Zap, AlertCircle } from "lucide-react";

export default function Controls() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [emptySlots, setEmptySlots] = useState(0);

  const handleStartProduction = () => {
    setIsRunning(true);
  };

  const handleEndProduction = () => {
    setIsRunning(false);
  };

  const handleEmptySlots = () => {
    setEmptySlots((prev) => prev + 1);
  };

  const handleResetSlots = () => {
    setEmptySlots(0);
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-secondary border-b border-border px-6 py-4 flex-shrink-0">
        <h1 className="text-lg font-bold text-foreground">Production Controls</h1>
        <p className="text-xs text-muted-foreground">
          Manage dropper assembly production
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl space-y-6">
          {/* Status Indicator */}
          <div
            className={`hmi-card border-2 ${
              isRunning ? "border-success bg-success/10" : "border-muted bg-muted/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  isRunning ? "bg-success animate-pulse" : "bg-muted"
                }`}
              />
              <div>
                <p className="font-semibold text-foreground">
                  {isRunning ? "Production Running" : "Production Stopped"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isRunning
                    ? "Assembly line is actively running"
                    : "Ready to start production"}
                </p>
              </div>
            </div>
          </div>

          {/* Start/Stop Controls */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleStartProduction}
              disabled={isRunning}
              className={`hmi-card px-6 py-4 rounded-lg transition-all border-2 ${
                isRunning
                  ? "border-success/50 bg-success/20 opacity-60 cursor-not-allowed"
                  : "border-primary/50 hover:border-primary hover:bg-primary/10"
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Play className="w-6 h-6 text-primary" fill="currentColor" />
                <h3 className="text-lg font-bold text-foreground">Start</h3>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Begin production run
              </p>
            </button>

            <button
              onClick={handleEndProduction}
              disabled={!isRunning}
              className={`hmi-card px-6 py-4 rounded-lg transition-all border-2 ${
                !isRunning
                  ? "border-destructive/30 bg-destructive/5 opacity-60 cursor-not-allowed"
                  : "border-destructive/50 hover:border-destructive hover:bg-destructive/10"
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Square className="w-6 h-6 text-destructive" fill="currentColor" />
                <h3 className="text-lg font-bold text-foreground">End</h3>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Stop production
              </p>
            </button>
          </div>

          {/* Speed Control */}
          <div className="hmi-card">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Speed</h3>
              <span className="ml-auto text-xl font-bold text-primary">
                {speed[0]}%
              </span>
            </div>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              max={100}
              step={1}
              className="w-full"
              disabled={!isRunning}
            />
            <p className="text-xs text-muted-foreground mt-3">
              {speed[0] < 33 && "Slow speed - Precision mode"}
              {speed[0] >= 33 && speed[0] < 66 && "Medium speed - Balanced"}
              {speed[0] >= 66 && "High speed - Maximum throughput"}
            </p>
          </div>

          {/* Empty Slots Counter */}
          <div className="hmi-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                <h3 className="text-lg font-bold text-foreground">Empty Slots</h3>
              </div>
              <span className="text-3xl font-bold text-warning">{emptySlots}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Number of empty assembly slots detected
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleEmptySlots}
                className="flex-1 px-4 py-2 bg-warning text-warning-foreground rounded font-semibold hover:opacity-90 transition-opacity"
              >
                Mark Empty Slot
              </button>
              <button
                onClick={handleResetSlots}
                disabled={emptySlots === 0}
                className="px-4 py-2 bg-secondary border border-border rounded font-semibold hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Production Summary */}
          <div className="hmi-card bg-secondary/50">
            <h3 className="text-lg font-bold text-foreground mb-3">
              Production Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={isRunning ? "text-success" : "text-muted-foreground"}>
                  {isRunning ? "Running" : "Stopped"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Speed:</span>
                <span className="text-primary">{speed[0]}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Empty Slots:</span>
                <span className="text-warning">{emptySlots}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
