import { RequestHandler } from "express";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface WifiNetwork {
  ssid: string;
  strength: number;
  secured: boolean;
}

interface CurrentNetwork {
  ssid: string | null;
  strength: number | null;
}

export const getWifiNetworks: RequestHandler = async (req, res) => {
  try {
    const { stdout } = await execAsync(
      "nmcli -t -f SSID,SIGNAL,SECURITY device wifi list 2>/dev/null || echo ''",
      { timeout: 10000 }
    );

    const networks: WifiNetwork[] = [];
    const seen = new Set<string>();

    stdout
      .trim()
      .split("\n")
      .filter((line) => line.length > 0)
      .forEach((line) => {
        const parts = line.split(":");
        if (parts.length >= 3) {
          const ssid = parts[0].trim();
          const strength = parseInt(parts[1].trim()) || 0;
          const security = parts.slice(2).join(":").trim();

          if (ssid && !seen.has(ssid)) {
            seen.add(ssid);
            networks.push({
              ssid,
              strength: Math.min(100, Math.max(0, strength)),
              secured: security.length > 0 && security !== "--",
            });
          }
        }
      });

    networks.sort((a, b) => b.strength - a.strength);
    res.json({ networks });
  } catch (error) {
    console.error("Error scanning WiFi networks:", error);
    res.status(500).json({
      error: "Failed to scan networks",
      networks: [],
    });
  }
};

export const getCurrentNetwork: RequestHandler = async (req, res) => {
  try {
    const { stdout: activeOutput } = await execAsync(
      "nmcli -t -f NAME,DEVICE connection show --active 2>/dev/null | grep wifi || echo ''",
      { timeout: 5000 }
    );

    const { stdout: deviceOutput } = await execAsync(
      "nmcli -t -f SSID,SIGNAL device wifi list 2>/dev/null | head -1 || echo ''",
      { timeout: 5000 }
    );

    let ssid: string | null = null;
    let strength: number | null = null;

    if (activeOutput.trim()) {
      const parts = activeOutput.trim().split(":");
      ssid = parts[0].trim();
    }

    if (deviceOutput.trim()) {
      const parts = deviceOutput.trim().split(":");
      if (parts[0]) ssid = parts[0].trim();
      if (parts[1]) strength = Math.min(100, Math.max(0, parseInt(parts[1]) || 0));
    }

    res.json({
      ssid,
      strength: strength ?? 75,
    });
  } catch (error) {
    console.error("Error getting current network:", error);
    res.json({
      ssid: null,
      strength: null,
    });
  }
};

export const connectToNetwork: RequestHandler = async (req, res) => {
  try {
    const { ssid, password } = req.body;

    if (!ssid) {
      return res.status(400).json({ error: "SSID is required" });
    }

    let command: string;

    if (password) {
      command = `nmcli device wifi connect "${ssid}" password "${password}" 2>&1`;
    } else {
      command = `nmcli device wifi connect "${ssid}" 2>&1`;
    }

    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000,
      shell: "/bin/bash",
    });

    const output = stdout + stderr;

    if (output.includes("Error") || output.includes("Error:")) {
      return res.status(400).json({
        error: "Failed to connect",
        details: output,
      });
    }

    res.json({
      success: true,
      ssid,
      message: "Connected successfully",
    });
  } catch (error) {
    console.error("Error connecting to WiFi:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Connection failed",
      details: errorMessage,
    });
  }
};

export const disconnectNetwork: RequestHandler = async (req, res) => {
  try {
    await execAsync("nmcli device disconnect wlan0 2>/dev/null || true", {
      timeout: 10000,
    });
    res.json({ success: true, message: "Disconnected" });
  } catch (error) {
    res.status(500).json({ error: "Failed to disconnect" });
  }
};
