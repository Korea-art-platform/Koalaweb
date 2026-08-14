declare global {
  interface Window {
    Kakao: any;
  }
}

export function initKakao() {
  const key = import.meta.env.VITE_KAKAO_APP_KEY;
  if (!key || !window.Kakao) return;
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(key);
  }
}
