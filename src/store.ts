import { create } from 'zustand'
import type { SectionId } from './data/content'

// lamp는 섹션이 아닌데 hover는 똑같이 먹어야 해서 끼워 넣음
type Hover = SectionId | 'lamp' | null

type State = {
  entered: boolean // 인트로 없앤 뒤로 늘 true. 되돌릴 때 쓰려고 남겨둠
  focus: SectionId | null // 줌인한 섹션. null이면 방 전체
  arrived: boolean // 카메라 이동 끝남. 패널 등장 타이밍
  hovered: Hover
  night: boolean
  soundOn: boolean
  soundAvailable: boolean // bgm.mp3 있을 때만 true
  view2d: boolean
  setFocus: (f: SectionId | null) => void
  setArrived: (v: boolean) => void
  setHovered: (h: Hover) => void
  toggleNight: () => void
  setSound: (v: boolean) => void
  setSoundAvailable: (v: boolean) => void
  setView2d: (v: boolean) => void
}

// 씬이랑 DOM 오버레이가 같은 상태를 봐야 해서 전역으로 뺌
export const useStore = create<State>((set) => ({
  entered: true, // 인트로 거치지 않고 방부터 바로
  focus: null,
  arrived: false,
  hovered: null,
  night: true, // 기본 밤
  soundOn: false,
  soundAvailable: false,
  view2d: false,
  setFocus: (focus) => set({ focus, entered: true, arrived: false, hovered: null }), // 섹션 바꾸면 arrived·hover 리셋
  setArrived: (arrived) => set({ arrived }),
  setHovered: (hovered) => set({ hovered }),
  toggleNight: () => set((s) => ({ night: !s.night })),
  setSound: (soundOn) => set({ soundOn }),
  setSoundAvailable: (soundAvailable) => set({ soundAvailable }),
  setView2d: (view2d) => set({ view2d, focus: null }), // 2D 가면 포커스 풀기
}))
