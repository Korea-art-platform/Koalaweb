import { describe, it, expect } from 'vitest';
import { romanize } from './romanize';

describe('한글 로마자 변환', () => {
  it('받침 없는 글자', () => {
    expect(romanize('아기')).toBe('agi');
    expect(romanize('가나다')).toBe('ganada');
  });

  it('받침이 있는 글자', () => {
    expect(romanize('검정')).toBe('geomjeong');
    expect(romanize('흰색')).toBe('huinsaek');
  });

  it('겹받침', () => {
    expect(romanize('닭')).toBe('dak');
    expect(romanize('삶')).toBe('sam');
  });

  it('띄어쓰기는 살린다 — 여러 칸은 하나로', () => {
    expect(romanize('아기 갈매기')).toBe('agi galmaegi');
    expect(romanize('아기   갈매기')).toBe('agi galmaegi');
  });

  it('영문과 숫자는 소문자로 그대로 둔다', () => {
    expect(romanize('Bird 2')).toBe('bird 2');
    expect(romanize('닥쿤이 V2')).toBe('dakkuni v2');
  });

  it('주소에 못 쓰는 기호는 버린다', () => {
    expect(romanize('순정남(男)')).toBe('sunjeongnam');
    expect(romanize('별★')).toBe('byeol');
  });

  it('받침 뒤에 모음이 오면 연음된다', () => {
    expect(romanize('호돌이')).toBe('hodori');
    expect(romanize('꽃이')).toBe('kkochi');
    expect(romanize('닭이')).toBe('dalgi');
    expect(romanize('국어')).toBe('gugeo');
  });

  it('연음 대상이 아니면 받침 그대로', () => {
    expect(romanize('갈매기')).toBe('galmaegi');
    expect(romanize('순정남')).toBe('sunjeongnam');
  });

  it('빈 값은 빈 문자열', () => {
    expect(romanize('')).toBe('');
  });

  it('앞뒤 공백은 다듬는다', () => {
    expect(romanize('  검정  ')).toBe('geomjeong');
  });
});
