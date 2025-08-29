"use client"

import React, { useEffect, useState } from 'react'
import { adminListPapers, adminTechnicalCheck, adminAssignReviewer, adminListAssignmentsByPaper, adminFinalDecision, adminCreateReviewer, adminListReviewsByPaper } from '@/lib/admin'
import AdminReference from '@/components/admin-reference'
import TopNav from '@/components/ui/top-nav'
 

function AdminSubmissions() {
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [assignForm, setAssignForm] = useState<{ reviewerEmail: string; dueAt: string }>({ reviewerEmail: '', dueAt: '' })

  const load = async () => {
    setLoading(true)
    try {
      const list = await adminListPapers()
      setPapers(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onTechCheck = async (id: number, passed: boolean) => {
    await adminTechnicalCheck(id, passed)
    await load()
  }

  const onAssign = async (id: number) => {
    if (!assignForm.reviewerEmail || !assignForm.dueAt) return alert('Reviewer Gmail and DueAt required')
    try {
      await adminAssignReviewer(id, assignForm.reviewerEmail, assignForm.dueAt)
      alert('Assigned successfully')
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Failed to assign reviewer. Ensure Gmail exists and is a reviewer.'
      alert(msg)
    }
    setAssignForm({ reviewerEmail: '', dueAt: '' })
    await load()
  }

  const onDecision = async (id: number) => {
    const status = prompt('Final decision (ACCEPTED, REJECTED, REVISIONS_REQUIRED):', 'ACCEPTED') as any
    if (!status) return
    await adminFinalDecision(id, status)
    await load()
  }

  return (
    <div className="space-y-4">
      {loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-600 text-white">
                <th className="border border-gray-400 px-2 py-1 text-left">ID</th>
                <th className="border border-gray-400 px-2 py-1 text-left">Title</th>
                <th className="border border-gray-400 px-2 py-1 text-left">Type</th>
                <th className="border border-gray-400 px-2 py-1 text-left">Status</th>
                <th className="border border-gray-400 px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((p: any) => (
                <React.Fragment key={p.id}>
                  <tr className="odd:bg-gray-50">
                    <td className="border border-gray-400 px-2 py-1">{p.id}</td>
                    <td className="border border-gray-400 px-2 py-1">{p.title}</td>
                    <td className="border border-gray-400 px-2 py-1">{p.paperType}</td>
                    <td className="border border-gray-400 px-2 py-1">{p.status}</td>
                    <td className="border border-gray-400 px-2 py-1">
                      <div className="flex flex-wrap gap-2">
                        <button className="px-2 py-1 rounded text-xs bg-amber-50 text-amber-700 border border-amber-200" onClick={() => onTechCheck(p.id, true)}>Tech Check OK</button>
                        <button className="px-2 py-1 rounded text-xs bg-red-50 text-red-700 border border-red-200" onClick={() => onTechCheck(p.id, false)}>Tech Reject</button>
                        <button className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>{expanded === p.id ? 'Hide' : 'Assign'}</button>
                        <button className="px-2 py-1 rounded text-xs bg-green-50 text-green-700 border border-green-200" onClick={() => onDecision(p.id)}>Final Decision</button>
                      </div>
                    </td>
                  </tr>
                  {expanded === p.id && (
                    <tr>
                      <td className="border border-gray-400 px-2 py-2" colSpan={5}>
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          {/* Reviewer Email */}
                          <div className="flex flex-col">
                            <label className="block text-xs text-gray-600">Reviewer Gmail</label>
                            <input className="border px-2 py-1 rounded" placeholder="e.g. reviewer1@gmail.com" value={assignForm.reviewerEmail} onChange={e => setAssignForm(s => ({ ...s, reviewerEmail: e.target.value }))} />
                          </div>

                          {/* Due At - simple datetime input */}
                          <div className="flex flex-col flex-1">
                            <label className="block text-xs text-gray-600 mb-1">Due At</label>
                            <input
                              type="datetime-local"
                              className="border px-2 py-1 rounded"
                              value={(function(){
                                const iso = assignForm.dueAt
                                if (!iso) return ''
                                const d = new Date(iso); if (isNaN(d.getTime())) return ''
                                const pad = (n:number) => String(n).padStart(2,'0')
                                const yyyy=d.getFullYear(), mm=pad(d.getMonth()+1), dd=pad(d.getDate()), hh=pad(d.getHours()), mi=pad(d.getMinutes())
                                return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
                              })()}
                              onChange={e => {
                                try {
                                  const iso = new Date(e.target.value).toISOString()
                                  setAssignForm(s => ({ ...s, dueAt: iso }))
                                } catch {
                                  setAssignForm(s => ({ ...s, dueAt: '' }))
                                }
                              }}
                            />
                          </div>

                          {/* Assign button */}
                          <button className="px-4 py-2 h-fit rounded text-sm bg-blue-600 text-white shadow-md hover:bg-blue-700" onClick={() => onAssign(p.id)}>Assign</button>
                        </div>

                        <Assignments paperId={p.id} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Assignments({ paperId }: { paperId: number }) {
  const [rows, setRows] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  useEffect(() => {
    (async () => {
      const data = await adminListAssignmentsByPaper(paperId)
      setRows(data)
      const r = await adminListReviewsByPaper(paperId)
      const normalized = Array.isArray(r) ? r : (r && Array.isArray(r.content) ? r.content : [])
      setReviews(normalized)
    })()
  }, [paperId])
  const fmt = (v: string) => {
    try { const d = new Date(v); return d.toLocaleString() } catch { return '-' }
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
      {/* Assignments card */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Assignments</div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{rows?.length || 0}</span>
        </div>
        {(!Array.isArray(rows) || rows.length === 0) ? (
          <div className="text-xs text-gray-500">No assignments</div>
        ) : (
          <ul className="space-y-2">
            {rows.map((r: any) => (
              <li key={r.id} className="text-sm rounded border border-gray-100 p-2 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">#{r.id} • {r.paperTitle}</div>
                  <div className="flex gap-2">
                    {r.dueSoon ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">Due soon</span>
                    ) : null}
                    {r.completed ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Completed</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">In progress</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600">Due: {fmt(r.dueAt)} • Accepted: {r.acceptedAt ? fmt(r.acceptedAt) : '-'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Reviews card */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Reviews</div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{reviews?.length || 0}</span>
        </div>
        {(!Array.isArray(reviews) || reviews.length === 0) ? (
          <div className="text-xs text-gray-500">No reviews yet</div>
        ) : (
          <ul className="space-y-2">
            {reviews.map((rv: any) => (
              <li key={rv.id} className="text-sm rounded border border-gray-100 p-2 flex items-start gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${rv.decision==='ACCEPT' ? 'bg-green-50 text-green-700 border-green-200' : rv.decision==='REJECT' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{rv.decision}</span>
                <span className="text-gray-700">{rv.comments}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function AdminUsers() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const onCreate = async () => {
    if (!email || !password || !firstName || !lastName) return alert('All fields required')
    await adminCreateReviewer({ email, password, firstName, lastName })
    setEmail(''); setPassword(''); setFirstName(''); setLastName('')
    alert('Reviewer created')
  }

  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold">Create Reviewer Account</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border px-3 py-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <input className="border px-3 py-2" placeholder="First Name" value={firstName} onChange={e=>setFirstName(e.target.value)} />
        <input className="border px-3 py-2" placeholder="Last Name" value={lastName} onChange={e=>setLastName(e.target.value)} />
      </div>
      <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={onCreate}>Create</button>
    </div>
  )
}

export default function AdminPanel({ onBack, user, onNavigate, onLogout }: { onBack: () => void; user: string; onNavigate: (v: any) => void; onLogout: () => void }) {
  const [tab, setTab] = useState<'submissions'|'reference'|'users'>('submissions')
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav user={user} current={"admin" as any} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex gap-3 mb-4">
            <button className={`px-3 py-2 rounded ${tab==='submissions'?'bg-green-600 text-white':'bg-gray-100'}`} onClick={()=>setTab('submissions')}>Submissions</button>
            <button className={`px-3 py-2 rounded ${tab==='reference'?'bg-green-600 text-white':'bg-gray-100'}`} onClick={()=>setTab('reference')}>Reference</button>
            <button className={`px-3 py-2 rounded ${tab==='users'?'bg-green-600 text-white':'bg-gray-100'}`} onClick={()=>setTab('users')}>Users</button>
            <div className="flex-1" />
            <button className="px-3 py-2 rounded bg-gray-200" onClick={onBack}>Back</button>
          </div>
          {tab === 'submissions' && <AdminSubmissions />}
          {tab === 'reference' && <AdminReference onBack={()=>{}} />}
          {tab === 'users' && <AdminUsers />}
        </div>
      </div>
    </div>
  )
}
