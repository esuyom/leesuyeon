# suyeon.studio — 3D 작업실 포트폴리오

React + Three.js(React Three Fiber)로 만든 방 탐색형 포트폴리오예요.
방 안의 물건을 클릭하면 카메라가 다가가고 섹션 내용이 열려요.

| 물건 | 섹션 |
| --- | --- |
| 모니터 | 01 Projects (모니터 안 OS 화면) |
| 책장 | 02 Skills |
| 코르크보드 | 03 Experience |
| 턴테이블 | 04 About (LP가 돌아감) |
| 휴대폰 | 05 Contact (휴대폰이 들어 올려짐) |
| 스탠드 | 밤 ↔ 낮 모드 |

## 실행

Node.js 20 이상이 필요해요.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 에 배포용 파일 생성
npm run preview  # 빌드 결과 미리보기
```

## 내용 바꾸기

**`src/data/content.ts` 하나만 고치면 돼요.** `[대괄호]` 부분이 채워야 할 자리예요.

- `profile` — 이름, 한 줄 소개, 이메일
- `projects` — 프로젝트 목록. 스크린샷은 `public/projects/` 에 넣고 `image: '/projects/a.png'`
- `skills`, `experience`, `about`, `contactLinks`

## 배경 음악 (선택)

`public/audio/bgm.mp3` 파일을 넣으면 헤더에 음악 버튼이 생기고, 켜면 턴테이블이 돌아가요.
파일이 없으면 버튼은 자동으로 숨겨져요.

## 구조

```
src/
  data/content.ts        포트폴리오 내용
  store.ts               상태 (현재 섹션, 밤/낮, 사운드 등)
  scene/
    Experience.tsx       Canvas + 조명
    CameraRig.tsx        섹션별 카메라 이동
    views.ts             섹션별 카메라 위치 (여기서 각도 조정)
    Room.tsx             방 조립 + 클릭 영역(Hotspot)
    Shell.tsx            바닥/벽/창문/전구줄/시계/코르크보드
    Desk.tsx             책상, 키보드, 마우스, 아아, 에어팟, 탁상달력, 휴대폰, 스탠드
    Monitor.tsx          모니터 (줌인하면 실제 HTML 화면)
    Bookshelf.tsx, Cabinet.tsx, Chair.tsx
    primitives.tsx       Box / Cyl / Sph / Rod 같은 기본 도형
    textures.ts          캔버스로 그린 텍스처 (바닥, 하늘, 달력 등)
  ui/
    Overlay.tsx          헤더, 섹션 패널, 모바일 시트
    ProjectsOS.tsx       모니터 안 OS 화면
    Panels.tsx           섹션별 내용
    Page2D.tsx           3D 없이 보는 페이지
```

## 접근성 / 대응

- 키보드: 핫스팟 버튼, `ESC`로 방으로 돌아가기
- WebGL이 안 되는 환경이면 자동으로 2D 페이지, 아니어도 "2D로 보기" 가능
- `prefers-reduced-motion` 이면 카메라 이동 애니메이션 없이 바로 전환
- 모바일(768px 미만): 카메라 고정 + 하단 시트로 섹션 선택

## 배포

`npm run build` 후 `dist/` 폴더를 Vercel, Netlify, GitHub Pages 등에 올리면 돼요.
(Vercel이면 저장소 연결만 하면 자동으로 Vite 프로젝트로 인식해요.)
