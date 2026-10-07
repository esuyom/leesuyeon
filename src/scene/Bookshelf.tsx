import { Suspense, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { Box, Cyl, Sph } from './primitives'
import { fitPhoto, rng } from './textures'
import framePhotoUrl from '../assets/cabnet_img.jpg'

const BOOK_COLORS = ['#7fe3c4', '#ffb547', '#e07a6b', '#9fb4ff', '#f3efe6', '#c59bff', '#5c6fa8', '#d9af7f', '#3e8c6e']
const SHELF_Y = [0.2, 1.45, 2.7, 3.95] // 선반 4칸 높이

type Book = { w: number; h: number; x: number; y: number; c: string; tilt?: number }

// 두 번째 칸 액자. 사진은 resize-assets.mjs로 미리 세워둠
const FRAME_H = 0.54 // 사진 세로. 가로는 비율대로 계산
const FRAME_BORDER = 0.04 // 액자 테두리 두께

function FramedPhoto() {
  const tex = useTexture(framePhotoUrl)
  const { w, h } = useMemo(() => fitPhoto(tex, FRAME_H, true), [tex])
  return (
    <group position={[3.3, 1.86, 0.55]} rotation={[-0.12, 0, 0]}>
      <Box size={[w + FRAME_BORDER * 2, h + FRAME_BORDER * 2, 0.05]} color="#2a2a33" />
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={tex} roughness={0.5} />
      </mesh>
    </group>
  )
}

// 책장 — Skills 섹션
export function Bookshelf() {
  // 시드 고정이라 새로고침해도 책 배치 그대로
  const books = useMemo(() => {
    const rnd = rng(7)
    const out: Book[] = []
    SHELF_Y.forEach((sy, i) => {
      let x = 1.14
      const stop = i === 1 ? 2.9 : i === 3 ? 2.6 : 3.45 // 칸마다 빈자리 남기려고 다르게
      while (x < stop) {
        const w = 0.1 + rnd() * 0.1
        const h = 0.72 + rnd() * 0.32
        out.push({ w, h, x: x + w / 2, y: sy + 0.07 + h / 2, c: BOOK_COLORS[Math.floor(rnd() * BOOK_COLORS.length)] })
        x += w + 0.012
      }
      // 꽉 차 보이지 말라고 기울인 책 한 권씩
      if (i === 0 || i === 2) out.push({ w: 0.11, h: 0.9, x: x + 0.2, y: sy + 0.07 + 0.4, c: BOOK_COLORS[(i + 3) % 9], tilt: -0.3 })
    })
    return out
  }, [])

  return (
    <group>
      <Box size={[3, 5.2, 0.06]} position={[2.5, 2.6, 0.03]} color="#9a6a45" />
      <Box size={[0.1, 5.2, 1.2]} position={[1.05, 2.6, 0.6]} color="#b9855a" />
      <Box size={[0.1, 5.2, 1.2]} position={[3.95, 2.6, 0.6]} color="#b9855a" />
      <Box size={[3, 0.1, 1.2]} position={[2.5, 5.25, 0.6]} color="#b9855a" />
      <Box size={[2.8, 0.2, 1.15]} position={[2.5, 0.1, 0.62]} color="#9a6a45" />
      {SHELF_Y.map((sy) => (
        <Box key={sy} size={[2.8, 0.07, 1.12]} position={[2.5, sy + 0.035, 0.6]} color="#b9855a" />
      ))}
      {books.map((b, i) => (
        <group key={i} position={[b.x, b.y, 0.55]} rotation={[0, 0, b.tilt ?? 0]}>
          <Box size={[b.w, b.h, 0.78]} color={b.c} roughness={0.85} />
          <Box size={[b.w + 0.004, 0.04, 0.782]} position={[0, b.h * 0.3, 0]} color="#f3efe6" shadow={false} />
        </group>
      ))}
      {/* 액자. 테두리 크기가 사진에 딸려서 통째로 Suspense 안 */}
      <Suspense fallback={null}>
        <FramedPhoto />
      </Suspense>
      {/* 맨 윗칸 작은 화분 */}
      <Cyl rt={0.13} rb={0.1} h={0.22} position={[3.4, 4.11, 0.6]} color="#f3efe6" />
      {Array.from({ length: 7 }, (_, k) => {
        const a = (k / 7) * Math.PI * 2
        return (
          <Sph
            key={k}
            r={0.09}
            scale={[0.6, 1.4, 0.6]}
            position={[3.4 + Math.cos(a) * 0.1, 4.33, 0.6 + Math.sin(a) * 0.1]}
            rotation={[Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5]}
            color={k % 2 ? '#4fa884' : '#5fc097'}
          />
        )
      })}
    </group>
  )
}
