import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, FileText, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/report/lost", icon: PlusCircle, label: "Report" },
  { to: "/my-reports", icon: FileText, label: "Reports" },
  { to: "/profile", icon: User, label: "Profile" },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-lg mx-auto">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to || 
              (to === "/report/lost" && location.pathname.startsWith("/report"));
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center gap-0.5 text-xs font-body transition-colors min-w-[3rem]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
