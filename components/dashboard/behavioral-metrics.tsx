"use client"

import { cn } from "@/lib/utils"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts"
import { TrendingUp, TrendingDown, Minus, Info, MoreHorizontal, ArrowUpRight } from "lucide-react"

const RADAR_DATA = [
  { metric: "Joint\nAttention", current: 72, baseline: 48, fullMark: 100 },
  { metric: "Social\nInitiation", current: 65, baseline: 40, fullMark: 100 },
  { metric: "Vocalization", current: 58, baseline: 35, fullMark: 100 },
  { metric: "Motor\nRegulation", current: 81, baseline: 62, fullMark: 100 },
  { metric: "Affect\nRegulation", current: 53, baseline: 44, fullMark: 100 },
  { metric: "Imitation", current: 78, baseline: 55, fullMark: 100 },
]

const SESSION_TREND = [
  { session: "S1", score: 41 },
  { session: "S2", score: 44 },
  { session: "S3", score: 48 },
  { session: "S4", score: 51 },
  { session: "S5", score: 55 },
  { session: "S6", score: 58 },
  { session: "S7", score: 60 },
  { session: "S8", score: 57 },
  { session: "S9", score: 63 },
  { session: "S10", score: 66 },
  { session: "S11", score: 70 },
  { session: "S12", score: 68 },
  { session: "S13", score: 71 },
  { session: "S14", score: 74 },
]

const BEHAVIOR_FREQUENCY = [
  { week: "W1", eyeContact: 12, handFlap: 18, vocal: 8 },
  { week: "W2", eyeContact: 15, handFlap: 16, vocal: 10 },
  { week: "W3", eyeContact: 18, handFlap: 14, vocal: 13 },
  { week: "W4", eyeContact: 22, handFlap: 11, vocal: 16 },
  { week: "W5", eyeContact: 25, handFlap: 10, vocal: 19 },
  { week: "W6", eyeContact: 28, handFlap: 8, vocal: 22 },
]

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  change?: number
  changeLabel?: string
  sublabel?: string
  color?: string
  large?: boolean
}

function MetricCard({ label, value, unit, change, changeLabel, sublabel, color = "bg-primary", large }: MetricCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  return (
    <div className="bg-white rounded-xl border border-border p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <button className="p-1 rounded hover:bg-muted transition-colors">
          <Info className="w-3 h-3 text-muted-foreground/60" />
        </button>
      </div>
      <div className="flex items-end gap-1.5">
        <span className={cn("font-bold text-foreground", large ? "text-4xl" : "text-2xl")}>{value}</span>
        {unit && <span className="text-sm text-muted-foreground mb-0.5">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1">
          <TrendIcon
            className={cn(
              "w-3 h-3",
              isPositive ? "text-emerald-500" : isNegative ? "text-red-500" : "text-muted-foreground"
            )}
          />
          <span
            className={cn(
              "text-xs font-semibold",
              isPositive ? "text-emerald-600" : isNegative ? "text-red-600" : "text-muted-foreground"
            )}
          >
            {isPositive ? "+" : ""}{change}%
          </span>
          {changeLabel && <span className="text-[10px] text-muted-foreground">{changeLabel}</span>}
        </div>
      )}
      {sublabel && <p className="text-[10px] text-muted-foreground">{sublabel}</p>}
    </div>
  )
}

