import { describe, it, expect } from 'vitest';
import { safeHttpUrl } from './safeUrl';

describe('바깥 링크 주소', () => {
  it('http 주소는 그대로 돌려준다', () => {
    expect(safeHttpUrl('http://example.com/store')).toBe('http://example.com/store');
  });

  it('https 주소는 그대로 돌려준다', () => {
    expect(safeHttpUrl('https://instagram.com/koala?hl=ko')).toBe('https://instagram.com/koala?hl=ko');
  });

  it('앞뒤 공백은 털어 낸다', () => {
    expect(safeHttpUrl('  https://naver.me/abc  ')).toBe('https://naver.me/abc');
  });

  it('javascript: 는 막는다', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull();
    expect(safeHttpUrl('JavaScript:alert(1)')).toBeNull();
    expect(safeHttpUrl('  javascript:alert(1)')).toBeNull();
  });

  it('data: 는 막는다', () => {
    expect(safeHttpUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
  });

  it('빈 값은 막는다', () => {
    expect(safeHttpUrl('')).toBeNull();
    expect(safeHttpUrl('   ')).toBeNull();
    expect(safeHttpUrl(null)).toBeNull();
    expect(safeHttpUrl(undefined)).toBeNull();
  });

  it('상대 경로는 막는다', () => {
    expect(safeHttpUrl('/stores/koala')).toBeNull();
    expect(safeHttpUrl('stores/koala')).toBeNull();
  });
});
