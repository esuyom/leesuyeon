import { useState, useEffect } from 'react'
import { profile, experience, projects } from './data/content'

const SECTIONS = [
  { id: 'about', label: 'About', num: '01' },
  { id: 'experience', label: 'Experience', num: '02' },
  { id: 'projects', label: 'Projects', num: '03' },
]

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage?.getItem('theme')
    if (saved) return saved
    return window.matchMedia?.('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
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

function getYearRank(year) {
  const years = String(year).match(/\d{4}/g)?.map(Number) ?? []
  return years.length ? Math.max(...years) : 0
}

const projectGroups = Object.entries(
  projects.reduce((groups, project) => {
    if (!groups[project.year]) groups[project.year] = []
    groups[project.year].push(project)
    return groups
  }, {})
)
  .map(([year, items]) => ({ year, items }))
  .sort((a, b) => getYearRank(b.year) - getYearRank(a.year))

/* Mobile-only sticky header — shown < 900px */
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

function Experience() {
  return (
    <section id="experience" className="block">
      <div className="block-head">
        <span className="block-num">02</span>
        <h2 className="block-title">Experience</h2>
      </div>
      <div className="exp-list">
        {experience.map((job, i) => {
          const RowTag = job.orgHref ? 'a' : 'article'
          const rowProps = job.orgHref
            ? { href: job.orgHref, target: '_blank', rel: 'noreferrer' }
            : {}

          return (
            <RowTag key={i} className="exp-row" {...rowProps}>
              <div className="exp-period">{job.period}</div>
              <div className="exp-main">
                <h3 className="exp-role">
                  {job.role} <span className="exp-at">@ {job.org}</span>
                  {job.orgHref && <span className="exp-arrow">↗</span>}
                </h3>
                <p className="exp-summary">{job.summary}</p>
                {job.details?.length > 0 && (
                  <ul className="exp-details">
                    {job.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                )}
                <ul className="tags">
                  {job.tags.map((t) => (
                    <li key={t} className="tag">{t}</li>
                  ))}
                </ul>
              </div>
            </RowTag>
          )
        })}
      </div>
    </section>
  )
}

function Projects() {
  let projectIndex = 0

  return (
    <section id="projects" className="block">
      <div className="block-head">
        <span className="block-num">03</span>
        <h2 className="block-title">Projects</h2>
      </div>
      {projectGroups.length ? (
        <div className="proj-list">
          {projectGroups.map((group) => (
            <div key={group.year} className="proj-group">
              <h3 className="proj-year-heading">{group.year}</h3>
              <div className="proj-group-list">
                {group.items.map((p) => {
                  projectIndex += 1

                  return (
                    <a
                      key={`${group.year}-${p.title}`}
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="proj-row"
                    >
                      <div className="proj-index">
                        {String(projectIndex).padStart(2, '0')}
                      </div>
                      <div className="proj-main">
                        <div className="proj-titleline">
                          <h4 className="proj-title">
                            {p.title}
                            {p.featured && (
                              <span
                                className="proj-star"
                                title="주요 작업"
                                aria-label="주요 작업"
                              >
                                ⭐
                              </span>
                            )}
                            {p.badge && (
                              <span
                                className="proj-badge"
                                title={p.badgeLabel}
                                aria-label={p.badgeLabel}
                              >
                                {p.badge}
                              </span>
                            )}
                            <span className="proj-arrow">↗</span>
                          </h4>
                        </div>
                        <p className="proj-desc">{p.desc}</p>
                        <ul className="tags">
                          {p.tags.map((t) => (
                            <li key={t} className="tag">{t}</li>
                          ))}
                        </ul>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty">공개 가능한 작업물을 정리 중입니다.</p>
      )}
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
        <Experience />
        <Projects />
        <footer className="foot">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </main>
    </div>
  )
}
