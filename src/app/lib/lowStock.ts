export const LOW_STOCK_THRESHOLD = 3;

interface StockInfo {
  status?: string | null;
  stockQuantity?: number | null;
  mainCategory?: string | null;
}

export function lowStockCount(sku: StockInfo, originalCode?: string | null): number | null {
  if (sku.status !== 'ACTIVE') return null;
  if (originalCode && sku.mainCategory === originalCode) return null;
  const n = sku.stockQuantity;
  if (n == null || n <= 0 || n > LOW_STOCK_THRESHOLD) return null;
  return n;
}
