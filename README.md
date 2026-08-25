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
| 모니터링 | Sentry(첫 페인트 뒤 지연 로딩), Google Tag Manager |
| 결제 | PG 추상화 (`src/app/lib/pg.ts`) — 나이스페이먼츠(운영) · 토스 · 페이플, `VITE_PG` 로 전환 |

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
| `VITE_PG` | 결제창 PG 선택 — `NICEPAY` / `PAYPLE` / `TOSS` (없으면 토스) |
| `VITE_NICEPAY_CLIENT_ID` / `VITE_PAYPLE_CLIENT_KEY` / `VITE_TOSS_CLIENT_KEY` | 각 PG 클라이언트 키(브라우저 노출 공개값). 쓰는 PG 것만 |
| `VITE_NICE_EASYPAY` | `true` 면 결제수단에 카카오페이·네이버페이가 뜹니다. 기본 `false` |
| `VITE_IMAGE_THUMBS` | `true` 면 목록·카드가 축소본을 씁니다. 기본 `false` |
| `VITE_KAKAO_APP_KEY` | 카카오 공유 SDK JavaScript 키 |
| `VITE_GTM_ID` | Google Tag Manager ID |
| `VITE_SENTRY_DSN` | Sentry DSN |
| `VITE_IMAGE_CDN_BASE` | 상품 이미지 CDN 도메인 (아래 참조) |

> **PG 전환은 서버·프론트 양쪽을 같이 바꿔야 합니다.** 서버는 `.env` 의 `*_ENABLED`,
> 프론트는 `VITE_PG`. 결제 관련 판단은 `src/app/lib/pg.ts` 한 곳에 모여 있어
> 결제 화면과 주문서가 갈리지 않습니다.

운영 빌드용 값은 `.github/workflows/deploy.yml` 의 Build 스텝에 정의되어 있습니다.
키 성격의 값은 GitHub Secrets 로, 켜고 끄는 스위치는 GitHub **Variables** 로 주입합니다.
(Secrets 에 넣으면 워크플로가 `vars.` 로 읽으므로 값이 들어가지 않습니다.)

### 켜는 순서가 있는 스위치

두 스위치는 **바깥 조건이 갖춰진 뒤에** 켜야 합니다. 먼저 켜면 오히려 나빠집니다.

| 스위치 | 먼저 해야 할 일 | 어겼을 때 |
|---|---|---|
| `VITE_NICE_EASYPAY` | 나이스 계약에서 간편결제 승인 | 고객이 카카오페이를 눌렀다가 결제 실패 |
| `VITE_IMAGE_THUMBS` | 어드민 → 시스템 → 유지보수에서 축소본 일괄 생성 | 이미지마다 404 를 한 번 거치고 원본을 받아 더 느려짐 |

## 알아둘 것

### 이미지 CDN 치환

DB 에는 상품 이미지가 S3 절대 주소로 저장되어 있습니다. 이걸 마이그레이션으로 일괄 변경하면
CDN 을 걷어낼 때 되돌리기 어려워서, **저장값은 그대로 두고 렌더 시점에 호스트만 바꿉니다.**

- 구현: `src/app/lib/imageUrl.ts`
- 적용: 공용 컴포넌트 `ImageWithFallback` 이 자동으로 사용
- `VITE_IMAGE_CDN_BASE` 가 비어 있으면 아무 동작도 하지 않으므로, CDN 없이도 안전하게 동작합니다

`ImageWithFallback` 은 `loading="lazy"` / `decoding="async"` 를 기본값으로 씁니다.
히어로처럼 첫 화면에 즉시 보여야 하는 이미지는 `loading="eager"` 로 덮어쓰세요.

### 축소본 (`_t480`)

상품 이미지 원본은 2000px 인데 목록·카드에서는 88~240px 로 그려집니다. 그대로 쓰면
홈 한 번에 8MB 가 넘어가므로, 업로드 시 원본 옆에 긴 변 480px 짜리 축소본을 함께 만듭니다.

- 규칙: `main/abc.jpg` → `main/abc_t480.jpg`
- 프론트: `src/app/lib/imageUrl.ts` 의 `toThumbUrl`
- 서버: `infra/storage/ImageDerivatives.java`

**양쪽이 같은 규칙이라 한쪽만 바꾸면 축소본을 못 찾습니다.**

작게 그려지는 자리에서만 씁니다.

- `ImageWithFallback` 에 `thumb` 프롭
- `<img>` 를 직접 쓰는 곳은 `useThumbSrc` 훅 (ProductCard, 히어로 레일)

축소본이 없으면 원본으로, 원본도 실패하면 에러 아이콘으로 물러납니다.

### 모바일에서 안 보이는 영역은 렌더하지 않기

`hidden lg:flex` 처럼 CSS 로만 숨기면 DOM 에 남아 **그 안의 이미지를 전부 내려받습니다.**
히어로의 FEATURED 레일이 그래서 모바일에서도 상품 이미지를 받고 한 장도 쓰지 않았습니다.

무거운 PC 전용 영역은 `useIsDesktop()`(`src/app/hooks/useMediaQuery.ts`)으로
렌더 자체를 막으세요.

### Sentry 는 지연 로딩합니다

Sentry 는 gzip 88KB 로 메인 번들의 3할을 차지했습니다. 첫 화면에는 필요 없으므로
유휴 시간에 따로 받아옵니다(`src/observability/sentry.ts`).

`Sentry.ErrorBoundary` 대신 자체 `RootErrorBoundary` 를 씁니다 — 화면이 깨지면 그대로
잡고, 보고는 Sentry 가 도착한 뒤에 올립니다. **Sentry 를 최상단에서 정적 import 하면
이 구조가 깨지므로 하지 마세요.**

### 어드민 화면

`/admin` 이하가 어드민이며 별도 인증 컨텍스트(`AdminAuthContext`)와 axios 인스턴스
(`src/api/adminInstance.ts`)를 씁니다. 고객용 인스턴스와 토큰이 섞이지 않도록 분리되어 있습니다.

대시보드 최상단의 **"확인 필요 결제"** 블록은 PG 응답을 받지 못해 승인·취소가 확정되지 않은
결제를 보여줍니다. 해당 건이 없으면 렌더되지 않습니다.

**시스템 → 유지보수** 는 일회성 보정 작업 화면입니다. 지금은 이미지 축소본·캐시 헤더
일괄 생성이 들어 있습니다. 한 번에 40개씩 나눠 처리하고, 이미 처리된 파일은 건너뛰므로
중단했다가 다시 실행해도 안전합니다.

### 배너 미디어

배너는 이미지 또는 영상 중 하나를 **미디어 유형 라디오**로 고릅니다. 영상은 자동 재생되며
브라우저 규칙상 항상 무음입니다. 영상일 때 썸네일 이미지는 선택 항목이고, 영상이 뜨기 전과
자동재생이 막혔을 때만 쓰입니다.

히어로는 **영상이 끝나면 다음 배너로 넘어갑니다.** 이미지는 5초 고정입니다.
자동재생이 막히거나 로딩이 실패하면 5초 타이머로 갈아타고, 그래도 신호가 없으면 30초
상한으로 넘어갑니다 — 캐러셀이 멈춰 서지 않도록 두 겹으로 막아 두었습니다.

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
├── observability/ Sentry 지연 로딩과 최상위 에러 경계
├── data/         정적 데이터 (FAQ 등)
├── locales/      i18next 번역 리소스
└── styles/       Tailwind 테마 토큰
```
