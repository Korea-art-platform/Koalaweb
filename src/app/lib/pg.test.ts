import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * PG 설정에 따라 결제수단 목록이 실제로 바뀌는지 본다.
 *
 * <p>이 테스트가 없어서 사고가 났다. PG 를 나이스로 바꿨는데 주문서에는 토스페이가 그대로
 * 떴고, 번들에는 나이스 코드가 들어 있어서 "배포됐다"고 판단했다. 목록은 세 PG 것이 모두
 * 번들에 들어가므로 파일을 뒤져 봐야 어느 쪽이 뜨는지 알 수 없다 — 실행해 봐야 한다.
 *
 * <p>모듈을 읽는 순간 설정이 고정되므로, 설정을 바꾼 뒤 매번 새로 불러온다.
 */
describe('PG 전환', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  async function loadWith(pg?: string) {
    if (pg) vi.stubEnv('VITE_PG', pg);
    else vi.stubEnv('VITE_PG', '');
    return import('./pg');
  }

  it('나이스에서는 토스페이가 목록에 없다', async () => {
    const { PAY_METHODS, ACTIVE_PG } = await loadWith('NICEPAY');

    expect(ACTIVE_PG).toBe('NICEPAY');
    expect(PAY_METHODS.map((m) => m.id)).toEqual(['CARD', 'TRANSFER', 'MOBILE_PHONE']);
  });

  it('페이플에서는 카드만 뜬다 — 연동해 둔 수단이 그것뿐이다', async () => {
    const { PAY_METHODS } = await loadWith('PAYPLE');

    expect(PAY_METHODS.map((m) => m.id)).toEqual(['CARD']);
  });

  it('설정이 없으면 토스다 — 설정을 빠뜨려도 결제가 멈추지는 않는다', async () => {
    const { ACTIVE_PG, PAY_METHODS } = await loadWith();

    expect(ACTIVE_PG).toBe('TOSS');
    expect(PAY_METHODS.map((m) => m.id)).toContain('TOSSPAY');
  });

  it('서버에 알리는 PG 이름이 선택한 PG 와 같다', async () => {
    const { PG_PROVIDER_CODE } = await loadWith('NICEPAY');

    // 백엔드 NicePaymentProvider.getProviderCode() 가 돌려주는 값
    expect(PG_PROVIDER_CODE).toBe('NICEPAY');
  });

  it('어느 PG 든 고를 수 있는 수단이 하나는 있다 — 빈 목록이면 결제 버튼을 누를 수 없다', async () => {
    for (const pg of ['TOSS', 'NICEPAY', 'PAYPLE']) {
      vi.resetModules();
      const { PAY_METHODS } = await loadWith(pg);
      expect(PAY_METHODS.length, `${pg} 결제수단`).toBeGreaterThan(0);
    }
  });
});
