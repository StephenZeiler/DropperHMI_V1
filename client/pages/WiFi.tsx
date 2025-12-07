import { useState, useEffect, memo } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Wifi,
  WifiOff,
  WifiIcon,
  Loader,
  Lock,
  Bluetooth,
  BluetoothOff,
} from "lucide-react";

interface Network {
  ssid: string;
  strength: number;
  secured: boolean;
  id: string;
}

interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
}

interface ConnectedBluetoothDevice {
  id: string;
  name: string;
  type: string;
}

function WiFiPage() {
  const [connectedNetwork, setConnectedNetwork] = useState<Network | null>(null);
  const [availableNetworks, setAvailableNetworks] = useState<Network[]>([]);
  const [scanning, setScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [connecting, setConnecting] = useState(false);

  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [connectedBluetoothDevices, setConnectedBluetoothDevices] = useState<
    ConnectedBluetoothDevice[]
  >([]);
  const [availableBluetoothDevices, setAvailableBluetoothDevices] = useState<
    BluetoothDevice[]
  >([]);
  const [bluetoothScanning, setBluetoothScanning] = useState(false);
  const [pairing, setPairing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"wifi" | "bluetooth">("wifi");

  useEffect(() => {
    setConnectedNetwork({
      id: "main",
      ssid: "HomeNetwork-2.4GHz",
      strength: 75,
      secured: true,
    });

    const networks: Network[] = [
      {
        id: "net1",
        ssid: "Neighbor WiFi",
        strength: 45,
        secured: true,
      },
      {
        id: "net2",
        ssid: "GuestNetwork",
        strength: 60,
        secured: false,
      },
      {
        id: "net3",
        ssid: "Office-5GHz",
        strength: 88,
        secured: true,
      },
      {
        id: "net4",
        ssid: "OpenPublic",
        strength: 30,
        secured: false,
      },
    ];

    setAvailableNetworks(networks);

    setConnectedBluetoothDevices([
      {
        id: "bt1",
        name: "Hand Barcode Scanner",
        type: "Scanner",
      },
    ]);

    setAvailableBluetoothDevices([]);
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 2000);
  };

  const handleConnectClick = (network: Network) => {
    setSelectedNetwork(network);
    if (network.secured) {
      setShowPasswordInput(true);
    } else {
      handleConnect(network, "");
    }
  };

  const handleConnect = (network: Network, pwd: string) => {
    setConnecting(true);
    setTimeout(() => {
      setConnectedNetwork(network);
      setConnecting(false);
      setShowPasswordInput(false);
      setPassword("");
      setSelectedNetwork(null);
    }, 2000);
  };

  const getSignalIcon = (strength: number) => {
    if (strength >= 70)
      return <Wifi className="w-4 h-4 text-success" />;
    if (strength >= 40)
      return <WifiIcon className="w-4 h-4 text-warning" />;
    return <WifiOff className="w-4 h-4 text-destructive" />;
  };

  const handleBluetoothScan = () => {
    setBluetoothScanning(true);
    setTimeout(() => {
      setBluetoothScanning(false);
    }, 2000);
  };

  const handlePairDevice = (device: BluetoothDevice) => {
    setSelectedDevice(device);
    setPairing(true);
    setTimeout(() => {
      setConnectedBluetoothDevices((prev) => [
        ...prev,
        {
          id: device.id,
          name: device.name,
          type: "Device",
        },
      ]);
      setAvailableBluetoothDevices((prev) =>
        prev.filter((d) => d.id !== device.id)
      );
      setPairing(false);
      setSelectedDevice(null);
    }, 1500);
  };

  const handleUnpairDevice = (deviceId: string) => {
    setConnectedBluetoothDevices((prev) =>
      prev.filter((d) => d.id !== deviceId)
    );
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
        <h1 className="text-base font-bold text-foreground">WiFi / Bluetooth</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 px-3 py-2 border-b border-border bg-secondary/30 flex-shrink-0">
        <button
          onClick={() => setActiveTab("wifi")}
          className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
            activeTab === "wifi"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary border border-border hover:bg-secondary/80"
          }`}
        >
          WiFi
        </button>
        <button
          onClick={() => setActiveTab("bluetooth")}
          className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
            activeTab === "bluetooth"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary border border-border hover:bg-secondary/80"
          }`}
        >
          Bluetooth
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* WiFi Tab */}
        {activeTab === "wifi" && (
          <div className="max-w-2xl space-y-2">
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
                  disabled={scanning}
                  className="px-2 py-1 bg-secondary border border-border rounded text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {scanning ? (
                    <Loader className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wifi className="w-3 h-3" />
                  )}
                  {scanning ? "Scan..." : "Scan"}
                </button>
              </div>

              <div className="space-y-1">
                {availableNetworks.map((network) => (
                  <div
                    key={network.id}
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
            </div>
          </div>
        )}

        {/* Bluetooth Tab */}
        {activeTab === "bluetooth" && (
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-foreground">Bluetooth</h3>
              <button
                onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  bluetoothEnabled
                    ? "bg-success text-success-foreground"
                    : "bg-secondary border border-border"
                }`}
              >
                {bluetoothEnabled ? "On" : "Off"}
              </button>
            </div>

            {bluetoothEnabled && (
              <div className="space-y-3">
                {/* Connected Devices */}
                {connectedBluetoothDevices.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-1">
                      Connected
                    </h4>
                    <div className="space-y-1">
                      {connectedBluetoothDevices.map((device) => (
                        <div
                          key={device.id}
                          className="hmi-card border-success/50 bg-success/10 p-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bluetooth className="w-4 h-4 text-success flex-shrink-0 animate-pulse" />
                              <div>
                                <p className="font-medium text-sm text-foreground">
                                  {device.name}
                                </p>
                                <p className="text-xs text-success">Connected</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleUnpairDevice(device.id)}
                              className="px-2 py-1 rounded text-xs font-medium bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors flex-shrink-0"
                            >
                              Disconnect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Devices */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-semibold text-foreground">
                      Available
                    </h4>
                    <button
                      onClick={handleBluetoothScan}
                      disabled={bluetoothScanning}
                      className="px-2 py-1 bg-secondary border border-border rounded text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {bluetoothScanning ? (
                        <Loader className="w-3 h-3 animate-spin" />
                      ) : (
                        <Bluetooth className="w-3 h-3" />
                      )}
                      {bluetoothScanning ? "Scan..." : "Scan"}
                    </button>
                  </div>

                  {availableBluetoothDevices.length === 0 ? (
                    <div className="hmi-card text-center py-4">
                      <BluetoothOff className="w-5 h-5 mx-auto mb-1 text-muted-foreground opacity-50" />
                      <p className="text-xs text-muted-foreground">No devices</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {availableBluetoothDevices.map((device) => {
                        const signalStrength = Math.max(
                          0,
                          Math.min(100, device.rssi + 100)
                        );
                        return (
                          <div
                            key={device.id}
                            className="hmi-card p-2 hover:bg-secondary/70 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Bluetooth className="w-4 h-4 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-foreground truncate">
                                    {device.name}
                                  </p>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <div className="w-10 h-1 bg-secondary border border-border rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary"
                                        style={{ width: `${signalStrength}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                      {Math.round(signalStrength)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handlePairDevice(device)}
                                disabled={
                                  pairing &&
                                  selectedDevice?.id === device.id
                                }
                                className="px-2 py-1 rounded text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
                              >
                                {pairing &&
                                selectedDevice?.id === device.id ? (
                                  <Loader className="w-3 h-3 animate-spin" />
                                ) : (
                                  "Pair"
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

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
      </div>
    </AppLayout>
  );
}
