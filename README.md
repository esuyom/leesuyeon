# suyeon.studio

React Three Fiber로 만든 방 탐색형 포트폴리오입니다.
방 안의 물건을 클릭하면 카메라가 그 앞으로 이동하고 해당 섹션이 열립니다.

## 물건 ↔ 섹션

| 물건 | 섹션 |
| --- | --- |
| 모니터 | Projects — 화면 안에서 직접 탐색 |
| 책장 | Skills |
| 코르크보드 | Experience |
| 턴테이블 | About — 음악을 켜면 LP가 돌아감 |
| 휴대폰 | Contact — 선택하면 들어 올려짐 |
| 스탠드 | 밤 ↔ 낮 전환 |

## 구현 메모

**외부 3D 모델을 쓰지 않습니다.** 책상, 의자, 책장, 턴테이블까지 전부 Box·Cylinder·Sphere
조합으로 만들었습니다. 두 점을 이으면 각도를 알아서 맞춰주는 `Rod` 같은 헬퍼를 만들어
조립했습니다.

**텍스처도 이미지 파일이 아닙니다.** 바닥 마루결, 창밖 하늘, 코르크 질감, 탁상 달력(오늘
날짜에 동그라미)까지 canvas 2D로 런타임에 그립니다. 책 배치 같은 무작위 요소는 시드 고정
난수를 써서 새로고침해도 같은 모양이 나옵니다.

**모니터에 다가가면 3D 텍스처가 실제 HTML로 교체됩니다.** 멀리서 보이는 화면은 canvas로
그린 그림이고, 카메라가 도착하면 `drei`의 `Html transform`으로 진짜 DOM을 그 자리에 띄웁니다.
그 안에서 프로젝트를 분류별로 넘겨보고 상세까지 들어갈 수 있습니다.

**섹션 패널이 화면을 가릴 때 카메라를 옮기지 않습니다.** 대신 투영 행렬의 뷰 오프셋만
밀어서, 앞쪽 가구에 피사체가 가려지는 것을 피했습니다.

**WebGL을 못 쓰는 환경에서는 같은 데이터로 2D 페이지를 렌더링합니다.** 3D와 2D가 하나의
데이터 소스를 공유하기 때문에 내용이 어긋나지 않습니다.

## 스택

React 19 · TypeScript · Three.js / React Three Fiber · Zustand · Vite

## 실행

Node.js 20 이상이 필요합니다.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## 구조

```
src/
  data/content.ts        포트폴리오 내용 (3D·2D가 공유)
  store.ts               상태 (현재 섹션, 밤/낮, 사운드)
  scene/
    Experience.tsx       Canvas + 조명
    CameraRig.tsx        섹션별 카메라 이동, 뷰 오프셋
    views.ts             섹션별 카메라 위치·화각
    Room.tsx             방 조립 + 클릭 영역(Hotspot)
    Shell.tsx            바닥·벽·창문·전구줄·시계·코르크보드
    Desk.tsx             책상과 책상 위 소품, 휴대폰, 스탠드
    Monitor.tsx          모니터 (줌인 시 HTML 화면으로 교체)
    Bookshelf.tsx, Cabinet.tsx, Chair.tsx
    primitives.tsx       Box / Cyl / Sph / Rod 기본 도형
    textures.ts          canvas로 그리는 텍스처
  ui/
    Overlay.tsx          헤더, 섹션 패널, 모바일 시트
    ProjectsOS.tsx       모니터 안 화면
    Panels.tsx           섹션별 본문 (3D·2D 공용)
    Page2D.tsx           3D 없이 보는 페이지
```

## 접근성 · 대응

- 핫스팟은 버튼이라 키보드로 접근할 수 있고, `ESC`로 방 전체 보기로 돌아갑니다
- `prefers-reduced-motion`이면 카메라 전환 애니메이션 없이 즉시 이동합니다
- 768px 미만에서는 카메라를 고정하고 하단 시트로 섹션을 고릅니다
