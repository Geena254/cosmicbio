import { Link, useLocation } from "react-router-dom";
import { Search, BarChart3, FileText, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", label: "Home", icon: Rocket },
    { path: "/explore", label: "Explore", icon: Search },
    { path: "/insights", label: "Insights", icon: BarChart3 },
  ];
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">NASA Bioscience</h1>
              <p className="text-xs text-muted-foreground">Knowledge Explorer</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={isActive(item.path) ? "cosmic-glow" : ""}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
