import { useEffect, useMemo, useRef } from 'react'
import { Html } from '@react-three/drei'
import { Box } from './primitives'
import { screenTexture } from './textures'
import { useStore } from '../store'
import { profile } from '../data/content'
import { ProjectsOS } from '../ui/ProjectsOS'
import { useIsMobile } from '../ui/useMedia'

// 화면 2.62×1.48 world = 1048×592 px (drei Html 기준 1px = distanceFactor/400)
// 둘 중 하나만 바꾸면 OS 화면이 베젤 밖으로 삐져나감
export const SCREEN = { center: [0.748, 3.97, 4.4] as [number, number, number], w: 2.62, h: 1.48 }

// Html(transform) 안쪽은 3D 레이어라 휠이 안 내려옴. 직접 굴림
// Html이 별도 root로 늦게 떠서 ref·effect는 이 안쪽에 둠
function Screen() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const onWheel = (e: WheelEvent) => {
      const hit = e.composedPath().find((n) => {
        if (!(n instanceof HTMLElement) || n === root) return false
        if (n.scrollHeight <= n.clientHeight) return false
        return /auto|scroll/.test(getComputedStyle(n).overflowY)
      }) as HTMLElement | undefined
      if (!hit) return
      e.preventDefault() // 안 막으면 두 배로 굴러감
      e.stopPropagation()
      hit.scrollTop += e.deltaY
    }
    root.addEventListener('wheel', onWheel, { passive: false })
    return () => root.removeEventListener('wheel', onWheel)
  }, [])

  // stopPropagation 없으면 화면 클릭이 씬으로 새서 포커스가 풀림
  return (
    <div ref={ref} className="screen-root" onPointerDown={(e) => e.stopPropagation()}>
      <ProjectsOS />
    </div>
  )
}

// 모니터 — 멀리선 그림, 줌인하면 진짜 HTML로 교체
export function Monitor() {
  const tex = useMemo(() => screenTexture(profile.siteName), [])
  const live = useStore((s) => s.focus === 'projects' && s.arrived) // 도착까지 기다림. 미리 띄우면 무거움
  const mobile = useIsMobile()

  return (
    <group>
      <Box size={[0.5, 0.04, 0.8]} position={[0.75, 2.48, 4.4]} radius={0.02} color="#c9ccd8" metalness={0.6} roughness={0.3} />
      <Box size={[0.1, 1.0, 0.24]} position={[0.6, 3.0, 4.4]} radius={0.03} color="#c9ccd8" metalness={0.6} roughness={0.3} />
      <Box size={[0.09, 1.62, 2.78]} position={[0.7, 3.95, 4.4]} radius={0.035} color="#d6d9e3" metalness={0.3} roughness={0.35} />
      <mesh position={SCREEN.center} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[SCREEN.w, SCREEN.h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* 베젤 포스트잇 */}
      <Box size={[0.01, 0.2, 0.2]} position={[0.752, 4.68, 5.62]} rotation={[0.15, 0, 0]} color="#ffe27a" />
      <Box size={[0.01, 0.2, 0.2]} position={[0.752, 4.66, 5.38]} rotation={[-0.1, 0, 0]} color="#ff9fb4" />
      <Box size={[0.01, 0.2, 0.2]} position={[0.752, 3.25, 3.2]} rotation={[0.2, 0, 0]} color="#7fe3c4" />

      {/* 모바일은 OS 화면 대신 패널로 */}
      {live && !mobile && (
        <Html
          transform
          distanceFactor={1}
          position={[SCREEN.center[0] + 0.004, SCREEN.center[1], SCREEN.center[2]]}
          rotation={[0, Math.PI / 2, 0]}
          zIndexRange={[8, 0]}
        >
          <Screen />
        </Html>
      )}
    </group>
  )
}
