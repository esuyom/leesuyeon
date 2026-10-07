import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { useStore } from '../store'
import { OVERVIEW, VIEWS } from './views'
import { useIsMobile, useReducedMotion } from '../ui/useMedia'

const BASE_AZIMUTH = Math.PI / 4 // 방 전체 기준 가로 각도. 45° = 방 모서리에서 대각선으로 봄
const BASE_POLAR = Math.acos(0.5) // 기준 세로 각도. 60° = 눈높이보다 조금 위에서 내려다봄
const PANEL_MAX = 460 // .panel 최대폭
const PANEL_GAP = 40 // 패널이랑 가구 사이 숨통

// 카메라 포커스 이동 + 화면 오프셋
// 패널 자리는 카메라를 옮기지 않고 화면만 민다 (옮기면 앞 가구에 가림)
export function CameraRig() {
  const ref = useRef<CameraControls>(null)
  const { size, camera } = useThree()
  const entered = useStore((s) => s.entered)
  const focus = useStore((s) => s.focus)
  const setArrived = useStore((s) => s.setArrived)
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  const first = useRef(true) // 첫 렌더는 애니 없이 바로 자리잡기
  const offset = useRef({ x: 0, y: 0, tx: 0, ty: 0 }) // x·y는 현재값, tx·ty는 목표값

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const persp = camera as THREE.PerspectiveCamera
    const W = size.width
    const H = size.height
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(persp.fov / 2))
    const animate = !reduced && !first.current
    first.current = false
    c.smoothTime = 0.55 // 전환 속도(초). 키우면 느긋, 줄이면 탁탁 끊김

    // ── 화면에서 실제로 쓸 수 있는 영역 ──
    // 패널·시트가 가린 만큼 빼고 남는 영역 + 중심 보정값(ox·oy는 화면 비율, 0.1 = 10%)
    let usableW = W
    let usableH = H
    let ox = 0
    let oy = 0
    if (!focus) {
      if (mobile) {
        usableH = H * 0.48 // 모바일 방 전체 — 아래 시트가 절반쯤 가림
        oy = 0.12 // 방을 위로 올려서 시트에 안 겹치게
      }
    } else if (mobile) {
      usableH = H * 0.4 // 모바일 줌인 — 아래 패널이 더 많이 차지
      oy = 0.29
    } else if (focus !== 'projects') {
      // projects는 패널 없이 모니터 화면을 꽉 보여주니까 제외
      const panel = Math.min(PANEL_MAX, W * 0.38) + PANEL_GAP // 패널은 화면의 38%, 단 460px 상한
      usableW = W - panel
      ox = panel / 2 / W // 가려진 폭의 절반만큼 반대로 밀기
    }
    offset.current.tx = ox
    offset.current.ty = oy

    // ── 거리 계산 ──
    // views.ts의 fit[가로,세로]이 usable 영역에 꽉 차는 거리를 구한다. 가로·세로 중 더 먼 쪽 채택
    const view = focus ? VIEWS[focus] : OVERVIEW
    const [fw, fh] = view.fit
    const aspect = usableW / usableH
    const viewFrac = usableH / H // 세로 일부만 쓰면 그만큼 멀리
    const dist = Math.max(fh / (2 * tanHalf * viewFrac), fw / (2 * tanHalf * aspect * viewFrac))
    const target = new THREE.Vector3(...view.target)
    const pos = target.clone().add(new THREE.Vector3(...view.dir).normalize().multiplyScalar(dist))

    // ── 조작 범위 ──
    // 방 전체일 때만 드래그 허용. 배수·각도는 전부 위에서 구한 기준 자세 대비
    if (!focus) {
      c.enabled = entered // entered는 지금 늘 true. 인트로 되살리면 여기서 다시 잠김
      c.minDistance = dist * 0.28 // 얼마나 가까이. 줄이면 더 들어가지만 벽을 뚫을 수 있음
      c.maxDistance = dist * 1.3 // 얼마나 멀리
      c.minAzimuthAngle = BASE_AZIMUTH - 0.45 // 좌우 회전 폭 ±0.45rad ≈ ±26°
      c.maxAzimuthAngle = BASE_AZIMUTH + 0.45
      c.minPolarAngle = BASE_POLAR - 0.3 // 위로 17°까지 (더 키우면 천장 없는 게 보임)
      c.maxPolarAngle = BASE_POLAR + 0.22 // 아래로 13°까지 (더 키우면 바닥만 보임)
    } else {
      // 줌인 중엔 조작 전부 잠금. 범위는 setLookAt이 걸리지 않게 활짝 열어둠
      c.enabled = false
      c.minDistance = 0.1
      c.maxDistance = 100
      c.minAzimuthAngle = -Infinity
      c.maxAzimuthAngle = Infinity
      c.minPolarAngle = 0
      c.maxPolarAngle = Math.PI
    }
    c.truckSpeed = 0 // 패닝 끔. 켜면 방 밖으로 끌고 나갈 수 있음

    // ── 이동 실행 ──
    // arrived는 패널 등장·모니터 HTML 전환 타이밍이라 늦거나 빠지면 안 됨
    setArrived(false)
    let alive = true
    const done = () => alive && setArrived(true)
    c.setLookAt(pos.x, pos.y, pos.z, target.x, target.y, target.z, animate).then(done)
    // 완료 안 올 때 대비. smoothTime의 2배쯤
    const t = window.setTimeout(done, animate ? 1100 : 0)
    return () => {
      alive = false
      window.clearTimeout(t)
    }
  }, [focus, entered, mobile, size.width, size.height, reduced, camera, setArrived])

  // 오프셋만 매 프레임 보간
  useFrame((_, dt) => {
    const o = offset.current
    const k = reduced ? 1 : Math.min(1, dt * 4) // 밀리는 속도. 키우면 빨리 따라붙음
    o.x += (o.tx - o.x) * k
    o.y += (o.ty - o.y) * k
    const persp = camera as THREE.PerspectiveCamera
    const W = size.width
    const H = size.height
    // 거의 0이면 오프셋 자체를 지움 (켜둔 채 두면 미세하게 틀어짐)
    if (Math.abs(o.x) < 1e-4 && Math.abs(o.y) < 1e-4 && o.tx === 0 && o.ty === 0) {
      if (persp.view?.enabled) persp.clearViewOffset()
      return
    }
    persp.setViewOffset(W, H, o.x * W, o.y * H, W, H)
  })

  return <CameraControls ref={ref} makeDefault />
}
