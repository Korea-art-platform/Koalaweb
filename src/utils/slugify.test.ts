import { describe, it, expect } from 'vitest';
import { romanizeKorean, slugify, slugifyInput } from './slugify';

describe('romanizeKorean', () => {
  it('받침 없는 음절', () => {
    expect(romanizeKorean('가')).toBe('ga');
    expect(romanizeKorean('나')).toBe('na');
    expect(romanizeKorean('마')).toBe('ma');
  });

  it('받침 있는 음절 — 대표음으로 적는다', () => {
    expect(romanizeKorean('강')).toBe('gang');
    expect(romanizeKorean('말')).toBe('mal');
    expect(romanizeKorean('밥')).toBe('bap');
  });

  it('실제 상품명', () => {
    expect(romanizeKorean('버드')).toBe('beodeu');
    expect(romanizeKorean('호돌이')).toBe('hodoli');
    expect(romanizeKorean('순정남')).toBe('sunjeongnam');
  });

  it('한글이 아닌 문자는 그대로 둔다', () => {
    expect(romanizeKorean('Bird 2')).toBe('Bird 2');
    expect(romanizeKorean('말 A')).toBe('mal A');
  });

  it('빈 문자열', () => {
    expect(romanizeKorean('')).toBe('');
  });
});

describe('slugify', () => {
  it('한글 상품명이 사라지지 않는다 — 예전 버그', () => {
    const slug = slugify('닥스훈트 레드');

    expect(slug).not.toBe('-');
    expect(slug).not.toBe('');
    expect(slug).toContain('dakseuhunteu');
  });

  it('색상만 다른 상품끼리 슬러그가 겹치지 않는다', () => {
    const colors = ['레드', '블루', '그린', '블랙', '화이트'];
    const slugs = colors.map((c) => slugify(`닥스훈트 ${c}`));

    expect(new Set(slugs).size).toBe(colors.length);
  });

  it('소문자·숫자·하이픈만 남는다 — 백엔드 CSV 검증과 같은 규칙', () => {
    const samples = ['버드 #3', 'Bird 2', '말(대형)', '호돌이 · 한정판', 'A/B 테스트'];

    for (const s of samples) {
      expect(slugify(s)).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('공백·특수문자는 지우지 않고 하이픈으로 바꾼다', () => {
    expect(slugify('말 A')).not.toBe(slugify('말B'));
  });

  it('앞뒤·연속 하이픈을 정리한다', () => {
    expect(slugify('  버드  ')).toBe('beodeu');
    expect(slugify('버드 -- 한정판')).not.toContain('--');
    expect(slugify('!!버드!!')).toBe('beodeu');
  });

  it('같은 이름은 항상 같은 슬러그가 된다', () => {
    expect(slugify('닥스훈트 레드')).toBe(slugify('닥스훈트 레드'));
  });

  it('영문 상품명은 그대로 소문자가 된다', () => {
    expect(slugify('Bird')).toBe('bird');
    expect(slugify('Birds 2')).toBe('birds-2');
  });

  it('한글과 영문·숫자가 섞여도 동작한다', () => {
    expect(slugify('버드 Blue 3')).toBe('beodeu-blue-3');
  });

  it('한글이 하나도 없어도 빈 값이 되지 않는다', () => {
    expect(slugify('2026')).toBe('2026');
  });
});

describe('slugifyInput — 타이핑 중', () => {
  it('끝 하이픈을 자르지 않는다 — 자르면 하이픈을 칠 수 없다', () => {
    expect(slugifyInput('bird-')).toBe('bird-');
    expect(slugifyInput('bird-2')).toBe('bird-2');
  });

  it('한 글자씩 이어 쳐도 원하는 값에 도달한다', () => {
    let typed = '';
    for (const ch of 'bird-2') {
      typed = slugifyInput(typed + ch);
    }
    expect(typed).toBe('bird-2');
  });

  it('타이핑 중에도 허용되지 않는 문자는 걸러진다', () => {
    expect(slugifyInput('bird!')).toBe('bird-');
    expect(slugifyInput('BIRD')).toBe('bird');
  });

  it('저장 직전 slugify 가 앞뒤 하이픈을 정리한다', () => {
    expect(slugify(slugifyInput('bird-'))).toBe('bird');
  });
});
