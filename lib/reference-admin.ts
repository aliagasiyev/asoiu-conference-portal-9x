import api from './http'

export type RefItem = { id: number; name: string }

// Topics
export async function adminListTopics(): Promise<RefItem[]> {
  const { data } = await api.get('/api/reference/topics')
  return data
}

export async function adminCreateTopic(name: string): Promise<RefItem> {
  const { data } = await api.post('/api/reference/topics', { name })
  return data
}

export async function adminUpdateTopic(id: number, name: string): Promise<RefItem> {
  const { data } = await api.put(`/api/reference/topics/${id}`, { name })
  return data
}

export async function adminDeleteTopic(id: number): Promise<void> {
  await api.delete(`/api/reference/topics/${id}`)
}

// Paper Types
export async function adminListPaperTypes(): Promise<RefItem[]> {
  const { data } = await api.get('/api/reference/paper-types')
  return data
}

export async function adminCreatePaperType(name: string): Promise<RefItem> {
  const { data } = await api.post('/api/reference/paper-types', { name })
  return data
}

export async function adminUpdatePaperType(id: number, name: string): Promise<RefItem> {
  const { data } = await api.put(`/api/reference/paper-types/${id}`, { name })
  return data
}

export async function adminDeletePaperType(id: number): Promise<void> {
  await api.delete(`/api/reference/paper-types/${id}`)
}


