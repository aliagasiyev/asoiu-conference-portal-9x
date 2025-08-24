import api from './http'

// Papers
export async function adminListPapers() {
  const { data } = await api.get('/api/admin/papers')
  return data
}
export async function adminGetPaper(id: number) {
  const { data } = await api.get(`/api/admin/papers/${id}`)
  return data
}
export async function adminTechnicalCheck(id: number, passed = true) {
  const { data } = await api.post(`/api/admin/papers/${id}/technical-check`, null, { params: { passed } })
  return data
}
export async function adminFinalDecision(id: number, status: 'ACCEPTED'|'REJECTED'|'REVISIONS_REQUIRED') {
  await api.post(`/api/admin/papers/${id}/final-decision`, { status })
}

// Reviews
export async function adminAssignReviewer(paperId: number, reviewerId: number, dueAt: string) {
  const { data } = await api.post(`/api/admin/reviews/papers/${paperId}/assign`, { reviewerId, dueAt })
  return data
}
export async function adminListAssignmentsByPaper(paperId: number) {
  const { data } = await api.get(`/api/admin/reviews/papers/${paperId}/assignments`)
  return data
}
export async function adminListReviewsByPaper(paperId: number) {
  const { data } = await api.get(`/api/admin/reviews/papers/${paperId}/reviews`)
  return data
}

// Users
export async function adminCreateReviewer(payload: { email: string; password: string; firstName: string; lastName: string }) {
  await api.post('/api/admin/users/reviewers', payload)
}
