import instance from './instance';
import type { OnSitePayment, OnSitePaymentInput } from './adminApi';

export interface OnSitePublic {
  orderNo: string;
  itemName: string | null;
  artistName: string | null;
  amount: number;
  payable: boolean;
  paid: boolean;
}

export const ONSITE_TOKEN_KEY = 'onSitePayToken';

export async function getOnSitePayment(payToken: string) {
  const res = await instance.get<{ data: OnSitePublic }>(
    `/api/v1/onsite-payments/${encodeURIComponent(payToken)}`,
  );
  const data = res.data?.data;
  if (!data || typeof data !== 'object' || !data.orderNo) {
    throw new Error('onsite payment not found');
  }
  return data;
}

export function onSitePayUrl(payToken: string) {
  return `${window.location.origin}/pay/${payToken}`;
}

export const ONSITE_SESSION_KEY = 'koala.onsiteSession';
const SESSION_HEADER = 'X-Onsite-Session';

export interface OnSiteSession {
  sessionToken: string;
  expiresAt: string;
}

export async function getOnSiteStatus() {
  const res = await instance.get<{ data: { enabled: boolean } }>('/api/v1/onsite/status');
  const data = res.data?.data;
  return Boolean(data && typeof data === 'object' && data.enabled);
}

export async function openOnSiteSession(pin: string) {
  const res = await instance.post<{ data: OnSiteSession }>(
    '/api/v1/onsite/session',
    { pin },
    { skipAuthRefresh: true },
  );
  return res.data.data;
}

export async function createOnSiteDeskPayment(session: string, body: OnSitePaymentInput) {
  const res = await instance.post<{ data: OnSitePayment }>('/api/v1/onsite/payments', body, {
    headers: { [SESSION_HEADER]: session },
    skipAuthRefresh: true,
  });
  return res.data.data;
}

export async function getOnSiteDeskPayments(session: string) {
  const res = await instance.get<{ data: OnSitePayment[] }>('/api/v1/onsite/payments', {
    headers: { [SESSION_HEADER]: session },
    skipAuthRefresh: true,
  });
  const data = res.data?.data;
  return Array.isArray(data) ? data : [];
}
