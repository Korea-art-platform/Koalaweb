# KoALa Web

아트토이·작품 커머스 플랫폼 KoALa 의 웹 프론트엔드입니다.
고객 화면과 어드민 화면을 한 애플리케이션에서 함께 제공합니다.

- 운영: https://koala-art.co.kr
- 백엔드 저장소: `KoALa-back`
- 모바일(Capacitor) 저장소: `KoALa-mobile`

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 프레임워크 | React 18.3 + Vite 6.3 |
| 라우팅 | react-router 7 |
| 스타일 | Tailwind CSS 4 (`src/styles/theme.css` 의 `@theme` 토큰) |
| 상태/데이터 | TanStack Query 5, axios |
| 애니메이션 | framer-motion 12 |
| 다국어 | i18next |
| 모니터링 | Sentry, Google Tag Manager |
| 결제 | Toss Payments 결제위젯 |

## 로컬 실행

```bash
npm i
npm run dev
```

개발 서버는 5173 포트로 뜨고, `/api` 요청은 `vite.config.ts` 의 프록시를 통해
로컬 백엔드(`http://localhost:8080`)로 전달됩니다.

> **프록시 주소를 운영 도메인으로 바꿨다면 커밋 전에 반드시 되돌리세요.**
> 로컬 백엔드 없이 화면만 확인하려고 임시로 바꾸는 경우가 있는데, 그대로 커밋되면
> 개발 환경 전체가 운영 API 를 치게 됩니다.

빌드는 아래와 같습니다.

```bash
npm run build
```

## 환경변수

Vite 환경변수는 **빌드 시점에 번들에 박힙니다.** 값을 바꾸면 반드시 다시 빌드해야 합니다.

| 키 | 설명 |
|---|---|
| `VITE_API_BASE_URL` | 백엔드 API 주소 |
| `VITE_OAUTH_KAKAO_URL` / `VITE_OAUTH_NAVER_URL` | 소셜 로그인 시작 URL |
| `VITE_TOSS_CLIENT_KEY` / `VITE_TOSS_WIDGET_CLIENT_KEY` | Toss 클라이언트 키 |
| `VITE_KAKAO_APP_KEY` | 카카오 공유 SDK JavaScript 키 |
| `VITE_GTM_ID` | Google Tag Manager ID |
| `VITE_SENTRY_DSN` | Sentry DSN |
| `VITE_IMAGE_CDN_BASE` | 상품 이미지 CDN 도메인 (아래 참조) |

운영 빌드용 값은 `.github/workflows/deploy.yml` 의 Build 스텝에 정의되어 있습니다.
키 성격의 값은 GitHub Secrets 로 주입합니다.

## 알아둘 것

### 이미지 CDN 치환

DB 에는 상품 이미지가 S3 절대 주소로 저장되어 있습니다. 이걸 마이그레이션으로 일괄 변경하면
CDN 을 걷어낼 때 되돌리기 어려워서, **저장값은 그대로 두고 렌더 시점에 호스트만 바꿉니다.**

- 구현: `src/app/lib/imageUrl.ts`
- 적용: 공용 컴포넌트 `ImageWithFallback` 이 자동으로 사용
- `VITE_IMAGE_CDN_BASE` 가 비어 있으면 아무 동작도 하지 않으므로, CDN 없이도 안전하게 동작합니다

`ImageWithFallback` 은 `loading="lazy"` / `decoding="async"` 를 기본값으로 씁니다.
히어로처럼 첫 화면에 즉시 보여야 하는 이미지는 `loading="eager"` 로 덮어쓰세요.

### 어드민 화면

`/admin` 이하가 어드민이며 별도 인증 컨텍스트(`AdminAuthContext`)와 axios 인스턴스
(`src/api/adminInstance.ts`)를 씁니다. 고객용 인스턴스와 토큰이 섞이지 않도록 분리되어 있습니다.

대시보드 최상단의 **"확인 필요 결제"** 블록은 PG 응답을 받지 못해 승인·취소가 확정되지 않은
결제를 보여줍니다. 해당 건이 없으면 렌더되지 않습니다.

### 결제 승인 응답 처리

결제 승인 API 는 성공이 아니면 **항상 2xx 가 아닌 상태로 응답합니다.**
axios 는 2xx 를 성공으로 처리하므로, 미확정 상태를 2xx 로 주면 승인되지도 않은 결제가
완료 화면으로 넘어갑니다. 결제 관련 응답 코드를 다룰 때 주의하세요.

## 배포

`main` 브랜치 푸시 시 GitHub Actions(`.github/workflows/deploy.yml`)가 자동 실행됩니다.

```
npm run build → S3 동기화 → CloudFront 캐시 무효화
```

## 프로젝트 구조

```
src/
├── api/          백엔드 API 클라이언트 (고객용 instance / 어드민용 adminInstance)
├── app/
│   ├── components/   화면 단위 컴포넌트
│   ├── context/      전역 컨텍스트 (인증, 어드민 인증 등)
│   ├── hooks/        공용 훅
│   ├── lib/          순수 유틸 (이미지 URL 치환 등)
│   ├── pages/        라우트 페이지 (Admin 하위가 어드민)
│   └── routes.tsx    라우팅 정의
├── data/         정적 데이터 (FAQ 등)
├── locales/      i18next 번역 리소스
└── styles/       Tailwind 테마 토큰
```
