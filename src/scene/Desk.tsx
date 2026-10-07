import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Instance, Instances } from '@react-three/drei'
import { Box, Cyl, Rod, Sph, metal } from './primitives'
import { canvasTexture, deskCalendarTexture } from './textures'
import { profile } from '../data/content'
import { useStore } from '../store'

// 상판 윗면 높이. 책상 위 물건 y좌표 기준
export const DESK_TOP = 2.46

// 책상 + 다리 + 서랍장
export function Desk() {
  return (
    <group>
      <Box size={[2.8, 0.12, 5.1]} position={[1.4, 2.4, 4.5]} radius={0.04} color="#c48e62" />
      {[
        [0.2, 2.15],
        [2.6, 2.15],
      ].map(([x, z], i) => (
        <Box key={i} size={[0.08, 2.34, 0.08]} position={[x, 1.17, z]} {...metal} />
      ))}
      <Box size={[2.48, 0.06, 0.06]} position={[1.4, 0.4, 2.15]} {...metal} />
      {/* 서랍장 */}
      <Box size={[2.4, 2.22, 0.86]} position={[1.3, 1.17, 6.5]} radius={0.03} color="#a06f4a" />
      {[0, 1, 2].map((k) => (
        <group key={k}>
          <Box size={[0.04, 0.62, 0.78]} position={[2.51, 0.5 + k * 0.7, 6.5]} radius={0.015} color="#b9855a" />
          <Box size={[0.05, 0.05, 0.3]} position={[2.55, 0.7 + k * 0.7, 6.5]} radius={0.02} color="#e9e3d6" />
        </group>
      ))}
    </group>
  )
}

