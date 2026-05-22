/**
 * 앱인토스(Apps in Toss) 환경 감지 유틸리티
 *
 * 토스 앱 내 미니앱으로 실행 중인지 확인합니다.
 * 일반 브라우저/웹에서는 false, 토스 앱 내부(샌드박스 포함)에서는 true를 반환합니다.
 */

let _cached: boolean | null = null;

export function isAppsInToss(): boolean {
  if (_cached !== null) return _cached;

  try {
    // 앱인토스 SDK 브릿지가 주입되어 있으면 토스 앱 내부로 판단
    // window.__AIT__ 또는 getAppsInTossGlobals 호출 성공 여부로 판단
    const globals = (window as unknown as { __AIT__?: unknown }).__AIT__;
    _cached = globals != null;
  } catch {
    _cached = false;
  }

  return _cached;
}

/** 앱인토스 환경 캐시 초기화 (테스트용) */
export function _resetAppsInTossCache() {
  _cached = null;
}
