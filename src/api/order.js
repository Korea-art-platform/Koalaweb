import instance from './instance';

// 주문 생성
export const createOrder = (data) =>
    instance.post('/api/v1/orders', data);

// 내 주문 목록
export const getMyOrders = (page = 0, size = 10) =>
    instance.get('/api/v1/orders', { params: { page, size } });

// 주문 상세
export const getOrder = (orderNo) =>
    instance.get(`/api/v1/orders/${orderNo}`);

// 주문 취소
export const cancelOrder = (orderNo) =>
    instance.post(`/api/v1/orders/${orderNo}/cancel`);