import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { loadNicePay, requestNicePay, type NicePayMethod } from '@/app/lib/nicepay';
import { loadPayple, requestPayple } from '@/app/lib/payple';

/**
 * 결제창을 띄우는 곳. **여기 하나뿐이어야 한다.**
 *
 * <p>전에는 주문서 화면과 결제 화면이 각자 결제 코드를 들고 있었다. PG 를 나이스로 바꿀 때
 * 한쪽만 고쳐서, 손님이 실제로 지나가는 주문서에는 토스 결제창이 그대로 떴다. 화면을 열어
 * 보기 전까지 아무도 몰랐다.
 *
 * <p>그래서 어느 PG 를 쓰는지, 결제수단으로 무엇을 보여줄지, 결제창을 어떻게 띄우는지를
 * 전부 이 파일로 모았다. 화면은 무엇을 고를지만 정하고, 어떻게 결제되는지는 몰라도 된다.
 */

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;
const NICE_CLIENT_ID = import.meta.env.VITE_NICEPAY_CLIENT_ID as string | undefined;
const PAYPLE_CLIENT_KEY = import.meta.env.VITE_PAYPLE_CLIENT_KEY as string | undefined;
const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

/**
 * 빌드 시점에 정해진다. 값이 없으면 토스다 — 설정을 빠뜨려도 결제가 멈추지는 않는다.
 *
 * <p>{@code ??} 가 아니라 {@code ||} 인 이유: 설정하지 않은 환경변수는 undefined 가 아니라
 * <b>빈 문자열</b>로 들어온다. {@code ??} 로 두면 빈 문자열이 그대로 통과해 서버에 PG 이름 없이
 * 결제를 요청하게 되고, 서버는 "지원하지 않는 PG" 로 거절한다.
 */
export const ACTIVE_PG = ((import.meta.env.VITE_PG as string | undefined) || 'TOSS') as PgCode;

export type PgCode = 'TOSS' | 'NICEPAY' | 'PAYPLE';

/** 서버에 어느 PG 로 결제할지 알리는 값. 백엔드 PaymentProvider.getProviderCode() 와 같아야 한다. */
export const PG_PROVIDER_CODE: PgCode = ACTIVE_PG;

/** 화면에서 고를 수 있는 결제수단 */
export type PayMethod = 'CARD' | 'TRANSFER' | 'MOBILE_PHONE' | 'TOSSPAY';

export interface PayMethodOption {
  id: PayMethod;
  label: string;
  desc: string;
}

/**
 * PG 마다 취급하는 결제수단이 다르다.
 *
 * <p>토스페이는 토스에만 있는 간편결제라 나이스·페이플에서는 뜨지 않는다. 목록에 남겨 두면
 * 손님이 고를 수 있는데 결제창은 그 수단을 모르는 상태가 된다.
 * 페이플 결제창은 카드만 연동해 두었다.
 */
const METHODS_BY_PG: Record<PgCode, PayMethodOption[]> = {
  TOSS: [
    { id: 'TOSSPAY',      label: '토스페이', desc: '토스 앱 간편 결제' },
    { id: 'TRANSFER',     label: '계좌이체', desc: '실시간 계좌이체' },
  ],
  NICEPAY: [
    { id: 'CARD',         label: '신용카드', desc: '국내 모든 카드' },
    { id: 'TRANSFER',     label: '계좌이체', desc: '실시간 계좌이체' },
    { id: 'MOBILE_PHONE', label: '휴대폰',   desc: '휴대폰 소액결제' },
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
};

export interface StartPaymentParams {
  method: PayMethod;
  orderNo: string;
  amount: number;
  orderName: string;
  customerKey?: string;
  customerName?: string;
  customerEmail?: string;
  /** 숫자만 (01012345678). 토스 계좌이체 현금영수증에도 쓰인다 */
  customerMobilePhone?: string;
  /** 결제창을 띄우지 못했을 때. 사용자가 직접 취소한 경우는 부르지 않는다 */
  onError: (message: string) => void;
}

/**
 * 결제창을 띄운다.
 *
 * <p><b>토스만 결과가 이 함수로 돌아온다.</b> 나이스와 페이플은 인증이 끝나면 우리 서버로
 * 직접 POST 하고, 서버가 승인을 마친 뒤 브라우저를 결과 화면으로 보낸다. 그래서 이 함수가
 * 정상적으로 끝났다고 결제가 된 것은 아니다 — 성공 처리를 여기서 하면 안 된다.
 */
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
      // 결제창이 우리 서버로 직접 POST 하는 주소다. 브라우저 주소가 아니라 API 주소여야 한다
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
      // 예전 코드는 { cashReceiptType, customerIdentityNumber } 를 넘겼는데 지금 SDK 가 받는
      // 모양이 아니다. 타입 검사는 통과하지 못했지만 빌드는 타입을 보지 않아 그대로 나가 있었다
      transfer: { cashReceipt: { type: '소득공제' } },
    });
    return;
  }

  if (p.method === 'MOBILE_PHONE') {
    await payment.requestPayment({ method: 'MOBILE_PHONE', ...common });
    return;
  }

  // TOSSPAY 는 토스 앱으로 바로 넘긴다(DIRECT). CARD 는 카드 선택 화면부터 보여준다.
  // 두 옵션을 삼항으로 합치면 SDK 가 받는 타입에 맞지 않아 호출을 나눈다
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

/** 사용자가 결제창을 직접 닫은 경우. 오류로 알릴 일이 아니다 */
export function isUserCancel(e: unknown): boolean {
  return (e as { code?: string })?.code === 'USER_CANCEL';
}
