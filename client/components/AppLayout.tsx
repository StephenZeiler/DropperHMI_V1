import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";

interface AppLayoutProps {
  children: ReactNode;
  systemStatus?: {
    teensyConnected: boolean;
    teensyLatency?: number;
    systemUptime?: string;
    memoryUsage?: number;
  };
}

export default function AppLayout({
  children,
  systemStatus = {
    teensyConnected: false,
    teensyLatency: 0,
    systemUptime: "0d 00:00:00",
    memoryUsage: 45,
  },
}: AppLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
      </div>
      <StatusBar status={systemStatus} />
    </div>
  );
}
