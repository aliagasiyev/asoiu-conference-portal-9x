"use client"

import { useEffect, useState } from "react"
import TopNav from "@/components/ui/top-nav"
import { me } from "@/lib/auth"

type Props = { user: string; onNavigate: (v: any) => void; onLogout: () => void }

export default function Profile({ user, onNavigate, onLogout }: Props) {
  const [email, setEmail] = useState<string>(user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await me()
        if (typeof res === 'string') setEmail(res)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav user={email || user} current={"profile" as any} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-xl font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">My Profile</h1>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">eMail</label>
                <input readOnly value={email} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50" />
              </div>
              <div className="pt-2">
                <button onClick={() => onNavigate("password")} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium">Change Password</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


