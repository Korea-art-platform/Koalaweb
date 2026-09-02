import instance from './instance';
import type { CreateOrderRequest } from './types';

export const createOrder = (data: CreateOrderRequest) =>
    instance.post('/api/v1/orders', data);

export const getMyOrders = (page = 0, size = 10) =>
    instance.get('/api/v1/orders', { params: { page, size } });

export const getOrder = (orderNo: string) =>
    instance.get(`/api/v1/orders/${orderNo}`);

/** 로그인하지 않고 한 건만 주문한다. */
export const createGuestOrder = (data: CreateOrderRequest) =>
    instance.post('/api/v1/orders/guest', data);

/**
 * 비회원이 자기 주문을 찾는다.
 *
 * 주문번호가 주소창·기록에 남지 않도록 POST 로 보낸다 — 남으면 그것만으로
 * 남의 주문이 열린다.
 */
export const lookupGuestOrder = (orderNo: string, phone: string) =>
    instance.post('/api/v1/orders/guest/lookup', { orderNo, phone });

export const cancelOrder = (orderNo: string) =>
    instance.post(`/api/v1/orders/${orderNo}/cancel`);

export const createReturnRequest = (data: {
    orderNo: string;
    returnType: 'RETURN' | 'EXCHANGE';
    reason: 'SIMPLE_CHANGE' | 'DEFECT' | 'WRONG_DELIVERY' | 'OTHER';
    reasonDetail?: string;
}) => instance.post('/api/v1/returns', data);

export const getMyReturns = () =>
    instance.get('/api/v1/returns');

export const getReturnByOrder = (orderNo: string) =>
    instance.get(`/api/v1/returns/order/${orderNo}`);
