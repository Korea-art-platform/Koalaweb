import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./sku', () => ({ getSkus: vi.fn() }));

import { getSkus } from './sku';
import { fetchAllSkus } from './fetchAllSkus';

/**
 * 홈·검색은 전체 목록이 필요하다.
 *
 * 예전에는 100개만 받아 왔다. 상품이 100개를 넘는 순간 앞 100개만 보이는데
 * **오류도 경고도 나지 않아** 빠졌다는 사실을 알 수 없었다.
 * 상품이 50개에서 100개로 늘어나는 건 금방이라, 이 경계를 테스트로 잡아 둔다.
 */
describe('fetchAllSkus', () => {
  const mocked = vi.mocked(getSkus);

  /** page 번호에 맞춰 SKU-<page>-<i> 를 돌려주는 가짜 서버 */
  function server({ total, size = 100 }: { total: number; size?: number }) {
    const totalPages = Math.max(1, Math.ceil(total / size));
    mocked.mockImplementation((page = 0, s = size) => {
      const start = page * s;
      const content = Array.from(
        { length: Math.max(0, Math.min(s, total - start)) },
        (_, i) => ({ skuCode: `SKU-${start + i}` })
      );
      return Promise.resolve({ data: { data: { content, totalPages } } }) as never;
    });
    return totalPages;
  }

  beforeEach(() => mocked.mockReset());

  it('한 페이지에 다 들어가면 한 번만 부른다', async () => {
    server({ total: 50 });

    const skus = await fetchAllSkus();

    expect(skus).toHaveLength(50);
    expect(mocked).toHaveBeenCalledTimes(1);
  });

  it('100개를 넘으면 나머지 페이지까지 모두 받는다 — 예전에는 여기서 잘렸다', async () => {
    server({ total: 250 });

    const skus = await fetchAllSkus();

    expect(skus).toHaveLength(250);
    expect(skus[0]).toMatchObject({ skuCode: 'SKU-0' });
    expect(skus[249]).toMatchObject({ skuCode: 'SKU-249' });
  });

  it('정확히 100개면 추가 요청을 하지 않는다', async () => {
    server({ total: 100 });

    const skus = await fetchAllSkus();

    expect(skus).toHaveLength(100);
    expect(mocked).toHaveBeenCalledTimes(1);
  });

  it('상품이 없으면 빈 배열', async () => {
    server({ total: 0 });
    await expect(fetchAllSkus()).resolves.toEqual([]);
  });

  it('totalPages 가 터무니없이 크면 상한에서 멈춘다 — 무한히 부르지 않는다', async () => {
    mocked.mockImplementation((page = 0) =>
      Promise.resolve({
        data: { data: { content: [{ skuCode: `SKU-${page}` }], totalPages: 99999 } },
      }) as never
    );

    await fetchAllSkus();

    // 첫 페이지 + 나머지 9페이지 = 10회 (MAX_PAGES)
    expect(mocked).toHaveBeenCalledTimes(10);
  });
});
