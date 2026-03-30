import instance from './instance';

// 결제 준비 — 주문번호로 결제 레코드 생성
export const preparePayment = (orderNo, provider, method) =>
    instance.post('/api/v1/payments/prepare', { orderNo, provider, method });

// 결제 승인 — Toss 리다이렉트 후 최종 승인
export const confirmPayment = (paymentKey, orderNo, amount) =>
    instance.post('/api/v1/payments/confirm', { paymentKey, orderNo, amount });
