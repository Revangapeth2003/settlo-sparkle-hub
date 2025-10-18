import { NavLink } from "react-router-dom";
import { Zap } from "lucide-react";
import Notifications from "./Notifications";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Zap className="w-8 h-8 text-primary animate-pulse-glow" />
              <Zap className="w-8 h-8 text-secondary absolute inset-0 animate-pulse opacity-50" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Settlo
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-6 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? "gradient-primary text-white shadow-lg glow-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/leads"
                className={({ isActive }) =>
                  `px-6 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? "gradient-primary text-white shadow-lg glow-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                Leads
              </NavLink>
            </div>
            <Notifications />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
