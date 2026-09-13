import type { SkuOrder } from '@/api/sku';

export const ALL = 'All';

/** 가격대 — 화면 금액(부가세 포함) 기준. 지금 작품이 2만 원대부터 300만 원까지라 네 칸으로 나눈다 */
export const PRICE_BANDS = [
  { key: 'u100k', label: '10만 원 이하', max: 100_000 },
  { key: '100k-500k', label: '10~50만 원', min: 100_001, max: 500_000 },
  { key: '500k-2m', label: '50~200만 원', min: 500_001, max: 2_000_000 },
  { key: '2m', label: '200만 원 이상', min: 2_000_001 },
] as const satisfies readonly { key: string; label: string; min?: number; max?: number }[];

export type PriceBandKey = (typeof PRICE_BANDS)[number]['key'];

export const priceRangeOf = (key: string | null) => {
  const band = PRICE_BANDS.find((b) => b.key === key);
  if (!band) return {};
  return { minPrice: 'min' in band ? band.min : undefined, maxPrice: 'max' in band ? band.max : undefined };
};

export const ORDERS: { key: SkuOrder; label: string }[] = [
  { key: 'RECOMMENDED', label: '추천순' },
  { key: 'NEWEST', label: '새로 들어온 순' },
  { key: 'PRICE_ASC', label: '가격 낮은 순' },
  { key: 'PRICE_DESC', label: '가격 높은 순' },
];

export const isOrder = (v: string | null): v is SkuOrder => ORDERS.some((o) => o.key === v);
