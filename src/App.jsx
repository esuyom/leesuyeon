import { useState, useEffect, useRef } from 'react'
import { profile, experience, projects } from './data/content'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
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
      { rootMargin: '-40% 0px -55% 0px' }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return active
}

function Spotlight() {
  const ref = useRef(null)
  useEffect(() => {
    const move = (e) => {
      if (!ref.current) return
      ref.current.style.background = `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, var(--spotlight), transparent 80%)`
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <div className="spotlight" ref={ref} aria-hidden="true" />
}

function Sidebar({ active, theme, toggleTheme }) {
  return (
    <header className="sidebar">
      <div>
        <h1 className="name">{profile.name}</h1>
        <h2 className="role">{profile.title}</h2>
        <p className="tagline">{profile.tagline}</p>

        <nav className="nav" aria-label="In-page jump links">
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={active === s.id ? 'nav-link active' : 'nav-link'}
                >
                  <span className="nav-indicator" />
                  <span className="nav-text">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <ul className="socials">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <button className="theme-btn" onClick={toggleTheme} aria-label="테마 전환">
          {theme === 'dark' ? '☀︎ Light' : '☾ Dark'}
        </button>
      </div>
    </header>
  )
}

function About() {
  return (
    <section id="about" className="section" aria-label="About">
      <h3 className="section-heading">About</h3>
      {profile.about.map((p, i) => (
        <p key={i} className="prose">
          {p}
        </p>
      ))}
    </section>
  )
}

function Experience() {
  return (
    <section id="experience" className="section" aria-label="Experience">
      <h3 className="section-heading">Experience</h3>
      <ol className="card-list">
        {experience.map((job, i) => (
          <li key={i} className="card">
            <div className="card-period">{job.period}</div>
            <div className="card-body">
              <h4 className="card-title">
                <a href={job.orgHref} target="_blank" rel="noreferrer">
                  {job.role} · {job.org}
                  <span className="arrow"> →</span>
                </a>
              </h4>
              <p className="card-summary">{job.summary}</p>
              <ul className="tags">
                {job.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="section" aria-label="Projects">
      <h3 className="section-heading">Projects</h3>
      <ol className="card-list">
        {projects.map((p, i) => (
          <li key={i} className="card">
            <div className="card-period">{p.year}</div>
            <div className="card-body">
              <h4 className="card-title">
                <a href={p.href} target="_blank" rel="noreferrer">
                  {p.title}
                  {p.featured && <span className="badge">Featured</span>}
                  <span className="arrow"> →</span>
                </a>
              </h4>
              <p className="card-summary">{p.desc}</p>
              <ul className="tags">
                {p.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const active = useActiveSection()

  return (
    <>
      <Spotlight />
      <div className="layout">
        <Sidebar active={active} theme={theme} toggleTheme={toggleTheme} />
        <main className="content">
          <About />
          <Experience />
          <Projects />
        </main>
      </div>
    </>
  )
}