// 책상 위 소품들
export function DeskItems() {
  const cal = useMemo(() => deskCalendarTexture(), [])
  // 키캡 4×16. Instances라 드로우콜 한 번으로 끝남
  const keys = useMemo(() => {
    const out: [number, number, number][] = []
    for (let r = 0; r < 4; r++) for (let c = 0; c < 16; c++) out.push([1.52 + r * 0.115, 2.525, 3.62 + c * 0.104])
    return out
  }, [])
  const icx = 1.15
  const icz = 5.75

  return (
    <group>
      {/* 키보드 */}
      <Box size={[0.55, 0.05, 1.8]} position={[1.7, 2.485, 4.4]} radius={0.02} color="#e9e3d6" />
      <Instances limit={64} castShadow receiveShadow>
        <boxGeometry args={[0.085, 0.035, 0.09]} />
        <meshStandardMaterial color="#f7f4ec" roughness={0.7} />
        {keys.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>

      {/* 마우스 (앉은 사람 기준 오른쪽) */}
      <Box size={[0.85, 0.012, 0.8]} position={[1.85, 2.466, 2.95]} radius={0.004} color="#5c6fa8" />
      <Sph r={0.15} scale={[1.1, 0.42, 0.72]} position={[1.85, 2.49, 3.0]} color="#f7f4ec" roughness={0.35} />
      <Cyl rt={0.018} rb={0.018} h={0.03} position={[1.74, 2.545, 3.0]} rotation={[Math.PI / 2, 0, 0]} color="#2a2a33" />

      {/* 아이스 아메리카노 */}
      <Cyl rt={0.13} rb={0.13} h={0.44} position={[icx, 2.68, icz]} color="#3b2414" transparent opacity={0.88} roughness={0.2} />
      {[0, 1, 2, 3, 4].map((k) => (
        <Box
          key={k}
          size={[0.09, 0.09, 0.09]}
          position={[icx + Math.cos(k * 1.3) * 0.05, 2.87 + (k % 2) * 0.05, icz + Math.sin(k * 1.3) * 0.05]}
          rotation={[k * 0.5, k * 0.7, 0]}
          color="#e8f4ff"
          transparent
          opacity={0.55}
          roughness={0.1}
          shadow={false}
        />
      ))}
      {/* 컵 바깥면 — depthWrite 끄면 안쪽 얼음이 제대로 비침 */}
      <Cyl rt={0.16} rb={0.13} h={0.62} open position={[icx, 2.77, icz]} color="#ffffff" transparent opacity={0.28} roughness={0.1} depthWrite={false} shadow={false} />
      <Cyl rt={0.165} rb={0.165} h={0.025} position={[icx, 3.09, icz]} color="#ffffff" transparent opacity={0.45} roughness={0.1} shadow={false} />
      <Rod from={[icx + 0.03, 2.6, icz - 0.02]} to={[icx + 0.12, 3.35, icz - 0.08]} r={0.018} color="#1e2236" />

      {/* 노트 + 펜 */}
      <group position={[2.25, 0, 5.75]} rotation={[0, -0.2, 0]}>
        <Box size={[0.6, 0.05, 0.8]} position={[0, 2.485, 0]} radius={0.015} color="#ffb547" />
        <Box size={[0.56, 0.012, 0.74]} position={[0, 2.517, 0]} color="#f7f4ec" shadow={false} />
      </group>
      <Rod from={[2.05, 2.535, 5.5]} to={[2.45, 2.535, 6.0]} r={0.015} color="#1e2236" />

      {/* 에어팟 케이스 + 한 쪽 */}
      <group position={[1.55, 2.54, 6.45]} rotation={[0, 0.3, 0]}>
        <Box size={[0.2, 0.16, 0.26]} radius={0.07} color="#fafafa" roughness={0.25} />
        <Box size={[0.205, 0.006, 0.265]} position={[0, 0.03, 0]} color="#d8d8de" shadow={false} />
      </group>
      <Sph r={0.035} position={[1.32, 2.5, 6.25]} color="#fafafa" roughness={0.25} />
      <Rod from={[1.32, 2.49, 6.25]} to={[1.44, 2.48, 6.18]} r={0.012} color="#fafafa" roughness={0.25} />

      {/* 탁상 달력 (오늘 날짜) */}
      <group position={[0.62, DESK_TOP, 6.3]} rotation={[0, Math.PI / 2, 0]}>
        <Box size={[0.66, 0.5, 0.02]} position={[0, 0.24, 0.09]} rotation={[-0.38, 0, 0]} color="#2a2a33" />
        <Box size={[0.66, 0.5, 0.02]} position={[0, 0.24, -0.09]} rotation={[0.38, 0, 0]} color="#2a2a33" />
        <mesh position={[0, 0.235, 0.105]} rotation={[-0.38, 0, 0]}>
          <planeGeometry args={[0.6, 0.44]} />
          <meshStandardMaterial map={cal} roughness={0.8} />
        </mesh>
        <Cyl rt={0.02} rb={0.02} h={0.64} position={[0, 0.47, 0]} rotation={[0, 0, Math.PI / 2]} color="#c9ccd8" metalness={0.7} roughness={0.3} />
      </group>
    </group>
  )
}

// 휴대폰 — Contact 누르면 들려서 기울어짐
export function Phone() {
  const ref = useRef<THREE.Group>(null)
  const lifted = useStore((s) => s.focus === 'contact')
  const screen = useMemo(() => phoneTexture(profile.name), [])
  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    const k = Math.min(1, dt * 4) // 프레임 들쭉날쭉해도 속도 비슷하게
    g.position.y = THREE.MathUtils.lerp(g.position.y, lifted ? 2.9 : 2.475, k)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, lifted ? -0.9 : 0, k)
  })
  return (
    <group ref={ref} position={[2.2, 2.475, 6.45]}>
      <group rotation={[0, -0.2, 0]}>
        <Box size={[0.3, 0.03, 0.56]} radius={0.012} color="#1e2236" />
        <mesh position={[0, 0.017, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.5, 0.26]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

// 관절 스탠드 — 클릭하면 밤낮 전환
export function Lamp() {
  const night = useStore((s) => s.night)
  // 전구 주변 뿌연 빛. 방사형 그라데이션 한 장 그려서 스프라이트로
  const glow = useMemo(() => {
    const cv = document.createElement('canvas')
    cv.width = cv.height = 256
    const g = cv.getContext('2d')!
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
    gr.addColorStop(0, 'rgba(255,190,100,.55)')
    gr.addColorStop(1, 'rgba(255,190,100,0)')
    g.fillStyle = gr
    g.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(cv)
  }, [])
  const lampMetal = { color: '#2a2a33', metalness: 0.4, roughness: 0.4 }
  return (
    <group>
      <Cyl rt={0.22} rb={0.24} h={0.07} position={[0.45, 2.495, 2.6]} {...lampMetal} />
      <Rod from={[0.45, 2.52, 2.6]} to={[0.65, 3.65, 2.6]} r={0.03} {...lampMetal} />
      <Sph r={0.055} position={[0.65, 3.65, 2.6]} color="#ffb547" />
      <Rod from={[0.65, 3.65, 2.6]} to={[1.3, 3.95, 2.6]} r={0.03} {...lampMetal} />
      <Sph r={0.05} position={[1.3, 3.95, 2.6]} color="#ffb547" />
      <Cyl rt={0.06} rb={0.26} h={0.34} open position={[1.4, 3.8, 2.6]} rotation={[0, 0, 0.45]} color="#ffb547" roughness={0.45} side={THREE.DoubleSide} />
      <mesh position={[1.45, 3.7, 2.6]}>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshBasicMaterial color={night ? '#fff1c9' : '#d8d2c4'} toneMapped={false} />
      </mesh>
      {/* 낮엔 조명이랑 글로우 통째로 뺌 */}
      {night && (
        <>
          <pointLight
            color="#ffb869"
            intensity={9}
            distance={7}
            decay={1.6}
            position={[1.5, 3.55, 2.6]}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.002}
          />
          <sprite position={[1.45, 3.6, 2.6]} scale={[3, 3, 1]}>
            <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </>
      )}
    </group>
  )
}

// 폰 화면 그림 — 연락처 카드
function phoneTexture(name: string) {
  return canvasTexture(512, 266, (g, w, h) => {
    g.fillStyle = '#1e2236'
    g.fillRect(0, 0, w, h)
    g.fillStyle = '#ffb547'
    g.beginPath()
    g.arc(96, h / 2 - 14, 52, 0, 7)
    g.fill()
    g.fillStyle = '#1e2236'
    g.font = 'bold 44px sans-serif'
    g.textAlign = 'center'
    g.fillText(name.slice(0, 1), 96, h / 2 + 2)
    g.fillStyle = '#f3efe6'
    g.font = 'bold 22px sans-serif'
    g.fillText(name, 96, h / 2 + 76)
    ;['#9fb4ff', '#7fe3c4', '#e07a6b'].forEach((c, i) => {
      const y = 34 + i * 70
      g.fillStyle = '#2f3557'
      g.beginPath()
      g.roundRect(196, y, w - 220, 54, 12)
      g.fill()
      g.fillStyle = c
      g.beginPath()
      g.arc(226, y + 27, 13, 0, 7)
      g.fill()
      g.fillStyle = '#a9aec8'
      g.fillRect(254, y + 22, 170 - i * 30, 10)
    })
  })
}
