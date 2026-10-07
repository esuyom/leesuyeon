import { useMemo } from 'react'
import { Box, Cyl, Rod, Sph, chrome, metal } from './primitives'

// 의자 중심. 부품이 많아서 전부 여기 기준
const CX = 3.75
const CZ = 4.75
const SEAT_TOP = 1.58 // 쿠션 윗면. 팔걸이·등받이가 전부 이 높이 기준
const LEG_R = 0.92 // 다리 뻗는 반경. 좌판 반폭(0.675)보다 커야 안 넘어져 보임

// 사무용 의자
export function Chair() {
  // 다리 5개 방사형
  const legs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, k) => {
        const a = (k / 5) * Math.PI * 2 + 0.3
        return [CX + Math.cos(a) * LEG_R, CZ + Math.sin(a) * LEG_R] as [number, number]
      }),
    [],
  )
  const fabric = { color: '#5c6fa8', roughness: 0.95 }

  return (
    <group>
      {/* 다리 + 바퀴 */}
      {legs.map(([x, z], i) => (
        <group key={i}>
          <Rod from={[CX, 0.24, CZ]} to={[x, 0.15, z]} r={0.045} {...metal} />
          <Sph r={0.085} scale={[1, 0.9, 1]} position={[x, 0.085, z]} color="#1e1e26" />
        </group>
      ))}
      <Cyl rt={0.12} rb={0.16} h={0.14} position={[CX, 0.27, CZ]} {...metal} />

      {/* 가스 기둥 + 커버 */}
      <Cyl rt={0.05} rb={0.05} h={0.9} position={[CX, 0.78, CZ]} {...chrome} />
      <Cyl rt={0.07} rb={0.07} h={0.35} position={[CX, 1.05, CZ]} {...metal} />

      {/* 좌판 */}
      <Box size={[0.6, 0.08, 0.6]} position={[CX, 1.27, CZ]} {...metal} />
      <Box size={[1.35, 0.2, 1.3]} position={[CX, 1.42, CZ]} radius={0.09} {...fabric} />
      <Box size={[1.18, 0.08, 1.15]} position={[CX - 0.02, 1.54, CZ]} radius={0.04} color="#6a7db8" roughness={1} />

      {/* 등받이. 기울기 0.2rad ≈ 11°, 아래끝이 쿠션에 살짝 묻히게 맞춤 */}
      <Rod from={[CX + 0.3, 1.33, CZ]} to={[CX + 0.6, 1.72, CZ]} r={0.045} {...metal} />
      <Box size={[0.16, 1.5, 1.3]} position={[CX + 0.75, 2.3, CZ]} rotation={[0, 0, -0.2]} radius={0.08} {...fabric} />

      {/* 팔걸이. 좌판 위 0.72(≈0.21m) */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Rod from={[CX + 0.1, 1.45, CZ + s * 0.68]} to={[CX + 0.1, 2.26, CZ + s * 0.68]} r={0.035} {...metal} />
          <Box size={[0.7, 0.07, 0.16]} position={[CX - 0.02, SEAT_TOP + 0.72, CZ + s * 0.68]} radius={0.025} color="#2a2a33" />
        </group>
      ))}
    </group>
  )
}
