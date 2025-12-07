import { useState, useEffect, memo } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Wifi,
  WifiOff,
  WifiIcon,
  Loader,
  Lock,
  RefreshCw,
} from "lucide-react";

interface Network {
  ssid: string;
  strength: number;
  secured: boolean;
}

function WiFiPage() {
  const [connectedNetwork, setConnectedNetwork] = useState<Network | null>(null);
  const [availableNetworks, setAvailableNetworks] = useState<Network[]>([]);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadNetworks();
  }, []);

  const loadNetworks = async () => {
    setLoading(true);
    setError("");
    try {
      const [currentRes, networksRes] = await Promise.all([
        fetch("/api/wifi/current").catch(() => ({ ok: false, json: async () => ({}) })),
        fetch("/api/wifi/networks").catch(() => ({ ok: false, json: async () => ({ networks: [] }) })),
      ]);

      if (currentRes.ok) {
        const current = await currentRes.json();
        if (current.ssid) {
          setConnectedNetwork({
            ssid: current.ssid,
            strength: current.strength || 75,
            secured: true,
          });
        }
      }

      if (networksRes.ok) {
        const data = await networksRes.json();
        setAvailableNetworks(data.networks || []);
      }
    } catch (err) {
      console.error("Failed to load networks:", err);
      setError("Failed to load networks");
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    setScanning(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await loadNetworks();
    } catch (err) {
      setError("Scan failed");
    } finally {
      setScanning(false);
    }
  };

  const handleConnectClick = (network: Network) => {
    setSelectedNetwork(network);
    if (network.secured) {
      setShowPasswordInput(true);
    } else {
      handleConnect(network, "");
    }
  };

  const handleConnect = async (network: Network, pwd: string) => {
    setConnecting(true);
    setError("");
    try {
      const response = await fetch("/api/wifi/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssid: network.ssid, password: pwd || undefined }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Connection failed");
      }

      setConnectedNetwork(network);
      setShowPasswordInput(false);
      setPassword("");
      setSelectedNetwork(null);

      await new Promise((resolve) => setTimeout(resolve, 500));
      await loadNetworks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setConnecting(false);
    }
  };

  const getSignalIcon = (strength: number) => {
    if (strength >= 70) return <Wifi className="w-4 h-4 text-success" />;
    if (strength >= 40) return <WifiIcon className="w-4 h-4 text-warning" />;
    return <WifiOff className="w-4 h-4 text-destructive" />;
  };

  const getSignalBar = (strength: number) => {
    return (
      <div className="flex gap-0.5 items-end h-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-0.5 rounded-sm transition-all ${
              strength >= (i + 1) * 25 ? "bg-primary h-full" : "bg-border h-0.5"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-secondary border-b border-border px-3 py-2 flex-shrink-0">
        <h1 className="text-base font-bold text-foreground">WiFi Network</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="max-w-2xl space-y-2">
          {/* Error Message */}
          {error && (
            <div className="hmi-card border-destructive/50 bg-destructive/10 p-2">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {/* Connected Network */}
          {connectedNetwork && (
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-1">
                Connected
              </h3>
              <div className="hmi-card border-success/50 bg-success/10 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Wifi className="w-4 h-4 text-success flex-shrink-0 animate-pulse" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {connectedNetwork.ssid}
                      </p>
                      <p className="text-xs text-success">Connected</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {getSignalBar(connectedNetwork.strength)}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {connectedNetwork.strength}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Networks */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-semibold text-foreground">Available</h3>
              <button
                onClick={handleScan}
                disabled={scanning || loading}
                className="px-2 py-1 bg-secondary border border-border rounded text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {scanning || loading ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                {scanning ? "Scanning..." : "Refresh"}
              </button>
            </div>

            {loading ? (
              <div className="hmi-card p-3 text-center">
                <Loader className="w-4 h-4 animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Loading networks...</p>
              </div>
            ) : availableNetworks.length === 0 ? (
              <div className="hmi-card p-3 text-center">
                <WifiOff className="w-5 h-5 mx-auto mb-1 text-muted-foreground opacity-50" />
                <p className="text-xs text-muted-foreground">No networks found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {availableNetworks.map((network) => (
                  <div
                    key={network.ssid}
                    className="hmi-card p-2 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getSignalIcon(network.strength)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-sm text-foreground truncate">
                              {network.ssid}
                            </p>
                            {network.secured && (
                              <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {getSignalBar(network.strength)}
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {network.strength}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleConnectClick(network)}
                        disabled={
                          connecting || connectedNetwork?.ssid === network.ssid
                        }
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 ${
                          connectedNetwork?.ssid === network.ssid
                            ? "bg-primary/20 text-primary cursor-default"
                            : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
                        }`}
                      >
                        {connecting &&
                        selectedNetwork?.ssid === network.ssid ? (
                          <Loader className="w-3 h-3 animate-spin" />
                        ) : connectedNetwork?.ssid === network.ssid ? (
                          "Connected"
                        ) : (
                          "Connect"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Input Modal */}
      {showPasswordInput && selectedNetwork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-4 max-w-sm w-full mx-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Connect to {selectedNetwork.ssid}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Enter WiFi password
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleConnect(selectedNetwork, password);
                }
              }}
              autoFocus
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPasswordInput(false);
                  setPassword("");
                  setSelectedNetwork(null);
                }}
                className="flex-1 px-3 py-2 bg-secondary border border-border rounded text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleConnect(selectedNetwork, password)
                }
                disabled={!password || connecting}
                className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {connecting ? (
                  <Loader className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Connect"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default memo(WiFiPage);
