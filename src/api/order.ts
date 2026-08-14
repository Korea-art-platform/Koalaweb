import instance from './instance';
import type { CreateOrderRequest } from './types';

export const createOrder = (data: CreateOrderRequest) =>
    instance.post('/api/v1/orders', data);

export const getMyOrders = (page = 0, size = 10) =>
    instance.get('/api/v1/orders', { params: { page, size } });

export const getOrder = (orderNo: string) =>
    instance.get(`/api/v1/orders/${orderNo}`);

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
