import { useSyncExternalStore } from 'react'

// matchMedia 구독 — resize 리스너 직접 안 달아도 됨
function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false, // 서버 스냅샷
  )
}

export const useIsMobile = () => useMedia('(max-width: 767px)')
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')

// 안 되면 3D 포기하고 2D 페이지로
export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
