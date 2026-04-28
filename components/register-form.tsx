"use client"

import { useState, useMemo } from "react"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { register } from "@/lib/auth"

type Props = { onRegistered: (email: string) => void; onBackToLogin: () => void }

// Password validation rules
const passwordRules = [
  { id: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { id: 'uppercase', label: 'At least 1 uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'At least 1 lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { id: 'digit', label: 'At least 1 digit', test: (p: string) => /[0-9]/.test(p) },
  { id: 'special', label: 'At least 1 special character (@#$%^&+=)', test: (p: string) => /[@#$%^&+=]/.test(p) },
  { id: 'whitespace', label: 'No whitespace', test: (p: string) => !/\s/.test(p) },
]

// Calculate password strength
function getPasswordStrength(password: string): { level: 'weak' | 'medium' | 'strong'; bars: number } {
  const passedRules = passwordRules.filter(rule => rule.test(password)).length
  
  // 0-2 rules: weak (1 bar = 33%)
  // 3-4 rules: medium (2 bars = 66%)
  // 5 rules: almost strong (2 bars = 66%)
  // 6 rules: strong (3 bars = 100%)
  if (passedRules <= 2) return { level: 'weak', bars: 1 }
  if (passedRules < 6) return { level: 'medium', bars: 2 }
  return { level: 'strong', bars: 3 }
}

export default function RegisterForm({ onRegistered, onBackToLogin }: Props) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Real-time validation results
  const passwordValidation = useMemo(() => {
    return passwordRules.map(rule => ({
      ...rule,
      passed: rule.test(password)
    }))
  }, [password])

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])
  
  const passwordValid = passwordValidation.every(r => r.passed)
  const confirmValid = confirm === "" || confirm === password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields.")
      return
    }
    
    if (!passwordValid) {
      setError("Password must contain at least one digit, one lowercase, one uppercase, one special character, and no whitespace")
      return
    }
    
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    
    setLoading(true)
    try {
      await register({ email, password, firstName, lastName })
      localStorage.setItem("asiou_user_email", email)
      localStorage.setItem("asiou_user_name", `${firstName} ${lastName}`)
      onRegistered(email)
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const getStrengthColor = (level: 'weak' | 'medium' | 'strong') => {
    switch (level) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-green-500'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-center mb-2 tracking-tight">Create Account</h1>
        <p className="text-center text-xs text-gray-600 mb-6">Join the ASOUI Conference portal</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
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
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pr-12 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${!passwordValid && password.length > 0 ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              <button
                type="button"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPwd(v => !v)}
                className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPwd ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {/* Password requirements */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded ${i <= passwordStrength.bars ? getStrengthColor(passwordStrength.level) : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-500 capitalize">Password: {passwordStrength.level}</p>
                <ul className="space-y-0.5">
                  {passwordValidation.map(rule => (
                    <li key={rule.id} className={`text-xs flex items-center gap-1 ${rule.passed ? 'text-green-600' : 'text-gray-500'}`}>
                      {rule.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {rule.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full pr-12 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${!confirmValid && confirm.length > 0 ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowConfirm(v => !v)}
                className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {/* Confirm password validation */}
            {confirm.length > 0 && (
              <p className={`text-xs mt-1 ${confirmValid ? 'text-green-600' : 'text-red-600'}`}>
                {confirmValid ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full text-center underline text-sm text-gray-600"
          >
            Back to login
          </button>
        </form>
      </div>
    </div>
  )
}


