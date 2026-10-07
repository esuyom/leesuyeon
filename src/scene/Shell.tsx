import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Box, Cyl, Sph } from './primitives'
import { corkTexture, fitPhoto, floorTexture, skyTexture } from './textures'
import photoUrl from '../assets/wall_img.png'
import { useStore } from '../store'

// 바닥 + 벽 2장 벽은 두 면만 (카메라가 그쪽만 봄)
export function Shell() {
  const floor = useMemo(() => floorTexture(), [])
  const night = useStore((s) => s.night)
  return (
    <group>
      <Box size={[10, 0.2, 10]} position={[5, -0.1, 5]} map={floor} color="#ffffff" roughness={0.6} />
      <Box size={[0.3, 7, 10.3]} position={[-0.15, 3.5, 4.85]} color={night ? '#34406a' : '#8796c9'} />
      <Box size={[10, 7, 0.3]} position={[5, 3.5, -0.15]} color={night ? '#3b4876' : '#94a3d4'} />
      <Box size={[0.3, 0.06, 10.3]} position={[-0.15, 7.03, 4.85]} color="#56638f" />
      <Box size={[10.3, 0.06, 0.3]} position={[4.85, 7.03, -0.15]} color="#56638f" />
      <Box size={[0.06, 0.28, 10]} position={[0.03, 0.14, 5]} color="#e9e3d6" />
      <Box size={[10, 0.28, 0.06]} position={[5, 0.14, 0.03]} color="#e9e3d6" />
    </group>
  )
}

// 창문 — 하늘은 그림, 커튼은 원기둥 세워서 주름 흉내
export function Window() {
  const night = useStore((s) => s.night)
  const sky = useMemo(() => skyTexture(night), [night])
  const frame = '#e9e3d6'
  return (
    <group>
      {/* 하늘은 meshBasic + toneMapped 꺼서 조명 영향 안 받게 */}
      <mesh position={[6.9, 4.4, 0.02]}>
        <planeGeometry args={[3, 2.8]} />
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      <Box size={[3.2, 0.12, 0.16]} position={[6.9, 5.86, 0.08]} color={frame} />
      <Box size={[3.2, 0.12, 0.16]} position={[6.9, 2.94, 0.08]} color={frame} />
      <Box size={[0.12, 3, 0.16]} position={[5.34, 4.4, 0.08]} color={frame} />
      <Box size={[0.12, 3, 0.16]} position={[8.46, 4.4, 0.08]} color={frame} />
      <Box size={[0.06, 2.8, 0.1]} position={[6.9, 4.4, 0.06]} color={frame} />
      <Box size={[3, 0.06, 0.1]} position={[6.9, 4.4, 0.06]} color={frame} />
      <Box size={[3.5, 0.08, 0.38]} position={[6.9, 2.86, 0.19]} radius={0.02} color="#f3efe6" />
      {/* 창틀 위 작은 화분 */}
      <Cyl rt={0.14} rb={0.11} h={0.24} position={[7.9, 3.02, 0.2]} color="#e07a6b" />
      <Sph r={0.15} scale={[1, 1.2, 1]} position={[7.9, 3.25, 0.2]} color="#5fc097" />
      <Sph r={0.11} position={[7.82, 3.38, 0.24]} color="#4fa884" />
      {/* 커튼 */}
      <Box size={[3.9, 0.04, 0.04]} position={[6.9, 6.2, 0.3]} color="#2a2a33" metalness={0.6} roughness={0.3} />
      {[5.05, 8.75].map((sx) =>
        [0, 1, 2, 3, 4].map((i) => (
          <Cyl key={`${sx}-${i}`} rt={0.075} rb={0.09} h={3.6} seg={16} position={[sx - 0.24 + i * 0.12, 4.38, 0.3 + (i % 2) * 0.05]} color="#8f7bc0" roughness={0.95} />
        )),
      )}
    </group>
  )
}

// 뒷벽 전구 줄 — sin으로 축 늘어뜨림
export function StringLights() {
  const night = useStore((s) => s.night)
  const bulbs = useMemo(
    () =>
      Array.from({ length: 27 }, (_, i) => {
        const t = i / 26
        return [0.3 + t * 9.4, 6.65 - Math.sin(t * Math.PI * 3) ** 2 * 0.28, 0.08] as [number, number, number]
      }),
    [],
  )
  return (
    <group>
      {bulbs.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 12, 8]} />
          <meshBasicMaterial color={night ? '#ffd28a' : '#cfc7b6'} toneMapped={false} />
        </mesh>
      ))}
      {night && <pointLight color="#ffd28a" intensity={1.5} distance={6} decay={2} position={[5, 6.3, 0.6]} />}
    </group>
  )
}

