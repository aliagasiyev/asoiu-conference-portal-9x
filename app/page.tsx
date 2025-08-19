"use client"
import { useEffect, useState } from "react"
import LoginForm from "@/components/login-form"
import Dashboard from "@/components/dashboard"
import PaperSubmission from "@/components/paper-submission"
import ContributionForm from "@/components/contribution-form"

export default function ConferenceApp() {
  const [currentView, setCurrentView] =
      useState<"login"|"dashboard"|"paper"|"contribution">("login")
  const [user, setUser] = useState("")

  useEffect(() => {
    const t = localStorage.getItem("asiou_jwt")
    const email = localStorage.getItem("asiou_user_email") || ""
    if (t) { setUser(email); setCurrentView("dashboard") }
  }, [])

  const handleLogin = (email: string) => { setUser(email); setCurrentView("dashboard") }
  const handleNavigate = (v: "dashboard"|"paper"|"contribution") => setCurrentView(v)
  const handleLogout = () => { localStorage.clear(); setUser(""); setCurrentView("login") }

  return (
      <>
        {currentView === "login" && <LoginForm onLogin={handleLogin} />}
        {currentView === "dashboard" && <Dashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentView === "paper" && <PaperSubmission user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentView === "contribution" && <ContributionForm user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
      </>
  )
}