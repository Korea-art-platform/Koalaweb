import { describe, it, expect } from 'vitest';
import {
  hidePopupForToday,
  isPopupHiddenToday,
  nextLocalMidnight,
  popupHideKey,
  resolveLandingUrl,
  type StorageLike,
} from './popup';

function memoryStorage(): StorageLike & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => { data.set(k, v); },
    removeItem: (k) => { data.delete(k); },
  };
}

const throwing: StorageLike = {
  getItem: () => { throw new Error('blocked'); },
  setItem: () => { throw new Error('blocked'); },
  removeItem: () => { throw new Error('blocked'); },
};

describe('오늘 하루 보지 않기', () => {
  const afternoon = new Date(2026, 8, 17, 15, 30).getTime();
  const midnight = new Date(2026, 8, 18, 0, 0, 0, 0).getTime();

  it('만료 시각은 다음 날 자정(현지 시각)이다', () => {
    expect(nextLocalMidnight(afternoon)).toBe(midnight);
    expect(nextLocalMidnight(new Date(2026, 8, 17, 0, 0).getTime())).toBe(midnight);
    expect(nextLocalMidnight(new Date(2026, 11, 31, 23, 59).getTime()))
      .toBe(new Date(2027, 0, 1).getTime());
  });

  it('숨긴 팝업은 자정 전까지 숨겨진다', () => {
    const s = memoryStorage();
    hidePopupForToday('P1', afternoon, s);
    expect(s.data.get(popupHideKey('P1'))).toBe(String(midnight));
    expect(isPopupHiddenToday('P1', afternoon, s)).toBe(true);
    expect(isPopupHiddenToday('P1', midnight - 1, s)).toBe(true);
    expect(isPopupHiddenToday('P2', afternoon, s)).toBe(false);
  });

  it('자정이 지나면 다시 보이고 지난 기록은 지운다', () => {
    const s = memoryStorage();
    hidePopupForToday('P1', afternoon, s);
    expect(isPopupHiddenToday('P1', midnight, s)).toBe(false);
    expect(s.data.has(popupHideKey('P1'))).toBe(false);
  });

  it('숫자가 아닌 값은 무시한다', () => {
    const s = memoryStorage();
    s.setItem(popupHideKey('P1'), 'abc');
    expect(isPopupHiddenToday('P1', afternoon, s)).toBe(false);
  });

  it('저장소가 막혀 있어도 오류 없이 보여 준다', () => {
    expect(() => hidePopupForToday('P1', afternoon, throwing)).not.toThrow();
    expect(isPopupHiddenToday('P1', afternoon, throwing)).toBe(false);
    expect(isPopupHiddenToday('P1', afternoon, null)).toBe(false);
    expect(() => hidePopupForToday('P1', afternoon, null)).not.toThrow();
  });
});

describe('팝업 이동 주소', () => {
  it('사이트 내부 경로는 내부 이동이다', () => {
    expect(resolveLandingUrl('/store')).toEqual({ kind: 'internal', path: '/store' });
    expect(resolveLandingUrl(' /notice/N1?x=1 ')).toEqual({ kind: 'internal', path: '/notice/N1?x=1' });
  });

  it('https 주소는 바깥 이동이다', () => {
    expect(resolveLandingUrl('https://example.com/a')).toEqual({ kind: 'external', url: 'https://example.com/a' });
  });

  it('javascript: 주소는 막는다', () => {
    expect(resolveLandingUrl('javascript:alert(1)')).toBeNull();
  });

  it('// 로 시작하는 주소는 막는다', () => {
    expect(resolveLandingUrl('//evil.com')).toBeNull();
    expect(resolveLandingUrl('/\\evil.com')).toBeNull();
  });

  it('빈 값과 상대 경로는 무시한다', () => {
    expect(resolveLandingUrl(null)).toBeNull();
    expect(resolveLandingUrl('   ')).toBeNull();
    expect(resolveLandingUrl('store')).toBeNull();
  });
});
