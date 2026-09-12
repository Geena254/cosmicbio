import {
  Home,
  Search,
  BarChart3,
  Info,
  Rocket,
  Menu,
  Sprout,
  CloudRain,
  BellRing,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/explore", label: "Explore", icon: Search },
  { path: "/whats-new", label: "New", icon: BellRing },
  { path: "/insights", label: "Insights", icon: BarChart3 },
  { path: "/agriculture", label: "Agriculture", icon: Sprout },
  { path: "/rainfall", label: "Rainfall", icon: CloudRain },
  { path: "/about", label: "About", icon: Info },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative flex h-16 items-center px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Rocket className="h-5 w-5 text-primary" />
          <span>NASA Bio</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-2 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                  isActive(item.path)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
