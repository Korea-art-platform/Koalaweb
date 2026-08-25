import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { loadNicePay, requestNicePay, type NicePayMethod } from '@/app/lib/nicepay';
import { loadPayple, requestPayple } from '@/app/lib/payple';

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;
const NICE_CLIENT_ID = import.meta.env.VITE_NICEPAY_CLIENT_ID as string | undefined;
const PAYPLE_CLIENT_KEY = import.meta.env.VITE_PAYPLE_CLIENT_KEY as string | undefined;
const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export const ACTIVE_PG = ((import.meta.env.VITE_PG as string | undefined) || 'TOSS') as PgCode;

export const EASYPAY_ENABLED =
  (import.meta.env.VITE_NICE_EASYPAY as string | undefined) === 'true';

export type PgCode = 'TOSS' | 'NICEPAY' | 'PAYPLE';

export const PG_PROVIDER_CODE: PgCode = ACTIVE_PG;

const PG_LABELS: Record<PgCode, string> = {
  TOSS: '토스페이먼츠',
  NICEPAY: '나이스페이먼츠',
  PAYPLE: '페이플',
};

export const PG_DISPLAY_NAME: string = PG_LABELS[ACTIVE_PG] ?? PG_LABELS.TOSS;

export type PayMethod = 'CARD' | 'TRANSFER' | 'MOBILE_PHONE' | 'TOSSPAY' | 'KAKAOPAY' | 'NAVERPAY';

export interface PayMethodOption {
  id: PayMethod;
  label: string;
  desc: string;
}

const METHODS_BY_PG: Record<PgCode, PayMethodOption[]> = {
  TOSS: [
    { id: 'TOSSPAY',      label: '토스페이', desc: '토스 앱 간편 결제' },
    { id: 'TRANSFER',     label: '계좌이체', desc: '실시간 계좌이체' },
  ],
  NICEPAY: [
    { id: 'CARD',         label: '신용카드',   desc: '국내 모든 카드' },
    ...(EASYPAY_ENABLED
      ? ([
          { id: 'KAKAOPAY', label: '카카오페이', desc: '카카오페이 간편결제' },
          { id: 'NAVERPAY', label: '네이버페이', desc: '네이버페이 간편결제' },
        ] as PayMethodOption[])
      : []),
    { id: 'TRANSFER',     label: '계좌이체',   desc: '실시간 계좌이체' },
    { id: 'MOBILE_PHONE', label: '휴대폰',     desc: '휴대폰 소액결제' },
  ],
  PAYPLE: [
    { id: 'CARD',         label: '신용카드', desc: '국내 모든 카드' },
  ],
};

export const PAY_METHODS: PayMethodOption[] = METHODS_BY_PG[ACTIVE_PG] ?? METHODS_BY_PG.TOSS;

const NICE_METHOD: Partial<Record<PayMethod, NicePayMethod>> = {
  CARD: 'card',
  TRANSFER: 'bank',
  MOBILE_PHONE: 'cellphone',
  KAKAOPAY: 'kakaopay',
  NAVERPAY: 'naverpayCard',
};

export const NICE_METHOD_MAP: Readonly<Partial<Record<PayMethod, NicePayMethod>>> = NICE_METHOD;

export interface StartPaymentParams {
  method: PayMethod;
  orderNo: string;
  amount: number;
  orderName: string;
  customerKey?: string;
  customerName?: string;
  customerEmail?: string;

  customerMobilePhone?: string;

  onError: (message: string) => void;
}

export async function startPayment(params: StartPaymentParams): Promise<void> {
  if (ACTIVE_PG === 'NICEPAY') return startNicePay(params);
  if (ACTIVE_PG === 'PAYPLE') return startPayple(params);
  return startToss(params);
}

async function startNicePay(p: StartPaymentParams): Promise<void> {
  if (!NICE_CLIENT_ID) {
    p.onError('결제 설정이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.');
    return;
  }
  await loadNicePay();

  requestNicePay(
    {
      clientId: NICE_CLIENT_ID,
      method: NICE_METHOD[p.method] ?? 'card',
      orderId: p.orderNo,
      amount: p.amount,
      goodsName: p.orderName,
      returnUrl: `${API_BASE}/api/v1/payments/nice/return`,
      buyerName: p.customerName,
      buyerEmail: p.customerEmail,
      buyerTel: p.customerMobilePhone,
    },
    p.onError,
  );
}

async function startPayple(p: StartPaymentParams): Promise<void> {
  if (!PAYPLE_CLIENT_KEY) {
    p.onError('결제 설정이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.');
    return;
  }
  await loadPayple(import.meta.env.MODE === 'production');

  requestPayple(
    {
      clientKey: PAYPLE_CLIENT_KEY,
      orderId: p.orderNo,
      amount: p.amount,
      goodsName: p.orderName,
      returnUrl: `${API_BASE}/api/v1/payments/payple/return`,
      payerName: p.customerName,
      payerEmail: p.customerEmail,
      payerHp: p.customerMobilePhone,
    },
    p.onError,
  );
}

async function startToss(p: StartPaymentParams): Promise<void> {
  const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
  const payment = tossPayments.payment({ customerKey: p.customerKey ?? ANONYMOUS });

  const common = {
    amount: { currency: 'KRW' as const, value: p.amount },
    orderId: p.orderNo,
    orderName: p.orderName,
    successUrl: `${window.location.origin}/payment/success`,
    failUrl: `${window.location.origin}/payment/fail`,
    customerEmail: p.customerEmail,
    customerName: p.customerName,
    customerMobilePhone: p.customerMobilePhone,
  };

  if (p.method === 'TRANSFER') {
    await payment.requestPayment({
      method: 'TRANSFER',
      ...common,
      transfer: { cashReceipt: { type: '소득공제' } },
    });
    return;
  }

  if (p.method === 'MOBILE_PHONE') {
    await payment.requestPayment({ method: 'MOBILE_PHONE', ...common });
    return;
  }

  if (p.method === 'TOSSPAY') {
    await payment.requestPayment({
      method: 'CARD',
      ...common,
      card: { flowMode: 'DIRECT', easyPay: 'TOSSPAY' },
    });
    return;
  }

  await payment.requestPayment({
    method: 'CARD',
    ...common,
    card: { useEscrow: false, flowMode: 'DEFAULT', useCardPoint: false, useAppCardOnly: false },
  });
}

export function isUserCancel(e: unknown): boolean {
  return (e as { code?: string })?.code === 'USER_CANCEL';
}
