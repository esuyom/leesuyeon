import { useEffect } from 'react'
import { useStore } from '../store'
import { profile, sections, type SectionId } from '../data/content'
import { SectionContent, sectionMeta } from './Panels'
import { useIsMobile } from './useMedia'

// 아이콘 라이브러리 쓸 만큼 많지 않아서 그냥 인라인 SVG
const Icon = {
  bulb: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" />
    </svg>
  ),
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  ),
  mouse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="6" y="3" width="12" height="18" rx="6" />
      <path d="M12 7v4" />
    </svg>
  ),
}

// 상단 로고 + 음악/조명 버튼
function Header() {
  const night = useStore((s) => s.night)
  const toggleNight = useStore((s) => s.toggleNight)
  const setFocus = useStore((s) => s.setFocus)
  return (
    <header className="header">
      {/* 로고 누르면 방 전체로 */}
      <button type="button" className="logo mono" onClick={() => setFocus(null)}>
        {profile.siteName}
        <span className="accent">.studio</span>
      </button>
      <nav className="header-actions" aria-label="보조 메뉴">
        <button type="button" className="icon-btn" aria-label={night ? '불 켜기 (낮 모드)' : '불 끄기 (밤 모드)'} aria-pressed={!night} onClick={toggleNight}>
          {Icon.bulb}
        </button>
      </nav>
    </header>
  )
}

// 줌인했을 때 오른쪽에 붙는 패널
function Panel({ id }: { id: SectionId }) {
  const meta = sectionMeta(id)
  const arrived = useStore((s) => s.arrived) // 카메라 도착하면 is-in 붙어서 슥 올라옴
  return (
    <aside className={`panel ${arrived ? 'is-in' : ''}`} aria-label={meta.title}>
      <div className="panel-head">
        <span className="mono accent">{meta.no}</span>
        <h2>{meta.title}</h2>
      </div>
      <div className="panel-body">
        <SectionContent id={id} />
      </div>
    </aside>
  )
}

// 모바일 하단 시트. 좁아서 인트로 대신 이걸로
function MobileSheet() {
  const setFocus = useStore((s) => s.setFocus)
  const setView2d = useStore((s) => s.setView2d)
  return (
    <section className="sheet" aria-label="섹션 목록">
      <div className="sheet-handle" />
      {sections.map((s) => (
        <button key={s.id} type="button" className="sheet-row" onClick={() => setFocus(s.id)}>
          <span className="mono accent">{s.no}</span>
          <span className="sheet-title">{s.title}</span>
          <span className="muted">{s.object}</span>
        </button>
      ))}
      <button type="button" className="link-btn small sheet-2d" onClick={() => setView2d(true)}>
        2D로 보기
      </button>
    </section>
  )
}

// 3D 위에 얹히는 DOM 전부. pointer-events는 styles.css에서 관리
export function Overlay() {
  const entered = useStore((s) => s.entered)
  const focus = useStore((s) => s.focus)
  const setFocus = useStore((s) => s.setFocus)
  const setView2d = useStore((s) => s.setView2d)
  const mobile = useIsMobile()

  useEffect(() => {
    // ESC로 방 복귀
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && useStore.getState().focus) setFocus(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setFocus])

  // projects는 모니터 안에 뜨니까 패널 생략. 모바일은 모니터 화면을 안 써서 예외
  const showPanel = focus && (focus !== 'projects' || mobile)

  return (
    <div className="overlay">
      <Header />

      {focus && (
        <button type="button" className="back-btn" onClick={() => setFocus(null)}>
          {Icon.back} 방으로 <span className="mono muted small">ESC</span>
        </button>
      )}

      {/* key에 focus 넣어서 섹션 바뀔 때마다 등장 애니 다시 탐 */}
      {showPanel && <Panel key={focus} id={focus} />}

      {mobile && !focus && <MobileSheet />}

      {entered && !focus && !mobile && (
        <footer className="hint">
          <span className="row-gap small">
            {Icon.mouse} 드래그해서 회전 · 스크롤로 줌 · 물건을 클릭하면 다가가요 · 스탠드를 누르면 불이 꺼져요
          </span>
          <button type="button" className="link-btn small" onClick={() => setView2d(true)}>
            2D로 보기
          </button>
        </footer>
      )}
    </div>
  )
}
