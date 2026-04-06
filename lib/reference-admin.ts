import api from './http'

export type RefItem = { id: number; name: string; active?: boolean }

// Conference settings
export type ConferenceSettings = {
  id: number
  conferenceName: string
  submissionsOpen: boolean
  cameraReadyOpen: boolean
}

export async function adminGetConferenceSettings(): Promise<ConferenceSettings> {
  const { data } = await api.get('/api/admin/reference/settings')
  return data
}

export async function adminUpdateConferenceSettings(
  patch: Partial<Pick<ConferenceSettings, 'conferenceName' | 'submissionsOpen' | 'cameraReadyOpen'>>,
): Promise<ConferenceSettings> {
  const { data } = await api.put('/api/admin/reference/settings', patch)
  return data
}

// Topics
export async function adminListTopics(): Promise<RefItem[]> {
  const { data } = await api.get('/api/admin/reference/topics')
  return data
}

export async function adminCreateTopic(name: string): Promise<RefItem> {
  const { data } = await api.post('/api/admin/reference/topics', { name })
  return data
}

export async function adminUpdateTopic(id: number, name: string, active?: boolean): Promise<RefItem> {
  const body: any = { name }
  if (typeof active === 'boolean') body.active = active
  const { data } = await api.put(`/api/admin/reference/topics/${id}`, body)
  return data
}

export async function adminSetTopicActive(id: number, active: boolean, currentName: string): Promise<RefItem> {
  const { data } = await api.put(`/api/admin/reference/topics/${id}`, { name: currentName, active })
  return data
}

export async function adminDeleteTopic(id: number): Promise<void> {
  await api.delete(`/api/admin/reference/topics/${id}`)
}

// Paper Types
export async function adminListPaperTypes(): Promise<RefItem[]> {
  const { data } = await api.get('/api/admin/reference/paper-types')
  return data
}

export async function adminCreatePaperType(name: string): Promise<RefItem> {
  const { data } = await api.post('/api/admin/reference/paper-types', { name })
  return data
}

export async function adminUpdatePaperType(id: number, name: string, active?: boolean): Promise<RefItem> {
  const body: any = { name }
  if (typeof active === 'boolean') body.active = active
  const { data } = await api.put(`/api/admin/reference/paper-types/${id}`, body)
  return data
}

export async function adminSetPaperTypeActive(id: number, active: boolean, currentName: string): Promise<RefItem> {
  const { data } = await api.put(`/api/admin/reference/paper-types/${id}`, { name: currentName, active })
  return data
}

export async function adminDeletePaperType(id: number): Promise<void> {
  await api.delete(`/api/admin/reference/paper-types/${id}`)
}


