import { useLocation, Link } from "react-router-dom";
import { Activity, Cpu, Wifi } from "lucide-react";

const navItems = [
  { path: "/", label: "Logs", icon: Activity },
  { path: "/assembly", label: "Assembly", icon: Cpu },
  { path: "/wifi", label: "WiFi", icon: Wifi },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-48 bg-secondary border-r border-border flex flex-col">
      {/* Logo Section */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-primary-foreground text-sm">
            π
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">EDATEC HMI</h2>
            <p className="text-xs text-muted-foreground">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full px-3 py-2.5 rounded flex items-center gap-2 transition-colors text-sm font-medium ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
        <p>Raspberry Pi</p>
        <p className="text-xs">v1.0</p>
      </div>
    </aside>
  );
}
