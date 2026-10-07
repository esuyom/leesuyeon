import { useEffect, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useStore } from '../store'
import type { SectionId } from '../data/content'

type Props = {
  id: SectionId | 'lamp'
  label?: string
  no?: string
  labelPosition?: [number, number, number]
  labelSide?: 'left' | 'right'
  onSelect: () => void
  children: ReactNode
}

const HIGHLIGHT = new THREE.Color('#e2764e')

// 클릭 가능한 물건 래퍼 — hover 시 발광 + 라벨 띄움
export function Hotspot({ id, label, no, labelPosition, labelSide = 'right', onSelect, children }: Props) {
  const ref = useRef<THREE.Group>(null)
  const hovered = useStore((s) => s.hovered === id)
  const entered = useStore((s) => s.entered)
  const focus = useStore((s) => s.focus)
  const setHovered = useStore((s) => s.setHovered)
  const interactive = entered && !focus // 인트로 중이거나 이미 줌인했으면 반응 끔

  // 첫 커밋 때 바로 Html을 띄우면 drei가 포털 root는 만들고 render를 흘려버린다.
  // (React 19에서 다른 root 커밋 중에 render가 호출돼 생기는 문제. 제일 먼저 뜨는 라벨 하나가 빈 채로 남음)
  // 한 프레임 미뤄서 붙이면 안 걸린다
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // 자식 메시 전부 훑어서 emissive만 갈아끼움. 원래 값은 백업해뒀다 복구
  useEffect(() => {
    ref.current?.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined
      if (!m || !('emissive' in m)) return
      if (!m.userData.baseEmissive) m.userData.baseEmissive = m.emissive.clone()
      if (hovered && interactive) {
        m.emissive.copy(HIGHLIGHT)
        m.emissiveIntensity = 0.16
      } else {
        m.emissive.copy(m.userData.baseEmissive)
        m.emissiveIntensity = 1
      }
    })
  }, [hovered, interactive])

  // 3D엔 커서가 없어서 body에 직접
  useEffect(() => {
    document.body.style.cursor = hovered && interactive ? 'pointer' : ''
  }, [hovered, interactive])

  const over = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return
    e.stopPropagation()
    setHovered(id)
  }
  // 다른 물건으로 바로 넘어간 경우 남의 hover를 지우면 안 됨
  const out = () => {
    if (useStore.getState().hovered === id) setHovered(null)
  }
  const click = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive) return
    e.stopPropagation()
    onSelect()
  }

  return (
    <group ref={ref} onPointerOver={over} onPointerOut={out} onClick={click}>
      {children}
      {/* 라벨은 drei Html — 3D 좌표에 DOM 붙임 */}
      {label && labelPosition && interactive && ready && (
        <Html position={labelPosition} zIndexRange={[9, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`hotspot ${labelSide} ${hovered ? 'is-hover' : ''}`}>
            <span className="hotspot-dot" />
            <button
              type="button"
              className="hotspot-pill"
              onClick={onSelect}
              onPointerEnter={() => setHovered(id)}
              onPointerLeave={out}
            >
              {no && <span className="mono accent">{no}</span>} {label}
            </button>
          </div>
        </Html>
      )}
    </group>
  )
}
