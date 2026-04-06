"use client"

import React, { useEffect, useState } from "react"
import useAuthGuard from "@/hooks/useAuthGuard"
import { listMyPapers, uploadCameraReady, submitCameraReady } from "@/lib/papers"
import { downloadFile } from "@/lib/files"
import StatusBadge from "@/components/status-badge"
import TopNav from "@/components/ui/top-nav"

type Props = { user: string; onNavigate: (v: "dashboard" | "paper" | "contribution" | "cameraReady" | "admin" | "password") => void; onLogout: () => void }

export default function CameraReady({ user, onNavigate, onLogout }: Props) {
  useAuthGuard()
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fileMap, setFileMap] = useState<Record<number, File | undefined>>({})
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const p = await listMyPapers(0, 50)
      setPapers(p)
    } catch (e: any) {
      // Reviewers (no USER role) will get 403 here; show a friendly notice
      if (e?.response?.status === 403) {
        setPapers([])
        setError("Camera-ready is available only for Authors (USER role)")
      } else {
        setError("Failed to load papers")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const canUpload = (status: string) => {
    const s = (status || "").toUpperCase()
    // Allow uploading camera-ready when paper is accepted or pending camera-ready,
    // and keep support for earlier states if needed
    return (
      s === "ACCEPTED" ||
      s === "CAMERA_READY_PENDING" ||
      s === "SUBMITTED" ||
      s === "DRAFT" ||
      s === "REVISIONS_REQUIRED"
    )
  }

  const onUpload = async (id: number) => {
    const f = fileMap[id]
    if (!f) { alert("Choose a PDF file first"); return }
    try {
      await uploadCameraReady(id, f)
      alert("Camera-ready file uploaded")
      await load()
    } catch {
      alert("Upload failed")
    }
  }

  const onSubmitCR = async (id: number) => {
    try {
      await submitCameraReady(id)
      alert("Camera-ready submitted")
      await load()
    } catch {
      alert("Submit camera-ready failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav user={user} current={"cameraReady" as any} onNavigate={onNavigate as any} onLogout={onLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">SUBMIT CAMERA READY</h1>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-600 text-white">
                  <th className="border border-gray-400 px-4 py-2 text-left">No</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">Title</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">Status</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">Camera-Ready</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {papers.length === 0 ? (
                  <tr>
                    <td className="border border-gray-400 px-4 py-2" colSpan={5}><em className="text-gray-500">No papers</em></td>
                  </tr>
                ) : papers.map((p: any, idx: number) => (
                  <tr key={p.id}>
                    <td className="border border-gray-400 px-4 py-2">{idx + 1}</td>
                    <td className="border border-gray-400 px-4 py-2">{p.title}</td>
                    <td className="border border-gray-400 px-4 py-2"><StatusBadge status={p.status} /></td>
                    <td className="border border-gray-400 px-4 py-2 space-x-2">
                      {p.cameraReadyFileId && (
                        <button className="underline text-blue-600" onClick={() => downloadFile(p.cameraReadyFileId)}>PDF</button>
                      )}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 space-y-2">
                      <input type="file" accept=".pdf" disabled={!canUpload(p.status)} onChange={(e)=>setFileMap(m=>({ ...m, [p.id]: e.target.files?.[0] }))} />
                      <div className="space-x-2">
                        <button disabled={!canUpload(p.status)} className="text-green-700 underline disabled:opacity-50" onClick={()=>onUpload(p.id)}>Upload CR</button>
                        <button className="text-green-700 underline" onClick={()=>onSubmitCR(p.id)}>Submit CR</button>
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
  )
}


