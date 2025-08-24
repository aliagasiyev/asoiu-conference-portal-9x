"use client"

import React, { useEffect, useState } from 'react'
import { listMyAssignments, acceptAssignment, submitReview, getAssignedPaper } from '@/lib/reviews'
import TopNav from '@/components/ui/top-nav'

export default function ReviewerAssignments({ user, onNavigate, onLogout }: { user: string; onNavigate: (v: any) => void; onLogout: () => void }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await listMyAssignments()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onAccept = async (id: number) => {
    await acceptAssignment(id)
    await load()
  }

  const onSubmitReview = async (id: number) => {
    const decision = prompt('Decision (ACCEPT, ACCEPT_WITH_REVISIONS, REJECT):', 'ACCEPT_WITH_REVISIONS') || ''
    const comments = prompt('Comments:', '') || ''
    if (!decision) return
    setSubmittingId(id)
    try {
      await submitReview(id, { decision: decision as any, comments })
      await load()
    } finally {
      setSubmittingId(null)
    }
  }

  const onViewPaper = async (id: number) => {
    const p = await getAssignedPaper(id)
    alert(`Title: ${p.title}\nType: ${p.paperType || '-'}\nStatus: ${p.status}\nTopics: ${(p.topics||[]).join(', ')}\nAbstract: ${p.paperAbstract}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav user={user} current={"reviewer" as any} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">My Review Assignments</h1>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-600 text-white">
                    <th className="border border-gray-400 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Paper</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Due</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Accepted</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Completed</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr><td className="border border-gray-400 px-4 py-2" colSpan={6}>No assignments</td></tr>
                  ) : items.map((it) => (
                    <tr key={it.id} className={"odd:bg-gray-50 " + (it.dueSoon && !it.completed ? 'bg-red-50' : '')}>
                      <td className="border border-gray-400 px-4 py-2">{it.id}</td>
                      <td className="border border-gray-400 px-4 py-2">{it.paperTitle} {it.dueSoon && !it.completed && <span className="ml-2 text-red-700 font-semibold">(Due soon)</span>}</td>
                      <td className="border border-gray-400 px-4 py-2">{new Date(it.dueAt).toLocaleString()}</td>
                      <td className="border border-gray-400 px-4 py-2">{it.acceptedAt ? new Date(it.acceptedAt).toLocaleString() : '-'}</td>
                      <td className="border border-gray-400 px-4 py-2">{it.completed ? 'Yes' : 'No'}</td>
                      <td className="border border-gray-400 px-4 py-2">
                        <div className="flex gap-2">
                          {!it.acceptedAt && (
                            <button className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100" onClick={() => onAccept(it.id)}>Accept</button>
                          )}
                          <button className="px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100" onClick={() => onViewPaper(it.id)}>View Paper</button>
                          {!it.completed && (
                            <button disabled={submittingId === it.id} className="px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50" onClick={() => onSubmitReview(it.id)}>
                              {submittingId === it.id ? 'Submitting...' : 'Submit Review'}
                            </button>
                          )}
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
