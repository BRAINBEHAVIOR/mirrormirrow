"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Download,
  Share2,
  Eye,
  Cpu,
  Layers,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Info,
  Zap,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

type EventSeverity = "info" | "warning" | "positive" | "critical"

interface DetectedEvent {
  id: string
  timestamp: string
  timestampSec: number
  label: string
  category: string
  severity: EventSeverity
  confidence: number
  description: string
}

const EVENTS: DetectedEvent[] = [
  {
    id: "e1",
    timestamp: "00:42",
    timestampSec: 42,
    label: "Eye Contact Initiated",
    category: "Social",
    severity: "positive",
    confidence: 94,
    description: "Subject established sustained gaze with therapist for 2.3s",
  },
  {
    id: "e2",
    timestamp: "01:15",
    timestampSec: 75,
    label: "Verbal Vocalization",
    category: "Language",
    severity: "positive",
    confidence: 88,
    description: "Single-word approximation detected: 'baw' (ball)",
  },
  {
    id: "e3",
    timestamp: "02:03",
    timestampSec: 123,
    label: "Hand Flapping",
    category: "Repetitive",
    severity: "warning",
    confidence: 97,
    description: "Bilateral hand flapping, 3.1Hz, duration 4.2s — moderate intensity",
  },
  {
    id: "e4",
    timestamp: "02:47",
    timestampSec: 167,
    label: "Joint Attention",
    category: "Social",
    severity: "positive",
    confidence: 91,
    description: "Shared reference to toy car; gaze-follow response observed",
  },
  {
    id: "e5",
    timestamp: "03:31",
    timestampSec: 211,
    label: "Self-Stimulatory Behavior",
    category: "Repetitive",
    severity: "warning",
    confidence: 85,
    description: "Rocking motion detected, 0.8Hz, 6s duration",
  },
  {
    id: "e6",
    timestamp: "04:10",
    timestampSec: 250,
    label: "Emotional Dysregulation",
    category: "Affect",
    severity: "critical",
    confidence: 89,
    description: "Elevated arousal state — raised vocal pitch, increased motor activity",
  },
  {
    id: "e7",
    timestamp: "05:02",
    timestampSec: 302,
    label: "Social Initiation",
    category: "Social",
    severity: "positive",
    confidence: 92,
    description: "Child reached for therapist hand; social bids observed",
  },
  {
    id: "e8",
    timestamp: "05:55",
    timestampSec: 355,
    label: "Motor Regulation",
    category: "Motor",
    severity: "info",
    confidence: 79,
    description: "Gross motor activity within expected range for age",
  },
  {
    id: "e9",
    timestamp: "06:33",
    timestampSec: 393,
    label: "Imitation Response",
    category: "Language",
    severity: "positive",
    confidence: 93,
    description: "Successful action imitation: clapping sequence replicated",
  },
]

const SEVERITY_CONFIG: Record<EventSeverity, { color: string; bg: string; icon: React.ElementType; dot: string }> = {
  positive: { color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2, dot: "bg-emerald-500" },
  warning: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: AlertCircle, dot: "bg-amber-500" },
  critical: { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertCircle, dot: "bg-red-500" },
  info: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Info, dot: "bg-blue-400" },
}

// CSS-drawn skeleton tracking dots positions (relative to a 16:9 video frame)
const SKELETON_JOINTS = [
  { id: "head", top: "16%", left: "48%", size: 7 },
  { id: "neck", top: "22%", left: "48.5%", size: 5 },
  { id: "l-shoulder", top: "27%", left: "40%", size: 5 },
  { id: "r-shoulder", top: "27%", left: "57%", size: 5 },
  { id: "l-elbow", top: "37%", left: "35%", size: 5 },
  { id: "r-elbow", top: "37%", left: "62%", size: 5 },
  { id: "l-wrist", top: "48%", left: "30%", size: 5 },
  { id: "r-wrist", top: "47%", left: "66%", size: 5 },
  { id: "torso", top: "33%", left: "49%", size: 5 },
  { id: "hip-c", top: "45%", left: "48.5%", size: 5 },
  { id: "l-hip", top: "46%", left: "43%", size: 5 },
  { id: "r-hip", top: "46%", left: "54%", size: 5 },
  { id: "l-knee", top: "59%", left: "42%", size: 5 },
  { id: "r-knee", top: "59%", left: "55%", size: 5 },
  { id: "l-ankle", top: "71%", left: "41%", size: 5 },
  { id: "r-ankle", top: "71%", left: "56%", size: 5 },
]

