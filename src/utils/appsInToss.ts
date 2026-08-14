let _cached: boolean | null = null;

export function isAppsInToss(): boolean {
  if (_cached !== null) return _cached;

  try {
    const globals = (window as unknown as { __AIT__?: unknown }).__AIT__;
    _cached = globals != null;
  } catch {
    _cached = false;
  }

  return _cached;
}

export function _resetAppsInTossCache() {
  _cached = null;
}
