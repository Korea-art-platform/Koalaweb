interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_OAUTH_KAKAO_URL: string;
  readonly VITE_OAUTH_NAVER_URL: string;
  readonly VITE_TOSS_CLIENT_KEY: string;
  readonly VITE_TOSS_WIDGET_CLIENT_KEY?: string;
  readonly VITE_PAYMENT_BASE_URL?: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css';
declare module '*.scss';
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.png' {
  const content: string;
  export default content;
}
declare module '*.jpg' {
  const content: string;
  export default content;
}