// 왼쪽 벽 시계. 실제 현재 시각으로 돔
export function WallClock() {
  const hour = useRef<THREE.Group>(null)
  const minute = useRef<THREE.Group>(null)
  useFrame(() => {
    const d = new Date()
    const m = d.getMinutes() + d.getSeconds() / 60
    const h = (d.getHours() % 12) + m / 60
    if (minute.current) minute.current.rotation.x = -(m / 60) * Math.PI * 2
    if (hour.current) hour.current.rotation.x = -(h / 12) * Math.PI * 2
  })
  return (
    <group position={[0, 5.75, 3.0]}>
      <Cyl rt={0.44} rb={0.44} h={0.05} position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]} color="#2a2a33" />
      <Cyl rt={0.42} rb={0.42} h={0.07} position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]} color="#f3efe6" />
      {/* 바늘은 X축 기준 회전 (벽이 +X를 바라봄) */}
      <group ref={hour} position={[0.11, 0, 0]}>
        <Box size={[0.02, 0.2, 0.035]} position={[0, 0.09, 0]} color="#1e2236" shadow={false} />
      </group>
      <group ref={minute} position={[0.12, 0, 0]}>
        <Box size={[0.02, 0.3, 0.025]} position={[0, 0.13, 0]} color="#1e2236" shadow={false} />
      </group>
      <Sph r={0.025} position={[0.13, 0, 0]} color="#e07a6b" shadow={false} />
    </group>
  )
}

// 코르크보드 사진. 흰 테두리만 얇게, 비율은 원본 그대로
const PHOTO_H = 0.405 // 세로만 정해두고 가로는 사진 비율대로 계산
const BORDER = 0.025 // 흰 테두리 두께

function PolaroidPhoto() {
  const tex = useTexture(photoUrl)
  const { w } = useMemo(() => fitPhoto(tex, PHOTO_H), [tex])

  // 한 group에 묶어야 테두리랑 사진 기울기가 안 어긋남
  return (
    <group position={[0.075, 4.35, 8.35]} rotation={[-0.15, 0, 0]}>
      <Box size={[0.012, PHOTO_H + BORDER * 2, w + BORDER * 2]} color="#ffffff" />
      <mesh position={[0.008, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[w, PHOTO_H]} />
        <meshStandardMaterial map={tex} roughness={0.55} />
      </mesh>
      <Sph r={0.03} position={[0.025, PHOTO_H / 2, 0]} color="#ffb547" />
    </group>
  )
}

// 코르크보드 — Experience 섹션
export function Corkboard() {
  const cork = useMemo(() => corkTexture(), [])
  // [z, y, 색, 기울기]
  const notes: [number, number, string, number][] = [
    [7.75, 5.05, '#f3efe6', 0.1],
    [8.55, 5.15, '#ffe27a', -0.12],
    [9.2, 4.9, '#9fb4ff', 0.08],
    [7.8, 3.95, '#7fe3c4', -0.06],
    [8.9, 3.75, '#ff9fb4', 0.14],
  ]
  return (
    <group>
      <Box size={[0.06, 2.6, 2.4]} position={[0.03, 4.3, 8.4]} radius={0.02} color="#8a5c3c" />
      <mesh position={[0.065, 4.3, 8.4]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[2.25, 2.45]} />
        <meshStandardMaterial map={cork} roughness={1} />
      </mesh>
      {notes.map(([z, y, c, r], i) => (
        <group key={i}>
          <Box size={[0.012, 0.5, 0.5]} position={[0.075, y, z]} rotation={[r, 0, 0]} color={c} />
          <Sph r={0.035} position={[0.1, y + 0.2, z]} color="#e07a6b" />
          {[0, 1, 2].map((l) => (
            <Box key={l} size={[0.004, 0.025, 0.32 - l * 0.06]} position={[0.083, y + 0.05 - l * 0.09, z - 0.02 * l]} rotation={[r, 0, 0]} color="#55586a" shadow={false} />
          ))}
        </group>
      ))}
      {/* 테두리 크기가 사진에 딸려서 통째로 Suspense 안 */}
      <Suspense fallback={null}>
        <PolaroidPhoto />
      </Suspense>
    </group>
  )
}
