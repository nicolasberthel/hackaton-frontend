import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, User, TrendingUp, ShoppingBag, LayoutDashboard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import fractionLogo from "@/assets/fraction-logo.png";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", path: "/", icon: Home },
  { name: "Portfolio", path: "/portfolio", icon: LayoutDashboard },
  { name: "Opportunities", path: "/opportunities_dyn", icon: ShoppingBag },
  { name: "Community", path: "/community", icon: User },
];

const availableUsers = [
  { id: "user_001", name: "Emma Dupont" },
  { id: "user_002", name: "Jean Schmidt" },
  { id: "user_003", name: "Sophie Weber" },
];

export default function Layout() {
  const location = useLocation();
  const { userId, setUserId } = useUser();
  const { data: portfolio } = usePortfolio(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Navigation */}
      <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img 
                src={fractionLogo} 
                alt="Fraction" 
                className="h-12 w-auto object-contain"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* User Dropdown */}
              {portfolio && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <span className="text-sm">
                        Hello, <span className="font-medium">{portfolio.user_name.split(' ')[0]}</span>
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Switch User</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableUsers.map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        onClick={() => setUserId(user.id)}
                        className={cn(
                          "cursor-pointer",
                          userId === user.id && "bg-accent"
                        )}
                      >
                        <User className="w-4 h-4 mr-2" />
                        {user.name}
                        {userId === user.id && " ✓"}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t backdrop-blur-sm">
        <div className="flex justify-around items-center py-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
