import { create } from 'zustand'
import type { SectionId } from './data/content'

// ?view=2d 가 우선, 없으면 지난번 선택. 새로고침해도 3D 로딩을 다시 안 기다리게
const VIEW_KEY = 'suyeon.view2d'
function readView2d() {
  try {
    const q = new URLSearchParams(location.search).get('view')
    if (q === '2d') return true
    if (q === '3d') return false
    return localStorage.getItem(VIEW_KEY) === '1'
  } catch {
    return false
  }
}
function writeView2d(v: boolean) {
  try {
    localStorage.setItem(VIEW_KEY, v ? '1' : '0')
    const u = new URL(location.href) // 해시(#projects)는 그대로 둔다
    if (v) u.searchParams.set('view', '2d')
    else u.searchParams.delete('view')
    history.replaceState(null, '', u)
  } catch {
    // 시크릿 모드 등에서 저장이 막히면 그냥 넘어간다
  }
}

// lamp는 섹션이 아닌데 hover는 똑같이 먹어야 해서 끼워 넣음
type Hover = SectionId | 'lamp' | null

type State = {
  entered: boolean // 인트로 없앤 뒤로 늘 true. 되돌릴 때 쓰려고 남겨둠
  focus: SectionId | null // 줌인한 섹션. null이면 방 전체
  arrived: boolean // 카메라 이동 끝남. 패널 등장 타이밍
  hovered: Hover
  night: boolean
  view2d: boolean
  setFocus: (f: SectionId | null) => void
  setArrived: (v: boolean) => void
  setHovered: (h: Hover) => void
  toggleNight: () => void
  setView2d: (v: boolean) => void
}

// 씬이랑 DOM 오버레이가 같은 상태를 봐야 해서 전역으로 뺌
export const useStore = create<State>((set) => ({
  entered: true, // 인트로 거치지 않고 방부터 바로
  focus: null,
  arrived: false,
  hovered: null,
  night: true, // 기본 밤
  view2d: readView2d(),
  setFocus: (focus) => set({ focus, entered: true, arrived: false, hovered: null }), // 섹션 바꾸면 arrived·hover 리셋
  setArrived: (arrived) => set({ arrived }),
  setHovered: (hovered) => set({ hovered }),
  toggleNight: () => set((s) => ({ night: !s.night })),
  setView2d: (view2d) => {
    writeView2d(view2d)
    set({ view2d, focus: null }) // 2D 가면 포커스 풀기
  },
}))
