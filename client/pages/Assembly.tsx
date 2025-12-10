import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import CalibrationDialog from "@/components/CalibrationDialog";
import { Save, RotateCcw, Zap, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface AssemblyConfig {
  pipet: string;
  cap: string;
  bulb: string;
}

const ASSEMBLY_OPTIONS = {
  pipets: [
    { id: "p-20", label: "20mm Pipet", description: "Standard 20mm pipette" },
    { id: "p-30", label: "30mm Pipet", description: "Standard 30mm pipette" },
    { id: "p-50", label: "50mm Pipet", description: "Large 50mm pipette" },
  ],
  caps: [
    { id: "c-std", label: "Standard Cap", description: "Regular cap" },
    {
      id: "c-child",
      label: "Child Proof Cap",
      description: "Safety cap for child protection",
    },
    {
      id: "c-tamper",
      label: "Tamper Evident Cap",
      description: "Shows if product was opened",
    },
  ],
  bulbs: [
    { id: "b-rubber", label: "Rubber Bulb", description: "Natural rubber" },
    {
      id: "b-silicone",
      label: "Silicone Bulb",
      description: "Medical grade silicone",
    },
    {
      id: "b-plastic",
      label: "Plastic Bulb",
      description: "Durable plastic option",
    },
  ],
};

export default function Assembly() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialConfig: AssemblyConfig = {
    pipet: ASSEMBLY_OPTIONS.pipets[0].id,
    cap: ASSEMBLY_OPTIONS.caps[0].id,
    bulb: ASSEMBLY_OPTIONS.bulbs[0].id,
  };

  const [config, setConfig] = useState<AssemblyConfig>(initialConfig);
  const [savedConfig, setSavedConfig] = useState<AssemblyConfig>(initialConfig);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [calibrationDialogOpen, setCalibrationDialogOpen] = useState(false);
  const [unsavedChangesDialogOpen, setUnsavedChangesDialogOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const hasChangesRef = useRef(false);

  const handleConfigChange = (
    component: keyof AssemblyConfig,
    value: string
  ) => {
    setConfig((prev) => ({ ...prev, [component]: value }));
  };

  // Track unsaved changes
  useEffect(() => {
    const configChanged =
      config.pipet !== savedConfig.pipet ||
      config.cap !== savedConfig.cap ||
      config.bulb !== savedConfig.bulb;

    hasChangesRef.current = configChanged;

    // Add beforeunload listener for browser close/refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (configChanged) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [config, savedConfig]);

  // Intercept navigation when user tries to leave
  useEffect(() => {
    const handleNavigationAttempt = () => {
      if (hasChangesRef.current && !unsavedChangesDialogOpen) {
        setUnsavedChangesDialogOpen(true);
        return false;
      }
      return true;
    };

    // Store the handler globally so sidebar links can check it
    (window as any).__assemblyUnsavedChanges = handleNavigationAttempt;
  }, [unsavedChangesDialogOpen]);

  const handleSave = () => {
    setSavedConfig(config);
    setLastSaved(new Date().toLocaleTimeString());
    console.log("Assembly configuration saved:", config);
  };

  const handleReset = () => {
    setConfig(initialConfig);
  };

  const handleConfirmLeaveWithoutSaving = () => {
    setUnsavedChangesDialogOpen(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  const handleSaveAndLeave = () => {
    handleSave();
    setUnsavedChangesDialogOpen(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  const getOptionLabel = (
    type: "pipets" | "caps" | "bulbs",
    id: string
  ): string => {
    const option = ASSEMBLY_OPTIONS[type].find((opt) => opt.id === id);
    return option?.label || "Unknown";
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-secondary border-b border-border px-6 py-4 flex-shrink-0">
        <h1 className="text-lg font-bold text-foreground">Assembly Configuration</h1>
        <p className="text-xs text-muted-foreground">
          Select components for dropper assembly
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl">
          {/* Configuration Layout - Two Columns */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Left Column - Selection Cards */}
            <div className="col-span-2 space-y-6">
              {/* Pipets Section */}
              <div className="hmi-card">
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Pipet Selection
                </h2>
                <select
                  value={config.pipet}
                  onChange={(e) => handleConfigChange("pipet", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {ASSEMBLY_OPTIONS.pipets.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                  {ASSEMBLY_OPTIONS.pipets.find((p) => p.id === config.pipet)
                    ?.description}
                </p>
              </div>

              {/* Caps Section */}
              <div className="hmi-card">
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Cap Selection
                </h2>
                <select
                  value={config.cap}
                  onChange={(e) => handleConfigChange("cap", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {ASSEMBLY_OPTIONS.caps.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                  {ASSEMBLY_OPTIONS.caps.find((c) => c.id === config.cap)
                    ?.description}
                </p>
              </div>

              {/* Bulbs Section */}
              <div className="hmi-card">
                <h2 className="text-sm font-semibold text-foreground mb-3">
                  Bulb Selection
                </h2>
                <select
                  value={config.bulb}
                  onChange={(e) => handleConfigChange("bulb", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {ASSEMBLY_OPTIONS.bulbs.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                  {ASSEMBLY_OPTIONS.bulbs.find((b) => b.id === config.bulb)
                    ?.description}
                </p>
              </div>
            </div>

            {/* Right Column - Current Configuration & Calibration */}
            <div className="col-span-1 space-y-4">
              {/* Current Configuration Summary */}
              <div className="hmi-card bg-secondary/50 border-primary/50">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Current Configuration
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pipet:</span>
                    <span className="text-primary">
                      {getOptionLabel("pipets", config.pipet)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cap:</span>
                    <span className="text-primary">
                      {getOptionLabel("caps", config.cap)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bulb:</span>
                    <span className="text-primary">
                      {getOptionLabel("bulbs", config.bulb)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Calibration Button */}
              <button
                onClick={() => setCalibrationDialogOpen(true)}
                className="w-full px-4 py-3 bg-secondary border border-border rounded font-semibold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                title="Calibrate machine"
              >
                <Zap className="w-4 h-4" />
                Calibration
              </button>

              {/* Last Saved Info */}
              {lastSaved && (
                <div className="hmi-card bg-success/20 border-success/50">
                  <p className="text-sm text-success">
                    ✓ Configuration saved at {lastSaved}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-secondary border border-border rounded font-semibold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
              title="Reset to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <CalibrationDialog
        open={calibrationDialogOpen}
        onOpenChange={setCalibrationDialogOpen}
      />

      {/* Unsaved Changes Dialog */}
      <Dialog open={unsavedChangesDialogOpen} onOpenChange={setUnsavedChangesDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <DialogTitle>Unsaved Changes</DialogTitle>
            </div>
            <DialogDescription className="mt-2">
              You have made changes to the assembly configuration that haven't been saved.
              Would you like to save them before leaving?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 flex-row">
            <button
              onClick={handleConfirmLeaveWithoutSaving}
              className="px-4 py-2 bg-secondary border border-border rounded font-semibold hover:bg-secondary/80 transition-colors"
            >
              Don't Save
            </button>
            <button
              onClick={handleSaveAndLeave}
              className="px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 transition-opacity"
            >
              Save and Leave
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
