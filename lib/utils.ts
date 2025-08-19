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
