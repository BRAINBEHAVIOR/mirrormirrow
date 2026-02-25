"use client"

import { cn } from "@/lib/utils"
import {
  DollarSign,
  FlaskConical,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Circle,
  ChevronRight,
  Download,
  Plus,
  ExternalLink,
  Users,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

type GrantStatus = "active" | "in-progress" | "submitted" | "awarded" | "completed" | "rejected"
type TrialStatus = "recruiting" | "active" | "completed" | "suspended" | "pending"

interface Grant {
  id: string
  title: string
  agency: string
  mechanism: string
  amount: string
  status: GrantStatus
  submittedDate: string
  decisionDate: string
  progress: number
  pi: string
  score?: string
}

interface Trial {
  id: string
  title: string
  nctId: string
  phase: string
  status: TrialStatus
  enrolled: number
  target: number
  site: string
  startDate: string
  endDate: string
  sponsor: string
}

const GRANTS: Grant[] = [
  {
    id: "g1",
    title: "AI-Powered Behavioral Phenotyping in Early ASD Intervention",
    agency: "NIH / NICHD",
    mechanism: "SBIR Phase II",
    amount: "$1,850,000",
    status: "active",
    submittedDate: "Jan 15, 2024",
    decisionDate: "Apr 30, 2024",
    progress: 62,
    pi: "Dr. Rachel Osei",
    score: "18",
  },
  {
    id: "g2",
    title: "Computer Vision for Automated ASD Severity Classification",
    agency: "NIH / NIMH",
    mechanism: "R01",
    amount: "$2,400,000",
    status: "in-progress",
    submittedDate: "Mar 1, 2025",
    decisionDate: "Aug 15, 2025",
    progress: 45,
    pi: "Dr. James Whitfield",
  },
  {
    id: "g3",
    title: "Telehealth-Augmented ABA: Digital Measurement Validity Study",
    agency: "PCORI",
    mechanism: "Pragmatic Trial",
    amount: "$890,000",
    status: "submitted",
    submittedDate: "Nov 20, 2024",
    decisionDate: "Feb 28, 2025",
    progress: 100,
    pi: "Dr. Keiko Tanaka",
  },
  {
    id: "g4",
    title: "Social Robotics Companion for Pediatric ASD Therapy Sessions",
    agency: "NSF",
    mechanism: "Small Business Innovation",
    amount: "$450,000",
    status: "awarded",
    submittedDate: "Jun 10, 2023",
    decisionDate: "Oct 1, 2023",
    progress: 80,
    pi: "Dr. Amir Hassan",
    score: "12",
  },
  {
    id: "g5",
    title: "Multimodal Biomarker Discovery in Pediatric Neurodevelopment",
    agency: "DoD CDMRP",
    mechanism: "Idea Award",
    amount: "$300,000",
    status: "completed",
    submittedDate: "Feb 5, 2022",
    decisionDate: "Jul 15, 2022",
    progress: 100,
    pi: "Dr. Rachel Osei",
    score: "9",
  },
  {
    id: "g6",
    title: "Wearable Sensor Integration for Affect Detection in ASD",
    agency: "NIH / NIBIB",
    mechanism: "SBIR Phase I",
    amount: "$280,000",
    status: "rejected",
    submittedDate: "Sep 30, 2023",
    decisionDate: "Jan 10, 2024",
    progress: 100,
    pi: "Dr. Priya Nair",
    score: "28",
  },
]

const TRIALS: Trial[] = [
  {
    id: "t1",
    title: "Efficacy of AI-Guided ABA vs Traditional ABA in Children 3–6 with ASD",
    nctId: "NCT05821047",
    phase: "Phase III",
    status: "recruiting",
    enrolled: 87,
    target: 200,
    site: "CBL — Boston",
    startDate: "Mar 2024",
    endDate: "Mar 2026",
    sponsor: "MirrorMirrow Inc.",
  },
  {
    id: "t2",
    title: "Automated ADOS-2 Scoring Validation Using Computer Vision",
    nctId: "NCT05629183",
    phase: "Observational",
    status: "active",
    enrolled: 156,
    target: 160,
    site: "Multi-site (4)",
    startDate: "Sep 2023",
    endDate: "Dec 2025",
    sponsor: "NIH / NICHD",
  },
  {
    id: "t3",
    title: "Parent-Mediated Naturalistic Developmental Behavioral Intervention (NDBI)",
    nctId: "NCT05412038",
    phase: "Phase II",
    status: "active",
    enrolled: 62,
    target: 80,
    site: "CBL — Boston",
    startDate: "Jan 2023",
    endDate: "Jun 2025",
    sponsor: "PCORI",
  },
  {
    id: "t4",
    title: "Social Story Video Modeling with MirrorAI Feedback Loop",
    nctId: "NCT05987241",
    phase: "Pilot / Phase I",
    status: "pending",
    enrolled: 0,
    target: 40,
    site: "CBL — Boston",
    startDate: "Jun 2025",
    endDate: "Jun 2026",
    sponsor: "MirrorMirrow Inc.",
  },
  {
    id: "t5",
    title: "Long-Term Outcomes of Early Intensive Behavioral Intervention (EIBI)",
    nctId: "NCT04918273",
    phase: "Phase III",
    status: "completed",
    enrolled: 220,
    target: 220,
    site: "Multi-site (7)",
    startDate: "Jan 2020",
    endDate: "Dec 2024",
    sponsor: "NIH / NIMH",
  },
]

const GRANT_STATUS_CONFIG: Record<GrantStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active: { label: "Active", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: Clock },
  submitted: { label: "Under Review", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
  awarded: { label: "Awarded", color: "text-teal-700", bg: "bg-teal-50 border-teal-200", icon: CheckCircle2 },
  completed: { label: "Completed", color: "text-slate-600", bg: "bg-slate-50 border-slate-200", icon: Circle },
  rejected: { label: "Not Funded", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
}

const TRIAL_STATUS_CONFIG: Record<TrialStatus, { label: string; color: string; bg: string; dot: string }> = {
  recruiting: { label: "Recruiting", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  active: { label: "Active", color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", dot: "bg-indigo-500" },
  completed: { label: "Completed", color: "text-slate-600", bg: "bg-slate-50 border-slate-200", dot: "bg-slate-400" },
  suspended: { label: "Suspended", color: "text-red-700", bg: "bg-red-50 border-red-200", dot: "bg-red-500" },
  pending: { label: "Pending Start", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-400" },
}

const FUNDING_PIPELINE_DATA = [
  { stage: "Identified", count: 12, amount: 8.4 },
  { stage: "In Prep", count: 5, amount: 4.2 },
  { stage: "Submitted", count: 3, amount: 3.5 },
  { stage: "Under Review", count: 2, amount: 2.9 },
  { stage: "Awarded", count: 4, amount: 5.2 },
]

export function ResearchGrants() {
  const totalFunding = GRANTS
    .filter((g) => g.status === "active" || g.status === "awarded")
    .reduce((sum) => sum, 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Header KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Active Funding", value: "$4.3M", sub: "3 active awards", icon: DollarSign, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
          { label: "Grants in Pipeline", value: "6", sub: "Across 4 agencies", icon: Target, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
          { label: "Active Trials", value: "3", sub: "305 participants enrolled", icon: FlaskConical, iconBg: "bg-teal-50", iconColor: "text-teal-600" },
          { label: "Publications (2024)", value: "7", sub: "3 first-author", icon: FileText, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
              <div className={cn("p-2.5 rounded-lg shrink-0", kpi.iconBg)}>
                <Icon className={cn("w-5 h-5", kpi.iconColor)} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-bold text-foreground mt-0.5">{kpi.value}</p>
                <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Grant Pipeline + Funnel Chart */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Grant Pipeline</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">All submissions · current fiscal year</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                <Download className="w-3 h-3" /> Export
              </Button>
              <Button size="sm" className="h-7 text-xs gap-1 bg-primary text-primary-foreground">
                <Plus className="w-3 h-3" /> New Grant
              </Button>
            </div>
          </div>

          <div className="divide-y divide-border">
            {GRANTS.map((grant) => {
              const config = GRANT_STATUS_CONFIG[grant.status]
              const Icon = config.icon
              return (
                <div key={grant.id} className="px-5 py-4 hover:bg-muted/20 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {grant.title}
                        </h4>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[11px] font-semibold text-foreground">{grant.agency}</span>
                        <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                          {grant.mechanism}
                        </span>
                        <span className="text-[10px] text-muted-foreground">PI: {grant.pi}</span>
                        {grant.score && (
                          <span className="text-[10px] text-muted-foreground">
                            Priority Score: <span className="font-bold text-foreground">{grant.score}</span>
                          </span>
                        )}
                      </div>
                      {grant.status === "in-progress" && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full max-w-[200px]">
                            <div
                              className="h-1.5 bg-primary rounded-full transition-all"
                              style={{ width: `${grant.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground">{grant.progress}% complete</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-sm font-bold text-foreground">{grant.amount}</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                          config.color, config.bg
                        )}
                      >
                        <Icon className="w-2.5 h-2.5" />
                        {config.label}
                      </span>
                      <div className="text-right">
                        <p className="text-[9px] text-muted-foreground">Submitted {grant.submittedDate}</p>
                        <p className="text-[9px] text-muted-foreground">Decision {grant.decisionDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pipeline Funnel */}
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Funding Funnel</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Grants by stage ($M)</p>
            </div>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={FUNDING_PIPELINE_DATA}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="stage"
                tick={{ fill: "#64748b", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={72}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                formatter={(v: number) => [`$${v}M`, "Funding"]}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={14}>
                {FUNDING_PIPELINE_DATA.map((entry, index) => {
                  const colors = ["#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1"]
                  return <Cell key={`cell-${index}`} fill={colors[index]} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {FUNDING_PIPELINE_DATA.map((item, i) => {
              const colors = ["#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1"]
              const textColors = ["text-indigo-300", "text-indigo-400", "text-indigo-500", "text-indigo-600", "text-indigo-700"]
              return (
                <div key={item.stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors[i] }} />
                    <span className="text-[10px] text-muted-foreground">{item.stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-bold", textColors[i])}>{item.count} grants</span>
                    <span className="text-[10px] text-muted-foreground">${item.amount}M</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Active Clinical Trials */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Active Clinical Trials</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">IRB-approved protocols · ClinicalTrials.gov</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <ExternalLink className="w-3 h-3" /> ClinicalTrials.gov
            </Button>
            <Button size="sm" className="h-7 text-xs gap-1 bg-primary text-primary-foreground">
              <Plus className="w-3 h-3" /> Register Trial
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["NCT ID", "Trial Title", "Phase", "Site", "Enrollment", "Timeline", "Sponsor", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRIALS.map((trial, i) => {
                const config = TRIAL_STATUS_CONFIG[trial.status]
                const enrollPct = (trial.enrolled / trial.target) * 100
                return (
                  <tr
                    key={trial.id}
                    className={cn(
                      "border-b border-border last:border-0 hover:bg-muted/10 transition-colors cursor-pointer",
                      i % 2 === 0 ? "bg-white" : "bg-muted/5"
                    )}
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[10px] text-indigo-600 font-semibold hover:underline">
                        {trial.nctId}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 max-w-[260px]">
                      <p className="font-medium text-foreground line-clamp-2 leading-relaxed">{trial.title}</p>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        {trial.phase}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">{trial.site}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="font-medium text-foreground">{trial.enrolled}</span>
                          <span className="text-muted-foreground">/ {trial.target}</span>
                        </div>
                        <div className="w-20 h-1.5 bg-muted rounded-full">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${Math.min(enrollPct, 100)}%`,
                              backgroundColor: enrollPct >= 100 ? "#10b981" : enrollPct > 50 ? "#6366f1" : "#f59e0b",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{trial.startDate} – {trial.endDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">{trial.sponsor}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={cn(
                          "flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border w-fit",
                          config.color, config.bg
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot,
                          trial.status === "recruiting" ? "animate-pulse" : ""
                        )} />
                        {config.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publications strip */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Recent Publications</h3>
          <Button variant="outline" size="sm" className="h-7 text-xs">View All</Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              title: "Real-Time Behavioral Phenotyping in Pediatric ASD Using Multi-Camera Pose Estimation",
              journal: "Journal of Autism and Developmental Disorders",
              year: "2024",
              impact: "4.9",
              type: "Original Research",
              status: "Published",
              statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
            },
            {
              title: "Validation of Computer Vision-Based ADOS-2 Behavioral Markers Across Diverse Populations",
              journal: "Nature Digital Medicine",
              year: "2024",
              impact: "15.2",
              type: "Validation Study",
              status: "In Press",
              statusColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
            },
            {
              title: "Parent Perspectives on AI-Augmented Behavioral Therapy: A Mixed-Methods Study",
              journal: "Autism",
              year: "2025",
              impact: "6.0",
              type: "Qualitative",
              status: "Under Review",
              statusColor: "text-amber-700 bg-amber-50 border-amber-200",
            },
          ].map((pub) => (
            <div key={pub.title} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", pub.statusColor)}>
                  {pub.status}
                </span>
                <ExternalLink className="w-3 h-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs font-semibold text-foreground leading-relaxed line-clamp-3 mb-2">{pub.title}</p>
              <div className="space-y-1">
                <p className="text-[10px] text-primary font-medium">{pub.journal}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">{pub.year}</span>
                  <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
                    <TrendingUp className="w-2.5 h-2.5" /> IF {pub.impact}
                  </span>
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{pub.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
