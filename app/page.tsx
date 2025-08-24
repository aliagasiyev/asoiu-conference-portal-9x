"use client"
import { useEffect, useState } from "react"
import LoginForm from "@/components/login-form"
import Dashboard from "@/components/dashboard"
import PaperSubmission from "@/components/paper-submission"
import ContributionForm from "@/components/contribution-form"
import AdminPanel from "@/components/admin-panel"
import RegisterForm from "@/components/register-form"
import ChangePassword from "@/components/change-password"
import CameraReady from "@/components/camera-ready"
import MySubmissions from "@/components/my-submissions"
import Profile from "@/components/profile"
import ReviewerAssignments from "@/components/reviewer-assignments"

export default function ConferenceApp() {
  const [currentView, setCurrentView] =
      useState<"login"|"register"|"dashboard"|"paper"|"contribution"|"cameraReady"|"admin"|"password"|"submissions"|"profile"|"reviewer">("login")
  const [user, setUser] = useState("")

  useEffect(() => {
    const t = localStorage.getItem("asiou_jwt")
    const email = localStorage.getItem("asiou_user_email") || ""
    if (t) { setUser(email); setCurrentView("dashboard") }
  }, [])

  const handleLogin = (email: string) => { setUser(email); setCurrentView("dashboard") }
  const handleNavigate = (v: "dashboard"|"paper"|"contribution"|"cameraReady"|"admin"|"password"|"submissions"|"profile"|"reviewer") => setCurrentView(v)
  const handleLogout = () => { localStorage.clear(); setUser(""); setCurrentView("login") }

  return (
      <>
        {currentView === "login" && <LoginForm onLogin={handleLogin} onGoRegister={() => setCurrentView("register")} />}
        {currentView === "register" && <RegisterForm onRegistered={handleLogin} onBackToLogin={() => setCurrentView("login")} />}
        {currentView === "dashboard" && <Dashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentView === "profile" && <Profile user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentView === "paper" && <PaperSubmission user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentView === "cameraReady" && <CameraReady user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentView === "submissions" && <MySubmissions user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentView === "contribution" && <ContributionForm user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentView === "admin" && <AdminPanel onBack={() => setCurrentView("dashboard")} user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
        {currentView === "password" && <ChangePassword onBack={() => setCurrentView("dashboard")} />}
        {currentView === "reviewer" && <ReviewerAssignments user={user} onNavigate={handleNavigate as any} onLogout={handleLogout} />}
      </>
  )
}