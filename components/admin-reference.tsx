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
import { Layers, FileText, Plus } from "lucide-react"

type Props = { onBack: () => void }

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

export default function AdminReference({ onBack }: Props) {
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
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-green-700 mb-4">Conference Settings</h2>
              {settings && (
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={settings.cameraReadyOpen}
                      onChange={async (e) => {
                        const s = await adminUpdateConferenceSettings({ cameraReadyOpen: e.target.checked })
                        setSettings(s)
                      }}
                    />
                    Camera Ready Open
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={settings.submissionsOpen}
                      onChange={async (e) => {
                        const s = await adminUpdateConferenceSettings({ submissionsOpen: e.target.checked })
                        setSettings(s)
                      }}
                    />
                    Submissions Open
                  </label>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="mt-2 flex justify-center">
          <button
            onClick={onBack}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}


