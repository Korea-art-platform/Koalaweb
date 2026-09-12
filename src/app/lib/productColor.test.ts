import { describe, it, expect } from 'vitest';
import { dominantColor, softenColor, luminance, hexToRgb, rgbToHsl, type Rgb } from './productColor';

// [r, g, b, a, 개수]
const pixels = (...list: [number, number, number, number, number][]) => {
  const out: number[] = [];
  for (const [r, g, b, a, count] of list) {
    for (let i = 0; i < count; i += 1) out.push(r, g, b, a);
  }
  return out;
};

describe('dominantColor', () => {
  it('투명한 배경은 세지 않는다', () => {
    const data = pixels([255, 255, 255, 0, 500], [200, 30, 50, 255, 100]);
    expect(dominantColor(data)).toEqual([200, 30, 50]);
  });

  it('같은 색의 명암은 한 칸으로 묶는다', () => {
    const data = pixels([200, 30, 50, 255, 40], [150, 20, 38, 255, 40], [240, 240, 240, 255, 60]);
    const [r, g] = dominantColor(data)!;
    expect(r).toBeGreaterThan(g + 80);
  });

  it('불투명한 픽셀이 없으면 null', () => {
    expect(dominantColor(pixels([0, 0, 0, 0, 10]))).toBeNull();
  });
});

describe('softenColor', () => {
  const colors: Rgb[] = [[255, 255, 255], [250, 220, 40], [200, 30, 50], [20, 20, 24], [40, 90, 220]];

  it('흰 글씨가 읽히는 밝기로 누른다', () => {
    for (const c of colors) {
      const hex = softenColor(c);
      expect(hex).toMatch(/^#[0-9a-f]{6}$/);
      expect(luminance(hexToRgb(hex))).toBeLessThanOrEqual(0.18);
    }
  });

  it('채도를 낮춘다', () => {
    const [, before] = rgbToHsl(200, 30, 50);
    const [, after] = rgbToHsl(...hexToRgb(softenColor([200, 30, 50])));
    expect(after).toBeLessThan(before);
  });

  it('검정은 순흑이 아니라 짙은 회색이 된다', () => {
    const [r, g, b] = hexToRgb(softenColor([5, 5, 5]));
    expect(Math.min(r, g, b)).toBeGreaterThanOrEqual(40);
  });
});
