import { useState, useEffect } from 'react'
import { profile, skills, experience, projects } from './data/content'

const SECTIONS = [
  { id: 'about', label: 'About', num: '01' },
  { id: 'skills', label: 'Skills', num: '02' },
  { id: 'experience', label: 'Experience', num: '03' },
  { id: 'projects', label: 'Projects', num: '04' },
]

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage?.getItem('theme')
    if (saved) return saved
    // 시스템이 다크 선호일 때만 다크, 그 외(설정 없음 포함)는 라이트 기본
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage?.setItem('theme', theme)
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

function useActiveSection() {
  const [active, setActive] = useState('about')
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-25% 0px -70% 0px' }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return active
}

function MobileHeader({ active, theme, toggleTheme }) {
  return (
    <header className="mheader">
      <a href="#top" className="mheader-name">{profile.name}</a>
      <nav className="mheader-nav" aria-label="Section navigation">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? 'mnav-item active' : 'mnav-item'}
          >
            {s.label}
          </a>
        ))}
      </nav>
      <button className="mtheme-btn" onClick={toggleTheme} aria-label="theme">
        {theme === 'dark' ? 'LIGHT' : 'DARK'}
      </button>
    </header>
  )
}

function LeftPanel({ active, theme, toggleTheme }) {
  return (
    <aside className="left">
      <div className="left-top">
        <p className="eyebrow">/ PORTFOLIO</p>
        <h1 className="name">{profile.name}</h1>
        <p className="role">{profile.title}</p>
      </div>

      <nav className="nav" aria-label="Section navigation">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? 'nav-item active' : 'nav-item'}
          >
            <span className="nav-num">{s.num}</span>
            <span className="nav-label">{s.label}</span>
          </a>
        ))}
      </nav>

      <div className="left-bottom">
        <div className="socials">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label} ↗
            </a>
          ))}
        </div>
        <button className="theme-btn" onClick={toggleTheme} aria-label="theme">
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </button>
      </div>
    </aside>
  )
}

function About() {
  return (
    <section id="about" className="block">
      <div className="block-head">
        <span className="block-num">01</span>
        <h2 className="block-title">About</h2>
      </div>
      <div className="about-body">
        {profile.about.map((p, i) => (
          <p key={i} className="prose">{p}</p>
        ))}
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="block">
      <div className="block-head">
        <span className="block-num">02</span>
        <h2 className="block-title">Skills</h2>
      </div>
      <div className="skills-grid">
        {skills.map((s) => (
          <div key={s.group} className="skill-group">
            <h3 className="skill-group-title">{s.group}</h3>
            <ul className="tags">
              {s.items.map((it) => (
                <li key={it} className="tag">{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" className="block">
      <div className="block-head">
        <span className="block-num">03</span>
        <h2 className="block-title">Experience</h2>
      </div>
      <div className="exp-list">
        {experience.map((job, i) => (
          <a key={i} href={job.orgHref} target="_blank" rel="noreferrer" className="exp-row">
            <div className="exp-period">{job.period}</div>
            <div className="exp-main">
              <h3 className="exp-role">
                {job.role} <span className="exp-at">@ {job.org}</span>
                <span className="exp-arrow">↗</span>
              </h3>
              <p className="exp-summary">{job.summary}</p>
              {job.details && (
                <ul className="exp-details">
                  {job.details.map((d, di) => (
                    <li key={di}>{d}</li>
                  ))}
                </ul>
              )}
              <ul className="tags">
                {job.tags.map((t) => (
                  <li key={t} className="tag">{t}</li>
                ))}
              </ul>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

function ProjectRow({ p, index }) {
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noreferrer"
      className={p.featured ? 'proj-row featured' : 'proj-row'}
    >
      <div className="proj-index">{String(index).padStart(2, '0')}</div>
      <div className="proj-main">
        <div className="proj-titleline">
          <h3 className="proj-title">{p.title}</h3>
          {p.badge && <span className="game-badge">{p.badgeLabel}</span>}
          <span className="proj-year">{p.year}</span>
          {typeof p.contribution === 'number' && (
            <span className="proj-contrib">기여도 {p.contribution}%</span>
          )}
        </div>
        <p className="proj-desc">{p.desc}</p>
        <ul className="tags">
          {p.tags.map((t) => (
            <li key={t} className="tag">{t}</li>
          ))}
        </ul>
      </div>
      <span className="proj-arrow">↗</span>
    </a>
  )
}

function Projects() {
  const [showAll, setShowAll] = useState(false)
  const featured = projects.filter((p) => p.featured)
  const archive = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="block">
      <div className="block-head">
        <span className="block-num">04</span>
        <h2 className="block-title">Projects</h2>
      </div>

      <p className="proj-label">대표 프로젝트</p>
      <div className="proj-list">
        {featured.map((p, i) => (
          <ProjectRow key={p.title} p={p} index={i + 1} />
        ))}
      </div>

      {showAll && (
        <>
          <p className="proj-label proj-label-archive">전체 작업 아카이브</p>
          <div className="proj-list">
            {archive.map((p, i) => (
              <ProjectRow key={p.title} p={p} index={featured.length + i + 1} />
            ))}
          </div>
        </>
      )}

      <button className="more-btn" onClick={() => setShowAll((v) => !v)}>
        {showAll ? '접기' : `전체 작업 ${archive.length}개 더보기`}
      </button>
    </section>
  )
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const active = useActiveSection()

  return (
    <div className="shell" id="top">
      <MobileHeader active={active} theme={theme} toggleTheme={toggleTheme} />
      <LeftPanel active={active} theme={theme} toggleTheme={toggleTheme} />
      <main className="right">
        <About />
        <Skills />
        <Experience />
        <Projects />
        <footer className="foot">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </main>
    </div>
  )
}
