import instance from './instance';
import type { PaymentProvider, PaymentMethodType } from './types';

export const preparePayment = (orderNo: string, provider: PaymentProvider, method: PaymentMethodType) =>
    instance.post('/api/v1/payments/prepare', { orderNo, provider, method });

export const confirmPayment = (paymentKey: string, orderNo: string, amount: number) =>
    instance.post('/api/v1/payments/confirm', { paymentKey, orderNo, amount });
