"use client"

import { cn } from "@/lib/utils"
import {
  Users,
  Brain,
  FlaskConical,
  FileText,
  Settings,
  Bell,
  ChevronDown,
  Shield,
  Activity,
  LogOut,
  HelpCircle,
  BarChart3,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface NavItem {
  icon: React.ElementType
  label: string
  id: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive"
  sublabel?: string
}

const NAV_ITEMS: NavItem[] = [
  {
    icon: Users,
    label: "Patient Directory",
    id: "patients",
    sublabel: "148 active",
  },
  {
    icon: Brain,
    label: "Session Analysis",
    id: "session",
    badge: "LIVE",
    badgeVariant: "destructive",
  },
  {
    icon: FlaskConical,
    label: "Research & Grants",
    id: "research",
    badge: "3",
  },
  {
    icon: FileText,
    label: "Clinical Documentation",
    id: "docs",
  },
]

const BOTTOM_NAV: NavItem[] = [
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Settings", id: "settings" },
  { icon: HelpCircle, label: "Support", id: "support" },
]

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="flex flex-col w-64 shrink-0 bg-white border-r border-border h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold tracking-tight text-foreground leading-none">
            MirrorMirrow
          </span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mt-0.5">
            Clinical Intelligence
          </span>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[oklch(0.92_0.04_264)] rounded text-[9px] font-bold text-[oklch(0.35_0.18_264)] tracking-wider uppercase">
            <Shield className="w-2.5 h-2.5" />
            HIPAA
          </div>
        </div>
      </div>

      {/* Workspace Selector */}
      <div className="px-4 py-3 border-b border-border">
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-muted transition-colors text-left">
          <div className="w-6 h-6 rounded-md bg-[oklch(0.55_0.14_185)] flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">CL</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-foreground truncate">Children&apos;s Behavioral Lab</span>
            <span className="text-[10px] text-muted-foreground">Research Site · IRB-2024-0891</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0" />
        </button>
      </div>

      {/* Section label */}
      <div className="px-5 pt-4 pb-1.5">
        <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
          Clinical Suite
        </span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm transition-all duration-150 group",
                isActive
                  ? "bg-[oklch(0.92_0.04_264)] text-[oklch(0.35_0.18_264)] font-semibold"
                  : "text-[oklch(0.38_0.015_240)] hover:bg-muted hover:text-foreground font-medium"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="flex-1 text-left leading-none">{item.label}</span>
              {item.sublabel && !item.badge && (
                <span className="text-[10px] text-muted-foreground">{item.sublabel}</span>
              )}
              {item.badge && (
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide",
                    item.badgeVariant === "destructive"
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-[oklch(0.92_0.04_264)] text-primary"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        <div className="pt-4 pb-1.5">
          <span className="px-3 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
            System
          </span>
        </div>

        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm transition-all duration-150 group",
                isActive
                  ? "bg-[oklch(0.92_0.04_264)] text-[oklch(0.35_0.18_264)] font-semibold"
                  : "text-[oklch(0.38_0.015_240)] hover:bg-muted hover:text-foreground font-medium"
              )}
            >
              <Icon className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              DR
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-foreground truncate">Dr. Rachel Osei</span>
            <span className="text-[10px] text-muted-foreground truncate">Clinical Researcher · PI</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-muted transition-colors relative">
              <Bell className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
