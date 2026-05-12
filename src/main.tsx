import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./app/App.tsx";
import ServerError from "./app/pages/ServerError.tsx";
import "./styles/index.css";
import {initKakao} from './utils/kakao';
// ─────────────────────────────────────────────────────────────
// Sentry 초기화
// DSN이 없으면(로컬 개발) 초기화 건너뛰기 → 콘솔로 디버깅
// ─────────────────────────────────────────────────────────────
const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,           // 'production' | 'development'
    tracesSampleRate: 0.1,                       // APM 트랜잭션 10%만 샘플링 (비용 절감)
    replaysSessionSampleRate: 0,                 // 세션 리플레이는 끔 (필요 시 0.1로)
    replaysOnErrorSampleRate: 1.0,               // 에러 발생 시 100% 리플레이 기록
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],
    // 민감 정보 마스킹
    beforeSend(event) {
      // 결제 콜백 URL의 paymentKey 등 민감 쿼리 제거
      if (event.request?.url) {
        event.request.url = event.request.url.replace(/paymentKey=[^&]+/, 'paymentKey=***');
      }
      return event;
    },
  });
}

initKakao();

// ErrorBoundary로 앱 감싸기 — 렌더링 에러도 자동 캡처
createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary
    fallback={({ resetError }) => <ServerError onReset={resetError} />}
  >
    <App />
  </Sentry.ErrorBoundary>
);