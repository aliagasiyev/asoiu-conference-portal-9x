"use client"

import type React from "react"

import { useState } from "react"

interface LoginFormProps {
  onLogin: (email: string) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onLogin(email)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Texniki tapşırıq</h1>
        <p className="text-gray-600">Sistemə bu şəkildə daxil olma olmalıdır. Sistemə daxil olduqda.</p>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-blue-600 border-b border-blue-200 pb-2">AICT Peer Review Form</h2>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">LOGIN:</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">eMail:</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <span className="absolute right-3 top-2 text-orange-500">*</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="your password..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <span className="absolute right-3 top-2 text-orange-500">*</span>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-gray-600">Help: </span>
              <a href="#" className="text-blue-500 hover:underline">
                I FORGOT MY PASSWORD
              </a>
              <br />
              <a href="#" className="text-blue-500 hover:underline ml-12">
                CREATE NEW ACCOUNT
              </a>
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p>Login olduqdan sonra aşağıdakı pəncərə çıxacaq.</p>
      </div>
    </div>
  )
}
