import { useEffect, useState } from 'react'
import api from '@/lib/http'
import { tokenHasReviewer } from '@/lib/utils'

export default function useIsReviewer() {
  const [isReviewer, setIsReviewer] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const cached = localStorage.getItem('asiou_is_reviewer')
    if (cached !== null) return cached === '1'
    const t = localStorage.getItem('asiou_jwt')
    return tokenHasReviewer(t)
  })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await api.get('/api/reviewer/assignments')
        if (!cancelled) {
          setIsReviewer(true)
          if (typeof window !== 'undefined') localStorage.setItem('asiou_is_reviewer', '1')
        }
      } catch {
        if (!cancelled) {
          setIsReviewer(false)
          if (typeof window !== 'undefined') localStorage.setItem('asiou_is_reviewer', '0')
        }
      }
    })()
    return () => { cancelled = true }
  }, [])

  return isReviewer
}
