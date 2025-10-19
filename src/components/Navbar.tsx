import { NavLink, Link, useNavigate } from "react-router-dom";
import { Zap, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import Notifications from "./Notifications";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate("/auth");
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="relative">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary animate-pulse-glow" />
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-secondary absolute inset-0 animate-pulse opacity-50" />
            </div>
            <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Settlo
            </span>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex gap-1 md:gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 md:px-6 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-semibold transition-all ${
                    isActive
                      ? "gradient-primary text-white shadow-lg"
                      : "hover:bg-primary/10 text-foreground"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/leads"
                className={({ isActive }) =>
                  `px-3 md:px-6 py-1.5 md:py-2 rounded-lg text-sm md:text-base font-semibold transition-all ${
                    isActive
                      ? "gradient-primary text-white shadow-lg"
                      : "hover:bg-primary/10 text-foreground"
                  }`
                }
              >
                Leads
              </NavLink>
            </div>
            <Notifications />
            <Button
              variant="outline"
              size="icon"
              onClick={handleSignOut}
              className="border-destructive text-destructive hover:bg-destructive/10 h-8 w-8 md:h-10 md:w-10"
            >
              <LogOut className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
