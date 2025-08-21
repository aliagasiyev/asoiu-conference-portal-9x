"use client"

import React, { useEffect, useState } from "react"
import useAuthGuard from "@/hooks/useAuthGuard"
import useIsAdmin from "@/hooks/useIsAdmin"
import { listMyPapers, withdrawPaper, submitPaper, submitCameraReady, deletePaper } from "@/lib/papers"
import { listMyContributions } from "@/lib/contributions"
import { deleteContribution } from "@/lib/contributions"
import { downloadFile } from "@/lib/files"
import api from "@/lib/http"
import StatusBadge from "@/components/status-badge"
import TopNav from "@/components/ui/top-nav"

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

  const load = async () => {
    setLoading(true)
    try {
      const [p, c] = await Promise.all([listMyPapers(0, 20), listMyContributions(0, 20)])
      setPapers(p)
      setContribs(c)
    } catch {
      alert("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onWithdraw = async (id: number) => {
    if (!confirm("Withdraw this paper?")) return
    await withdrawPaper(id)
    await load()
  }

  const onSubmit = async (id: number) => {
    await submitPaper(id).catch(() => alert("Submission failed (check settings and required fields)."))
    await load()
  }

  const onSubmitCR = async (id: number) => {
    await submitCameraReady(id).catch(() => alert("Camera-ready submission failed."))
    await load()
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <TopNav user={user} current={"dashboard" as any} onNavigate={onNavigate as any} onLogout={onLogout} />

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-xl font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">MY HOME</h1>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {(() => {
                const total = papers.length
                const submitted = papers.filter(p => (p.status || '').toUpperCase().includes('SUBMITTED') && !(p.status || '').toUpperCase().includes('CAMERA')).length
                const drafts = papers.filter(p => (p.status || '').toUpperCase().includes('DRAFT')).length
                const withdrawn = papers.filter(p => (p.status || '').toUpperCase().includes('WITHDRAW')).length
                return (
                  <>
                    <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                      <div className="text-xs text-gray-600">Total Papers</div>
                      <div className="text-lg font-semibold">{total}</div>
                    </div>
                    <div className="rounded-lg border border-green-200 p-3 bg-green-50">
                      <div className="text-xs text-green-700">Submitted</div>
                      <div className="text-lg font-semibold text-green-800">{submitted}</div>
                    </div>
                    <div className="rounded-lg border border-amber-200 p-3 bg-amber-50">
                      <div className="text-xs text-amber-700">Drafts</div>
                      <div className="text-lg font-semibold text-amber-800">{drafts}</div>
                    </div>
                    <div className="rounded-lg border border-red-200 p-3 bg-red-50">
                      <div className="text-xs text-red-700">Withdrawn</div>
                      <div className="text-lg font-semibold text-red-800">{withdrawn}</div>
                    </div>
                  </>
                )
              })()}
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-medium text-orange-600 mb-4">Submitted Papers:</h2>
              {loading ? (
                  <div className="text-gray-500">Loading...</div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                      <tr className="bg-gray-600 text-white">
                        <th className="border border-gray-400 px-4 py-2 text-left">No</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Paper Title</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Type</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Co-authors</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Docs</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {papers.length === 0 ? (
                          <tr>
                            <td className="border border-gray-400 px-4 py-2" colSpan={6}>
                              <em className="text-gray-500">No papers submitted yet</em>
                            </td>
                          </tr>
                      ) : papers.map((p, idx) => (
                          <tr key={p.id} className="odd:bg-gray-50 hover:bg-green-50">
                            <td className="border border-gray-400 px-4 py-2">{idx + 1}</td>
                            <td className="border border-gray-400 px-4 py-2">{p.title}</td>
                            <td className="border border-gray-400 px-4 py-2">{p.paperType || "-"}</td>
                            <td className="border border-gray-400 px-4 py-2"><StatusBadge status={p.status} /></td>
                            <td className="border border-gray-400 px-4 py-2">{Array.isArray(p.coAuthors) ? p.coAuthors.length : (typeof p.coAuthorCount === 'number' ? p.coAuthorCount : "-")}</td>
                            <td className="border border-gray-400 px-4 py-2 space-x-2">
                              {p.fileId && (
                                  <button className="underline text-blue-600" onClick={() => downloadFile(p.fileId)}>
                                    PDF
                                  </button>
                              )}
                              {p.cameraReadyFileId && (
                                  <button className="underline text-blue-600" onClick={() => downloadFile(p.cameraReadyFileId)}>
                                    Camera-Ready
                                  </button>
                              )}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  className="px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                                  onClick={() => onSubmit(p.id)}
                                >
                                  Submit
                                </button>
                                <button
                                  className="px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                  onClick={() => onSubmitCR(p.id)}
                                >
                                  Submit CR
                                </button>
                                <button
                                  className="px-2 py-1 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
                                  onClick={() => onWithdraw(p.id)}
                                >
                                  Withdraw
                                </button>
                                <button
                                  className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                                  onClick={async () => {
                                if (!confirm('Permanently delete this paper? This cannot be undone.')) return
                                await deletePaper(p.id).catch(()=>alert('Delete failed.'))
                                await load()
                              }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-medium text-orange-600 mb-4">My other Contributions:</h2>
              {loading ? (
                  <div className="text-gray-500">Loading...</div>
              ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                      <tr className="bg-gray-600 text-white">
                        <th className="border border-gray-400 px-4 py-2 text-left">No</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Title</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Roles</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {contribs.length === 0 ? (
                          <tr>
                            <td className="border border-gray-400 px-4 py-2" colSpan={4}>
                              <em className="text-gray-500">No contributions submitted yet</em>
                            </td>
                          </tr>
                      ) : contribs.map((c, idx) => (
                          <tr key={c.id}>
                            <td className="border border-gray-400 px-4 py-2">{idx + 1}</td>
                            <td className="border border-gray-400 px-4 py-2">{c.title}</td>
                            <td className="border border-gray-400 px-4 py-2">{Array.isArray(c.roles) ? c.roles.join(", ") : ""}</td>
                            <td className="border border-gray-400 px-4 py-2">
                              <div className="flex gap-2">
                                <button
                                  className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                                  onClick={async ()=>{
                                    if (!confirm('Delete this contribution?')) return
                                    await deleteContribution(c.id).catch(()=>alert('Delete failed.'))
                                    await load()
                                  }}
                                >
                                  Delete
                                </button>
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
        </div>
      </div>
  )
}