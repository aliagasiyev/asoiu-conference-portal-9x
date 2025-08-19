"use client"

import { useEffect, useState } from 'react'
import api from '@/lib/http'
import { tokenHasAdmin } from '@/lib/utils'

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const cached = localStorage.getItem('asiou_is_admin')
    if (cached !== null) return cached === '1'
    const t = localStorage.getItem('asiou_jwt')
    return tokenHasAdmin(t)
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await api.get('/api/admin/reference/topics')
        if (!cancelled) {
          setIsAdmin(true)
          if (typeof window !== 'undefined') localStorage.setItem('asiou_is_admin', '1')
        }
      } catch {
        if (!cancelled) {
          setIsAdmin(false)
          if (typeof window !== 'undefined') localStorage.setItem('asiou_is_admin', '0')
        }
      }
    })()
    return () => { cancelled = true }
  }, [])

  return isAdmin
}


