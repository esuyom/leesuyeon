// 내용은 전부 여기서만 고친다. [대괄호]는 아직 안 채운 자리

export type SectionId = 'projects' | 'skills' | 'experience' | 'about' | 'contact'

export const profile = {
  name: '이수연',
  siteName: 'suyeon',
  tagline: 'Vue와 React로 서비스 화면을 만드는 프론트엔드 개발자',
  email: 'worksuyeon@gmail.com',
}

// 이 순서가 곧 화면 번호 순서. object는 방 안에서 어떤 물건인지
export const sections: { id: SectionId; no: string; title: string; object: string }[] = [
  { id: 'projects', no: '01', title: 'Projects', object: '모니터' },
  { id: 'skills', no: '02', title: 'Skills', object: '책장' },
  { id: 'experience', no: '03', title: 'Experience', object: '코르크보드' },
  { id: 'about', no: '04', title: 'About', object: '턴테이블' },
  { id: 'contact', no: '05', title: 'Contact', object: '휴대폰' },
]

// ProjectsOS의 CATEGORIES와 한 글자도 안 틀려야 필터가 먹음
export type Category = '웹서비스' | '홈페이지' | '스낵게임' | '사이드프로젝트'

export type Project = {
  id: string
  title: string
  summary: string
  category: Category
  featured?: boolean // 대표 3건. 모니터 화면에서 큰 카드로 뜬다
  period: string
  role: string
  description: string[]
  stack: string[]
  links?: { label: string; href: string }[]
  image?: string // public/projects/ 에 넣고 '/projects/a.png'
}

