import instance from './instance';

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
  return res.data.data;
}

export function onSitePayUrl(payToken: string) {
  return `${window.location.origin}/pay/${payToken}`;
}
