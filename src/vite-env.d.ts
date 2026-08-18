interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_OAUTH_KAKAO_URL: string;
  readonly VITE_OAUTH_NAVER_URL: string;
  readonly VITE_TOSS_CLIENT_KEY: string;
  readonly VITE_TOSS_WIDGET_CLIENT_KEY?: string;
  readonly VITE_PAYMENT_BASE_URL?: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
  // 배포 워크플로우가 빌드 시점에 주입한다. 로컬에서는 비어 있어 S3 주소를 그대로 쓴다.
  readonly VITE_IMAGE_CDN_BASE?: string;
  // 'NICEPAY' 면 나이스 결제창을 쓴다. 없거나 다른 값이면 토스.
  readonly VITE_PG?: string;
  readonly VITE_NICEPAY_CLIENT_ID?: string;
  readonly VITE_PAYPLE_CLIENT_KEY?: string;
  readonly MODE: string;
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
