"use client"

import React, { useEffect, useState } from "react"
import useAuthGuard from "@/hooks/useAuthGuard"
import useIsAdmin from "@/hooks/useIsAdmin"
import { listMyPapers, withdrawPaper, submitPaper, submitCameraReady, deletePaper } from "@/lib/papers"
import { listMyContributions } from "@/lib/contributions"
import { deleteContribution } from "@/lib/contributions"
import { downloadFile } from "@/lib/files"
import TopNav from "@/components/ui/top-nav"
import { getWelcomeName } from "@/lib/utils"
import { 
  FileText, 
  CheckCircle2, 
  FileEdit, 
  XCircle,
  DownloadCloud,
  Trash,
  Send,
  Upload,
  Archive,
  ArrowRight,
  Plus,
  Files,
  Component,
  Activity
} from "lucide-react"

// --- Custom Subcomponents to emulate Vercel/Linear vibes ---

function StatusPill({ status }: { status: string }) {
  const s = (status || "").toUpperCase()
  if (!s) return <span className="text-zinc-400">-</span>
  
  let layout = "bg-zinc-100 text-zinc-600 ring-zinc-200"
  let dot = "bg-zinc-400"
  
  if (s.includes('SUBMITTED') || s.includes('CAMERA')) {
    layout = "bg-emerald-50 text-emerald-700 ring-emerald-200/50"
    dot = "bg-emerald-500"
  } else if (s.includes('DRAFT')) {
    layout = "bg-amber-50 text-amber-700 ring-amber-200/50"
    dot = "bg-amber-500"
  } else if (s.includes('WITHDRAW')) {
    layout = "bg-rose-50 text-rose-700 ring-rose-200/50"
    dot = "bg-rose-500"
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset ${layout}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  )
}

function PremiumButton({ children, onClick, variant = "primary", className = "", title = "" }: any) {
  const base = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 px-3.5 gap-2"
  
  const variants = {
    primary: "bg-zinc-950 text-white hover:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(255,255,255,0.1)_inset] focus:ring-zinc-950",
    secondary: "bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200 shadow-sm focus:ring-zinc-200",
    ghost: "bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-200",
    danger_ghost: "bg-transparent text-zinc-500 hover:text-rose-600 hover:bg-rose-50 focus:ring-rose-200"
  }
  
  return (
    <button onClick={onClick} className={`${base} ${variants[variant as keyof typeof variants]} ${className}`} title={title}>
      {children}
    </button>
  )
}

function MetricCard({ title, value, icon: Icon, trend }: any) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-zinc-200/80 p-5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] group">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="text-[13px] font-medium text-zinc-500">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tighter text-zinc-950">{value}</span>
            {trend && <span className="text-[11px] font-medium text-zinc-400 leading-none">{trend}</span>}
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-950 group-hover:bg-zinc-100 transition-colors">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

// --- Main component ---

interface DashboardProps {
  user: string
  onNavigate: (view: "dashboard" | "paper" | "contribution") => void
  onLogout: () => void
}

