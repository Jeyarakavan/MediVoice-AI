"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  Phone,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  LogOut,
  User,
  Activity,
  FileText,
  UserCheck,
  Building2,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const hospitalAdminNav: NavItem[] = [
  { label: "Dashboard", href: "/hospital", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Doctors", href: "/hospital/doctors", icon: <Stethoscope className="w-5 h-5" /> },
  { label: "Receptionists", href: "/hospital/receptionists", icon: <UserCheck className="w-5 h-5" /> },
  { label: "Patients", href: "/hospital/patients", icon: <Users className="w-5 h-5" /> },
  { label: "Appointments", href: "/hospital/appointments", icon: <Calendar className="w-5 h-5" /> },
  { label: "AI Receptionist", href: "/hospital/ai-receptionist", icon: <Phone className="w-5 h-5" /> },
  { label: "Reports", href: "/hospital/reports", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "Audit Logs", href: "/hospital/audit", icon: <FileText className="w-5 h-5" /> },
  { label: "Settings", href: "/hospital/settings", icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar({ role = "hospitalAdmin" }: { role?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const navItems = hospitalAdminNav; // extend for other roles

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-30 flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
      style={{
        background: "hsl(var(--color-surface))",
        borderRight: "1px solid hsl(var(--color-border))",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[hsl(var(--color-border))] min-h-[64px] ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
          <Activity className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="text-base font-bold text-[hsl(var(--color-text))] block truncate">
              MediVox AI
            </span>
            <span className="text-xs text-[hsl(var(--color-text-muted))] capitalize">
              {role === "hospitalAdmin" ? "Hospital Admin" : role}
            </span>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-[hsl(var(--color-surface))] border border-[hsl(var(--color-border))] flex items-center justify-center shadow-sm hover:bg-[hsl(var(--color-surface-2))] transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          className={`w-3.5 h-3.5 text-[hsl(var(--color-text-secondary))] transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/hospital" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                    isActive
                      ? "bg-[hsl(var(--color-primary)/0.1)] text-[hsl(var(--color-primary))]"
                      : "text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-surface-2))] hover:text-[hsl(var(--color-text))]"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[hsl(var(--color-primary))]" />
                  )}
                  <span className={`flex-shrink-0 ${isActive ? "text-[hsl(var(--color-primary))]" : ""}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge != null && item.badge > 0 && (
                        <span className="ml-auto px-1.5 py-0.5 text-xs rounded-full bg-[hsl(var(--color-primary))] text-white font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className={`p-3 border-t border-[hsl(var(--color-border))] ${collapsed ? "items-center" : ""}`}>
        {!collapsed && user && (
          <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-[hsl(var(--color-surface-2))] transition-colors mb-1">
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[hsl(var(--color-text))] truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-[hsl(var(--color-text-muted))] truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => logout()}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-danger)/0.08)] hover:text-[hsl(var(--color-danger))] transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}
