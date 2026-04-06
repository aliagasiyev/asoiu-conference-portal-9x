"use client"

import * as React from "react"
import useIsAdmin from "@/hooks/useIsAdmin"
import useIsReviewer from "@/hooks/useIsReviewer"
import { getWelcomeName } from "@/lib/utils"
import { 
  Menu, 
  LogOut, 
  User, 
  LayoutPanelLeft, 
  FileText, 
  UploadCloud, 
  Layers, 
  ShieldCheck, 
  BookOpenCheck,
  ChevronDown,
  Sparkles
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

type View = "dashboard" | "paper" | "cameraReady" | "contribution" | "admin" | "password" | "submissions" | "profile" | "reviewer"

type Props = {
  user: string
  current: View
  onNavigate: (v: View) => void
  onLogout: () => void
}

export default function TopNav({ user, current, onNavigate, onLogout }: Props) {
  const isAdmin = useIsAdmin()
  const isReviewer = useIsReviewer()
  
  const userName = getWelcomeName(user) || "User"
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  const navItems = [
    { label: "Overview", view: "dashboard" as View, icon: LayoutPanelLeft },
    { label: "Submit Paper", view: "paper" as View, icon: FileText },
    { label: "Camera Ready", view: "cameraReady" as View, icon: UploadCloud },
    { label: "Contributions", view: "contribution" as View, icon: Sparkles },
    { label: "All Submissions", view: "submissions" as View, icon: Layers },
  ]
  
  if (isReviewer) navItems.push({ label: "Reviewer", view: "reviewer" as View, icon: BookOpenCheck })
  if (isAdmin) navItems.push({ label: "Admin", view: "admin" as View, icon: ShieldCheck })

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-zinc-200/50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between max-w-[1400px]">
        
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-8">
          
          <div className="flex items-center gap-2.5 cursor-default">
            <div className="h-7 w-7 bg-zinc-950 rounded-[6px] shadow-sm flex items-center justify-center">
              <span className="text-white font-bold text-xs">C P</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold tracking-tight text-zinc-950 text-sm hidden sm:inline-block">Conference<span className="font-normal text-zinc-500">Portal</span></span>
            </div>
            <div className="hidden sm:flex h-4 w-px bg-zinc-200 ml-4"></div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = current === item.view
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                    isActive 
                      ? "text-zinc-950 font-medium bg-zinc-100/80" 
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Right: User Menu & Mobile Trigger */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8 text-zinc-600">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 border-r border-zinc-200/50">
              <SheetHeader className="p-6 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-zinc-950 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">C P</span>
                  </div>
                  <SheetTitle className="text-left font-semibold text-zinc-950 text-sm">ConferencePortal</SheetTitle>
                </div>
                <SheetDescription className="hidden">Navigate between modules</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col p-4 gap-1">
                {navItems.map((item) => {
                  const isActive = current === item.view
                  const Icon = item.icon
                  return (
                    <button
                      key={item.view}
                      onClick={() => onNavigate(item.view)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm transition-all ${
                        isActive 
                          ? "bg-zinc-100 text-zinc-950 font-medium" 
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px] opacity-70" strokeWidth={1.5} />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full hover:bg-zinc-100/80 p-1 pr-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400">
                <Avatar className="h-7 w-7 border border-zinc-200 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-700 text-[10px] font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-1.5 rounded-xl border border-zinc-200 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-3xl" align="end" sideOffset={8}>
              <div className="px-2 py-2.5 mb-1 bg-zinc-50/50 rounded-lg border border-zinc-100/50">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium leading-none text-zinc-950 truncate">{userName}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{user}</p>
                </div>
              </div>
              
              <div className="px-1 py-1">
                <DropdownMenuItem onClick={() => onNavigate("profile")} className="cursor-pointer text-sm rounded-md h-8 text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900">
                  <User className="mr-2 h-4 w-4 opacity-70" />
                  Account Settings
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator className="bg-zinc-100 mx-1" />
              
              <div className="px-1 py-1">
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-sm rounded-md h-8 text-zinc-700 focus:bg-red-50 focus:text-red-700 hover:text-red-700 group">
                  <LogOut className="mr-2 h-4 w-4 opacity-70 group-hover:opacity-100" />
                  Sign out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
