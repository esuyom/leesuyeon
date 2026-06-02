// 포트폴리오 데이터 — 본인 정보에 맞게 수정하세요.
export const profile = {
  name: '이수연',
  title: 'Frontend Developer · Web Publisher',
  tagline: '사용성과 흐름을 최우선으로, 직관적인 웹 경험을 만듭니다.',
  email: 'sylee@koreaedugroup.com',
  about: [
    `웹 퍼블리싱과 프론트엔드 개발을 담당하는 개발자입니다. 교육 그룹의
     다수 사이트를 신규 구축·리뉴얼하며 사용성, 흐름, 직관성을 기준으로
     화면을 설계하고 구현합니다.`,
    `현재는 React 기반 컴포넌트 라이브러리와 앱 화면 컴포넌트 변환 작업을
     진행하며, 디자인 시스템과 재사용 가능한 UI 구조에 집중하고 있습니다.`,
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/' }, // TODO: 본인 깃허브 주소
    { label: 'Email', href: 'mailto:sylee@koreaedugroup.com' },
  ],
}

export const experience = [
  {
    period: '2026 — 현재',
    role: 'Frontend Developer',
    org: 'Korea Edu Group',
    orgHref: 'https://www.koreaedugroup.com/',
    summary:
      'React 기반 컴포넌트 라이브러리 구축 및 앱 화면의 컴포넌트 변환 작업을 진행. 디자인 시스템을 코드로 구현하고 재사용 가능한 UI 패턴을 정립.',
    tags: ['React', 'Figma', 'Component Library', 'Design System'],
  },
  {
    period: '2025',
    role: 'Web Publisher / Frontend',
    org: 'Korea Edu Group',
    orgHref: 'https://www.koreaedugroup.com/',
    summary:
      '교육 그룹 산하 다수 사이트의 신규 구축 및 전면 리뉴얼 진행. 콘텐츠 플랫폼 구축, 학과별 사이트 리뉴얼, AI 아카데미 신규 작업 등을 담당.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive', 'Renewal'],
  },
  {
    period: '2024',
    role: 'Web Publisher',
    org: 'Korea Edu Group',
    orgHref: 'https://www.koreaedugroup.com/',
    summary:
      '커피베이킹 홈페이지를 분리하여 신규 구축. 독립적인 사이트 구조 설계 및 퍼블리싱.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
]

export const projects = [
  {
    year: '2026',
    title: '파인드미 (Find Me)',
    desc: 'React 기반 단일 페이지 웹앱. 컴포넌트 단위 설계와 상태 관리 적용.',
    href: 'https://findme-lovat.vercel.app/',
    tags: ['React', 'Vite', 'Vercel'],
    featured: true,
  },
  {
    year: '2026',
    title: '스마트러닝앱 컴포넌트 라이브러리',
    desc: '앱 화면을 재사용 가능한 React 컴포넌트로 변환. Figma 디자인을 코드로 옮기고 컴포넌트 라이브러리로 정리.',
    href: 'https://keg-ui-components.vercel.app/',
    tags: ['React', 'Component Library', 'Figma'],
    featured: true,
  },
  {
    year: '2025',
    title: 'KOREA AI 아카데미',
    desc: 'AI 교육 과정 사이트 신규 작업.',
    href: 'https://www.koreaaiacademy.com/',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    year: '2025',
    title: 'KEG 홈페이지 리뉴얼',
    desc: '교육 그룹 대표 홈페이지 전면 리뉴얼.',
    href: 'https://www.koreaedugroup.com/',
    tags: ['Renewal', 'Responsive'],
  },
  {
    year: '2025',
    title: '승무원 아카데미 리뉴얼',
    desc: '승무원 교육 과정 사이트 리뉴얼.',
    href: 'https://www.koreacrewacademy.com/',
    tags: ['Renewal', 'CSS', 'JavaScript'],
  },
  {
    year: '2025',
    title: '항공운항과 리뉴얼',
    desc: '항공운항 학과 사이트 리뉴얼.',
    href: 'https://www.koreaairacademy.com/',
    tags: ['Renewal', 'CSS'],
  },
  {
    year: '2025',
    title: '캘리스펫 아카데미 리뉴얼',
    desc: '반려동물 교육 과정 사이트 리뉴얼.',
    href: 'https://kpetacademy.com/',
    tags: ['Renewal', 'CSS'],
  },
  {
    year: '2024',
    title: '커피베이킹 홈페이지',
    desc: '커피·베이킹 과정 홈페이지 분리 신규 구축.',
    href: 'https://korea-coffeebaking.com/coffeeBaking/',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
]
