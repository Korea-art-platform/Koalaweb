export const FREE_SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FEE = 3000;

export const FREE_SHIPPING_THRESHOLD_TEXT = '5만원';
export const FREE_SHIPPING_THRESHOLD_AMOUNT_TEXT = FREE_SHIPPING_THRESHOLD.toLocaleString();
export const SHIPPING_FEE_AMOUNT_TEXT = SHIPPING_FEE.toLocaleString();

export const SHIPPING_SUMMARY_TEXT =
  `${SHIPPING_FEE_AMOUNT_TEXT}원 (${FREE_SHIPPING_THRESHOLD_TEXT} 이상 무료 · 제주/도서산간 추가)`;

export function calcShipping(subtotal: number, itemCount: number): number {
  if (itemCount <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
