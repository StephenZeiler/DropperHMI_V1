import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, Plus, Minus, Droplet } from "lucide-react";

interface CalibrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_CALIBRATION = {
  xAxis: 50,
  yAxis: 50,
  zAxis: 50,
};

const DROPPER_PRESET_VALUES = [1, 5, 10, 25, 50];

export default function CalibrationDialog({
  open,
  onOpenChange,
}: CalibrationDialogProps) {
  const [calibration, setCalibration] = useState(DEFAULT_CALIBRATION);
  const [dropperCount, setDropperCount] = useState(1);

  const handleIncrement = (axis: keyof typeof DEFAULT_CALIBRATION) => {
    setCalibration((prev) => ({
      ...prev,
      [axis]: Math.min(prev[axis] + 1, 100),
    }));
  };

  const handleDecrement = (axis: keyof typeof DEFAULT_CALIBRATION) => {
    setCalibration((prev) => ({
      ...prev,
      [axis]: Math.max(prev[axis] - 1, 0),
    }));
  };

  const handleSave = () => {
    console.log("Calibration saved:", calibration);
    // TODO: Save to database when Supabase is set up
    onOpenChange(false);
  };

  const handleReset = () => {
    setCalibration(DEFAULT_CALIBRATION);
  };

  const handleSample = () => {
    console.log(
      `Sending sample command to Teensy: ${dropperCount} droppers with calibration:`,
      calibration
    );
    // TODO: Send command to Teensy when backend is set up
  };

  const renderNumberControl = (
    label: string,
    axis: keyof typeof DEFAULT_CALIBRATION,
    value: number
  ) => (
    <div className="space-y-4 p-4 bg-secondary/30 rounded border border-border">
      <label className="text-base font-semibold text-foreground">
        {label}
      </label>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => handleDecrement(axis)}
          className="px-6 py-4 bg-secondary border border-border rounded font-bold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 text-lg"
          title="Decrease by 1mm"
        >
          <Minus className="w-6 h-6" />
        </button>
        <span className="text-5xl font-bold text-primary font-mono w-32 text-center">
          {value}
        </span>
        <span className="text-2xl font-semibold text-foreground">mm</span>
        <button
          onClick={() => handleIncrement(axis)}
          className="px-6 py-4 bg-secondary border border-border rounded font-bold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 text-lg"
          title="Increase by 1mm"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Machine Calibration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Pipet RAM Calibration */}
          {renderNumberControl(
            "Pipet RAM Distance Travel in Millimeter",
            "xAxis",
            calibration.xAxis
          )}

          {/* Cap RAM Calibration */}
          {renderNumberControl(
            "Cap RAM Distance Travel in Millimeter",
            "yAxis",
            calibration.yAxis
          )}

          {/* Bulb RAM Calibration */}
          {renderNumberControl(
            "Bulb RAM Distance Travel in Millimeter",
            "zAxis",
            calibration.zAxis
          )}

          {/* Sample Section */}
          <div className="space-y-4 p-4 bg-secondary/30 rounded border border-border">
            <h3 className="text-base font-semibold text-foreground">
              Test Calibration
            </h3>
            <div className="space-y-3">
              <label className="text-base font-semibold text-foreground">
                Number of Droppers
              </label>
              <select
                value={dropperCount}
                onChange={(e) => setDropperCount(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-input border border-border rounded text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {DROPPER_PRESET_VALUES.map((val) => (
                  <option key={val} value={val}>
                    {val} dropper{val !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSample}
              className="px-6 py-4 bg-yellow-500 text-black rounded font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg mx-auto"
            >
              <Droplet className="w-6 h-6" />
              Sample
            </button>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-3 flex-row pt-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-secondary border border-border rounded font-bold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 text-base"
            title="Reset to defaults"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary text-primary-foreground rounded font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-base"
          >
            <Save className="w-5 h-5" />
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
