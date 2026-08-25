let loading: Promise<typeof import('@sentry/react')> | null = null;
let ready = false;

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

export function sentryEnabled() {
  return Boolean(dsn);
}

/**
 * Sentry 는 gzip 88KB 로 메인 번들의 3할을 차지했다. 첫 화면을 그리는 데는
 * 필요 없으므로 유휴 시간에 따로 받아 온다.
 */
export function loadSentry() {
  if (!dsn) return Promise.resolve(null);
  if (!loading) {
    loading = import('@sentry/react').then((Sentry) => {
      if (!ready) {
        ready = true;
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
      return Sentry;
    });
  }
  return loading;
}

/** 첫 페인트를 방해하지 않도록 유휴 시간에 예약한다. */
export function scheduleSentry() {
  if (!dsn) return;
  const start = () => { void loadSentry(); };
  const ric = (window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  }).requestIdleCallback;
  if (ric) ric(start, { timeout: 4000 });
  else window.setTimeout(start, 2000);
}

/** Sentry 가 아직 안 왔으면 받아 온 뒤 보고한다. */
export function reportError(error: unknown, info?: Record<string, unknown>) {
  if (!dsn) return;
  void loadSentry().then((Sentry) => {
    Sentry?.captureException(error, info ? { extra: info } : undefined);
  });
}
