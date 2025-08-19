"use client"

import { useState } from "react"
import { login } from "@/lib/auth"

type Props = { onLogin: (email: string) => void; onGoRegister?: () => void }

export default function LoginForm({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await login(email, password) // saves JWT in localStorage
      localStorage.setItem("asiou_user_email", email)
      // Try to derive a nice display name and cache it
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('asiou_jwt') : null
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const candidate = (payload.firstName && payload.lastName) ? `${payload.firstName} ${payload.lastName}` : (payload.given_name && payload.family_name) ? `${payload.given_name} ${payload.family_name}` : (payload.name || '')
          if (candidate) localStorage.setItem('asiou_user_name', candidate)
        }
      } catch {}
      onLogin(email) // switch SPA view instead of router.push
    } catch (err: any) {
      setError(err?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">eMail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="your password..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {onGoRegister && (
            <button type="button" onClick={onGoRegister} className="w-full text-center underline text-sm text-gray-600">
              Create new account
            </button>
          )}
        </form>
      </div>
    </div>
  )
}