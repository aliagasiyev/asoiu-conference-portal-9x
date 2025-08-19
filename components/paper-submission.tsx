"use client"

import React, { useEffect, useState } from "react"
import useAuthGuard from "@/hooks/useAuthGuard"
import { getTopics, getPaperTypes } from "@/lib/reference"
import { addCoAuthor, createPaper, submitPaper, uploadPdf } from "@/lib/papers"
import TopNav from "@/components/ui/top-nav"

interface CoAuthorUI {
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
  useAuthGuard()
  const [coAuthors, setCoAuthors] = useState<CoAuthorUI[]>([])
  const [paperId, setPaperId] = useState<number | null>(null)
  const [topics, setTopics] = useState<{ id:number; name:string }[]>([])
  const [paperTypes, setPaperTypes] = useState<{ id:number; name:string }[]>([])
  const [loadingRefs, setLoadingRefs] = useState(true)
  const [file, setFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    keywords: "",
    abstract: "",
    paperTypeId: 0,
    selectedTopicIds: [] as number[],
  })

  useEffect(() => {
    (async () => {
      try {
        setLoadingRefs(true)
        const [tps, types] = await Promise.all([getTopics(), getPaperTypes()])
        setTopics(tps || [])
        setPaperTypes(types || [])
        if (types?.[0]) setFormData(f => ({ ...f, paperTypeId: types[0].id }))
      } finally {
        setLoadingRefs(false)
      }
    })()
  }, [])

  const toggleTopic = (id: number, checked: boolean) => {
    setFormData(f => ({
      ...f,
      selectedTopicIds: checked ? [...f.selectedTopicIds, id] : f.selectedTopicIds.filter(x => x !== id)
    }))
  }

  const addCoAuthorUI = () => {
    setCoAuthors(prev => [...prev, {
      id: Date.now().toString(),
      title: "Assoc.Prof.",
      name: "",
      surname: "",
      email: "",
      affiliation: "",
      position: "",
      country: "Azerbaijan",
      city: ""
    }])
  }

  const removeCoAuthorUI = (id: string) => setCoAuthors(prev => prev.filter(a => a.id !== id))

  const updateCoAuthorUI = (id: string, field: keyof CoAuthorUI, value: string) =>
      setCoAuthors(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.keywords || !formData.abstract || !formData.paperTypeId || formData.selectedTopicIds.length === 0) {
      alert("Please fill all required fields.")
      return
    }

    const payload = {
      title: formData.title,
      keywords: formData.keywords,
      paperAbstract: formData.abstract,
      paperTypeId: formData.paperTypeId,
      topicIds: formData.selectedTopicIds,
      coAuthors: coAuthors.map(c => ({
        firstName: c.name,
        lastName: c.surname,
        email: c.email,
        affiliation: c.affiliation,
        position: c.position,
        country: c.country,
        city: c.city
      }))
    }

    try {
      const created = await createPaper(payload)
      setPaperId(created.id)
      if (file) {
        await uploadPdf(created.id, file)
      }
      await submitPaper(created.id) // initial submit per flow (optional)
      alert("Paper created and submitted successfully.")
    } catch (err) {
      alert("Create/submit failed. Check required fields and settings.")
    }
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <TopNav user={user} current={"paper" as any} onNavigate={onNavigate as any} onLogout={onLogout} />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h1 className="text-lg font-bold text-orange-600 border-b border-blue-200 pb-2 mb-6">PAPER SUBMISSION</h1>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-4">Paper Details:</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-red-500 text-sm">* Denotes Required Field</span>
                  </div>
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
                      disabled={loadingRefs || paperTypes.length === 0}
                      value={formData.paperTypeId}
                      onChange={(e) => setFormData({ ...formData, paperTypeId: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                  >
                    {paperTypes.length === 0 ? (
                        <option value={0}>No paper types configured</option>
                    ) : (
                        paperTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose session of interest:</label>
                  {topics.length === 0 ? (
                      <div className="text-sm text-gray-500 border border-gray-200 p-3 rounded bg-gray-50">
                        No topics configured. Please contact the administrator.
                      </div>
                  ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 p-3 rounded">
                        {topics.map((t) => (
                            <label key={t.id} className="flex items-start space-x-2">
                              <input
                                  type="checkbox"
                                  checked={formData.selectedTopicIds.includes(t.id)}
                                  onChange={(e) => toggleTopic(t.id, e.target.checked)}
                                  className="mt-1"
                              />
                              <span className="text-sm">{t.name}</span>
                            </label>
                        ))}
                      </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload your paper (.PDF):</label>
                  <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                      type="button"
                      onClick={addCoAuthorUI}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    Add Co-author
                  </button>
                  <button
                      type="submit"
                      disabled={paperTypes.length === 0 || topics.length === 0}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-2 rounded font-medium transition-colors"
                  >
                    Create & Submit
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              {coAuthors.map((author, index) => (
                  <div key={author.id} className="bg-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-700">Co-Author {index + 1}:</h3>
                      <button
                          onClick={() => removeCoAuthorUI(author.id)}
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
                            onChange={(e) => updateCoAuthorUI(author.id, "title", e.target.value)}
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
                              onChange={(e) => updateCoAuthorUI(author.id, "name", e.target.value)}
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
                              onChange={(e) => updateCoAuthorUI(author.id, "surname", e.target.value)}
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
                              onChange={(e) => updateCoAuthorUI(author.id, "email", e.target.value)}
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
                              onChange={(e) => updateCoAuthorUI(author.id, "affiliation", e.target.value)}
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
                            onChange={(e) => updateCoAuthorUI(author.id, "position", e.target.value)}
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
                            onChange={(e) => updateCoAuthorUI(author.id, "country", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
                        >
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
                              onChange={(e) => updateCoAuthorUI(author.id, "city", e.target.value)}
                              placeholder="co-author's city / region"
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                          />
                          <span className="absolute right-3 top-2 text-orange-500">*</span>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}