import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GitBranch, Calendar, MessageSquare,
  BookOpen, BarChart3, Clock, Building2, Boxes, Grid3X3,
  Zap, Puzzle, MapPin, Settings, ChevronLeft, Bell, Search,
  LogOut, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const demandItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Leads", icon: Users, path: "/leads" },
  { label: "Pipeline", icon: GitBranch, path: "/pipeline" },
  { label: "Visits", icon: Calendar, path: "/visits" },
  { label: "Messages", icon: MessageSquare, path: "/conversations" },
  { label: "Bookings", icon: BookOpen, path: "/bookings" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Historical", icon: Clock, path: "/historical" },
];

const supplyItems: NavItem[] = [
  { label: "Owners", icon: Building2, path: "/owners" },
  { label: "Inventory", icon: Boxes, path: "/inventory" },
  { label: "Availability", icon: Grid3X3, path: "/availability" },
  { label: "Effort", icon: Zap, path: "/effort" },
  { label: "Matching", icon: Puzzle, path: "/matching" },
  { label: "Zones", icon: MapPin, path: "/zones" },
];

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-sidebar-active text-sidebar-active-foreground shadow-lg shadow-primary/20"
            : "text-sidebar-foreground hover:bg-sidebar-hover"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          G
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-sidebar-active-foreground font-bold text-lg leading-none">Gharpayy</h1>
            <p className="text-[11px] text-sidebar-section mt-0.5">Booking OS</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className={cn("text-[11px] font-semibold uppercase tracking-wider text-sidebar-section mb-2", collapsed ? "text-center" : "px-3")}>
            {collapsed ? "D" : "Demand"}
          </p>
          <div className="space-y-1">
            {demandItems.map((item) => <NavLink key={item.path} item={item} />)}
          </div>
        </div>

        <div>
          <p className={cn("text-[11px] font-semibold uppercase tracking-wider text-sidebar-section mb-2", collapsed ? "text-center" : "px-3")}>
            {collapsed ? "S" : "Supply"}
          </p>
          <div className="space-y-1">
            {supplyItems.map((item) => <NavLink key={item.path} item={item} />)}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-sidebar-border px-3 py-3 space-y-1">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-hover transition-colors"
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-hover transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar - desktop */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 -right-3 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-10"
          style={{ left: collapsed ? "56px" : "228px" }}
        >
          <ChevronLeft className={cn("h-3 w-3 text-muted-foreground transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Sidebar - mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[240px] bg-sidebar transform transition-transform duration-300 lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