// 노션 포폴용 체크된 건 '내부 기록' 링크. 비공개라 외부에선 로그인 화면 뜸
export const projects: Project[] = [
  // ───────────── 웹서비스 ─────────────
  {
    id: 'keg-mou',
    title: 'KEG 산학협력(MOU) 관리 플랫폼',
    summary: '계열사와 지점마다 흩어진 협약과 계약을 한 곳에 모은 사내 플랫폼. 혼자 만들어 3주 만에 개발서버에 올렸고 커밋 482건, 테스트 423건, DB 마이그레이션 60건',
    category: '웹서비스',
    featured: true,
    period: '2026.09 – 10',
    role: '단독 개발 — 설계와 백엔드, 프론트, DB, 배포',
    description: [
      '계열사와 지점이 각자 엑셀로 관리하다 보니, 같은 대학에 A지점이 협약을 맺은 걸 모르고 B지점이 또 연락하는 일이 있었음',
      '협약과 계약, 사업, 컨택을 전부 기관 Master 하나에 매달고 기관 정보를 고치는 화면도 기관 상세 한 곳으로 제한. 처음에는 협약 수정 화면에서도 기관명을 고칠 수 있게 했다가, 같은 기관이 화면마다 다른 이름을 갖게 돼서 걷어냄',
      '3주 만에 개발서버 오픈. 커밋 482건, 테스트 423건, DB 마이그레이션 60건. 개발은 마쳤고 상용 적용을 앞두고 있음',
      '외부 담당자 개인정보는 AES-256-GCM으로 암호화 저장하고 목록과 상세에선 항상 마스킹. 원문 열람은 별도 API로 분리하고 열람 기록을 적재',
      '권한을 JWT에 담아두던 것을 요청마다 DB에서 읽도록 바꿔, 권한을 회수하면 즉시 반영되게 수정',
      '권한 상수를 지웠는데 @PreAuthorize 문자열이 남아 아무도 연락처 원문을 못 보게 된 적이 있어, 소스 전체를 훑어 없는 권한을 잡아내는 테스트를 추가',
      '사업자번호 중복 검사를 앱 레벨에서 생성 컬럼 + UNIQUE 제약으로 내려, 동시 등록 경합까지 차단',
      '기존 엑셀 605건을 이관하며 주소 문자열에서 시·도/시·군·구를 자동 매핑해 98% 자동 분류',
    ],
    stack: ['Vue 3', 'TypeScript', 'Spring Boot', 'Java 21', 'MyBatis', 'MySQL', 'Flyway', 'nginx', 'GitHub Actions'],
    links: [{ label: '내부 기록', href: 'https://app.notion.com/p/3f187353d9298160bd5ec380ba5a5280' }],
  },
  {
    id: 'o4o',
    title: 'O4O 온오프 블렌디드 학습 플랫폼',
    summary: '오프라인 수업과 온라인 복습을 묶은 학습 플랫폼의 웹 프론트. 화면보다 공통 컴포넌트를 먼저 만들어둔 덕에 8월 말 전 화면 모바일 대응을 Core 컴포넌트만 고쳐서 넘김',
    category: '웹서비스',
    featured: true,
    period: '2026.07 – 09',
    role: '프론트엔드 단독 — 공통 컴포넌트와 화면, API 연동, 모바일',
    description: [
      '수업노트를 쓰다 저장하지 않고 나가면 업로드가 끝난 파일까지 서버에서 지워졌고, 되돌릴 방법이 없었음',
      '이탈 확인을 붙였더니 이번엔 저장을 해도 "변경사항 있음"이 남았음. nextTick을 겹쳐 쌓아 타이밍을 맞추는 대신, 저장 시점 내용과 현재 내용을 직접 비교하도록 바꿈',
      '값이 같으면 변경으로 보지 않게 되면서 저장과 이탈 처리가 함께 정리됨. 커밋 175건, 개발서버 배포 56회',
      '화면보다 공통 컴포넌트를 먼저 만들고 가이드 페이지로 정리. 8월 말 전 화면 모바일 대응 때 Core 컴포넌트만 손봐도 되는 구조가 됨',
      '수업노트 블록 에디터 구현. 텍스트와 영상, 참고자료, FAQ 블록을 드래그로 재배치하고 임시저장과 동시 수정 충돌까지 처리',
      '사파리 영상 로딩 멈춤과 iOS 전체화면 미동작을 브라우저별 분기로 처리',
      'FCM 웹 푸시와 플루터 앱 웹뷰 네이티브 푸시를 브릿지로 나눠 양쪽 모두 동작하게 구성',
      '상태 관리를 Pinia로 이전 — 130개 파일에서 3,900줄을 걷어내고 1,000줄로 다시 씀',
    ],
    stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Pinia', 'Firebase FCM', 'DOMPurify', 'GitHub Actions'],
    links: [{ label: '내부 기록', href: 'https://app.notion.com/p/3f187353d9298114b685d912415cf596' }],
  },
  {
    id: 'korea-ai-campus',
    title: '코리아 AI 캠퍼스 홈페이지',
    summary: 'AI 교육기관 수강생 모집 홈페이지 초기 2주. 클래스 목록과 상세를 맡았고, 넘기기 이틀 전 전체 코드리뷰 14건을 우선순위와 수정 방향까지 문서로 정리',
    category: '웹서비스',
    period: '2026.07',
    role: '프론트엔드 — 기본 스타일 세팅과 공통 UI, 클래스 목록/상세',
    description: [
      'SCSS 변수와 믹스인, 리셋과 폼 컴포넌트를 만들고 스타일 가이드 페이지로 모음',
      '클래스 상세를 하드코딩 300줄에서 섹션 렌더러 구조로 전환. CMS 블록 데이터를 타입 유니언으로 받아 그리게 만들어, 이후 팀에서 멀티테넌시 템플릿과 편집 모드를 그 위에 얹음',
      '클래스 목록에 SSR 첫 페이지 + IntersectionObserver 무한 스크롤을 적용해, 11번째부터 보이지 않던 문제를 해결',
      '모양 단위로 늘어난 폼 그룹 컴포넌트 4개를 Checkbox와 ChipSelect 2개로 통합 (+654 / −712)',
      '인수인계 이틀 전 전체 코드리뷰 14건을 우선순위와 파일 위치, 수정 방향까지 문서로 정리',
    ],
    stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'SCSS', 'Swiper'],
    links: [{ label: '내부 기록', href: 'https://app.notion.com/p/3f287353d9298186a0f2e77ce1f07232' }],
  },
  {
    id: 'findme',
    title: '파인드미 (Find Me)',
    summary: '채용 플랫폼 React SPA. 컴포넌트 단위 설계와 상태 관리를 직접 구성하고 화면 전반을 단독 개발',
    category: '웹서비스',
    period: '2026',
    role: '프론트엔드 단독 — 기여도 100%',
    description: ['채용 플랫폼의 React SPA 화면 전반을 단독 개발', '컴포넌트 단위 설계와 상태 관리를 직접 구성'],
    stack: ['React', 'Vite', 'Vercel'],
    links: [{ label: 'Demo', href: 'https://findme-lovat.vercel.app/' }],
  },
  {
    id: 'keg-ui',
    title: '수강생 앱 컴포넌트 라이브러리',
    summary: 'Figma 디자인을 재사용 가능한 React 컴포넌트로 옮기고 라이브러리로 구조화. 앱 화면 전환의 기반을 단독 구축',
    category: '웹서비스',
    period: '2026',
    role: '단독 개발 — 기여도 100%',
    description: ['Figma 디자인을 재사용 가능한 React 컴포넌트로 변환', '컴포넌트 라이브러리로 구조화해 앱 화면 전환의 기반을 마련'],
    stack: ['React', 'Component Library', 'Figma'],
    links: [{ label: 'Demo', href: 'https://keg-ui-components.vercel.app/' }],
  },
  {
    id: 'keg-app-ux',
    title: '수강생 앱 리뉴얼 화면설계서',
    summary: '수강생 앱 전면 리뉴얼의 화면설계서와 와이어프레임 작성. 사용자 화면 구조와 운영 흐름을 설계하고 Figma로 정리',
    category: '웹서비스',
    period: '2026',
    role: 'UX 설계 참여 — 기여도 50%',
    description: ['수강생 앱 전면 리뉴얼의 화면설계서와 와이어프레임 작성에 참여', '사용자 화면 구조와 운영 흐름을 설계하고 Figma로 정리'],
    stack: ['UX', 'Wireframe', 'Figma'],
    links: [
      {
        label: 'Figma',
        href: 'https://www.figma.com/design/juDtQCqeWnvXJnmlj3C6NE/%EC%8A%A4%EB%A7%88%ED%8A%B8%EB%9F%AC%EB%8B%9D%EC%95%B1-2%EC%B0%A8?node-id=539-4460',
      },
    ],
  },

  // ───────────── 홈페이지 ─────────────
  {
    id: 'keg-official',
    title: '코리아교육그룹 공식 홈페이지 리뉴얼',
    summary: '공식 홈페이지 전면 리뉴얼. 전체 반응형 UI를 구현하고 three.js로 디지털 전시관 구현',
    category: '홈페이지',
    period: '2026',
    role: '퍼블리싱과 프론트 — 기여도 80%',
    description: ['공식 홈페이지 전면 리뉴얼의 전체 페이지 반응형 UI 구현', 'three.js를 활용한 디지털 전시관 구현'],
    stack: ['three.js', 'JavaScript', 'Responsive', 'Renewal'],
    links: [{ label: 'Site', href: 'https://www.koreaedugroup.com/' }],
  },
  {
    id: 'kpet',
    title: '코리아펫아카데미 홈페이지 리뉴얼',
    summary: '반려동물 교육 브랜드 사이트의 반응형 UI와 페이지 퍼블리싱을 담당',
    category: '홈페이지',
    period: '2025',
    role: '퍼블리싱 — 기여도 80%',
    description: ['반려동물 교육 브랜드 사이트의 반응형 UI 구현과 전체 페이지 퍼블리싱'],
    stack: ['Renewal', 'Responsive', 'CSS'],
    links: [{ label: 'Site', href: 'https://kpetacademy.com/' }],
  },
  {
    id: 'crew-academy',
    title: '코리아승무원아카데미 홈페이지 리뉴얼',
    summary: 'Figma 시안 기반 반응형 퍼블리싱과 UI 개선 작업',
    category: '홈페이지',
    period: '2025',
    role: '퍼블리싱 — 기여도 70%',
    description: ['Figma 시안을 기준으로 반응형 퍼블리싱 진행', '기존 UI 개선 작업 병행'],
    stack: ['Renewal', 'CSS', 'JavaScript'],
    links: [{ label: 'Site', href: 'https://www.koreacrewacademy.com/' }],
  },
  {
    id: 'air-academy',
    title: '코리아항공운항과 홈페이지 리뉴얼',
    summary: '학과 소개 흐름에 맞춘 반응형 페이지 구현, 운영하면서 쌓인 UI 정리',
    category: '홈페이지',
    period: '2025',
    role: '퍼블리싱 — 기여도 50%',
    description: ['학과 소개 흐름에 맞춘 반응형 페이지 구현', '운영 단계에서 쌓인 UI 정리'],
    stack: ['Renewal', 'Responsive', 'CSS'],
    links: [{ label: 'Site', href: 'https://www.koreaairacademy.com/' }],
  },
  {
    id: 'coffee-baking',
    title: '코리아요리아트아카데미 커피베이킹 신규 구축',
    summary: '커피베이킹 과정 홈페이지를 분리해 신규 구축. 사이트 구조 설계와 퍼블리싱을 단독 담당',
    category: '홈페이지',
    period: '2024',
    role: '단독 구축 — 기여도 100%',
    description: ['커피베이킹 과정 홈페이지를 기존 사이트에서 분리해 신규 구축', '사이트 구조를 짜고 퍼블리싱까지 혼자 진행'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    links: [{ label: 'Site', href: 'https://korea-coffeebaking.com/coffeeBaking/' }],
  },
  {
    id: 'db-insure',
    title: 'DB손해보험 유지보수',
    summary: '2년 7개월간 DB손해보험 사이트 리뉴얼과 연간 유지보수를 담당',
    category: '홈페이지',
    period: '2021 – 2023',
    role: '퍼블리싱과 운영 — 기여도 100%',
    description: [
      '2년 7개월간 사이트 리뉴얼과 연간 유지보수를 담당',
      '운영 요청 대응, 금칙어 처리, 애니메이션 및 JavaScript 기능 구현',
    ],
    stack: ['Maintenance', 'Renewal', 'JavaScript'],
    links: [{ label: 'Site', href: 'https://dbinsure.co.kr/driver' }],
  },
  {
    id: 'dearchiis',
    title: '디아키즈건설 홈페이지',
    summary: '반응형 홈페이지로 슬라이드와 스크롤 애니메이션을 포함해 전체 퍼블리싱을 진행',
    category: '홈페이지',
    period: '2023',
    role: '퍼블리싱 — 기여도 100%',
    description: ['반응형 홈페이지 전체 퍼블리싱', '슬라이드와 스크롤 애니메이션 구현'],
    stack: ['Responsive', 'Animation', 'JavaScript'],
    links: [{ label: 'Site', href: 'https://www.dearchiis.co.kr/' }],
  },

  // ───────────── 스낵게임 ─────────────
  {
    id: 'jjansun',
    title: '짠순이 게임방',
    summary: '게임방 콘셉트 사이트의 적립 게임과 당첨 게임 전체를 JavaScript와 GSAP 기반으로 단독 개발',
    category: '스낵게임',
    period: '2023',
    role: '게임 개발 단독 — 기여도 100%',
    description: ['게임방 콘셉트 사이트의 적립 게임과 당첨 게임 전체를 단독 개발', 'JavaScript와 GSAP으로 게임 로직과 연출을 구현'],
    stack: ['JavaScript', 'GSAP', 'Game'],
    links: [{ label: 'Site', href: 'https://www.jjansun.com/' }],
  },
  {
    id: 'shinhan-sol',
    title: '신한은행 쏠 게임 3종',
    summary: '신한은행 임직원 대상 모바일 최적화 게임 3종 제작',
    category: '스낵게임',
    period: '2022',
    role: '게임 개발 단독 — 기여도 100%',
    description: ['임직원 대상 모바일 최적화 게임 3종 제작', 'JavaScript와 GSAP, 사운드 연출 활용'],
    stack: ['JavaScript', 'GSAP', 'Mobile', 'Game'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2022shinhansol/game1/' }],
  },
  {
    id: 'db-33rd',
    title: 'DB손해보험 33주년 창립 기념 카드게임',
    summary: '프로모션 사이트 내 카드게임 개발과 전체 퍼블리싱을 담당',
    category: '스낵게임',
    period: '2022',
    role: '게임 개발과 퍼블리싱 — 기여도 100%',
    description: ['창립 기념 프로모션 사이트 내 카드게임 개발', '사이트 전체 퍼블리싱 병행'],
    stack: ['JavaScript', 'Game', 'Promotion'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2204db/index.html' }],
  },
  {
    id: 'halotop',
    title: '헤일로탑 디지털 팝업스토어',
    summary: '체험 콘텐츠 중심의 디지털 팝업스토어. JavaScript 콘텐츠 개발과 전체 퍼블리싱을 담당',
    category: '스낵게임',
    period: '2022',
    role: '콘텐츠 개발과 퍼블리싱 — 기여도 100%',
    description: ['디지털 팝업스토어의 체험 콘텐츠를 JavaScript로 개발', '사이트 전체 퍼블리싱 담당'],
    stack: ['JavaScript', 'Interactive', 'Game'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2208halotop/index.html' }],
  },
  {
    id: 'fss-voice-promo',
    title: '금융감독원 보이스피싱 예방 프로모션',
    summary: '보이스피싱 예방 메시지를 전달하는 프로모션 사이트. JavaScript 게임 개발과 전체 퍼블리싱을 담당',
    category: '스낵게임',
    period: '2023',
    role: '게임 개발과 퍼블리싱 — 기여도 100%',
    description: ['보이스피싱 예방 메시지를 전달하는 게임형 프로모션 사이트 개발', '게임 로직과 전체 퍼블리싱을 담당'],
    stack: ['JavaScript', 'Game', 'Promotion'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2306voice/' }],
  },
  {
    id: 'fss-voice-v2',
    title: '금융감독원 보이스피싱 사이버 체험관 ver2',
    summary: '체험형 테스트 콘텐츠를 JavaScript로 만들고 전체 퍼블리싱을 담당',
    category: '스낵게임',
    period: '2023',
    role: '콘텐츠 개발과 퍼블리싱 — 기여도 100%',
    description: ['체험형 테스트 콘텐츠를 JavaScript로 개발', '사이트 전체 퍼블리싱 담당'],
    stack: ['JavaScript', 'Interactive'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2309voice/index.html' }],
  },
  {
    id: 'fss-voice-v1',
    title: '금융감독원 보이스피싱 사이버 체험관 ver1',
    summary: '체험형 테스트와 인터랙션을 JavaScript로 구현하고 전체 퍼블리싱을 진행',
    category: '스낵게임',
    period: '2022',
    role: '콘텐츠 개발과 퍼블리싱 — 기여도 100%',
    description: ['체험형 테스트와 인터랙션을 JavaScript로 구현', '사이트 전체 퍼블리싱 진행'],
    stack: ['JavaScript', 'Interactive'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2210financial' }],
  },
  {
    id: 'kia-colors',
    title: '기아 Change the Colors 프로모션',
    summary: '스크롤 애니메이션 중심의 프로모션 사이트 전체 퍼블리싱',
    category: '스낵게임',
    period: '2023',
    role: '퍼블리싱 — 기여도 100%',
    description: ['스크롤 애니메이션 중심의 프로모션 사이트 전체 퍼블리싱', '애니메이션 라이브러리로 스크롤 연출 구현'],
    stack: ['Promotion', 'Animation', 'JavaScript'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2304kia/' }],
  },
  {
    id: 'oreo-dunk',
    title: '오레오 덩크 챌린지',
    summary: '터치로 점수를 쌓는 아케이드 게임. 피버 구간과 랭킹 등록이 들어간 프로모션 사이트',
    category: '스낵게임',
    period: '2021',
    role: '게임 개발과 퍼블리싱 — 기여도 100%',
    description: ['터치 입력으로 점수가 쌓이는 게임 로직과 피버 연출 구현', '최고 점수 저장, 랭킹 확인, 친구 초대 기능 개발'],
    stack: ['JavaScript', 'GSAP', 'Game', 'Promotion'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2111oreodunk/' }],
  },
  {
    id: 'kcci-event',
    title: '대한상공회의소 소통플랫폼 오픈 이벤트',
    summary: '소통플랫폼 오픈 기념 사이트. 이름 낱말 퍼즐 게임과 네이밍 공모전 응모를 함께 담음',
    category: '스낵게임',
    period: '2021',
    role: '게임 개발과 퍼블리싱 — 기여도 100%',
    description: ['글자를 맞춰 이름을 완성하는 낱말 퍼즐 구현. 성공과 실패에 따라 결과 화면 분기', '네이밍 공모전 응모 폼과 SNS 공유 기능 개발'],
    stack: ['JavaScript', 'GSAP', 'Game', 'Promotion'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2110KCCI/' }],
  },
  {
    id: 'hbcil-find',
    title: '한밭장애인자립생활센터 인식 개선 그림찾기',
    summary: '장애인 인식 개선을 목적으로 한 틀린그림찾기 게임. JavaScript 기반 게임 로직을 구현',
    category: '스낵게임',
    period: '2021',
    role: '게임 개발 단독 — 기여도 100%',
    description: ['장애인 인식 개선을 목적으로 한 틀린그림찾기 게임 개발', 'JavaScript 기반 게임 로직 구현'],
    stack: ['JavaScript', 'Game', 'Accessibility'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2108hbcil/' }],
  },
  {
    id: 'hy-kids',
    title: 'hy 어린이날 맞이 이벤트',
    summary: '어린이날 이벤트 사이트. 아이템을 주워 담는 미니게임과 당첨자 발표를 담음',
    category: '스낵게임',
    period: '2021',
    role: '게임 개발과 퍼블리싱 — 기여도 100%',
    description: ['아이템을 주워 담는 미니게임 구현. 성공과 실패에 따라 결과 화면 분기', '응모 폼과 당첨자 발표 화면 퍼블리싱'],
    stack: ['JavaScript', 'GSAP', 'Game', 'Promotion'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2104hykid/' }],
  },
  {
    id: 'db-family',
    title: 'DB손해보험 프로미스 가족사랑 이벤트',
    summary: '프로모션 사이트로 액자 꾸미기 등 참여형 콘텐츠를 포함해 전체 퍼블리싱을 진행',
    category: '스낵게임',
    period: '2021',
    role: '퍼블리싱 — 기여도 100%',
    description: ['액자 꾸미기 등 참여형 콘텐츠 구현', '프로모션 사이트 전체 퍼블리싱 진행'],
    stack: ['JavaScript', 'HTML', 'Promotion'],
    links: [{ label: 'Demo', href: 'https://dbins2.speedgabia.com/thl/work/2107db/' }],
  },

  // ───────────── 사이드프로젝트 ─────────────
  {
    id: 'suyeon-studio',
    title: '수연의 작업실',
    summary: '지금 보고 계신 이 사이트. React Three Fiber로 3D 작업실을 만들고 방 안 물건을 눌러 섹션을 여는 포트폴리오',
    category: '사이드프로젝트',
    featured: true,
    period: '2026',
    role: '개인 프로젝트 — 기여도 100%',
    description: [
      '외부 3D 모델을 쓰면 용량이 늘고 고칠 때마다 모델링 툴을 열어야 해서, 가구를 전부 코드로 만들기로 함',
      'Box와 Cylinder, Sphere를 조합하고 두 점을 이으면 각도를 맞춰주는 Rod 헬퍼를 따로 만들어 조립. 바닥 마루와 창밖 하늘, 코르크 질감도 canvas로 런타임에 그림',
      '가구와 질감에 쓰는 이미지 파일이 0개. 외부 파일은 사진 2장뿐이고 긴 변 512px로 줄여 합쳐서 255KB',
      '방 안 물건(모니터와 책장, 코르크보드, 턴테이블, 휴대폰)을 클릭하면 카메라가 다가가며 섹션이 열리는 구조',
      '모니터에 줌인하면 3D 화면 텍스처가 실제 HTML OS 화면으로 교체되고, 그 안에서 프로젝트를 탐색',
      '저사양 기기나 WebGL이 막힌 환경을 위해 같은 데이터로 그리는 2D 페이지를 따로 둠. 모바일에서는 카메라를 고정하고 하단 시트로 섹션을 고르게 분기',
    ],
    stack: ['React', 'Three.js', 'React Three Fiber', 'TypeScript', 'Zustand', 'Vite'],
  },
  {
    id: 'drop-cookie',
    title: 'Drop Cookie',
    summary: 'Phaser3 게임 프레임워크로 제작한 개인 게임 프로젝트. 게임 로직과 인터랙션을 직접 설계하고 구현',
    category: '사이드프로젝트',
    period: '2024',
    role: '개인 프로젝트 — 기여도 100%',
    description: ['Phaser3 게임 프레임워크로 제작한 개인 게임', '게임 로직과 인터랙션을 직접 설계하고 구현'],
    stack: ['Phaser3', 'JavaScript', 'Game'],
    links: [{ label: 'Play', href: 'https://esuyom.github.io/drop-cookie/' }],
  },
]

export const skills: { group: string; items: { name: string; note?: string }[] }[] = [
  {
    group: 'Frontend',
    items: [
      { name: 'Vue 3 / Nuxt 4', note: 'O4O 학습 플랫폼, MOU 관리 플랫폼, AI 캠퍼스' },
      { name: 'React', note: '파인드미 채용 플랫폼, 수강생 앱 컴포넌트 라이브러리' },
      { name: 'TypeScript' },
      { name: 'JavaScript (ES6+)', note: '퍼블리싱 하던 시절부터 쓴 주력' },
      { name: 'HTML5 / CSS3 / SCSS' },
    ],
  },
  {
    group: 'UI / Interaction',
    items: [
      { name: 'Responsive UI', note: 'Figma 시안을 반응형으로' },
      { name: 'Three.js / R3F', note: '코리아교육그룹 디지털 전시관' },
      { name: 'GSAP', note: '프로모션 사이트 연출' },
      { name: 'Pinia / Zustand' },
    ],
  },
  {
    group: 'Design / Collab',
    items: [{ name: 'Figma' }, { name: 'Git' }, { name: '화면설계서 / 와이어프레임' }],
  },
]

// detail은 요약 한 문단, details는 아래 불릿
export const experience: {
  period: string
  title: string
  org: string
  orgHref?: string
  detail: string
  details?: string[]
  tags?: string[]
}[] = [
  {
    period: '2024.07 — 현재',
    title: 'Frontend UI Developer / Web Publisher',
    org: '코리아교육그룹',
    orgHref: 'https://www.koreaedugroup.com/',
    detail:
      '교육 브랜드 웹사이트와 사내 서비스 화면을 만듭니다. Figma 시안을 반응형으로 옮기는 일에서 시작해, 지금은 React 공통 컴포넌트 설계와 화면설계서 작성도 맡고 있습니다.',
    details: [
      '코리아승무원아카데미와 항공운항과, 펫아카데미, 커피베이킹, 공식 홈페이지 리뉴얼 및 신규 구축',
      '계열사 CMS 관리자 화면 UI, 파인드미 채용 플랫폼, 스마트러닝앱 React 컴포넌트 전환',
      '산학협력(MOU) 관리 플랫폼을 혼자 개발. 요구사항 해석과 DB 설계, 백엔드, 프론트, 배포를 전부 담당',
      '수강생앱 리뉴얼 화면설계서와 와이어프레임 작성에 참여',
    ],
    tags: ['React', 'Vue 3', 'Nuxt 4', 'Spring Boot', 'Design System', 'CMS'],
  },
  {
    period: '2021.05 — 2024.01',
    title: 'Web Publisher / Interactive Developer',
    org: 'THL',
    orgHref: 'https://www.htmlgame.co.kr/',
    detail:
      '보험사 운영 사이트와 브랜드 프로모션, 적립형 게임 사이트를 만드는 에이전시였습니다. 디자인 시안을 HTML과 CSS, JavaScript로 옮기면서 미니게임과 이벤트 화면도 직접 만들었고, 오픈 뒤 운영 요청과 외부 담당자 커뮤니케이션도 맡았습니다.',
    details: [
      'DB손해보험 사이트 유지보수와 리뉴얼. 운영 요청 대응, 금칙어 처리 같은 JavaScript 기능 구현',
      '짠순이 게임방 적립 게임과 추첨 게임, 프로모션 미니게임, 스크롤 애니메이션 개발',
      '홈페이지와 프로모션 페이지 오픈 후 수정, 이슈 대응, 일정 관리',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'GSAP', 'Maintenance'],
  },
]

// howIWork는 회고 Keep 항목에서 추림
export const about = {
  // 전부 projects, experience에 근거가 있는 내용만
  intro: [
    '웹 퍼블리셔로 시작해 6년째 화면을 만들고 있습니다. 에이전시에서 보험사 사이트와 프로모션 페이지, 미니게임을 만들다가 지금은 교육 그룹에서 브랜드 홈페이지와 서비스 프론트를 맡고 있습니다.',
    '시안을 화면으로 옮기는 일로 시작했는데, 하다 보니 화면설계서를 쓰고 공통 컴포넌트를 설계하는 쪽으로 넘어갔습니다. 요즘은 테이블 구조를 보고 어떤 API가 필요한지 먼저 그려본 다음 백엔드 쪽이랑 그 기준으로 얘기합니다. AI 캠퍼스에서는 목록 API가 한 번에 10개만 준다는 걸 응답에서 보고, 11번째 클래스부터 화면에 안 나오던 걸 잡았습니다. 사내 협약 관리 플랫폼은 요구사항 해석과 DB 설계, 백엔드, 프론트, 배포 파이프라인을 혼자 맡아 3주 만에 개발서버에 올렸는데, 그렇다고 백엔드가 주력인 건 아니고 화면에 필요한 데이터가 어디서 어떻게 오는지 알고 만드는 쪽에 가깝습니다.',
    '화면이 움직이는 걸 만드는 일을 좋아합니다. JavaScript로 미니게임과 이벤트 연출을 열 개 넘게 만들었고, 이 사이트도 외부 3D 모델 없이 기본 도형만 조합해서 만들었습니다.',
  ],
  // 각 프로젝트 회고의 Keep 항목에서 추림
  howIWork: [
    'O4O에서는 화면보다 공통 컴포넌트를 먼저 만들었습니다. 8월 말에 모바일 디자인이 한꺼번에 나왔을 때 Core 컴포넌트만 고쳐서 넘겼습니다',
    'MOU 플랫폼에 엑셀 605건을 옮기면서 주소로 지역을 자동 분류했습니다. 592건은 시군구까지 자동으로 들어갔고 7건은 광역 단위만 잡혔습니다. 남은 6건은 주소가 두 군데 적혀 있거나 "용신시" 같은 오타여서 비워뒀습니다',
    '권한 전수 검사를 만들었다가 정규식이 틀려서 한 건도 못 찾고 통과한 적이 있습니다. 그 뒤로는 "0건이면 실패"를 같이 넣습니다',
    'AI 캠퍼스를 넘기기 이틀 전에 코드리뷰 14건을 문서로 남겼습니다. 우선순위와 파일 위치, 고치는 방향을 적어서 다음 사람이 바로 집어 들 수 있게 했습니다',
  ],
  likes: ['아이스 아메리카노', '노래듣기', '산책'],
}

export const contactLinks: { label: string; value: string; href: string }[] = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'GitHub', value: 'github.com/esuyom', href: 'https://github.com/esuyom' },
]
