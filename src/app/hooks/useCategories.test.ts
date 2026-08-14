import { describe, it, expect } from 'vitest';
import type { Category } from '@/api/category';

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
