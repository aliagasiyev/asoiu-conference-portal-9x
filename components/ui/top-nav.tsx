"use client"

import useIsAdmin from "@/hooks/useIsAdmin"
import { getWelcomeName } from "@/lib/utils"

type View = "dashboard" | "paper" | "cameraReady" | "contribution" | "admin" | "password" | "submissions" | "profile"

type Props = {
  user: string
  current: View
  onNavigate: (v: View) => void
  onLogout: () => void
}

export default function TopNav({ user, current, onNavigate, onLogout }: Props) {
  const isAdmin = useIsAdmin()
  const item = (label: string, view?: View) => {
    const isActive = view && current === view
    const cls = isActive ? "hover:underline font-bold" : "hover:underline"
    if (view) {
      return (
        <button onClick={() => onNavigate(view)} className={cls}>{label}</button>
      )
    }
    return <span>{label}</span>
  }

  return (
    <nav className="bg-gradient-to-r from-green-500 to-green-600 text-white">
      <div className="px-4 py-2 text-center bg-green-400">
        You are Welcome: <strong>{getWelcomeName(user) || "User"}!</strong>
      </div>
      <div className="px-4 py-2 flex flex-wrap justify-center space-x-4 text-sm">
        {item("My Home", "dashboard")}
        {item("My Profile", "profile")}
        {item("Submit a Paper", "paper")}
        {item("Submit Camera Ready", "cameraReady")}
        {item("Submit a Contribution", "contribution")}
        {item("My All Submissions", "submissions")}
        {isAdmin && item("Admin", "admin")}
        <button onClick={onLogout} className="hover:underline">Sign Out</button>
      </div>
    </nav>
  )
}


