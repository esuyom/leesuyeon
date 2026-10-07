import { useMemo } from 'react'
import * as THREE from 'three'
import { Box, Cyl, Rod, Sph, chrome, metal } from './primitives'
import { canvasTexture } from './textures'

// 의자 중심. 부품이 많아서 전부 여기 기준
const CX = 3.75
const CZ = 4.75

// 사무용 의자 + 등받이에 걸친 가디건
export function Chair() {
  // 니트 짜임 — 작게 그려서 타일링
  const knit = useMemo(() => {
    const t = canvasTexture(128, 128, (g, w) => {
      g.fillStyle = '#d9a441'
      g.fillRect(0, 0, w, w)
      g.strokeStyle = 'rgba(120,80,20,.35)'
      g.lineWidth = 2
      for (let y = 0; y < w; y += 8)
        for (let x = 0; x < w; x += 8) {
          g.beginPath()
          g.moveTo(x, y)
          g.lineTo(x + 4, y + 6)
          g.lineTo(x + 8, y)
          g.stroke()
        }
    })
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(3, 3)
    return t
  }, [])
  // 다리 5개 방사형
  const legs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, k) => {
        const a = (k / 5) * Math.PI * 2 + 0.3
        return [CX + Math.cos(a) * 0.62, CZ + Math.sin(a) * 0.62] as [number, number]
      }),
    [],
  )
  const fabric = { color: '#5c6fa8', roughness: 0.95 }

  return (
    <group>
      {legs.map(([x, z], i) => (
        <group key={i}>
          <Rod from={[CX, 0.2, CZ]} to={[x, 0.13, z]} r={0.04} {...metal} />
          <Sph r={0.07} position={[x, 0.07, z]} color="#1e1e26" />
        </group>
      ))}
      <Cyl rt={0.1} rb={0.12} h={0.12} position={[CX, 0.24, CZ]} {...metal} />
      <Cyl rt={0.05} rb={0.05} h={0.9} position={[CX, 0.75, CZ]} {...chrome} />
      <Cyl rt={0.07} rb={0.07} h={0.35} position={[CX, 1.05, CZ]} {...metal} />
      <Box size={[0.6, 0.08, 0.6]} position={[CX, 1.27, CZ]} {...metal} />
      <Box size={[1.35, 0.2, 1.3]} position={[CX, 1.42, CZ]} radius={0.09} {...fabric} />
      <Box size={[1.18, 0.08, 1.15]} position={[CX - 0.02, 1.54, CZ]} radius={0.04} color="#6a7db8" roughness={1} />
      <Rod from={[CX + 0.3, 1.35, CZ]} to={[CX + 0.62, 1.95, CZ]} r={0.045} {...metal} />
      <Box size={[0.16, 1.45, 1.22]} position={[CX + 0.72, 2.45, CZ]} rotation={[0, 0, -0.1]} radius={0.08} {...fabric} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Rod from={[CX + 0.1, 1.4, CZ + s * 0.62]} to={[CX + 0.1, 1.95, CZ + s * 0.62]} r={0.035} {...metal} />
          <Box size={[0.7, 0.06, 0.15]} position={[CX, 1.98, CZ + s * 0.62]} radius={0.025} color="#2a2a33" />
        </group>
      ))}
      {/* 가디건 */}
      <Box size={[0.34, 0.1, 1.1]} position={[CX + 0.8, 3.2, CZ + 0.05]} rotation={[0, 0, -0.1]} radius={0.05} map={knit} roughness={1} />
      <Box size={[0.08, 0.8, 1.0]} position={[CX + 0.96, 2.85, CZ + 0.08]} rotation={[0, 0, -0.08]} radius={0.04} map={knit} roughness={1} />
      <Box size={[0.08, 0.55, 0.95]} position={[CX + 0.62, 2.95, CZ + 0.05]} rotation={[0, 0, -0.14]} radius={0.04} map={knit} roughness={1} />
      <Rod from={[CX + 0.95, 3.1, CZ + 0.62]} to={[CX + 1.08, 2.15, CZ + 0.72]} r={0.08} map={knit} roughness={1} />
      <Rod from={[CX + 0.95, 3.1, CZ - 0.5]} to={[CX + 1.12, 2.3, CZ - 0.62]} r={0.08} map={knit} roughness={1} />
    </group>
  )
}
