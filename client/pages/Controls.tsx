import { useState, memo } from "react";
import AppLayout from "@/components/AppLayout";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Zap, Trash2 } from "lucide-react";

function ControlsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [emptying, setEmptying] = useState(false);

  const handleStartProduction = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePauseProduction = () => {
    setIsPaused(!isPaused);
  };

  const handleEndProduction = () => {
    setIsRunning(false);
    setIsPaused(false);
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
        <h1 className="text-lg font-bold text-foreground">
          Production Controls
        </h1>
      </header>

      {/* Main Content - Full Height with Spread Layout */}
      <div className="flex-1 overflow-hidden p-6 flex flex-col justify-between">
        {/* Status Indicator */}
        <div
          className={`hmi-card border-2 p-4 flex-shrink-0 ${
            isRunning
              ? isPaused
                ? "border-warning bg-warning/10"
                : "border-success bg-success/10"
              : "border-muted bg-muted/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full flex-shrink-0 ${
                isRunning
                  ? isPaused
                    ? "bg-warning"
                    : "bg-success animate-pulse"
                  : "bg-muted"
              }`}
            />
            <div className="min-w-0">
              <p className="font-semibold text-lg text-foreground">
                {isRunning ? (isPaused ? "Paused" : "Running") : "Stopped"}
              </p>
            </div>
          </div>
        </div>

        {/* Start/Pause/Stop Controls */}
        <div className="grid grid-cols-3 gap-6 flex-shrink-0">
          <button
            onClick={handleStartProduction}
            disabled={isRunning && !isPaused}
            className={`hmi-card px-6 py-12 rounded transition-all border-2 flex flex-col items-center justify-center ${
              isRunning && !isPaused
                ? "border-success/50 bg-success/20 opacity-60 cursor-not-allowed"
                : "border-primary/50 hover:border-primary hover:bg-primary/10"
            }`}
          >
            <Play
              className="w-12 h-12 text-primary flex-shrink-0 mb-3"
              fill="currentColor"
            />
            <h3 className="text-xl font-bold text-foreground">
              {isPaused ? "Resume" : "Start"}
            </h3>
          </button>

          <button
            onClick={handlePauseProduction}
            disabled={!isRunning}
            className={`hmi-card px-6 py-12 rounded transition-all border-2 flex flex-col items-center justify-center ${
              !isRunning
                ? "border-warning/30 bg-warning/5 opacity-60 cursor-not-allowed"
                : isPaused
                  ? "border-warning/50 bg-warning/20 hover:border-warning"
                  : "border-warning/50 hover:border-warning hover:bg-warning/10"
            }`}
          >
            <Pause
              className="w-12 h-12 text-warning flex-shrink-0 mb-3"
              fill="currentColor"
            />
            <h3 className="text-xl font-bold text-foreground">Pause</h3>
          </button>

          <button
            onClick={handleEndProduction}
            disabled={!isRunning}
            className={`hmi-card px-6 py-12 rounded transition-all border-2 flex flex-col items-center justify-center ${
              !isRunning
                ? "border-destructive/30 bg-destructive/5 opacity-60 cursor-not-allowed"
                : "border-destructive/50 hover:border-destructive hover:bg-destructive/10"
            }`}
          >
            <Square
              className="w-12 h-12 text-destructive flex-shrink-0 mb-3"
              fill="currentColor"
            />
            <h3 className="text-xl font-bold text-foreground">End</h3>
          </button>
        </div>

        {/* Speed Control */}
        <div className="hmi-card p-6 flex-shrink-0">
          <div className="flex items-center gap-4 mb-6">
            <Zap className="w-6 h-6 text-primary flex-shrink-0" />
            <h3 className="text-xl font-bold text-foreground flex-1">Speed</h3>
            <span className="text-3xl font-bold text-primary flex-shrink-0">
              {speed[0]}%
            </span>
          </div>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Empty Slots Button */}
        <button
          onClick={handleEmptySlots}
          disabled={emptying}
          className={`hmi-card px-8 py-10 rounded transition-all border-2 flex flex-col items-center justify-center ${
            emptying
              ? "border-warning bg-warning/20 opacity-75"
              : "border-warning/50 hover:border-warning hover:bg-warning/10"
          }`}
        >
          <Trash2 className="w-10 h-10 text-warning mb-3 flex-shrink-0" />
          <h3 className="text-xl font-bold text-foreground">Empty Slots</h3>
          <p className="text-sm text-warning-foreground mt-1">
            {emptying ? "Emptying..." : "Click to empty"}
          </p>
        </button>
      </div>
    </AppLayout>
  );
}

export default memo(ControlsPage);
