import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save } from "lucide-react";

interface CalibrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_CALIBRATION = {
  xAxis: 50,
  yAxis: 50,
  zAxis: 50,
};

export default function CalibrationDialog({
  open,
  onOpenChange,
}: CalibrationDialogProps) {
  const [calibration, setCalibration] = useState(DEFAULT_CALIBRATION);

  const handleSliderChange = (
    axis: keyof typeof DEFAULT_CALIBRATION,
    value: number[]
  ) => {
    setCalibration((prev) => ({
      ...prev,
      [axis]: value[0],
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Machine Calibration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* X-Axis Calibration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground">
                X-Axis Travel
              </label>
              <span className="text-sm font-mono text-primary">
                {calibration.xAxis} mm
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[calibration.xAxis]}
              onValueChange={(value) => handleSliderChange("xAxis", value)}
              className="w-full"
            />
          </div>

          {/* Y-Axis Calibration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground">
                Y-Axis Travel
              </label>
              <span className="text-sm font-mono text-primary">
                {calibration.yAxis} mm
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[calibration.yAxis]}
              onValueChange={(value) => handleSliderChange("yAxis", value)}
              className="w-full"
            />
          </div>

          {/* Z-Axis Calibration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-foreground">
                Z-Axis Travel
              </label>
              <span className="text-sm font-mono text-primary">
                {calibration.zAxis} mm
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[calibration.zAxis]}
              onValueChange={(value) => handleSliderChange("zAxis", value)}
              className="w-full"
            />
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
