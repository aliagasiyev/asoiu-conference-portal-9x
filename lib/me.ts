import api from './http'

export async function changePassword(newPassword: string) {
  await api.put('/api/me/password', { newPassword })
}


