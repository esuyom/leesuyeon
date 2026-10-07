import { useStore } from '../store'
import { profile, sections } from '../data/content'
import { SectionContent } from './Panels'

// 3D 없는 일반 페이지 — WebGL 안 되거나 직접 2D 고를 때
export function Page2D({ forced = false }: { forced?: boolean }) {
  const setView2d = useStore((s) => s.setView2d)
  return (
    <div className="page2d">
      <header className="page2d-header">
        <span className="logo mono">
          {profile.siteName}
          <span className="accent">.studio</span>
        </span>
        <nav aria-label="섹션">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>
        {/* WebGL 자체가 안 되면 돌아갈 데가 없으니 버튼 숨김 */}
        {!forced && (
          <button type="button" className="btn ghost small" onClick={() => setView2d(false)}>
            3D 작업실로
          </button>
        )}
      </header>
      <main>
        <section className="page2d-hero">
          <div className="eyebrow mono accent">PORTFOLIO</div>
          <h1>{profile.name}의 작업실</h1>
          <p className="lead">{profile.tagline}</p>
        </section>
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="page2d-section">
            <div className="panel-head">
              <span className="mono accent">{s.no}</span>
              <h2>{s.title}</h2>
            </div>
            <SectionContent id={s.id} />
          </section>
        ))}
      </main>
    </div>
  )
}
