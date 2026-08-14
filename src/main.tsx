import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./app/App.tsx";
import ServerError from "./app/pages/ServerError.tsx";
import "./styles/index.css";
import {initKakao} from './utils/kakao';

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],

    beforeSend(event) {
      if (event.request?.url) {
        event.request.url = event.request.url.replace(/paymentKey=[^&]+/, 'paymentKey=***');
      }
      return event;
    },
  });
}

initKakao();

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary
    fallback={({ resetError }) => <ServerError onReset={resetError} />}
  >
    <App />
  </Sentry.ErrorBoundary>
);
