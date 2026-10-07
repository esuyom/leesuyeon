import { useState } from 'react'
import { about, contactLinks, experience, profile, projects, sections, skills, type SectionId } from '../data/content'

// 패널(3D)이랑 2D 페이지가 같이 쓰는 본문들. content.ts 내용 그대로 뿌림
export function SkillsContent() {
  return (
    <div className="stack-lg">
      {skills.map((g) => (
        <div key={g.group} className="stack-sm">
          <h3 className="eyebrow">{g.group}</h3>
          <ul className="skill-list">
            {g.items.map((s) => (
              <li key={s.name}>
                <span className="skill-name">{s.name}</span>
                {s.note && <span className="muted">{s.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// 코르크보드 섹션 본문
export function ExperienceContent() {
  return (
    <ol className="timeline">
      {experience.map((e, i) => (
        <li key={i}>
          <span className="mono accent small">{e.period}</span>
          <strong>{e.title}</strong>
          {e.orgHref ? (
            <a className="muted" href={e.orgHref} target="_blank" rel="noreferrer">
              {e.org} ↗
            </a>
          ) : (
            <span className="muted">{e.org}</span>
          )}
          <p>{e.detail}</p>
          {e.details && (
            <ul className="dash-list">
              {e.details.map((d, k) => (
                <li key={k}>{d}</li>
              ))}
            </ul>
          )}
          {e.tags && (
            <ul className="tags">
              {e.tags.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  )
}

// 턴테이블 섹션 본문
export function AboutContent() {
  return (
    <div className="stack-lg">
      {/* 인트로 없애면서 갈 곳 잃은 이름·한 줄 소개 */}
      <div className="stack-sm about-id">
        <h3>{profile.name}</h3>
        <p className="muted">{profile.tagline}</p>
      </div>
      <div className="stack-sm">
        {about.intro.map((p, i) => (
          <p key={i} className="lead">
            {p}
          </p>
        ))}
      </div>
      <div className="stack-sm">
        <h3 className="eyebrow">일하는 방식</h3>
        <ul className="dash-list">
          {about.howIWork.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>
      <div className="stack-sm">
        <h3 className="eyebrow">좋아하는 것</h3>
        <div className="tags">
          {about.likes.map((l) => (
            <span key={l} className="tag">
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// 휴대폰 섹션 본문 + 메일 복사
export function ContactContent() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600) // 토스트 대신 버튼 글자만 잠깐 바꿈
    } catch {
      /* 클립보드 권한 없으면 무시 */
    }
  }
  return (
    <div className="stack-lg">
      <p className="lead">같이 일하고 싶거나 궁금한 게 있으면 편하게 연락 주세요.</p>
      <ul className="contact-list">
        {contactLinks.map((c) => (
          <li key={c.label}>
            <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <span className="eyebrow">{c.label}</span>
              <span>{c.value}</span>
            </a>
          </li>
        ))}
      </ul>
      <button type="button" className="btn ghost" onClick={copy}>
        {copied ? '복사했어요 ✓' : '이메일 주소 복사'}
      </button>
    </div>
  )
}

// 모바일·2D용 프로젝트 목록 (데스크탑은 모니터 안 OS 화면)
export function ProjectsContent() {
  return (
    <div className="project-list">
      {projects.map((p) => (
        <article key={p.id} className="project-card">
          <div className="os-thumb">{p.image ? <img src={p.image} alt="" /> : <span>[스크린샷]</span>}</div>
          <div className="stack-sm">
            <span className="mono accent small">
              {p.category} · {p.period}
            </span>
            <strong>{p.title}</strong>
            <span className="muted">{p.summary}</span>
            <div className="tags">
              {p.stack.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
            {p.links && (
              <div className="row-gap">
                {p.links.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

// id로 본문 갈아끼우기. default 없어서 섹션 추가하면 타입 에러로 잡힘
export function SectionContent({ id }: { id: SectionId }) {
  switch (id) {
    case 'projects':
      return <ProjectsContent />
    case 'skills':
      return <SkillsContent />
    case 'experience':
      return <ExperienceContent />
    case 'about':
      return <AboutContent />
    case 'contact':
      return <ContactContent />
  }
}

// 번호·제목 꺼내기
export function sectionMeta(id: SectionId) {
  return sections.find((s) => s.id === id)!
}
