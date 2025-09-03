"use client"

import React, { useEffect, useState } from "react"
import {
  adminListTopics,
  adminCreateTopic,
  adminUpdateTopic,
  adminDeleteTopic,
  adminListPaperTypes,
  adminCreatePaperType,
  adminUpdatePaperType,
  adminDeletePaperType,
  adminSetTopicActive,
  adminSetPaperTypeActive,
  adminGetConferenceSettings,
  adminUpdateConferenceSettings,
  type ConferenceSettings,
  type RefItem,
} from "@/lib/reference-admin"
import { Layers, FileText, Plus, Settings } from "lucide-react"

type Props = {}

function CrudList({
                    title,
                    icon,
                    items,
                    onCreate,
                    onUpdate,
                    onDelete,
                    onToggle,
                  }: {
  title: string
  icon?: React.ReactNode
  items: RefItem[]
  onCreate: (name: string) => Promise<void>
  onUpdate: (id: number, name: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onToggle: (id: number, active: boolean, currentName: string) => Promise<void>
}) {
  const [newName, setNewName] = useState("")

  return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-lg font-semibold text-orange-600 mb-4 flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h2>
        <div className="flex gap-2 mb-4">
          <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`New ${title.slice(0, -1)} name...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={async () => {
                if (!newName.trim()) return
                await onCreate(newName.trim())
                setNewName("")
              }}
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        <ul className="space-y-2">
          {items.map((it) => (
              <li key={it.id} className="flex items-center gap-2">
                <input
                    defaultValue={it.name}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    onBlur={async (e) => {
                      const v = e.currentTarget.value.trim()
                      if (v && v !== it.name) await onUpdate(it.id, v)
                    }}
                />
                <label className="flex items-center gap-1 text-sm text-gray-700 rounded px-2 py-1 bg-green-50 border border-green-200">
                  <input type="checkbox" checked={it.active ?? true} onChange={async (e) => {
                    await onToggle(it.id, e.target.checked, it.name)
                  }} /> active
                </label>
                <button
                    className={(it.active ?? true) ? "text-gray-400 underline cursor-not-allowed" : "text-red-700 hover:text-red-800 underline"}
                    disabled={it.active ?? true}
                    title={(it.active ?? true) ? "Deactivate first, then delete" : "Delete"}
                    onClick={() => onDelete(it.id)}
                >
                  Delete
                </button>
              </li>
          ))}
        </ul>
      </div>
  )
}

export default function AdminReference({}: Props) {
  const [topics, setTopics] = useState<RefItem[]>([])
  const [types, setTypes] = useState<RefItem[]>([])
  const [settings, setSettings] = useState<ConferenceSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [tps, pts, s] = await Promise.all([
        adminListTopics(),
        adminListPaperTypes(),
        adminGetConferenceSettings(),
      ])
      setTopics(tps)
      setTypes(pts)
      setSettings(s)
    } catch (e: any) {
      alert(e?.response?.status === 403 ? "You are not authorized (ADMIN role required)." : "Failed to load admin data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold">Admin Panel</h1>
            <p className="text-sm opacity-90">Manage topics and paper types used during submission</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
              <div>Loading...</div>
          ) : (
              <>
                <CrudList
                    title="Topics"
                    icon={<Layers className="h-5 w-5" />}
                    items={topics}
                    onCreate={async (name) => { await adminCreateTopic(name); await load() }}
                    onUpdate={async (id, name) => { await adminUpdateTopic(id, name); await load() }}
                    onDelete={async (id) => {
                      try { await adminDeleteTopic(id); await load() } catch (e: any) {
                        const s = e?.response?.status
                        if (s === 409 || s === 400) {
                          alert('Cannot delete topic: it is referenced by existing papers. Please remove it from papers or deactivate it in the backend.')
                        } else {
                          alert('Failed to delete topic')
                        }
                      }
                    }}
                    onToggle={async (id, active, currentName) => {
                      await adminSetTopicActive(id, active, currentName)
                      setTopics(prev => prev.map(it => it.id === id ? { ...it, active } : it))
                    }}
                />
                <CrudList
                    title="Paper Types"
                    icon={<FileText className="h-5 w-5" />}
                    items={types}
                    onCreate={async (name) => { await adminCreatePaperType(name); await load() }}
                    onUpdate={async (id, name) => { await adminUpdatePaperType(id, name); await load() }}
                    onDelete={async (id) => {
                      try { await adminDeletePaperType(id); await load() } catch (e: any) {
                        const s = e?.response?.status
                        if (s === 409 || s === 400) {
                          alert('Cannot delete paper type: it is referenced by existing papers. Please change those papers first or deactivate it in the backend.')
                        } else {
                          alert('Failed to delete paper type')
                        }
                      }
                    }}
                    onToggle={async (id, active, currentName) => {
                      await adminSetPaperTypeActive(id, active, currentName)
                      setTypes(prev => prev.map(it => it.id === id ? { ...it, active } : it))
                    }}
                />
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-white">
                    <Settings className="h-5 w-5 text-green-600" />
                    <h2 className="text-base font-semibold text-gray-900">Conference Settings</h2>
                  </div>
                  {settings && (
                      <div className="px-6 py-4">
                        {/* Camera Ready Open */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Camera Ready Open</div>
                            <div className="text-xs text-gray-500">Allow authors to upload and submit final camera‑ready PDFs.</div>
                          </div>
                          <button
                              type="button"
                              role="switch"
                              aria-checked={settings.cameraReadyOpen}
                              onClick={async () => {
                                const s = await adminUpdateConferenceSettings({ cameraReadyOpen: !settings.cameraReadyOpen })
                                setSettings(s)
                              }}
                              className={`${settings.cameraReadyOpen ? 'bg-green-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                          >
                      <span
                          className={`${settings.cameraReadyOpen ? 'translate-x-5' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform`}
                      />
                          </button>
                        </div>

                        <div className="my-4 border-t border-gray-100" />

                        {/* Submissions Open */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Submissions Open</div>
                            <div className="text-xs text-gray-500">Allow authors to create and submit new papers.</div>
                          </div>
                          <button
                              type="button"
                              role="switch"
                              aria-checked={settings.submissionsOpen}
                              onClick={async () => {
                                const s = await adminUpdateConferenceSettings({ submissionsOpen: !settings.submissionsOpen })
                                setSettings(s)
                              }}
                              className={`${settings.submissionsOpen ? 'bg-green-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                          >
                      <span
                          className={`${settings.submissionsOpen ? 'translate-x-5' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform`}
                      />
                          </button>
                        </div>
                      </div>
                  )}
                </div>
              </>
          )}
        </div>

        {/* Removed bottom Back button as requested */}
      </div>
  )
}

