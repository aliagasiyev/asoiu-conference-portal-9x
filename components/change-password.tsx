"use client"

import { useState } from "react"
import { changePassword } from "@/lib/me"

type Props = { onBack: () => void }

export default function ChangePassword({ onBack }: Props) {
  const [pwd, setPwd] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (pwd.length < 6) { setMsg('Password must be at least 6 characters'); return }
    if (pwd !== confirm) { setMsg('Passwords do not match'); return }
    setLoading(true)
    try {
      await changePassword(pwd)
      setMsg('Password changed successfully')
    } catch (e: any) {
      setMsg('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="px-4 py-2 flex flex-wrap justify-center space-x-4 text-sm">
          <button onClick={onBack} className="hover:underline">Back</button>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-xl font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">Change Password</h1>
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {msg && <p className="text-sm text-gray-700">{msg}</p>}
            <button disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium disabled:opacity-60" type="submit">{loading ? 'Saving...' : 'Save'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}


