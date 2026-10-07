import type { SectionId } from '../data/content'

type V3 = [number, number, number]

// target: 바라볼 점 / dir: target→카메라 방향 / fit: 화면에 들어와야 할 [가로,세로]
// 거리는 fit이랑 fov로 CameraRig에서 계산
export type View = { target: V3; dir: V3; fit: [number, number] }

// 방 전체
export const OVERVIEW: View = { target: [5, 2.4, 5], dir: [0.6124, 0.5, 0.6124], fit: [16.5, 14.5] }

// 섹션별 카메라 자리 — 숫자는 직접 맞춰본 값
export const VIEWS: Record<SectionId, View> = {
  // 모니터 화면 정면 (화면이 +X를 바라봄)
  projects: { target: [0.748, 3.97, 4.4], dir: [1, 0, 0], fit: [2.95, 1.75] },
  // 책장 정면
  skills: { target: [2.6, 2.75, 0.6], dir: [0.32, 0.27, 0.91], fit: [3.6, 5.6] },
  // 코르크보드 정면
  experience: { target: [0.06, 4.3, 8.4], dir: [1, 0.05, 0.1], fit: [2.7, 2.9] },
  // 턴테이블 + 스피커, 살짝 위에서
  about: { target: [7.15, 1.8, 0.7], dir: [0.1, 0.55, 1], fit: [3.6, 2.4] },
  // 들어 올린 휴대폰
  contact: { target: [2.2, 2.9, 6.45], dir: [1, 0.35, 0.15], fit: [1.9, 1.5] },
}
