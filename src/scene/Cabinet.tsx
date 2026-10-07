import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Box, Cyl, Rod, Sph, chrome } from './primitives'
import { useStore } from '../store'

const RECORD_COLORS = ['#7fe3c4', '#e07a6b', '#f3efe6', '#5c6fa8', '#ffb547', '#3e8c6e', '#c59bff']

// 창문 아래 수납장 + 턴테이블 + 스피커 — About 섹션
export function Cabinet() {
  const platter = useRef<THREE.Group>(null)
  const spinning = useStore((s) => s.focus === 'about' || s.soundOn) // 음악 켜져 있거나 About 보는 중
  const speed = useRef(0)

  useFrame((_, dt) => {
    // 뚝 멈추면 어색해서 감속
    speed.current = THREE.MathUtils.lerp(speed.current, spinning ? 3.5 : 0, Math.min(1, dt * 2))
    if (platter.current) platter.current.rotation.y -= speed.current * dt
  })

  return (
    <group>
      <Box size={[3.2, 1.1, 1.3]} position={[7.2, 0.95, 0.65]} radius={0.04} color="#a06f4a" />
      <Box size={[1.55, 0.95, 0.04]} position={[6.4, 0.95, 1.31]} radius={0.015} color="#b9855a" />
      <Box size={[1.55, 0.95, 0.04]} position={[8.0, 0.95, 1.31]} radius={0.015} color="#c48e62" />
      {Array.from({ length: 9 }, (_, k) => (
        <Box key={k} size={[0.03, 0.85, 0.02]} position={[7.3 + k * 0.15, 0.95, 1.34]} color="#9a6a45" shadow={false} />
      ))}
      <Cyl rt={0.03} rb={0.03} h={0.25} position={[7.05, 0.95, 1.36]} color="#2a2a33" metalness={0.6} roughness={0.3} />
      {[
        [5.75, 0.15],
        [8.65, 0.15],
        [5.75, 1.15],
        [8.65, 1.15],
      ].map(([x, z], i) => (
        <Cyl key={i} rt={0.05} rb={0.03} h={0.4} position={[x, 0.2, z]} color="#3a2a20" />
      ))}

      {/* 턴테이블 */}
      <Box size={[1.5, 0.14, 1.0]} position={[6.55, 1.57, 0.65]} radius={0.04} color="#2c2c36" roughness={0.4} />
      <group ref={platter} position={[6.4, 1.66, 0.65]}>
        <Cyl rt={0.43} rb={0.43} h={0.04} {...chrome} color="#9ea2b3" />
        <Cyl rt={0.41} rb={0.41} h={0.015} position={[0, 0.03, 0]} color="#111116" roughness={0.25} />
        <Cyl rt={0.13} rb={0.13} h={0.017} position={[0, 0.035, 0]} color="#e07a6b" />
        <Box size={[0.04, 0.02, 0.1]} position={[0.07, 0.045, 0]} color="#f3efe6" shadow={false} />
      </group>
      <Cyl rt={0.06} rb={0.07} h={0.1} position={[7.1, 1.69, 0.3]} {...chrome} />
      <Rod from={[7.1, 1.75, 0.3]} to={[6.6, 1.76, 0.9]} r={0.012} {...chrome} />
      <Box size={[0.08, 0.04, 0.12]} position={[6.58, 1.73, 0.92]} color="#2a2a33" />

      {/* 스피커 */}
      {[7.75, 8.45].map((x) => (
        <group key={x}>
          <Box size={[0.55, 0.85, 0.6]} position={[x, 1.93, 0.55]} radius={0.05} color="#e9e3d6" />
          <Cyl rt={0.17} rb={0.17} h={0.03} position={[x, 1.8, 0.86]} rotation={[Math.PI / 2, 0, 0]} color="#2a2a33" />
          <Cyl rt={0.07} rb={0.07} h={0.035} position={[x, 2.12, 0.86]} rotation={[Math.PI / 2, 0, 0]} color="#55586a" />
        </group>
      ))}
      {/* 기대 세운 앨범 */}
      <Box size={[0.7, 0.7, 0.03]} position={[7.25, 1.85, 0.12]} rotation={[0.12, 0, 0]} color="#ffb547" />
      <Sph r={0.18} scale={[1, 1, 0.1]} position={[7.25, 1.9, 0.16]} color="#e07a6b" />

      {/* 바닥 LP 상자 */}
      <Box size={[0.8, 0.6, 0.8]} position={[4.8, 0.3, 0.6]} radius={0.02} color="#9a6a45" />
      {RECORD_COLORS.map((c, k) => (
        <Box key={k} size={[0.04, 0.66, 0.68]} position={[4.5 + k * 0.08, 0.38, 0.6]} rotation={[0, 0, -0.08 + k * 0.02]} color={c} />
      ))}
    </group>
  )
}
