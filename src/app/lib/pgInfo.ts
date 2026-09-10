export type PgCode = 'TOSS' | 'NICEPAY' | 'PAYPLE';

export const ACTIVE_PG = ((import.meta.env.VITE_PG as string | undefined) || 'TOSS') as PgCode;

export const PG_PROVIDER_CODE: PgCode = ACTIVE_PG;

export const EASYPAY_ENABLED =
  (import.meta.env.VITE_NICE_EASYPAY as string | undefined) === 'true';

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

export const PAY_METHOD_SENTENCE: string = PAY_METHODS.map((m) => m.label).join(', ');
