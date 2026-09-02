import { describe, it, expect } from 'vitest';
import { displayPrice, displayListPrice, hasDiscount } from './price';

describe('표시 가격', () => {
  it('서버가 준 표시가를 그대로 쓴다', () => {
    expect(displayPrice({ listPrice: 300000, displayPrice: 330000 })).toBe(330000);
    expect(displayListPrice({ listPrice: 300000, displayListPrice: 330000 })).toBe(330000);
  });

  it('표시가가 없으면 과세로 보고 부가세를 붙인다', () => {
    // 싸게 보이면 고객이 본 금액보다 더 청구된다. 그쪽으로는 물러나지 않는다.
    expect(displayPrice({ listPrice: 300000 })).toBe(330000);
    expect(displayPrice({ listPrice: 200000 })).toBe(220000);
  });

  it('면세라고 적혀 있으면 붙이지 않는다', () => {
    expect(displayPrice({ listPrice: 3000000, taxExempt: true })).toBe(3000000);
  });

  it('할인가가 있으면 할인가를 쓴다', () => {
    expect(displayPrice({ listPrice: 300000, salePrice: 200000 })).toBe(220000);
  });

  it('할인 여부는 표시가끼리 견준다', () => {
    expect(hasDiscount({ listPrice: 300000, salePrice: 200000 })).toBe(true);
    expect(hasDiscount({ listPrice: 300000 })).toBe(false);
    expect(hasDiscount({ listPrice: 300000, salePrice: 300000 })).toBe(false);
  });

  it('가격이 없으면 null 이다', () => {
    expect(displayPrice({})).toBeNull();
  });
});
