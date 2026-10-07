import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

type V3 = [number, number, number]
export type MatProps = {
  color?: THREE.ColorRepresentation
  roughness?: number
  metalness?: number
  map?: THREE.Texture | null
  transparent?: boolean
  opacity?: number
  side?: THREE.Side
  depthWrite?: boolean
}

// 머티리얼 기본값. 안 적으면 다 이걸로
export function Mat({ color = '#ffffff', roughness = 0.75, metalness = 0, ...rest }: MatProps) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} {...rest} />
}

type Common = { position?: V3; rotation?: V3; shadow?: boolean } & MatProps

// radius 주면 둥근 박스 (RoundedBox라 삼각형 수 늘어남)
export function Box({ size, radius, position, rotation, shadow = true, ...mat }: Common & { size: V3; radius?: number }) {
  if (radius) {
    return (
      <RoundedBox args={size} radius={radius} smoothness={4} position={position} rotation={rotation} castShadow={shadow} receiveShadow>
        <Mat {...mat} />
      </RoundedBox>
    )
  }
  return (
    <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
      <boxGeometry args={size} />
      <Mat {...mat} />
    </mesh>
  )
}

// 원기둥. open이면 옆면만 (컵·갓 같은 거)
export function Cyl({ rt, rb, h, seg = 32, open = false, position, rotation, shadow = true, ...mat }: Common & { rt: number; rb: number; h: number; seg?: number; open?: boolean }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
      <cylinderGeometry args={[rt, rb, h, seg, 1, open]} />
      <Mat {...mat} />
    </mesh>
  )
}

// 구. scale로 눌러서 타원으로도 씀
export function Sph({ r, scale = [1, 1, 1], position, rotation, shadow = true, ...mat }: Common & { r: number; scale?: V3 }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow={shadow} receiveShadow>
      <sphereGeometry args={[r, 32, 20]} />
      <Mat {...mat} />
    </mesh>
  )
}

// 두 점 잇는 막대 — 각도 계산하기 싫어서 만듦
export function Rod({ from, to, r, shadow = true, ...mat }: { from: V3; to: V3; r: number; shadow?: boolean } & MatProps) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const d = b.clone().sub(a)
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize())
    return { pos: a.add(b).multiplyScalar(0.5), quat: q, len: d.length() }
  }, [from, to])
  return (
    <mesh position={pos} quaternion={quat} castShadow={shadow} receiveShadow>
      <cylinderGeometry args={[r, r, len, 16]} />
      <Mat {...mat} />
    </mesh>
  )
}

// 도넛. arc로 일부만 자를 수 있음
export function Torus({ r, tube, arc = Math.PI * 2, position, rotation, shadow = true, ...mat }: Common & { r: number; tube: number; arc?: number }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
      <torusGeometry args={[r, tube, 12, 32, arc]} />
      <Mat {...mat} />
    </mesh>
  )
}

// 자주 쓰는 재질 — 스프레드로 꽂아 씀
export const metal = { color: '#2a2a33', metalness: 0.5, roughness: 0.4 }
export const chrome = { color: '#c9ccd8', metalness: 0.8, roughness: 0.25 }