const SKELETON_BONES = [
  ["head", "neck"],
  ["neck", "l-shoulder"],
  ["neck", "r-shoulder"],
  ["l-shoulder", "l-elbow"],
  ["r-shoulder", "r-elbow"],
  ["l-elbow", "l-wrist"],
  ["r-elbow", "r-wrist"],
  ["neck", "torso"],
  ["torso", "hip-c"],
  ["hip-c", "l-hip"],
  ["hip-c", "r-hip"],
  ["l-hip", "l-knee"],
  ["r-hip", "r-knee"],
  ["l-knee", "l-ankle"],
  ["r-knee", "r-ankle"],
]

function getJointPos(id: string) {
  return SKELETON_JOINTS.find((j) => j.id === id)
}

export function SessionAnalysis() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState([75])
  const [showOverlay, setShowOverlay] = useState(true)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const SESSION_DURATION = 480 // 8 minutes in seconds

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= SESSION_DURATION) {
            setIsPlaying(false)
            return SESSION_DURATION
          }
          return t + 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  const progress = (currentTime / SESSION_DURATION) * 100

  const visibleEvents = EVENTS.filter((e) => e.timestampSec <= currentTime + 30)
  const filteredEvents = activeFilter === "all"
    ? visibleEvents
    : visibleEvents.filter((e) => e.severity === activeFilter)

  const latestEvent = visibleEvents[visibleEvents.length - 1]

  const categories = ["all", "positive", "warning", "critical", "info"]

  return (
    <div className="flex gap-4 h-full min-h-0">
      {/* Left: Video + Controls */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Session header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">Session Recording</h2>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                LIVE AI ANALYSIS
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Patient #ASD-2024-0047 · Marcus T., Age 4 · Therapist: Dr. Keiko Tanaka · ABA Session 14
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
              <Download className="w-3 h-3" /> Export
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
              <Share2 className="w-3 h-3" /> Share
            </Button>
            <Button size="sm" className="h-7 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Zap className="w-3 h-3" /> Generate Report
            </Button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative bg-[#0d1117] rounded-xl overflow-hidden aspect-video w-full border border-[oklch(0.3_0.02_240)]">
          {/* Simulated therapy room background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2234] via-[#141c2e] to-[#0d1117]">
            {/* Room elements */}
            <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-[#1e2a3a]" />
            <div className="absolute bottom-[34%] left-[10%] w-[80%] h-[2px] bg-[oklch(0.3_0.02_240)]" />
            {/* Table */}
            <div className="absolute bottom-[20%] left-[25%] w-[50%] h-[12%] bg-[#2a3a50] rounded-sm border border-[oklch(0.3_0.02_240)]" />
            {/* Toys on table */}
            <div className="absolute bottom-[32%] left-[35%] w-6 h-4 bg-[#e74c3c] rounded-sm opacity-70" />
            <div className="absolute bottom-[32%] left-[45%] w-5 h-5 bg-[#3498db] rounded-full opacity-70" />
            <div className="absolute bottom-[32%] left-[53%] w-7 h-4 bg-[#2ecc71] rounded-sm opacity-70" />
            {/* Chair */}
            <div className="absolute bottom-[20%] left-[15%] w-[12%] h-[18%] bg-[#263545] rounded border border-[oklch(0.3_0.02_240)]" />
            <div className="absolute bottom-[20%] right-[15%] w-[12%] h-[18%] bg-[#263545] rounded border border-[oklch(0.3_0.02_240)]" />

            {/* Child figure (abstract CSS silhouette) */}
            <div className="absolute bottom-[34%] left-[43%]">
              {/* Body */}
              <div className="relative">
                <div className="w-10 h-[56px] bg-[#4a6fa5] rounded-t-sm" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#f5c9a0] rounded-full border-2 border-[#e8b888]" />
              </div>
            </div>

            {/* Therapist figure */}
            <div className="absolute bottom-[34%] right-[28%]">
              <div className="relative">
                <div className="w-10 h-[64px] bg-[#2c5f3f] rounded-t-sm" />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-9 h-9 bg-[#c8956a] rounded-full border-2 border-[#b8804a]" />
              </div>
            </div>
          </div>

          {/* AI Bounding Boxes */}
          {showOverlay && (
            <>
              {/* Child bounding box */}
              <div
                className="bounding-box absolute border-2 border-indigo-400 rounded-sm pointer-events-none"
                style={{
                  top: "12%",
                  left: "40%",
                  width: "20%",
                  height: "68%",
                }}
              >
                <div className="absolute -top-5 left-0 flex items-center gap-1 bg-indigo-500/90 px-1.5 py-0.5 rounded text-[9px] text-white font-bold whitespace-nowrap">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  CHILD · P#0047 · conf 97%
                </div>
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-indigo-400" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-indigo-400" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-indigo-400" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-indigo-400" />
              </div>

              {/* Therapist bounding box */}
              <div
                className="absolute border-2 border-teal-400/80 rounded-sm pointer-events-none"
                style={{
                  top: "10%",
                  left: "63%",
                  width: "22%",
                  height: "72%",
                }}
              >
                <div className="absolute -top-5 left-0 flex items-center gap-1 bg-teal-500/90 px-1.5 py-0.5 rounded text-[9px] text-white font-bold whitespace-nowrap">
                  THERAPIST · Staff · conf 99%
                </div>
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-teal-400" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-teal-400" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-teal-400" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-teal-400" />
              </div>

              {/* Object detection boxes */}
              <div
                className="absolute border border-amber-400/60 rounded-sm pointer-events-none"
                style={{ bottom: "22%", left: "33%", width: "5%", height: "8%" }}
              >
                <div className="absolute -top-4 left-0 bg-amber-500/80 px-1 py-0.5 rounded text-[8px] text-white font-bold whitespace-nowrap">
                  toy · 0.91
                </div>
              </div>
              <div
                className="absolute border border-amber-400/60 rounded-sm pointer-events-none"
                style={{ bottom: "22%", left: "43%", width: "4.5%", height: "8%" }}
              >
                <div className="absolute -top-4 left-0 bg-amber-500/80 px-1 py-0.5 rounded text-[8px] text-white font-bold whitespace-nowrap">
                  ball · 0.88
                </div>
              </div>
            </>
          )}

          {/* Skeleton Tracking */}
          {showSkeleton && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Skeleton bones */}
              {SKELETON_BONES.map(([a, b]) => {
                const ja = getJointPos(a)
                const jb = getJointPos(b)
                if (!ja || !jb) return null
                const ax = parseFloat(ja.left)
                const ay = parseFloat(ja.top)
                const bx = parseFloat(jb.left)
                const by = parseFloat(jb.top)
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={ax}
                    y1={ay}
                    x2={bx}
                    y2={by}
                    stroke="rgba(99,102,241,0.5)"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                  />
                )
              })}
            </svg>
          )}

          {/* Skeleton dots */}
          {showSkeleton &&
            SKELETON_JOINTS.map((joint) => (
              <div
                key={joint.id}
                className="skeleton-dot absolute rounded-full bg-indigo-400 border border-indigo-200"
                style={{
                  top: joint.top,
                  left: joint.left,
                  width: joint.size,
                  height: joint.size,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${Math.random() * 0.8}s`,
                  boxShadow: "0 0 4px rgba(99,102,241,0.6)",
                }}
              />
            ))}

          {/* Scan line */}
          <div className="scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent pointer-events-none" />

          {/* Live detection overlay — current event */}
          {latestEvent && isPlaying && (
            <div className="absolute top-3 right-3 max-w-[220px]">
              <div className="bg-[#0d1117]/90 backdrop-blur-sm border border-indigo-500/40 rounded-lg px-3 py-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                  <span className="text-[9px] text-indigo-300 font-bold tracking-wider uppercase">Detected Event</span>
                </div>
                <p className="text-[11px] text-white font-semibold">{latestEvent.label}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{latestEvent.description}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex-1 h-1 bg-slate-700 rounded-full">
                    <div
                      className="h-1 bg-indigo-400 rounded-full"
                      style={{ width: `${latestEvent.confidence}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400">{latestEvent.confidence}%</span>
                </div>
              </div>
            </div>
          )}

          {/* AI model info */}
          <div className="absolute bottom-12 left-3 flex items-center gap-1 bg-[#0d1117]/80 backdrop-blur-sm border border-slate-700/60 rounded px-2 py-1">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span className="text-[9px] text-slate-300 font-mono">MirrorAI v3.1 · YOLO-Pose · BehaviorNet-XL</span>
          </div>

          {/* Overlay toggle controls */}
          <div className="absolute bottom-12 right-3 flex items-center gap-1.5">
            <button
              onClick={() => setShowOverlay((v) => !v)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold transition-all",
                showOverlay
                  ? "bg-indigo-500/80 text-white"
                  : "bg-[#0d1117]/70 text-slate-400 border border-slate-700"
              )}
            >
              <Layers className="w-3 h-3" /> BBOX
            </button>
            <button
              onClick={() => setShowSkeleton((v) => !v)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold transition-all",
                showSkeleton
                  ? "bg-indigo-500/80 text-white"
                  : "bg-[#0d1117]/70 text-slate-400 border border-slate-700"
              )}
            >
              <Eye className="w-3 h-3" /> SKEL
            </button>
          </div>

          {/* Playback Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d1117] to-transparent px-4 pt-6 pb-3">
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-slate-400 font-mono w-10 text-right">{formatTime(currentTime)}</span>
              <div className="flex-1 relative h-1 bg-slate-700 rounded-full cursor-pointer group">
                <div
                  className="absolute left-0 top-0 h-full bg-indigo-400 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
                {/* Event markers */}
                {EVENTS.map((e) => (
                  <div
                    key={e.id}
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-1.5 rounded-full cursor-pointer"
                    style={{
                      left: `${(e.timestampSec / SESSION_DURATION) * 100}%`,
                      backgroundColor:
                        e.severity === "positive" ? "#10b981" :
                        e.severity === "warning" ? "#f59e0b" :
                        e.severity === "critical" ? "#ef4444" : "#60a5fa",
                    }}
                    title={e.label}
                  />
                ))}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md border-2 border-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono w-10">{formatTime(SESSION_DURATION)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentTime((t) => Math.max(0, t - 15))}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="p-2 bg-white rounded-full text-slate-900 hover:bg-slate-200 transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setCurrentTime((t) => Math.min(SESSION_DURATION, t + 15))}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 ml-1">
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <div className="w-16">
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="h-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 ml-1">
                <button className="px-2 py-0.5 text-[9px] font-bold text-slate-400 hover:text-white border border-slate-700 rounded transition-colors">
                  1x
                </button>
                <button className="px-2 py-0.5 text-[9px] font-bold text-slate-400 hover:text-white border border-slate-700 rounded transition-colors">
                  2x
                </button>
              </div>

              <div className="ml-auto flex items-center gap-1">
                <button className="p-1.5 text-slate-400 hover:text-white transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Session metadata bar */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Session Duration", value: "08:00", sub: "ABA Protocol" },
            { label: "Events Detected", value: String(visibleEvents.length), sub: `of ${EVENTS.length} total` },
            { label: "Avg. Confidence", value: "90.1%", sub: "Model certainty" },
            { label: "Engagement Score", value: "74", sub: "+8 vs last session" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-border px-4 py-3">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: AI Events Timeline */}
      <div className="w-72 shrink-0 flex flex-col gap-3">
        <div className="bg-white rounded-xl border border-border flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Detected Events</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {visibleEvents.length} event{visibleEvents.length !== 1 ? "s" : ""} · real-time
              </p>
            </div>
            <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Filters */}
          <div className="px-4 py-2.5 border-b border-border flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3 h-3 text-muted-foreground shrink-0" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveFilter(c)}
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize transition-all",
                  activeFilter === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-border"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="w-8 h-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {isPlaying ? "Awaiting events…" : "Press play to begin analysis"}
                </p>
              </div>
            ) : (
              [...filteredEvents].reverse().map((event, i) => {
                const config = SEVERITY_CONFIG[event.severity]
                const Icon = config.icon
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "event-item relative flex gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm",
                      config.bg
                    )}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {/* Timeline line */}
                    {i < filteredEvents.length - 1 && (
                      <div className="absolute left-[23px] top-[calc(100%+0px)] w-0.5 h-2.5 bg-border" />
                    )}

                    <div className={cn("flex-shrink-0 mt-0.5", config.color)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={cn("text-[11px] font-semibold truncate", config.color)}>
                          {event.label}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", config.bg, config.color)}>
                          {event.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-0.5 bg-white/60 rounded-full">
                            <div
                              className={cn("h-0.5 rounded-full", config.dot)}
                              style={{ width: `${event.confidence}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-muted-foreground">{event.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0 self-start mt-0.5" />
                  </div>
                )
              })
            )}
          </div>

          {/* Footer summary */}
          <div className="border-t border-border px-4 py-3 bg-muted/40">
            <div className="grid grid-cols-3 gap-1 text-center">
              {[
                { label: "Positive", count: visibleEvents.filter((e) => e.severity === "positive").length, color: "text-emerald-600" },
                { label: "Warning", count: visibleEvents.filter((e) => e.severity === "warning").length, color: "text-amber-600" },
                { label: "Critical", count: visibleEvents.filter((e) => e.severity === "critical").length, color: "text-red-600" },
              ].map((s) => (
                <div key={s.label}>
                  <p className={cn("text-sm font-bold", s.color)}>{s.count}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
