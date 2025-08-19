import api from './http'

export async function getHome() {
  const { data } = await api.get('/api/home')
  return data as { submittedPapers: any[]; contributions: any[] }
}


