import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, calcShipping } from './shipping';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|json)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const SRC = join(process.cwd(), 'src');
const SHIPPING_MODULE = join('lib', 'shipping.ts');

function toWon(text: string): number {
  const man = text.match(/^(\d+)만$/);
  if (man) return Number(man[1]) * 10000;
  return Number(text.replace(/,/g, ''));
}

describe('배송비', () => {
  it('무료 기준 바로 아래는 배송비가 붙는다', () => {
    expect(calcShipping(FREE_SHIPPING_THRESHOLD - 1, 1)).toBe(SHIPPING_FEE);
  });

  it('무료 기준과 같으면 무료다', () => {
    expect(calcShipping(FREE_SHIPPING_THRESHOLD, 1)).toBe(0);
  });

  it('담긴 상품이 없으면 배송비도 없다', () => {
    expect(calcShipping(0, 0)).toBe(0);
    expect(calcShipping(FREE_SHIPPING_THRESHOLD - 1, 0)).toBe(0);
  });

  it('화면에 적힌 무료 기준이 실제 계산과 같다', () => {
    const pattern = /([\d,]+원|\d+만원)\s*이상[^.。]{0,12}무료|무료[^.。]{0,12}?([\d,]+원|\d+만원)\s*이상/g;

    const mismatched = sourceFiles(SRC)
      .filter((path) => !path.endsWith(SHIPPING_MODULE))
      .flatMap((path) => {
        const text = readFileSync(path, 'utf8');
        return [...text.matchAll(pattern)]
          .map((m) => (m[1] ?? m[2]).replace(/원$/, ''))
          .filter((amount) => toWon(amount) !== FREE_SHIPPING_THRESHOLD)
          .map((amount) => `${amount}원  (${path.replace(SRC, 'src')})`);
      });

    expect(mismatched, '표기와 실제가 다르면 손님이 계산한 금액과 청구액이 어긋난다')
      .toEqual([]);
  });
});
