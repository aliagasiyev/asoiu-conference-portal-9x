"use client"

type Props = {
  onNavigate: (v: "dashboard" | "paper" | "contribution" | "cameraReady" | "admin" | "password") => void
  showAdmin?: boolean
  onLogout?: () => void
}

export default function FooterNav({ onNavigate, showAdmin, onLogout }: Props) {
  return (
    <footer className="mt-10 border-t border-gray-200">
      <div className="container mx-auto px-4 py-6 flex flex-wrap gap-3 justify-center text-sm">
        <button onClick={() => onNavigate("dashboard")} className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50">My Home</button>
        <button onClick={() => onNavigate("paper")} className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50">Submit a Paper</button>
        <button onClick={() => onNavigate("cameraReady")} className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50">Submit Camera Ready</button>
        <button onClick={() => onNavigate("contribution")} className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50">Submit a Contribution</button>
        <button onClick={() => onNavigate("password")} className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50">Change Password</button>
        {showAdmin && <button onClick={() => onNavigate("admin")} className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50">Admin</button>}
        {onLogout && <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white border rounded shadow-sm hover:bg-red-700">Sign Out</button>}
      </div>
    </footer>
  )
}


