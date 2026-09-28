import { describe, it, expect } from 'vitest';
import { sizeText, weightText } from './skuSpec';

describe('작품 크기 표기', () => {
  it('가로 · 세로 · 높이 순으로 잇는다', () => {
    expect(sizeText(6.5, 7.5, 20)).toBe('6.5 × 7.5 × 20cm');
  });

  it('빠진 값은 건너뛴다', () => {
    expect(sizeText(8, null, 12.5)).toBe('8 × 12.5cm');
    expect(sizeText(null, null, 20)).toBe('20cm');
  });

  it('소수점 뒤 0 은 떼고 보여준다', () => {
    expect(sizeText(8.0, 8.0, 12.5)).toBe('8 × 8 × 12.5cm');
  });

  it('값이 없거나 0 이면 표기하지 않는다', () => {
    expect(sizeText(null, undefined, '')).toBeNull();
    expect(sizeText(0, 0, 0)).toBeNull();
  });
});

describe('작품 무게 표기', () => {
  it('그램으로 저장된 값을 쓴다', () => {
    expect(weightText(200, null)).toBe('200g');
    expect(weightText(220, undefined)).toBe('220g');
  });

  it('1kg 이상이면 kg 로 바꾼다', () => {
    expect(weightText(1000, null)).toBe('1kg');
    expect(weightText(1250, null)).toBe('1.25kg');
  });

  it('그램이 없으면 예전에 저장된 kg 값을 쓴다', () => {
    expect(weightText(null, 1.5)).toBe('1.5kg');
  });

  it('둘 다 없으면 표기하지 않는다', () => {
    expect(weightText(null, null)).toBeNull();
    expect(weightText(0, 0)).toBeNull();
  });
});
