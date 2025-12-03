import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Slider } from "@/components/ui/slider";
import { Play, Square, Zap, Trash2 } from "lucide-react";

export default function Controls() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [emptying, setEmptying] = useState(false);

  const handleStartProduction = () => {
    setIsRunning(true);
  };

  const handleEndProduction = () => {
    setIsRunning(false);
  };

  const handleEmptySlots = () => {
    setEmptying(true);
    setTimeout(() => {
      setEmptying(false);
    }, 1500);
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

          {/* Empty Slots Button */}
          <button
            onClick={handleEmptySlots}
            disabled={emptying}
            className={`hmi-card w-full px-8 py-8 rounded-lg transition-all border-2 ${
              emptying
                ? "border-warning bg-warning/20 opacity-75"
                : "border-warning/50 hover:border-warning hover:bg-warning/10"
            }`}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <Trash2 className="w-12 h-12 text-warning" />
              <h3 className="text-5xl font-bold text-foreground">Empty Slots</h3>
            </div>
            <p className="text-2xl text-warning-foreground">
              {emptying ? "Emptying..." : "Click to empty assembly slots"}
            </p>
          </button>

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
                <span className="text-muted-foreground">Status:</span>
                <span className={emptying ? "text-warning" : "text-muted-foreground"}>
                  {emptying ? "Emptying..." : "Ready"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
