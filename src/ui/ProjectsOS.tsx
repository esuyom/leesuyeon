import { useEffect, useState } from 'react'
import { profile, projects, type Project } from '../data/content'

// content.ts의 Category 유니언이랑 한 글자도 안 틀려야 필터가 먹음
const CATEGORIES = ['전체', '웹서비스', '홈페이지', '스낵게임', '사이드프로젝트'] as const

// 대표는 크기를 키우지 않고 제목 옆 별표로만 구분. 목록 순서는 앞
function Card({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <button type="button" className="os-card" onClick={onOpen}>
      <div className="os-thumb">{p.image ? <img src={p.image} alt="" loading="lazy" /> : <span>[스크린샷]</span>}</div>
      <strong>
        {p.featured && <span className="os-star" aria-label="대표 프로젝트">★</span>}
        {p.title}
      </strong>
      <span className="os-card-sum">{p.summary}</span>
      <span className="tags">
        {p.stack.slice(0, 3).map((s) => (
          <span key={s} className="tag">
            {s}
          </span>
        ))}
      </span>
    </button>
  )
}

// 모니터 안에 뜨는 가짜 OS 화면 (1048×592 px 고정 — Monitor.tsx SCREEN이랑 세트)
export function ProjectsOS() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('전체')
  const [open, setOpen] = useState<Project | null>(null)
  const [showFolded, setShowFolded] = useState(false)
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 15000) // 분 단위 표시라 15초면 충분
    return () => clearInterval(t)
  }, [])

  // 전체 탭에서만 대표를 앞으로 빼고 프로모션 묶음을 접는다. 분류 탭은 그냥 다 보여줌
  const all = cat === '전체'
  const list = all ? projects : projects.filter((p) => p.category === cat)
  const featured = all ? list.filter((p) => p.featured) : []
  const folded = all ? list.filter((p) => !p.featured && p.category === '스낵게임') : []
  const rest = all ? list.filter((p) => !p.featured && p.category !== '스낵게임') : list

  // 분류별 건수. 어디가 두꺼운지 안 보이면 답답함
  const countOf = (c: (typeof CATEGORIES)[number]) => (c === '전체' ? projects.length : projects.filter((p) => p.category === c).length)
  const hhmm = time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div className="os">
      <div className="os-menubar">
        <div className="os-menubar-left">
          <span className="mono accent bold">{profile.siteName} OS</span>
          <span>파일</span>
          <span>보기</span>
        </div>
        <span className="mono">{hhmm}</span>
      </div>

      <section className="os-window" aria-label="프로젝트">
        <div className="os-titlebar">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="os-title">{open ? `~/projects/${open.id}` : '~/projects'}</span>
        </div>
        {/* 목록 ↔ 상세를 한 창 안에서 교체 */}
        {open ? (
          // key 없으면 아래 os-body와 DOM이 재사용돼 스크롤 위치가 남음
          <div className="os-detail" key={open.id}>
            <button type="button" className="os-back" onClick={() => setOpen(null)}>
              ← 목록
            </button>
            <div className="os-detail-body">
              <div className="os-thumb large">{open.image ? <img src={open.image} alt="" loading="lazy" /> : <span>[스크린샷]</span>}</div>
              <div className="os-detail-text">
                <h3>{open.title}</h3>
                <p className="muted-dark">
                  {open.period} · {open.role}
                </p>
                <p className="os-summary">{open.summary}</p>
                <ul>
                  {open.description.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
                <div className="tags">
                  {open.stack.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>
                {open.links && (
                  <div className="os-links">
                    {open.links.map((l) => (
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="os-body" key="list">
            <nav className="os-side" aria-label="프로젝트 분류">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={c === cat ? 'active' : ''}
                  onClick={() => {
                    setCat(c)
                    setShowFolded(false) // 탭 바꾸면 다시 접음
                  }}
                >
                  {c}
                  <span className="mono os-count"> {countOf(c)}</span>
                </button>
              ))}
            </nav>
            {/* 탭 바꾸면 통째로 새로 마운트 — 스크롤 맨 위로 */}
            <div className="os-grid" key={cat}>
              {featured.map((p) => (
                <Card key={p.id} p={p} onOpen={() => setOpen(p)} />
              ))}
              {rest.map((p) => (
                <Card key={p.id} p={p} onOpen={() => setOpen(p)} />
              ))}
              {folded.length > 0 && !showFolded && (
                <button type="button" className="os-more" onClick={() => setShowFolded(true)}>
                  그 외 프로모션 및 미니게임 {folded.length}건 보기
                </button>
              )}
              {showFolded && folded.map((p) => <Card key={p.id} p={p} onOpen={() => setOpen(p)} />)}
            </div>
          </div>
        )}
      </section>

      {/* 장식용 터미널 */}
      <section className="os-terminal" aria-label="터미널">
        <div className="os-terminal-bar mono">terminal</div>
        <pre className="mono">
          <span className="accent-2">$</span> whoami{'\n'}
          {profile.name} — {profile.tagline}
          {'\n'}
          <span className="accent-2">$</span> <span className="cursor">_</span>
        </pre>
      </section>
    </div>
  )
}
