import { describe, expect, it, vi, beforeEach } from 'vitest';

const get = vi.fn();
vi.mock('./instance', () => ({ default: { get: (...args: unknown[]) => get(...args) } }));

import { getOnSitePayment } from './onsite';

describe('getOnSitePayment', () => {
  beforeEach(() => get.mockReset());

  it('결제 정보를 돌려준다', async () => {
    get.mockResolvedValue({ data: { data: { orderNo: 'KL-1', amount: 100, payable: true, paid: false } } });
    await expect(getOnSitePayment('tok')).resolves.toMatchObject({ orderNo: 'KL-1' });
  });

  it('CloudFront 가 404 를 사이트 화면(HTML)으로 바꿔 돌려주면 찾을 수 없음으로 처리한다', async () => {
    get.mockResolvedValue({ data: '<!DOCTYPE html><html></html>' });
    await expect(getOnSitePayment('missing')).rejects.toThrow();
  });
});
