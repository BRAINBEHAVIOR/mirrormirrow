"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Clock,
  User,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  SortAsc,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const PATIENTS = [
  { id: "ASD-2024-0047", name: "Marcus T.", age: 4, dob: "Mar 12, 2020", therapist: "Dr. Keiko Tanaka", sessions: 14, lastSession: "Today", nextSession: "Thu, Feb 27", diagnosis: "ASD Level 2", riskScore: 42, trend: "improving", status: "active" },
  { id: "ASD-2024-0031", name: "Lily W.", age: 6, dob: "Jun 5, 2018", therapist: "Dr. Rachel Osei", sessions: 28, lastSession: "Yesterday", nextSession: "Fri, Feb 28", diagnosis: "ASD Level 1", riskScore: 28, trend: "improving", status: "active" },
  { id: "ASD-2023-0098", name: "Ethan P.", age: 5, dob: "Sep 18, 2019", therapist: "Dr. Amir Hassan", sessions: 41, lastSession: "Mon, Feb 24", nextSession: "Wed, Feb 26", diagnosis: "ASD Level 2", riskScore: 58, trend: "stable", status: "active" },
  { id: "ASD-2024-0062", name: "Aisha M.", age: 3, dob: "Dec 2, 2021", therapist: "Dr. Priya Nair", sessions: 8, lastSession: "Fri, Feb 21", nextSession: "Mon, Mar 3", diagnosis: "ASD Level 3", riskScore: 71, trend: "critical", status: "active" },
  { id: "ASD-2023-0077", name: "Noah B.", age: 7, dob: "Apr 14, 2017", therapist: "Dr. James Whitfield", sessions: 62, lastSession: "Tue, Feb 18", nextSession: "Thu, Feb 27", diagnosis: "ASD Level 1", riskScore: 22, trend: "improving", status: "active" },
  { id: "ASD-2024-0015", name: "Sophie C.", age: 4, dob: "Aug 29, 2020", therapist: "Dr. Keiko Tanaka", sessions: 19, lastSession: "Mon, Feb 24", nextSession: "Wed, Feb 26", diagnosis: "ASD Level 2", riskScore: 45, trend: "stable", status: "active" },
  { id: "ASD-2022-0143", name: "Jaylen R.", age: 9, dob: "Feb 1, 2015", therapist: "Dr. Rachel Osei", sessions: 88, lastSession: "Fri, Feb 14", nextSession: "—", diagnosis: "ASD Level 1", riskScore: 18, trend: "improving", status: "discharged" },
]

const TREND_CONFIG = {
  improving: { label: "Improving", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  stable: { label: "Stable", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Activity },
  critical: { label: "Needs Attention", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertCircle },
}

export function PatientDirectory() {
  const [search, setSearch] = useState("")
  const filtered = PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Patient Directory</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{PATIENTS.length} total patients · {PATIENTS.filter(p => p.status === "active").length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients…"
              className="pl-9 h-8 text-xs w-56 bg-white"
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Filter className="w-3 h-3" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <SortAsc className="w-3 h-3" /> Sort
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground">
            <Plus className="w-3 h-3" /> Admit Patient
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Active Patients", value: "148", sub: "In current treatment", color: "border-l-indigo-500" },
          { label: "Sessions This Week", value: "34", sub: "12 remaining today", color: "border-l-teal-500" },
          { label: "Avg. Risk Score", value: "41", sub: "Across all active", color: "border-l-amber-500" },
          { label: "Discharged (2024)", value: "22", sub: "Goal-achieved exits", color: "border-l-emerald-500" },
        ].map((s) => (
          <div key={s.label} className={cn("bg-white rounded-xl border border-border border-l-4 px-4 py-3", s.color)}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Patient table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Patient", "ID", "Age", "Diagnosis", "Therapist", "Sessions", "Last Session", "Next Session", "Risk", "Trend", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((patient, i) => {
              const tConfig = TREND_CONFIG[patient.trend as keyof typeof TREND_CONFIG]
              const TIcon = tConfig.icon
              const riskColor = patient.riskScore < 30 ? "text-emerald-600" : patient.riskScore < 60 ? "text-amber-600" : "text-red-600"
              const riskBg = patient.riskScore < 30 ? "bg-emerald-500" : patient.riskScore < 60 ? "bg-amber-500" : "bg-red-500"
              return (
                <tr
                  key={patient.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-muted/10 transition-colors cursor-pointer",
                    patient.status === "discharged" && "opacity-60"
                  )}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-foreground">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[10px] text-indigo-600 font-semibold">{patient.id}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {patient.age}y
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-foreground">{patient.diagnosis}</span>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{patient.therapist}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium text-foreground">{patient.sessions}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {patient.lastSession}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                      <Calendar className="w-3 h-3" />
                      {patient.nextSession}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-8 h-1.5 bg-muted rounded-full">
                        <div className={cn("h-1.5 rounded-full", riskBg)} style={{ width: `${patient.riskScore}%` }} />
                      </div>
                      <span className={cn("font-bold text-[11px]", riskColor)}>{patient.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn("flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit", tConfig.color, tConfig.bg)}>
                      <TIcon className="w-2.5 h-2.5" />
                      {tConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1 rounded hover:bg-muted transition-colors">
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-1 rounded hover:bg-muted transition-colors">
                        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
