import { describe, it, expect } from 'vitest';
import type { Category } from '@/api/category';

/**
 * 카테고리 코드 → 표시명 매핑.
 *
 * 상품에는 코드(`SCULPTURE`)만 저장되고 이름(`조각`)은 카테고리 목록에만 있다.
 * 이 매핑이 어긋나면 상품 카드·필터·홈 섹션에 코드가 그대로 노출된다.
 *
 * 매핑 규칙만 떼어내 검증한다. useCategories 는 react-query 로 목록을 받아
 * 이 규칙을 적용할 뿐이라, 네트워크까지 끌어들이면 정작 규칙을 보기 어려워진다.
 */
function labelOf(list: Category[], code?: string): string {
  if (!code) return '';
  return list.find((c) => c.code === code)?.name ?? code;
}

const cat = (code: string, name: string): Category => ({
  id: 1, type: 'SUB', code, name, sortOrder: 1, isActive: true,
});

describe('카테고리 코드 → 이름', () => {
  const list = [cat('SCULPTURE', '조각'), cat('ART_TOY', '아트 토이')];

  it('등록된 코드는 이름으로 바꾼다', () => {
    expect(labelOf(list, 'SCULPTURE')).toBe('조각');
    expect(labelOf(list, 'ART_TOY')).toBe('아트 토이');
  });

  it('모르는 코드는 코드를 그대로 보여준다 — 빈칸보다는 낫다', () => {
    // 관리자가 숨긴 카테고리를 쓰던 옛 상품이 여기에 해당한다.
    // 이름을 못 찾았다고 빈칸을 두면 분류가 없는 상품처럼 보인다.
    expect(labelOf(list, 'CERAMIC')).toBe('CERAMIC');
  });

  it('코드가 없으면 빈 문자열', () => {
    expect(labelOf(list, undefined)).toBe('');
    expect(labelOf(list, '')).toBe('');
  });

  it('목록이 아직 안 왔어도 코드를 보여준다 — 로딩 중에 화면이 비지 않게', () => {
    expect(labelOf([], 'SCULPTURE')).toBe('SCULPTURE');
  });
});
