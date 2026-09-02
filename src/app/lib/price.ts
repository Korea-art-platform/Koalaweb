/**
 * 고객에게 보여 줄 금액을 고르는 곳.
 *
 * listPrice·salePrice 는 부가세를 뺀 공급가액이다. 어드민이 고치는 값이라
 * 그대로 두고, 서버가 부가세를 더한 displayPrice 를 함께 내려준다.
 * 화면에는 반드시 이 값을 쓴다 — 표시가와 결제가가 다르면 안 된다.
 */

interface Priced {
  listPrice?: number | null;
  salePrice?: number | null;
  displayPrice?: number | null;
  displayListPrice?: number | null;
  taxExempt?: boolean | null;
}

const VAT_RATE = 0.1;

/**
 * 서버가 표시가를 안 준 경우에 쓸 값.
 *
 * 배포 직후 예전 응답이 캐시에 남아 있을 수 있다. 그때 공급가액을 그대로
 * 보여 주면 결제 금액보다 싸게 보인다 — 고객이 본 것보다 더 청구되는 쪽이라
 * 제일 나쁘다. 면세라고 적혀 있지 않으면 과세로 보고 붙여 둔다.
 */
function fallback(base: number | null | undefined, taxExempt?: boolean | null) {
  if (base == null) return null;
  return taxExempt ? base : Math.round(base * (1 + VAT_RATE));
}

/** 실제로 팔리는 가격 (할인 중이면 할인가) */
export function displayPrice(sku: Priced): number | null {
  if (sku.displayPrice != null) return sku.displayPrice;
  return fallback(sku.salePrice ?? sku.listPrice, sku.taxExempt);
}

/** 정가. 할인 표시의 취소선에 쓴다. */
export function displayListPrice(sku: Priced): number | null {
  if (sku.displayListPrice != null) return sku.displayListPrice;
  return fallback(sku.listPrice, sku.taxExempt);
}

/** 할인 중인가 — 취소선을 보여 줄지 판단한다 */
export function hasDiscount(sku: Priced): boolean {
  const now = displayPrice(sku);
  const was = displayListPrice(sku);
  return now != null && was != null && now < was;
}

/** ₩ 없이 숫자만. 앞뒤 표기는 쓰는 쪽에서 붙인다. */
export function formatWon(value: number | null | undefined): string {
  return (value ?? 0).toLocaleString();
}
