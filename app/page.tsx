"use client"

import { useState } from "react"
import LoginForm from "@/components/login-form"
import Dashboard from "@/components/dashboard"
import PaperSubmission from "@/components/paper-submission"
import ContributionForm from "@/components/contribution-form"

export default function ConferenceApp() {
  const [currentView, setCurrentView] = useState<"login" | "dashboard" | "paper" | "contribution">("login")
  const [user, setUser] = useState<string>("")

  const handleLogin = (email: string) => {
    setUser(email)
    setCurrentView("dashboard")
  }

  const handleNavigation = (view: "dashboard" | "paper" | "contribution") => {
    setCurrentView(view)
  }

  const handleLogout = () => {
    setUser("")
    setCurrentView("login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "login" && <LoginForm onLogin={handleLogin} />}

      {currentView === "dashboard" && <Dashboard user={user} onNavigate={handleNavigation} onLogout={handleLogout} />}

      {currentView === "paper" && <PaperSubmission user={user} onNavigate={handleNavigation} onLogout={handleLogout} />}

      {currentView === "contribution" && (
        <ContributionForm user={user} onNavigate={handleNavigation} onLogout={handleLogout} />
      )}
    </div>
  )
}
