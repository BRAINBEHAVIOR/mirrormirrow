"use client"

import { cn } from "@/lib/utils"
import {
  FileText,
  Plus,
  Search,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Eye,
  Lock,
  Unlock,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type DocStatus = "signed" | "draft" | "pending-review" | "overdue"

const DOCS = [
  { id: "doc001", title: "Session Progress Note — Marcus T. (S14)", type: "Progress Note", patient: "Marcus T.", therapist: "Dr. Keiko Tanaka", date: "Feb 25, 2025", status: "draft" as DocStatus, locked: false },
  { id: "doc002", title: "ADOS-2 Evaluation Report — Aisha M.", type: "Evaluation Report", patient: "Aisha M.", therapist: "Dr. Priya Nair", date: "Feb 24, 2025", status: "pending-review" as DocStatus, locked: false },
  { id: "doc003", title: "Treatment Plan (Annual Update) — Ethan P.", type: "Treatment Plan", patient: "Ethan P.", therapist: "Dr. Amir Hassan", date: "Feb 22, 2025", status: "signed" as DocStatus, locked: true },
  { id: "doc004", title: "Session Progress Note — Lily W. (S28)", type: "Progress Note", patient: "Lily W.", therapist: "Dr. Rachel Osei", date: "Feb 21, 2025", status: "signed" as DocStatus, locked: true },
  { id: "doc005", title: "Behavioral Intervention Plan — Noah B.", type: "BIP", patient: "Noah B.", therapist: "Dr. James Whitfield", date: "Feb 19, 2025", status: "overdue" as DocStatus, locked: false },
  { id: "doc006", title: "Insurance Authorization Request — Sophie C.", type: "Authorization", patient: "Sophie C.", therapist: "Dr. Keiko Tanaka", date: "Feb 18, 2025", status: "pending-review" as DocStatus, locked: false },
]

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  signed: { label: "Signed & Locked", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  draft: { label: "Draft", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: Edit3 },
  "pending-review": { label: "Pending Review", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  overdue: { label: "Overdue", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertCircle },
}

export function ClinicalDocs() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Clinical Documentation</h2>
          <p className="text-xs text-muted-foreground mt-0.5">HIPAA-compliant · AES-256 encrypted · Audit-logged</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="Search documents…" className="pl-9 h-8 text-xs w-56 bg-white" />
          </div>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground">
            <Plus className="w-3 h-3" /> New Document
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Documents Total", value: "312", sub: "This year", color: "border-l-indigo-500" },
          { label: "Awaiting Signature", value: "4", sub: "Action required", color: "border-l-amber-500" },
          { label: "Overdue Notes", value: "2", sub: "Past 48hr SLA", color: "border-l-red-500" },
          { label: "Signed This Week", value: "18", sub: "All compliant", color: "border-l-emerald-500" },
        ].map((s) => (
          <div key={s.label} className={cn("bg-white rounded-xl border border-border border-l-4 px-4 py-3", s.color)}>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Document list */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Recent Documents</span>
          <span className="ml-auto text-[10px] text-muted-foreground">Sorted by last modified</span>
        </div>
        <div className="divide-y divide-border">
          {DOCS.map((doc) => {
            const config = STATUS_CONFIG[doc.status]
            const Icon = config.icon
            return (
              <div key={doc.id} className="px-5 py-4 hover:bg-muted/10 transition-colors cursor-pointer group flex items-center gap-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted shrink-0">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {doc.title}
                    </h4>
                    {doc.locked ? (
                      <Lock className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                    ) : (
                      <Unlock className="w-3 h-3 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{doc.type}</span>
                    <span className="text-[10px] text-muted-foreground">Patient: <span className="font-medium text-foreground">{doc.patient}</span></span>
                    <span className="text-[10px] text-muted-foreground">{doc.therapist}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {doc.date}
                  </div>
                  <span className={cn("flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border", config.color, config.bg)}>
                    <Icon className="w-2.5 h-2.5" />
                    {config.label}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded hover:bg-muted transition-colors">
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-muted transition-colors">
                      <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
