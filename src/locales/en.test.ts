import { describe, it, expect } from 'vitest';
import ko from './ko/koala.json';
import en from './en/koala.json';

type Tree = { [key: string]: string | Tree };

function flatten(node: Tree, prefix = '', out: Record<string, string> = {}) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out[path] = value;
    else flatten(value, path, out);
  }
  return out;
}

const koFlat = flatten(ko as Tree);
const enFlat = flatten(en as Tree);

const HANGUL = /[가-힣]/;
const KEEPS_HANGUL = ['header.language.ko'];

describe('영어 번역', () => {
  it('한국어에 있는 키는 영어에도 있다', () => {
    const missing = Object.keys(koFlat).filter((key) => !(key in enFlat));

    expect(missing, '빠진 키는 영어 화면에서 한국어로 나온다').toEqual([]);
  });

  it('영어에만 있는 키는 없다', () => {
    const orphan = Object.keys(enFlat).filter((key) => !(key in koFlat));

    expect(orphan).toEqual([]);
  });

  it('영어 값에 한글이 남아 있지 않다', () => {
    const untranslated = Object.keys(enFlat)
      .filter((key) => !KEEPS_HANGUL.includes(key))
      .filter((key) => HANGUL.test(enFlat[key]));

    expect(untranslated).toEqual([]);
  });

  it('치환 자리({{...}})가 두 언어에서 같다', () => {
    const marks = (text: string) => (text.match(/{{\s*\w+\s*}}/g) ?? []).map((m) => m.replace(/\s/g, '')).sort();
    const mismatched = Object.keys(koFlat)
      .filter((key) => key in enFlat)
      .filter((key) => marks(koFlat[key]).join() !== marks(enFlat[key]).join());

    expect(mismatched, '자리 이름이 다르면 값이 빈칸으로 나온다').toEqual([]);
  });
});