export default function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  useAuthGuard()
  const [papers, setPapers] = useState<any[]>([])
  const [contribs, setContribs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const isAdmin = useIsAdmin()
  const userName = getWelcomeName(user) || "User"

  const load = async () => {
    setLoading(true)
    try {
      const [pRes, cRes] = await Promise.allSettled([
        listMyPapers(0, 20),
        listMyContributions(0, 20)
      ])
      if (pRes.status === 'fulfilled') setPapers(pRes.value)
      else setPapers([]) 
      if (cRes.status === 'fulfilled') setContribs(cRes.value)
      else setContribs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onWithdraw = async (id: number) => {
    if (!confirm("Are you sure you want to withdraw this paper?")) return
    await withdrawPaper(id)
    await load()
  }

  const onSubmit = async (id: number) => alert("You don't have permission to change status. Please contact the admin.")
  const onSubmitCR = async (id: number) => alert("You don't have permission to change status. Please contact the admin.")

  const total = papers.length
  const submitted = papers.filter(p => (p.status || '').toUpperCase().includes('SUBMITTED') && !(p.status || '').toUpperCase().includes('CAMERA')).length
  const drafts = papers.filter(p => (p.status || '').toUpperCase().includes('DRAFT')).length
  const withdrawn = papers.filter(p => (p.status || '').toUpperCase().includes('WITHDRAW')).length

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-zinc-200">
      <TopNav user={user} current={"dashboard" as any} onNavigate={onNavigate as any} onLogout={onLogout} />

      <main className="mx-auto max-w-[1100px] px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Subtle Background Mesh / Glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-100/40 to-transparent blur-[120px]" />
           <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-gradient-to-bl from-rose-50/40 to-transparent blur-[120px]" />
        </div>

        <div className="relative z-10 w-full">
          
          {/* Architectural Hero */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-zinc-200/60 shadow-sm text-[11px] font-medium text-zinc-600 mb-4 tracking-wide uppercase">
                <Activity className="h-3 w-3 text-emerald-500" />
                Active Session
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 mb-2">
                Overview
              </h1>
              <p className="text-[15px] text-zinc-500 leading-relaxed font-normal">
                Welcome back, {userName}. Manage your research submissions, track review statuses, and review your author contributions.
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <PremiumButton onClick={() => (onNavigate as any)("contribution")} variant="secondary">
                <Component className="h-4 w-4 text-zinc-400" />
                New Role
              </PremiumButton>
              <PremiumButton onClick={() => (onNavigate as any)("paper")}>
                <Plus className="h-4 w-4" />
                Submit Paper
              </PremiumButton>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <MetricCard title="Total Papers" value={total} icon={Files} trend="Lifetime" />
            <MetricCard title="Submitted" value={submitted} icon={CheckCircle2} trend="Under review" />
            <MetricCard title="Drafts" value={drafts} icon={FileEdit} trend="Requires action" />
            <MetricCard title="Withdrawn" value={withdrawn} icon={XCircle} trend="Archived" />
          </div>

          {/* Primary Data Section: Papers */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Submissions Hub</h2>
            </div>
            
            <div className="bg-white rounded-2xl border border-zinc-200/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] overflow-hidden relative">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                  <div className="h-5 w-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                  <p className="text-sm text-zinc-500 font-medium">Syncing data...</p>
                </div>
              ) : papers.length === 0 ? (
                <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-50/50 to-white">
                  <div className="relative w-16 h-16 mb-5">
                    <div className="absolute inset-0 bg-zinc-100 rounded-2xl rotate-3" />
                    <div className="absolute inset-0 bg-white border border-zinc-200 rounded-2xl -rotate-3 flex items-center justify-center shadow-sm">
                      <FileText className="h-6 w-6 text-zinc-400" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-semibold text-zinc-900 mb-1.5">No submissions yet</h3>
                  <p className="text-[13px] text-zinc-500 max-w-sm mb-6 leading-relaxed">
                    You haven't submitted any manuscripts. Create your first draft to begin the conference review process.
                  </p>
                  <PremiumButton onClick={() => (onNavigate as any)("paper")}>
                    Start Submission <ArrowRight className="h-3 w-3" />
                  </PremiumButton>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-zinc-200/60 bg-zinc-50/50">
                        <th className="px-5 py-3.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Manuscript</th>
                        <th className="px-5 py-3.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Track</th>
                        <th className="px-5 py-3.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Status</th>
                        <th className="px-5 py-3.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500 text-center">Authors</th>
                        <th className="px-5 py-3.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500 text-center">Assets</th>
                        <th className="px-5 py-3.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500 text-right">Configure</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {papers.map((p) => (
                        <tr key={p.id} className="group hover:bg-zinc-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-medium text-zinc-900 max-w-[280px] truncate" title={p.title}>{p.title}</div>
                            <div className="text-[11px] text-zinc-400 mt-0.5">ID: {p.id.toString().padStart(4, '0')}</div>
                          </td>
                          <td className="px-5 py-4 text-zinc-600 text-[13px]">
                            {p.paperType || <span className="text-zinc-300">-</span>}
                          </td>
                          <td className="px-5 py-4">
                            <StatusPill status={p.status} />
                          </td>
                          <td className="px-5 py-4 text-center">
                            <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-[11px] font-medium">
                              {Array.isArray(p.coAuthors) ? p.coAuthors.length : (typeof p.coAuthorCount === 'number' ? p.coAuthorCount : <span className="text-zinc-400 opacity-50">-</span>)}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {p.fileId ? (
                                <button onClick={() => downloadFile(p.fileId)} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 text-zinc-600 hover:text-zinc-900 text-xs font-medium transition-colors" title="Original PDF">
                                  <DownloadCloud className="h-3 w-3" /> PDF
                                </button>
                              ) : (
                                <span className="w-12 h-6 flex items-center justify-center text-zinc-300">-</span>
                              )}
                              
                              {p.cameraReadyFileId && (
                                <button onClick={() => downloadFile(p.cameraReadyFileId)} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50/50 hover:bg-blue-50 border border-blue-100 text-blue-700 hover:text-blue-800 text-xs font-medium transition-colors" title="Camera Ready PDF">
                                  <DownloadCloud className="h-3 w-3" /> CR
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <PremiumButton variant="ghost" className="h-8 w-8 !p-0" onClick={() => onSubmit(p.id)} title="Submit Final">
                                <Send className="h-3.5 w-3.5" />
                              </PremiumButton>
                              <PremiumButton variant="ghost" className="h-8 w-8 !p-0" onClick={() => onSubmitCR(p.id)} title="Submit Camera-Ready">
                                <Upload className="h-3.5 w-3.5" />
                              </PremiumButton>
                              <PremiumButton variant="ghost" className="h-8 w-8 !p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-50" onClick={() => onWithdraw(p.id)} title="Withdraw">
                                <Archive className="h-3.5 w-3.5" />
                              </PremiumButton>
                              <PremiumButton variant="danger_ghost" className="h-8 w-8 !p-0" 
                                onClick={async () => {
                                  if (!confirm('Permanently delete this paper? This action is irreversible.')) return
                                  await deletePaper(p.id).catch(()=>alert('Failed to delete.'))
                                  await load()
                                }} 
                                title="Delete"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </PremiumButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Data Section: Contributions */}
          <div className="mb-10">
             <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Contributions & Roles</h2>
            </div>
            
            <div className="bg-white rounded-2xl border border-zinc-200/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
              {loading ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                </div>
              ) : contribs.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center text-center bg-zinc-50/30">
                  <div className="h-10 w-10 bg-white border border-zinc-100 rounded-xl flex items-center justify-center shadow-sm mb-3">
                    <Component className="h-4 w-4 text-zinc-300" strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-1">No registered roles</h3>
                  <p className="text-xs text-zinc-500 mb-4">You have not registered as a reviewer or organizer.</p>
                  <PremiumButton variant="secondary" onClick={() => (onNavigate as any)("contribution")} className="h-8 text-xs">
                    Apply for Role
                  </PremiumButton>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-zinc-200/60 bg-zinc-50/50">
                        <th className="px-5 py-3.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Contribution Context</th>
                        <th className="px-5 py-3.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500">Assigned Roles</th>
                        <th className="px-5 py-3.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {contribs.map((c) => (
                        <tr key={c.id} className="group hover:bg-zinc-50/50 transition-colors">
                          <td className="px-5 py-4 font-medium text-zinc-900">{c.title}</td>
                          <td className="px-5 py-4 text-zinc-600">
                            {Array.isArray(c.roles) ? (
                              <div className="flex gap-1.5 flex-wrap">
                                {c.roles.map(role => (
                                  <span key={role} className="inline-flex items-center px-2 py-0.5 rounded-[5px] text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/60 shadow-sm">
                                    {role}
                                  </span>
                                ))}
                              </div>
                            ) : <span className="text-zinc-300">-</span>}
                          </td>
                          <td className="px-5 py-4 text-right">
                             <PremiumButton variant="danger_ghost" className="h-8 w-8 !p-0 opacity-0 group-hover:opacity-100" 
                                onClick={async () => {
                                  if (!confirm('Revoke this role?')) return
                                  await deleteContribution(c.id).catch(()=>alert('Failed.'))
                                  await load()
                                }} 
                                title="Remove Role"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </PremiumButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}