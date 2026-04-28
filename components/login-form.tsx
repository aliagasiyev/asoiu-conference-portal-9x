"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { login } from "@/lib/auth"


type Props = { onLogin: (email: string) => void; onGoRegister?: () => void }

export default function LoginForm({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

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
      } catch { }
      onLogin(email) // switch SPA view instead of router.push
    } catch (err: any) {
      // Handle error response from backend - show user-friendly message
      let errorMessage = "Login failed. Please try again."
      
      if (err.response) {
        // Server responded with error status (4xx, 5xx)
        const status = err.response.status
        const responseData = err.response.data
        
        if (status === 401) {
          // Bad credentials or similar auth failure
          errorMessage = "Email or password is incorrect"
        } else if (status === 400 && responseData?.message) {
          // Bad request - use backend message if available
          errorMessage = responseData.message
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later."
        }
      } else if (err.request) {
        // Network error - no response received
        errorMessage = "Unable to connect to server. Please check your connection."
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-center mb-2 tracking-tight">Login</h1>
        <p className="text-center text-xs text-gray-600 mb-6">Access your ASOUI Conference account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">eMail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="your password..."
                className="w-full pr-12 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            disabled={loading}
            type="submit"
            className="glass-button relative w-full px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-400 transition-all disabled:opacity-60 hover:-translate-y-[1px] active:translate-y-[1px] border border-white/20"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {onGoRegister && (
            <button type="button" onClick={onGoRegister} className="w-full text-center text-sm text-teal-600 hover:text-teal-700 underline underline-offset-4 decoration-teal-400 hover:decoration-teal-600 transition-colors">
              Create new account
            </button>
          )}
        </form>
      </div>
      <style jsx>{`
        .glass-button {
          box-shadow: 0 10px 26px rgba(16,185,129,.35), 0 1px 0 rgba(255,255,255,.35) inset, 0 -6px 12px rgba(0,0,0,.08) inset;
        }
        .glass-button:before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background: linear-gradient(180deg, rgba(255,255,255,.55), rgba(255,255,255,.08));
          mix-blend-mode: soft-light;
          opacity: .55;
          pointer-events: none;
        }
        .glass-button:hover {
          box-shadow: 0 12px 36px rgba(20,184,166,.55), 0 1px 0 rgba(255,255,255,.45) inset, 0 -6px 12px rgba(0,0,0,.09) inset;
        }
        .glass-button:hover:after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 140%;
          height: 140%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(closest-side, rgba(16,185,129,.25), transparent);
          animation: pulseGlow 1.6s ease-out;
          pointer-events: none;
        }
        @keyframes pulseGlow {
          0% { opacity: .6; transform: translate(-50%, -50%) scale(.8); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </div>
  )
}