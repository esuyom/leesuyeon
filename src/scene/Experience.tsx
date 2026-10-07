import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Room } from './Room'
import { CameraRig } from './CameraRig'
import { useStore } from '../store'

// 밤/낮은 조명 색·세기만 갈아끼움. 지오메트리는 그대로
function Lights() {
  const night = useStore((s) => s.night)
  return (
    <>
      {/* 바닥·천장 환경광 */}
      <hemisphereLight args={[night ? '#8a94d6' : '#dfe8ff', night ? '#2a2440' : '#8c7a6a', night ? 1.35 : 2.2]} />
      {/* 해 겸 달. 그림자는 얘만 만든다 */}
      <directionalLight
        color={night ? '#c3cbff' : '#fff1dc'}
        intensity={night ? 1.6 : 2.6}
        position={[14, 16, 9]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      {/* 모니터 화면빛 */}
      <pointLight color="#8fe6ff" intensity={night ? 2.2 : 0.6} distance={4} decay={2} position={[1.4, 3.9, 4.4]} />
      {/* 창가 쪽 */}
      <pointLight color={night ? '#ff9ab0' : '#fff6e0'} intensity={night ? 3 : 4} distance={6} decay={1.8} position={[6.9, 4.2, 0.9]} />
    </>
  )
}

// Canvas 세팅 — 여기 건드리면 전체 톤 다 바뀜
export function Experience() {
  const setHovered = useStore((s) => s.setHovered)
  return (
    <Canvas
      className="scene"
      shadows="percentage" // 기본값(soft)은 three에서 제거돼 경고가 뜬다
      dpr={[1, 2]} // 레티나에서 2배까지만. 그 이상은 버벅임
      camera={{ fov: 30, near: 0.1, far: 200, position: [20, 15, 20] }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      onPointerMissed={() => setHovered(null)} // 빈 곳 클릭하면 hover 해제
      // 캔버스만 숨긴다. 래퍼에 걸면 안에 포털로 들어간 OS 화면까지 같이 가려짐
      onCreated={({ gl }) => gl.domElement.setAttribute('aria-hidden', 'true')}
    >
      <Lights />
      <Room />
      <CameraRig />
    </Canvas>
  )
}
