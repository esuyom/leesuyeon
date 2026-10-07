import { useEffect, useState } from 'react'
import { profile, projects, type Project } from '../data/content'

// content.ts의 Category 유니언이랑 한 글자도 안 틀려야 필터가 먹음
const CATEGORIES = ['전체', '웹서비스', '홈페이지', '스낵게임', '사이드프로젝트'] as const

// 모니터 안에 뜨는 가짜 OS 화면 (1048×592 px 고정 — Monitor.tsx SCREEN이랑 세트)
export function ProjectsOS() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('전체')
  const [open, setOpen] = useState<Project | null>(null)
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 15000) // 분 단위 표시라 15초면 충분
    return () => clearInterval(t)
  }, [])
  const list = cat === '전체' ? projects : projects.filter((p) => p.category === cat)
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
          <div className="os-detail">
            <button type="button" className="os-back" onClick={() => setOpen(null)}>
              ← 목록
            </button>
            <div className="os-detail-body">
              <div className="os-thumb large">{open.image ? <img src={open.image} alt="" /> : <span>[스크린샷]</span>}</div>
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
          <div className="os-body">
            <nav className="os-side" aria-label="프로젝트 분류">
              {CATEGORIES.map((c) => (
                <button key={c} type="button" className={c === cat ? 'active' : ''} onClick={() => setCat(c)}>
                  {c}
                  <span className="mono os-count"> {countOf(c)}</span>
                </button>
              ))}
            </nav>
            <div className="os-grid">
              {list.map((p) => (
                <button key={p.id} type="button" className="os-card" onClick={() => setOpen(p)}>
                  <div className="os-thumb">{p.image ? <img src={p.image} alt="" /> : <span>[스크린샷]</span>}</div>
                  <strong>{p.title}</strong>
                  <span className="tags">
                    {p.stack.slice(0, 3).map((s) => (
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 장식용 터미널 */}
      <section className="os-terminal" aria-label="터미널">
        <div className="os-terminal-bar mono">terminal</div>
        <pre className="mono">
          <span className="mint">$</span> whoami{'\n'}
          {profile.name} — {profile.tagline}
          {'\n'}
          <span className="mint">$</span> <span className="cursor">_</span>
        </pre>
      </section>
    </div>
  )
}
