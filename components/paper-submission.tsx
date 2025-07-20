"use client"

import type React from "react"

import { useState } from "react"

interface CoAuthor {
  id: string
  title: string
  name: string
  surname: string
  email: string
  affiliation: string
  position: string
  country: string
  city: string
}

interface PaperSubmissionProps {
  user: string
  onNavigate: (view: "dashboard" | "paper" | "contribution") => void
  onLogout: () => void
}

export default function PaperSubmission({ user, onNavigate, onLogout }: PaperSubmissionProps) {
  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([])
  const [formData, setFormData] = useState({
    contactAuthor: "Elviz Ismayilov",
    title: "",
    keywords: "",
    abstract: "",
    paperType: "Full Research Paper",
    selectedSessions: [] as string[],
    file: null as File | null,
  })

  const sessionOptions = [
    "Data Science and Advanced Analytics",
    "Data Engineering",
    "High Performance Computing",
    "Machine Learning and Other AI Techniques",
    "Software Engineering",
    "Cyber Security and Best Practices",
    "Emerging Trends and Technologies in ICT Application",
    "Communications, network and hardware",
    "Signal Processing",
    "ICT in Business Administration, Governance, Finance and Economy",
    "ICT in Education and Research",
    "ICT in Medicine and Health Care",
  ]

  const addCoAuthor = () => {
    const newCoAuthor: CoAuthor = {
      id: Date.now().toString(),
      title: "Assoc.Prof.",
      name: "",
      surname: "",
      email: "",
      affiliation: "",
      position: "",
      country: "Afghanistan",
      city: "",
    }
    setCoAuthors([...coAuthors, newCoAuthor])
  }

  const removeCoAuthor = (id: string) => {
    setCoAuthors(coAuthors.filter((author) => author.id !== id))
  }

  const updateCoAuthor = (id: string, field: keyof CoAuthor, value: string) => {
    setCoAuthors(coAuthors.map((author) => (author.id === id ? { ...author, [field]: value } : author)))
  }

  const handleSessionChange = (session: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        selectedSessions: [...formData.selectedSessions, session],
      })
    } else {
      setFormData({
        ...formData,
        selectedSessions: formData.selectedSessions.filter((s) => s !== session),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Paper submission:", { formData, coAuthors })
    alert("Paper submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="px-4 py-2 text-center bg-green-400">
          You are Welcome: <strong>Elviz Ismayilov!</strong>
        </div>
        <div className="px-4 py-2 flex flex-wrap justify-center space-x-4 text-sm">
          <button onClick={() => onNavigate("dashboard")} className="hover:underline">
            My Home
          </button>
          <span>My Profile</span>
          <button onClick={() => onNavigate("paper")} className="hover:underline font-bold">
            Submit a Paper
          </button>
          <span>Submit Camera Ready</span>
          <button onClick={() => onNavigate("contribution")} className="hover:underline">
            Submit a Contribution
          </button>
          <span>My All Submissions</span>
          <span>Change Password</span>
          <button onClick={onLogout} className="hover:underline">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Paper Submission Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-lg font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">PAPER SUBMISSION</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Paper Details:</h3>
                <div className="flex items-center mb-2">
                  <span className="text-red-500 text-sm">* Denotes Required Field</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact / Main Author:</label>
                <input
                  type="text"
                  value={formData.contactAuthor}
                  onChange={(e) => setFormData({ ...formData, contactAuthor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="title of paper..."
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
                    placeholder="keywords of paper..."
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
                    placeholder="abstract of paper..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span className="absolute right-3 top-2 text-orange-500">*</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type of Paper:</label>
                <select
                  value={formData.paperType}
                  onChange={(e) => setFormData({ ...formData, paperType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                >
                  <option>Full Research Paper</option>
                  <option>Short Paper</option>
                  <option>Position Paper</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose session of interest:</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 p-3 rounded">
                  {sessionOptions.map((session, index) => (
                    <label key={index} className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.selectedSessions.includes(session)}
                        onChange={(e) => handleSessionChange(session, e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm">{session}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload your paper (.PDF):</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={addCoAuthor}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Add Co-author
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Co-Authors */}
          <div className="space-y-6">
            {coAuthors.map((author, index) => (
              <div key={author.id} className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">Co-Author {index + 1}:</h3>
                  <button
                    onClick={() => removeCoAuthor(author.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Remove this co-author
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title/Salutation:</label>
                    <select
                      value={author.title}
                      onChange={(e) => updateCoAuthor(author.id, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                    >
                      <option>Assoc.Prof.</option>
                      <option>Prof.</option>
                      <option>Dr.</option>
                      <option>Mr.</option>
                      <option>Ms.</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={author.name}
                        onChange={(e) => updateCoAuthor(author.id, "name", e.target.value)}
                        placeholder="co-author's name"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <span className="absolute right-3 top-2 text-orange-500">*</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Surname:</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={author.surname}
                        onChange={(e) => updateCoAuthor(author.id, "surname", e.target.value)}
                        placeholder="co-author's surname"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <span className="absolute right-3 top-2 text-orange-500">*</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">eMail:</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={author.email}
                        onChange={(e) => updateCoAuthor(author.id, "email", e.target.value)}
                        placeholder="co-author's email address"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <span className="absolute right-3 top-2 text-orange-500">*</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation/Organization:</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={author.affiliation}
                        onChange={(e) => updateCoAuthor(author.id, "affiliation", e.target.value)}
                        placeholder="co-author's affiliation"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <span className="absolute right-3 top-2 text-orange-500">*</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position:</label>
                    <select
                      value={author.position}
                      onChange={(e) => updateCoAuthor(author.id, "position", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                    >
                      <option value="">co-author's position</option>
                      <option>Professor</option>
                      <option>Associate Professor</option>
                      <option>Assistant Professor</option>
                      <option>Researcher</option>
                      <option>PhD Student</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country:</label>
                    <select
                      value={author.country}
                      onChange={(e) => updateCoAuthor(author.id, "country", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                    >
                      <option>Afghanistan</option>
                      <option>Albania</option>
                      <option>Algeria</option>
                      <option>Azerbaijan</option>
                      <option>Turkey</option>
                      <option>USA</option>
                      <option>UK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City:</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={author.city}
                        onChange={(e) => updateCoAuthor(author.id, "city", e.target.value)}
                        placeholder="co-author's city / region"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <span className="absolute right-3 top-2 text-orange-500">*</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addCoAuthor}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    Add Co-author
                  </button>
                </div>
              </div>
            ))}

            {coAuthors.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 mb-4">
                  Burada lazım olan məlumatlar daxil edilir. Sonra lazım olmasa silmək mümkün olsun.
                </p>
                <p className="text-gray-700">
                  Ondan sonra Submit a contribution form olmalıdır burada konfransa dəstak olan kim varsa o qeydiyyatdan
                  keçsin.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-gray-700">
          <p>Add Co-author burduqda ora əlavə olaraq bu pəncərə çıxmalıdır.</p>
        </div>
      </div>
    </div>
  )
}
