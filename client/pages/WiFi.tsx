import { useState, useEffect } from "react";
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

export default function WiFi() {
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

    // Initialize Bluetooth devices
    setConnectedBluetoothDevices([
      {
        id: "bt1",
        name: "Teensy Microcontroller",
        type: "Microcontroller",
      },
    ]);

    const bluetoothDevices: BluetoothDevice[] = [
      { id: "btdev1", name: "Sensor Module A", rssi: -45 },
      { id: "btdev2", name: "Sensor Module B", rssi: -55 },
      { id: "btdev3", name: "Control Panel", rssi: -65 },
      { id: "btdev4", name: "Wireless Switch", rssi: -72 },
    ];

    setAvailableBluetoothDevices(bluetoothDevices);
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
      <div className="flex gap-1 items-end h-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-sm transition-all ${
              strength >= (i + 1) * 25 ? "bg-primary h-full" : "bg-border h-1"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      {/* Header */}
      <header className="bg-secondary border-b border-border px-6 py-4 flex-shrink-0">
        <h1 className="text-lg font-bold text-foreground">WiFi Configuration</h1>
        <p className="text-xs text-muted-foreground">
          Manage network connections for Raspberry Pi
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          {/* Connected Network */}
          {connectedNetwork && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Connected Network
              </h2>
              <div className="hmi-card border-success/50 bg-success/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-success animate-pulse" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {connectedNetwork.ssid}
                      </p>
                      <p className="text-xs text-success">Connected</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getSignalBar(connectedNetwork.strength)}
                    <p className="text-xs text-muted-foreground mt-1">
                      {connectedNetwork.strength}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Networks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Available Networks
              </h2>
              <button
                onClick={handleScan}
                disabled={scanning}
                className="px-3 py-1.5 bg-secondary border border-border rounded text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {scanning ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : (
                  <Wifi className="w-3 h-3" />
                )}
                {scanning ? "Scanning..." : "Scan"}
              </button>
            </div>

            <div className="space-y-2">
              {availableNetworks.map((network) => (
                <div
                  key={network.id}
                  className="hmi-card hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getSignalIcon(network.strength)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            {network.ssid}
                          </p>
                          {network.secured && (
                            <Lock className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getSignalBar(network.strength)}
                          <span className="text-xs text-muted-foreground">
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
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
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

          {/* Bluetooth Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">Bluetooth</h2>
                <button
                  onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                  className={`ml-auto px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    bluetoothEnabled
                      ? "bg-success text-success-foreground"
                      : "bg-secondary border border-border"
                  }`}
                >
                  {bluetoothEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>

            {bluetoothEnabled && (
              <div className="space-y-6">
                {/* Connected Bluetooth Devices */}
                {connectedBluetoothDevices.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      Connected Devices
                    </h3>
                    <div className="space-y-2">
                      {connectedBluetoothDevices.map((device) => (
                        <div
                          key={device.id}
                          className="hmi-card border-success/50 bg-success/10"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Bluetooth className="w-4 h-4 text-success animate-pulse" />
                              <div>
                                <p className="font-medium text-foreground">
                                  {device.name}
                                </p>
                                <p className="text-xs text-success">
                                  Connected
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleUnpairDevice(device.id)}
                              className="px-3 py-1.5 rounded text-xs font-medium bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                            >
                              Disconnect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Bluetooth Devices */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Available Devices
                    </h3>
                    <button
                      onClick={handleBluetoothScan}
                      disabled={bluetoothScanning}
                      className="px-3 py-1.5 bg-secondary border border-border rounded text-xs font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {bluetoothScanning ? (
                        <Loader className="w-3 h-3 animate-spin" />
                      ) : (
                        <Bluetooth className="w-3 h-3" />
                      )}
                      {bluetoothScanning ? "Scanning..." : "Scan"}
                    </button>
                  </div>

                  {availableBluetoothDevices.length === 0 ? (
                    <div className="hmi-card text-center py-6">
                      <BluetoothOff className="w-6 h-6 mx-auto mb-2 text-muted-foreground opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        No available devices found
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availableBluetoothDevices.map((device) => {
                        const signalStrength = Math.max(
                          0,
                          Math.min(100, device.rssi + 100)
                        );
                        return (
                          <div
                            key={device.id}
                            className="hmi-card hover:bg-secondary/70 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <Bluetooth className="w-4 h-4 text-primary" />
                                <div className="flex-1">
                                  <p className="font-medium text-foreground">
                                    {device.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="w-12 h-1.5 bg-secondary border border-border rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-primary"
                                        style={{ width: `${signalStrength}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground">
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
                                className="px-3 py-1.5 rounded text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
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

          {/* Password Input Modal */}
          {showPasswordInput && selectedNetwork && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Connect to {selectedNetwork.ssid}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  This network requires authentication
                </p>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter WiFi password"
                  className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
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
                    className="flex-1 px-3 py-2 bg-secondary border border-border rounded font-medium hover:bg-secondary/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleConnect(selectedNetwork, password)
                    }
                    disabled={!password || connecting}
                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
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
      </div>
    </AppLayout>
  );
}
