import { displayPrice } from '@/app/lib/price';
import type { Sku } from '@/api/types';

type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
  }
}

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  price?: number;
  quantity: number;
}

const CURRENCY = 'KRW';
const PURCHASE_SENT_KEY = 'koala.analytics.purchases';

function push(entry: DataLayerEntry) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(entry);
}

function pushEcommerce(event: string, ecommerce: DataLayerEntry) {
  push({ ecommerce: null });
  push({ event, ecommerce });
}

export function skuToItem(sku: Sku, quantity = 1): AnalyticsItem {
  return {
    item_id: sku.skuCode,
    item_name: sku.name,
    item_brand: sku.artistName,
    item_category: sku.mainCategory,
    item_category2: sku.genre,
    price: displayPrice(sku) ?? undefined,
    quantity,
  };
}

const valueOf = (items: AnalyticsItem[]) =>
  items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);

export function trackPageView(path: string) {
  push({
    event: 'page_view',
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackViewItem(sku: Sku) {
  const item = skuToItem(sku);
  pushEcommerce('view_item', { currency: CURRENCY, value: item.price ?? 0, items: [item] });
}

export function trackAddToCart(sku: Sku, quantity = 1) {
  const item = skuToItem(sku, quantity);
  pushEcommerce('add_to_cart', { currency: CURRENCY, value: valueOf([item]), items: [item] });
}

export function trackBeginCheckout(items: AnalyticsItem[]) {
  if (items.length === 0) return;
  pushEcommerce('begin_checkout', { currency: CURRENCY, value: valueOf(items), items });
}

export function trackPurchase(order: {
  orderNo: string;
  total: number;
  shipping?: number;
  tax?: number;
  items: AnalyticsItem[];
}) {
  if (alreadySent(order.orderNo)) return;
  pushEcommerce('purchase', {
    transaction_id: order.orderNo,
    currency: CURRENCY,
    value: order.total,
    shipping: order.shipping ?? 0,
    tax: order.tax ?? 0,
    items: order.items,
  });
  markSent(order.orderNo);
}

function readSent(): string[] {
  try {
    const raw = localStorage.getItem(PURCHASE_SENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function alreadySent(orderNo: string) {
  return readSent().includes(orderNo);
}

function markSent(orderNo: string) {
  try {
    const next = [...readSent().filter((n) => n !== orderNo), orderNo].slice(-30);
    localStorage.setItem(PURCHASE_SENT_KEY, JSON.stringify(next));
  } catch {
    return;
  }
}
