import api from './http'

// Reviewer endpoints
export async function listMyAssignments() {
  const { data } = await api.get('/api/reviewer/assignments')
  return data as Array<{
    id: number
    paperId: number
    paperTitle: string
    dueAt: string
    acceptedAt?: string | null
    completed?: boolean
  }>
}

export async function acceptAssignment(assignmentId: number) {
  const { data } = await api.post(`/api/reviewer/assignments/${assignmentId}/accept`)
  return data
}

export async function submitReview(assignmentId: number, payload: { decision: 'ACCEPT'|'ACCEPT_WITH_REVISIONS'|'REJECT'; comments: string }) {
  await api.post(`/api/reviewer/assignments/${assignmentId}/review`, payload)
}

export async function getAssignedPaper(assignmentId: number) {
  const { data } = await api.get(`/api/reviewer/assignments/${assignmentId}/paper`)
  return data
}

export async function listAssignedPapers() {
  const { data } = await api.get('/api/reviewer/papers')
  return data
}

// Admin endpoints (optional usage from UI)
export async function adminAssignReviewer(paperId: number, payload: { reviewerEmail: string; dueAt: string }) {
  const { data } = await api.post(`/api/admin/reviews/papers/${paperId}/assign`, payload)
  return data
}

export async function adminListAssignmentsByPaper(paperId: number) {
  const { data } = await api.get(`/api/admin/reviews/papers/${paperId}/assignments`)
  return data
}


