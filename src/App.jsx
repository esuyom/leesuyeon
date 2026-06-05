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
        <p className="tagline">{profile.tagline}</p>
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
        {experience.map((job, i) => (
          <a key={i} href={job.orgHref} target="_blank" rel="noreferrer" className="exp-row">
            <div className="exp-period">{job.period}</div>
            <div className="exp-main">
              <h3 className="exp-role">
                {job.role} <span className="exp-at">@ {job.org}</span>
                <span className="exp-arrow">↗</span>
              </h3>
              <p className="exp-summary">{job.summary}</p>
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

function Projects() {
  return (
    <section id="projects" className="block">
      <div className="block-head">
        <span className="block-num">03</span>
        <h2 className="block-title">Projects</h2>
      </div>
      <div className="proj-list">
        {projects.map((p, i) => (
          <a
            key={i}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className={p.featured ? 'proj-row featured' : 'proj-row'}
          >
            <div className="proj-index">{String(i + 1).padStart(2, '0')}</div>
            <div className="proj-main">
              <div className="proj-titleline">
                <h3 className="proj-title">{p.title}</h3>
                {p.featured && <span className="star">★</span>}
                <span className="proj-year">{p.year}</span>
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
        ))}
      </div>
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
