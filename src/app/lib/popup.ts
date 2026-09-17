import { safeHttpUrl } from './safeUrl';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const POPUP_HIDE_PREFIX = 'koala.popup.hide.';

export function popupHideKey(popupCode: string): string {
  return `${POPUP_HIDE_PREFIX}${popupCode}`;
}

export function nextLocalMidnight(now: number): number {
  const d = new Date(now);
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

export function defaultStorage(): StorageLike | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function isPopupHiddenToday(
  popupCode: string,
  now: number = Date.now(),
  storage: StorageLike | null = defaultStorage(),
): boolean {
  if (!storage) return false;
  try {
    const key = popupHideKey(popupCode);
    const raw = storage.getItem(key);
    if (!raw) return false;
    const expiry = Number(raw);
    if (Number.isFinite(expiry) && expiry > now) return true;
    storage.removeItem(key);
    return false;
  } catch {
    return false;
  }
}

export function hidePopupForToday(
  popupCode: string,
  now: number = Date.now(),
  storage: StorageLike | null = defaultStorage(),
): void {
  if (!storage) return;
  try {
    storage.setItem(popupHideKey(popupCode), String(nextLocalMidnight(now)));
  } catch {
    return;
  }
}

export type LandingTarget =
  | { kind: 'internal'; path: string }
  | { kind: 'external'; url: string };

export function isInternalPath(value: string): boolean {
  return value.startsWith('/') && value[1] !== '/' && value[1] !== '\\' && !/[\s\\]/.test(value);
}

export function resolveLandingUrl(value?: string | null): LandingTarget | null {
  const raw = value?.trim();
  if (!raw) return null;
  if (isInternalPath(raw)) return { kind: 'internal', path: raw };
  const url = safeHttpUrl(raw);
  return url ? { kind: 'external', url } : null;
}
