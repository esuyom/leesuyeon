# 이수연 포트폴리오

Brittany Chiang 사이트에서 디자인 영감을 받은 React 포트폴리오.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기
```

## 수정 위치

- `src/data/content.js` — 이름, 소개, 경력, 프로젝트 등 모든 텍스트
- `src/index.css` — 색상/테마 (`:root` = 다크, `[data-theme='light']` = 라이트)

## TODO

- `content.js`의 GitHub 주소(`profile.socials`) 본인 것으로 교체
- 소개 문구(`about`) 보완

## 배포

GitHub에 푸시 후 Vercel에서 import → 자동 빌드.
```

## 기능

- 라이트/다크 모드 토글 (브라우저 설정 자동 감지 + localStorage 저장)
- 스크롤에 따른 네비게이션 활성화
- 마우스 추적 스포트라이트
- 반응형 (모바일/데스크톱)
