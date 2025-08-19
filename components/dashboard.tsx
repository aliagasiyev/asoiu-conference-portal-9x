"use client"

import React, { useEffect, useState } from "react"
import useAuthGuard from "@/hooks/useAuthGuard"
import { listMyPapers, withdrawPaper, submitPaper, submitCameraReady } from "@/lib/papers"
import { listMyContributions } from "@/lib/contributions"
import { downloadFile } from "@/lib/files"
import api from "@/lib/http"

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
  const [isAdmin, setIsAdmin] = useState(false)

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

  useEffect(() => {
    load()
    // Probe an admin endpoint silently to decide whether to show Admin link
    ;(async () => {
      try {
        await api.get('/api/admin/reference/topics')
        setIsAdmin(true)
      } catch {
        setIsAdmin(false)
      }
    })()
  }, [])

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
        <nav className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="px-4 py-2 text-center bg-green-400">
            You are Welcome: <strong>{user || "User"}!</strong>
          </div>
          <div className="px-4 py-2 flex flex-wrap justify-center space-x-4 text-sm">
            <button onClick={() => onNavigate("dashboard")} className="hover:underline">My Home</button>
            <span>My Profile</span>
            <button onClick={() => onNavigate("paper")} className="hover:underline">Submit a Paper</button>
            <span>Submit Camera Ready</span>
            <button onClick={() => onNavigate("contribution")} className="hover:underline">Submit a Contribution</button>
            <span>My All Submissions</span>
            <span>Change Password</span>
            {isAdmin && <button onClick={() => onNavigate("admin")} className="hover:underline">Admin</button>}
            <button onClick={onLogout} className="hover:underline">Sign Out</button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-xl font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">MY HOME</h1>

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
                          <tr key={p.id}>
                            <td className="border border-gray-400 px-4 py-2">{idx + 1}</td>
                            <td className="border border-gray-400 px-4 py-2">{p.title}</td>
                            <td className="border border-gray-400 px-4 py-2">{p.paperType || "-"}</td>
                            <td className="border border-gray-400 px-4 py-2">{p.status}</td>
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
                            <td className="border border-gray-400 px-4 py-2 space-x-2">
                              <button className="text-green-700 underline" onClick={() => onSubmit(p.id)}>Submit</button>
                              <button className="text-green-700 underline" onClick={() => onSubmitCR(p.id)}>Submit CR</button>
                              <button className="text-red-700 underline" onClick={() => onWithdraw(p.id)}>Withdraw</button>
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
                      </tr>
                      </thead>
                      <tbody>
                      {contribs.length === 0 ? (
                          <tr>
                            <td className="border border-gray-400 px-4 py-2" colSpan={3}>
                              <em className="text-gray-500">No contributions submitted yet</em>
                            </td>
                          </tr>
                      ) : contribs.map((c, idx) => (
                          <tr key={c.id}>
                            <td className="border border-gray-400 px-4 py-2">{idx + 1}</td>
                            <td className="border border-gray-400 px-4 py-2">{c.title}</td>
                            <td className="border border-gray-400 px-4 py-2">{Array.isArray(c.roles) ? c.roles.join(", ") : ""}</td>
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