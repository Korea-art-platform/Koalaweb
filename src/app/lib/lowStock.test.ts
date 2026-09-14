import { describe, it, expect } from 'vitest';
import { lowStockCount, LOW_STOCK_THRESHOLD } from './lowStock';

const ORIGINAL = 'MAIN_3';

const sku = (stockQuantity: number | null, over: { status?: string; mainCategory?: string } = {}) => ({
  status: 'ACTIVE',
  mainCategory: 'MAIN_2',
  stockQuantity,
  ...over,
});

describe('품절 임박', () => {
  it('기준 이하로 남으면 남은 개수를 돌려준다', () => {
    expect(lowStockCount(sku(LOW_STOCK_THRESHOLD), ORIGINAL)).toBe(LOW_STOCK_THRESHOLD);
    expect(lowStockCount(sku(1), ORIGINAL)).toBe(1);
  });

  it('기준보다 하나라도 많으면 띄우지 않는다', () => {
    expect(lowStockCount(sku(LOW_STOCK_THRESHOLD + 1), ORIGINAL)).toBeNull();
  });

  it('다 팔렸으면 품절 표시에 맡긴다', () => {
    expect(lowStockCount(sku(0), ORIGINAL)).toBeNull();
  });

  it('원작은 한 점뿐이라 띄우지 않는다', () => {
    expect(lowStockCount(sku(1, { mainCategory: ORIGINAL }), ORIGINAL)).toBeNull();
  });

  it('판매 중이 아니면 띄우지 않는다', () => {
    expect(lowStockCount(sku(1, { status: 'OUT_OF_STOCK' }), ORIGINAL)).toBeNull();
    expect(lowStockCount(sku(1, { status: 'DISCONTINUED' }), ORIGINAL)).toBeNull();
  });

  it('재고 값이 없으면 띄우지 않는다', () => {
    expect(lowStockCount(sku(null), ORIGINAL)).toBeNull();
  });
});
