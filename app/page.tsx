"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { SessionAnalysis } from "@/components/dashboard/session-analysis"
import { BehavioralMetrics } from "@/components/dashboard/behavioral-metrics"
import { ResearchGrants } from "@/components/dashboard/research-grants"
import { PatientDirectory } from "@/components/dashboard/patient-directory"
import { ClinicalDocs } from "@/components/dashboard/clinical-docs"
import { cn } from "@/lib/utils"
import { Brain, BarChart3, Search, Bell, ChevronRight, Settings } from "lucide-react"

type Tab = "patients" | "session" | "research" | "docs" | "analytics" | "settings" | "support"

const SESSION_SUBTABS = [
  { id: "video", label: "Session Recording" },
  { id: "metrics", label: "Behavioral Metrics" },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("session")
  const [sessionSubtab, setSessionSubtab] = useState("video")

  const breadcrumb =
    activeTab === "session" ? "Session Analysis" :
    activeTab === "patients" ? "Patient Directory" :
    activeTab === "research" ? "Research & Grants" :
    activeTab === "docs" ? "Clinical Documentation" :
    activeTab === "analytics" ? "Analytics" :
    activeTab === "settings" ? "Settings" : "Support"

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={(t) => setActiveTab(t as Tab)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-13 bg-white border-b border-border flex items-center px-6 gap-4 shrink-0 py-0" style={{ height: 52 }}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs" aria-label="Breadcrumb">
            <span className="text-muted-foreground font-medium">MirrorMirrow™</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
            <span className="font-semibold text-foreground">{breadcrumb}</span>
            {activeTab === "session" && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                <span className="text-muted-foreground">Marcus T. · ASD-2024-0047 · Session 14</span>
              </>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {/* Global search trigger */}
            <button
              className="flex items-center gap-2 h-7 bg-muted hover:bg-border transition-colors rounded-lg px-3 text-xs text-muted-foreground w-44"
              aria-label="Search"
            >
              <Search className="w-3 h-3 shrink-0" />
              <span>Search…</span>
              <kbd className="ml-auto text-[9px] bg-background border border-border px-1 py-0.5 rounded font-mono leading-none">
                ⌘K
              </kbd>
            </button>

            {/* MirrorAI status */}
            <div
              className="flex items-center gap-1.5 text-[10px] font-semibold text-[oklch(0.35_0.18_264)] bg-[oklch(0.92_0.04_264)] border border-[oklch(0.82_0.08_264)] px-2.5 py-1.5 rounded-lg select-none"
              aria-label="AI status: active"
            >
              <Brain className="w-3 h-3" />
              <span>MirrorAI v3.1</span>
              <span className="w-1.5 h-1.5 bg-[oklch(0.45_0.18_264)] rounded-full animate-pulse" />
            </div>

            {/* Notifications */}
            <button
              className="relative p-1.5 rounded-lg hover:bg-muted transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* Settings */}
            <button
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              aria-label="Settings"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* System health */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground border-l border-border pl-3">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>All systems nominal</span>
            </div>
          </div>
        </header>

        {/* Sub-tab bar — only for Session Analysis */}
        {activeTab === "session" && (
          <div className="bg-white border-b border-border px-6 flex items-center shrink-0">
            {SESSION_SUBTABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSessionSubtab(tab.id)}
                className={cn(
                  "px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-px",
                  sessionSubtab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {tab.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 py-2">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/60 border border-border rounded-md px-2.5 py-1">
                <BarChart3 className="w-3 h-3" />
                <span>Session 14 of 24 planned</span>
                <span className="w-px h-3 bg-border mx-1" />
                <span className="text-foreground font-medium">Marcus T.</span>
                <span className="text-muted-foreground">· ASD Level 2</span>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-6 min-h-0">
          {activeTab === "session" && sessionSubtab === "video" && (
            <SessionAnalysis />
          )}
          {activeTab === "session" && sessionSubtab === "metrics" && (
            <BehavioralMetrics />
          )}
          {activeTab === "patients" && (
            <PatientDirectory />
          )}
          {activeTab === "research" && (
            <ResearchGrants />
          )}
          {activeTab === "docs" && (
            <ClinicalDocs />
          )}
          {(activeTab === "analytics" || activeTab === "settings" || activeTab === "support") && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-muted-foreground/40" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{breadcrumb}</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                This module is provisioned for your workspace and will be available in the next release.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