// Risk Score Gauge
function RiskGauge({ score }: { score: number }) {
  const angle = -135 + (score / 100) * 270
  const getColor = (s: number) => s < 30 ? "#10b981" : s < 60 ? "#f59e0b" : "#ef4444"
  const getRisk = (s: number) => s < 30 ? "Low Risk" : s < 60 ? "Moderate Risk" : "High Risk"
  const color = getColor(score)

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Behavioral Risk Score</span>
        <button className="p-1 rounded hover:bg-muted transition-colors">
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground/60" />
        </button>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-24 overflow-hidden">
          {/* Gauge arc background */}
          <svg viewBox="0 0 100 55" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Green zone */}
            <path
              d="M 10 50 A 40 40 0 0 1 37 16"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Yellow zone */}
            <path
              d="M 37 16 A 40 40 0 0 1 63 16"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Red zone */}
            <path
              d="M 63 16 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.3"
            />

            {/* Needle */}
            <g transform={`translate(50, 50) rotate(${angle})`}>
              <line x1="0" y1="0" x2="0" y2="-32" stroke={color} strokeWidth="2" strokeLinecap="round" />
              <circle cx="0" cy="0" r="3" fill={color} />
            </g>

            {/* Center cap */}
            <circle cx="50" cy="50" r="4" fill="white" stroke="#e2e8f0" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="text-center -mt-2">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
        <span
          className="mt-1 text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            color,
            backgroundColor: color + "18",
            border: `1px solid ${color}40`,
          }}
        >
          {getRisk(score)}
        </span>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Composite score across 6 behavioral domains
        </p>

        {/* Sub-scores */}
        <div className="w-full mt-3 space-y-1.5">
          {[
            { label: "Repetitive Behaviors", value: 62, color: "#f59e0b" },
            { label: "Social Communication", value: 38, color: "#10b981" },
            { label: "Sensory Sensitivity", value: 55, color: "#f59e0b" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-36 shrink-0">{item.label}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="text-[10px] font-semibold w-6 text-right" style={{ color: item.color }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Custom radar tooltip
function CustomRadarTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg px-3 py-2">
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.name === "current" ? "#6366f1" : "#0d9488" }} />
          <span className="capitalize text-muted-foreground">{p.name}:</span>
          <span className="font-bold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function BehavioralMetrics() {
  return (
    <div className="flex flex-col gap-4">
      {/* Top KPI row */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          label="Overall Engagement"
          value={74}
          unit="/100"
          change={8}
          changeLabel="vs last session"
        />
        <MetricCard
          label="Eye Contact Events"
          value={12}
          unit="events"
          change={33}
          changeLabel="vs S13"
        />
        <MetricCard
          label="Repetitive Behaviors"
          value={7}
          unit="events"
          change={-22}
          changeLabel="vs S13"
        />
        <MetricCard
          label="Verbal Utterances"
          value={19}
          unit="total"
          change={18}
          changeLabel="vs S13"
        />
      </div>

      {/* Main charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Radar Chart */}
        <div className="col-span-1 bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Core Engagement Profile</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Session 14 vs baseline</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-0.5 bg-indigo-500 rounded" />
                <span className="text-[10px] text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-0.5 bg-teal-500 rounded border-dashed" />
                <span className="text-[10px] text-muted-foreground">Baseline</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "Inter" }}
              />
              <Radar
                name="baseline"
                dataKey="baseline"
                stroke="#0d9488"
                fill="#0d9488"
                fillOpacity={0.08}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <Radar
                name="current"
                dataKey="current"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Tooltip content={<CustomRadarTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Session Progress Trend */}
        <div className="col-span-1 bg-white rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Engagement Trend</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Sessions 1–14 · composite score</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
              <ArrowUpRight className="w-3 h-3" />
              +80% overall
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={SESSION_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="session"
                tick={{ fill: "#94a3b8", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                domain={[30, 90]}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  fontSize: 11,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#engagementGrad)"
                dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 4, fill: "#6366f1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Score Gauge */}
        <div className="col-span-1">
          <RiskGauge score={42} />
        </div>
      </div>

      {/* Behavior Frequency Chart */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Weekly Behavior Frequency</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Tracked behaviors per session week · rolling 6 weeks</p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: "Eye Contact", color: "#6366f1" },
              { label: "Hand Flapping", color: "#f59e0b" },
              { label: "Vocalizations", color: "#0d9488" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color + "33", border: `1.5px solid ${item.color}` }} />
                <span className="text-[10px] text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={BEHAVIOR_FREQUENCY} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 11,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Line type="monotone" dataKey="eyeContact" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: "#6366f1" }} name="Eye Contact" />
            <Line type="monotone" dataKey="handFlap" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} name="Hand Flapping" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="vocal" stroke="#0d9488" strokeWidth={2} dot={{ r: 3, fill: "#0d9488" }} name="Vocalizations" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Domain scores table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Domain Assessment Scores</h3>
          <span className="text-[10px] text-muted-foreground">ADOS-2 · Vineland III · VABS</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Domain", "Instrument", "Score", "Percentile", "Classification", "Change"].map((h) => (
                <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { domain: "Social Communication", instrument: "ADOS-2", score: 72, pct: 38, class: "Moderate", change: +4, classColor: "text-amber-700 bg-amber-50" },
              { domain: "Restricted/Repetitive", instrument: "ADOS-2", score: 58, pct: 22, class: "Moderate-Severe", change: -6, classColor: "text-red-700 bg-red-50" },
              { domain: "Adaptive Behavior", instrument: "Vineland III", score: 81, pct: 52, class: "Adequate", change: +8, classColor: "text-emerald-700 bg-emerald-50" },
              { domain: "Daily Living Skills", instrument: "VABS", score: 76, pct: 44, class: "Moderately Low", change: +3, classColor: "text-amber-700 bg-amber-50" },
              { domain: "Motor Development", instrument: "Bayley-4", score: 88, pct: 68, class: "Average", change: +5, classColor: "text-emerald-700 bg-emerald-50" },
            ].map((row, i) => (
              <tr key={row.domain} className={cn("border-b border-border last:border-0", i % 2 === 0 ? "bg-white" : "bg-muted/10")}>
                <td className="px-5 py-3 font-medium text-foreground">{row.domain}</td>
                <td className="px-5 py-3 font-mono text-[10px] text-muted-foreground">{row.instrument}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{row.score}</span>
                    <div className="w-16 h-1.5 bg-muted rounded-full">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{row.pct}th</td>
                <td className="px-5 py-3">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", row.classColor)}>
                    {row.class}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={cn("flex items-center gap-0.5 font-semibold", row.change > 0 ? "text-emerald-600" : "text-red-600")}>
                    {row.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {row.change > 0 ? "+" : ""}{row.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
