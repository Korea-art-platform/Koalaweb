import instance from './instance';
import type { CreateOrderRequest } from './types';

// 주문 생성
export const createOrder = (data: CreateOrderRequest) =>
    instance.post('/api/v1/orders', data);

// 내 주문 목록
export const getMyOrders = (page = 0, size = 10) =>
    instance.get('/api/v1/orders', { params: { page, size } });

// 주문 상세
export const getOrder = (orderNo: string) =>
    instance.get(`/api/v1/orders/${orderNo}`);

// 주문 취소
export const cancelOrder = (orderNo: string) =>
    instance.post(`/api/v1/orders/${orderNo}/cancel`);

// 반품/교환 신청
export const createReturnRequest = (data: {
    orderNo: string;
    returnType: 'RETURN' | 'EXCHANGE';
    reason: 'SIMPLE_CHANGE' | 'DEFECT' | 'WRONG_DELIVERY' | 'OTHER';
    reasonDetail?: string;
}) => instance.post('/api/v1/returns', data);

// 내 반품 목록
export const getMyReturns = () =>
    instance.get('/api/v1/returns');

// 특정 주문의 반품 상태
export const getReturnByOrder = (orderNo: string) =>
    instance.get(`/api/v1/returns/order/${orderNo}`);
