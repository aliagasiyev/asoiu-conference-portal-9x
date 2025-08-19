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
  type RefItem,
} from "@/lib/reference-admin"

type Props = { onBack: () => void }

function CrudList({
  title,
  items,
  onCreate,
  onUpdate,
  onDelete,
}: {
  title: string
  items: RefItem[]
  onCreate: (name: string) => Promise<void>
  onUpdate: (id: number, name: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}) {
  const [newName, setNewName] = useState("")

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-orange-600 mb-4">{title}</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`New ${title.slice(0, -1)} name...`}
          className="flex-1 px-3 py-2 border border-gray-300 rounded"
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={async () => {
            if (!newName.trim()) return
            await onCreate(newName.trim())
            setNewName("")
          }}
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-2">
            <input
              defaultValue={it.name}
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
              onBlur={async (e) => {
                const v = e.currentTarget.value.trim()
                if (v && v !== it.name) await onUpdate(it.id, v)
              }}
            />
            <button
              className="text-red-700 underline"
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
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [tps, pts] = await Promise.all([
        adminListTopics(),
        adminListPaperTypes(),
      ])
      setTopics(tps)
      setTypes(pts)
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
      <nav className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="px-4 py-2 flex flex-wrap justify-center space-x-4 text-sm">
          <button onClick={onBack} className="hover:underline">Back</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <CrudList
              title="Topics"
              items={topics}
              onCreate={async (name) => { await adminCreateTopic(name); await load() }}
              onUpdate={async (id, name) => { await adminUpdateTopic(id, name); await load() }}
              onDelete={async (id) => { await adminDeleteTopic(id); await load() }}
            />
            <CrudList
              title="Paper Types"
              items={types}
              onCreate={async (name) => { await adminCreatePaperType(name); await load() }}
              onUpdate={async (id, name) => { await adminUpdatePaperType(id, name); await load() }}
              onDelete={async (id) => { await adminDeletePaperType(id); await load() }}
            />
          </>
        )}
      </div>
    </div>
  )
}


