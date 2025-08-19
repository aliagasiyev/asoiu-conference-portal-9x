"use client"

import React, { useEffect, useState } from "react"
import { getHome } from "@/lib/home"
import StatusBadge from "@/components/status-badge"
import TopNav from "@/components/ui/top-nav"
import { downloadFile } from "@/lib/files"

type Props = { user: string; onNavigate: (v: any) => void; onLogout: () => void }

export default function MySubmissions({ user, onNavigate, onLogout }: Props) {
  const [data, setData] = useState<{ submittedPapers: any[]; contributions: any[] }>({ submittedPapers: [], contributions: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await getHome()
        setData(res)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav user={user} current={"dashboard" as any} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">MY ALL SUBMISSIONS</h1>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-orange-600 mb-3">Papers</h2>
                <ul className="space-y-2">
                  {data.submittedPapers.length === 0 ? <li className="text-gray-500">No papers</li> : data.submittedPapers.map((p: any) => (
                    <li key={p.id} className="border rounded p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2"><StatusBadge status={p.status} /> {p.paperType || '-'}</div>
                      </div>
                      <div className="space-x-2">
                        {p.fileId && <button className="underline text-blue-600" onClick={()=>downloadFile(p.fileId)}>PDF</button>}
                        {p.cameraReadyFileId && <button className="underline text-blue-600" onClick={()=>downloadFile(p.cameraReadyFileId)}>CR</button>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-medium text-orange-600 mb-3">Contributions</h2>
                <ul className="space-y-2">
                  {data.contributions.length === 0 ? <li className="text-gray-500">No contributions</li> : data.contributions.map((c: any) => (
                    <li key={c.id} className="border rounded p-3">
                      <div className="font-medium">{c.title}</div>
                      <div className="text-sm text-gray-600">{Array.isArray(c.roles) ? c.roles.join(', ') : ''}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


