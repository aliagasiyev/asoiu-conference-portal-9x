import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type DecodedToken = {
  sub?: string
  roles?: string[] | string
  [k: string]: any
}

export function decodeJwt(token: string | null): DecodedToken | null {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(Array.prototype.map.call(json, (c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join('')))
  } catch {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return null
    }
  }
}

export function tokenHasAdmin(token: string | null): boolean {
  const d = decodeJwt(token)
  if (!d) return false
  const roles = Array.isArray(d.roles) ? d.roles : typeof d.roles === 'string' ? [d.roles] : []
  return roles.some(r => r.toUpperCase().includes('ADMIN'))
}

export function getWelcomeName(userEmail: string | null | undefined): string {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('asiou_user_name')
    if (cached && cached.trim().length > 0) return cached
    const token = localStorage.getItem('asiou_jwt')
    const d = decodeJwt(token)
    if (d) {
      const candidate = (d.firstName && d.lastName) ? `${d.firstName} ${d.lastName}` : (d.given_name && d.family_name) ? `${d.given_name} ${d.family_name}` : (d.name as string)
      if (candidate && candidate.trim().length > 0) {
        localStorage.setItem('asiou_user_name', candidate)
        return candidate
      }
    }
  }
  const email = (userEmail || '').toLowerCase()
  if (email === 'admin@asoiu.az') return 'Elviz Ismayilov'
  return ''
}
