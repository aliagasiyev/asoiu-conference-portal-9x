"use client"

import React, { useState } from "react"
import useAuthGuard from "@/hooks/useAuthGuard"
import { createContribution } from "@/lib/contributions"
import TopNav from "@/components/ui/top-nav"

interface ContributionFormProps {
  user: string
  onNavigate: (view: "dashboard" | "paper" | "contribution") => void
  onLogout: () => void
}

const roleToEnum = (v: string) =>
    v.toUpperCase().replaceAll(" ", "_") // Speaker -> SPEAKER, Session Chair -> SESSION_CHAIR

const speechToEnum = (v: string) => {
  const map: Record<string,string> = {
    "Keynote":"KEYNOTE",
    "Invited Talk":"INVITED",
    "Panel Discussion":"TALK",
    "Workshop":"TALK",
  }
  return map[v] ?? "TALK"
}

const timeToEnum = (v: string) => {
  const m = v.replace(" min","")
  return `MIN_${m}`
}

export default function ContributionForm({ user, onNavigate, onLogout }: ContributionFormProps) {
  useAuthGuard()
  const [formData, setFormData] = useState({
    roles: [] as string[],
    speechTitle: "",
    keywords: "",
    abstract: "",
    briefBio: "",
    speechType: "Keynote",
    timeScope: "20 min",
    rightAudience: "",
    previousSpeeches: "",
    exhibitionAtConference: false,
    sponsoringConference: false,
  })

  const toggleRole = (value: string, checked: boolean) => {
    setFormData((f) => ({
      ...f,
      roles: checked ? [...f.roles, value] : f.roles.filter((r) => r !== value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      roles: formData.roles.map(roleToEnum),
      title: formData.speechTitle,
      keywords: formData.keywords,
      description: formData.abstract,
      bio: formData.briefBio,
      speechType: speechToEnum(formData.speechType),
      timeScope: timeToEnum(formData.timeScope),
      audience: formData.rightAudience,
      previousTalkUrl: formData.previousSpeeches || undefined,
    }
    try {
      await createContribution(payload)
      alert("Contribution submitted successfully!")
      onNavigate("dashboard")
    } catch {
      alert("Failed to submit contribution")
    }
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <TopNav user={user} current={"contribution" as any} onNavigate={onNavigate as any} onLogout={onLogout} />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h1 className="text-xl font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">
              SUBMIT A CONTRIBUTION FORM
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-4">CONTRIBUTION:</h3>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Opportunities you are interested in:</label>
                  <span className="text-red-500 text-sm">* Denotes Required Field</span>
                </div>

                <div className="mb-4">
                  <span className="block text-sm font-medium text-gray-700 mb-3">Participate as:</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {["Speaker", "Workshop Moderator"].map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.roles.includes(option)}
                                onChange={(e) => toggleRole(option, e.target.checked)}
                                className="text-blue-600"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {["Committee Member", "Attendee", "Reviewer", "Session Chair"].map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={option}
                                checked={formData.roles.includes(option)}
                                onChange={(e) => toggleRole(option, e.target.checked)}
                                className="text-blue-600"
                            />
                            <span className="text-sm">{option}</span>
                          </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title of speech:</label>
                <div className="relative">
                  <input
                      type="text"
                      value={formData.speechTitle}
                      onChange={(e) => setFormData({ ...formData, speechTitle: e.target.value })}
                      placeholder="title of proposed speech..."
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />
                  <span className="absolute right-3 top-2 text-orange-500">*</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords:</label>
                <div className="relative">
                  <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="keywords..."
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />
                  <span className="absolute right-3 top-2 text-orange-500">*</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Abstract:</label>
                <div className="relative">
                <textarea
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    placeholder="short abstract (up to 2000 characters)..."
                    rows={4}
                    maxLength={2000}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                  <span className="absolute right-3 top-2 text-orange-500">*</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brief BIO:</label>
                <div className="relative">
                <textarea
                    value={formData.briefBio}
                    onChange={(e) => setFormData({ ...formData, briefBio: e.target.value })}
                    placeholder="short biography (up to 1500 characters)..."
                    rows={4}
                    maxLength={1500}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                  <span className="absolute right-3 top-2 text-orange-500">*</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speech type:</label>
                <select
                    value={formData.speechType}
                    onChange={(e) => setFormData({ ...formData, speechType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                >
                  <option>Keynote</option>
                  <option>Invited Talk</option>
                  <option>Panel Discussion</option>
                  <option>Workshop</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time scope:</label>
                <select
                    value={formData.timeScope}
                    onChange={(e) => setFormData({ ...formData, timeScope: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                >
                  <option>20 min</option>
                  <option>30 min</option>
                  <option>45 min</option>
                  <option>60 min</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Right Audience:</label>
                <div className="relative">
                  <input
                      type="text"
                      value={formData.rightAudience}
                      onChange={(e) => setFormData({ ...formData, rightAudience: e.target.value })}
                      placeholder="who is the target audience..."
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />
                  <span className="absolute right-3 top-2 text-orange-500">*</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous speeches:</label>
                <input
                    type="text"
                    value={formData.previousSpeeches}
                    onChange={(e) => setFormData({ ...formData, previousSpeeches: e.target.value })}
                    placeholder="reference (URL) to previous speeches..."
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Additional opportunities:</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox"
                           checked={formData.exhibitionAtConference}
                           onChange={(e) => setFormData({ ...formData, exhibitionAtConference: e.target.checked })}
                           className="text-blue-600"
                    />
                    <span className="text-sm">Exhibition at conference</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox"
                           checked={formData.sponsoringConference}
                           onChange={(e) => setFormData({ ...formData, sponsoringConference: e.target.checked })}
                           className="text-blue-600"
                    />
                    <span className="text-sm">Sponsoring conference</span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded font-medium transition-colors">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}