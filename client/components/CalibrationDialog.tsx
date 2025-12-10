import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
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

  const handleSliderChange = (
    axis: keyof typeof DEFAULT_CALIBRATION,
    value: number[]
  ) => {
    setCalibration((prev) => ({
      ...prev,
      [axis]: value[0],
    }));
  };

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

  const renderSliderControl = (
    label: string,
    axis: keyof typeof DEFAULT_CALIBRATION,
    value: number
  ) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-foreground">
          {label}
        </label>
        <span className="text-lg font-mono text-primary font-bold">
          {value} mm
        </span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[value]}
        onValueChange={(v) => handleSliderChange(axis, v)}
        className="w-full"
      />
      <div className="flex gap-2">
        <button
          onClick={() => handleDecrement(axis)}
          className="flex-1 px-3 py-2 bg-secondary border border-border rounded font-semibold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
          title="Decrease by 1mm"
        >
          <Minus className="w-4 h-4" />
          <span className="text-xs">-1mm</span>
        </button>
        <button
          onClick={() => handleIncrement(axis)}
          className="flex-1 px-3 py-2 bg-secondary border border-border rounded font-semibold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
          title="Increase by 1mm"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs">+1mm</span>
        </button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Machine Calibration</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Pipet RAM Calibration */}
          {renderSliderControl(
            "Pipet RAM Distance Travel in Millimeter",
            "xAxis",
            calibration.xAxis
          )}

          {/* Cap RAM Calibration */}
          {renderSliderControl(
            "Cap RAM Distance Travel in Millimeter",
            "yAxis",
            calibration.yAxis
          )}

          {/* Bulb RAM Calibration */}
          {renderSliderControl(
            "Bulb RAM Distance Travel in Millimeter",
            "zAxis",
            calibration.zAxis
          )}

          {/* Sample Section */}
          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-foreground">
              Test Calibration
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Number of Droppers
              </label>
              <select
                value={dropperCount}
                onChange={(e) => setDropperCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full px-4 py-3 bg-success text-white rounded font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Droplet className="w-4 h-4" />
              Sample
            </button>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 flex-row">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-secondary border border-border rounded font-semibold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
            title="Reset to defaults"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
