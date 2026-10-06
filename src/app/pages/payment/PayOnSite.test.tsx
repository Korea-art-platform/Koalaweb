import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router';
import i18n from '@/locales/i18n';
import type { OnSitePublic } from '@/api/onsite';

const info = { value: null as OnSitePublic | null, fail: false };
const startPayment = vi.fn<(params: unknown) => Promise<void>>(async () => {});

vi.mock('@/api/onsite', () => ({
  ONSITE_TOKEN_KEY: 'onSitePayToken',
  getOnSitePayment: vi.fn(async () => {
    if (info.fail || !info.value) throw new Error('not found');
    return info.value;
  }),
}));

vi.mock('@/app/lib/pg', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/app/lib/pg')>()),
  startPayment: (params: unknown) => startPayment(params),
}));

vi.mock('@/app/components/common/PageMeta', () => ({ default: () => null }));

const preparePayment = vi.fn(async (orderNo: string) => ({ data: { data: { orderNo, amount: 1100000 } } }));
vi.mock('@/api/payment', () => ({
  preparePayment: (orderNo: string) => preparePayment(orderNo),
}));

import PayOnSite from './PayOnSite';

let container: HTMLDivElement;
let root: Root;

const base: OnSitePublic = {
  orderNo: 'KL-20261002120000-ABCD',
  itemName: '버즈 원작',
  artistName: '박준상',
  amount: 1100000,
  payable: true,
  paid: false,
};

async function render(path = '/pay/tok123') {
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/pay/:token" element={<PayOnSite />} />
        </Routes>
      </MemoryRouter>,
    );
  });
  await act(async () => { await Promise.resolve(); });
}

const text = () => container.textContent ?? '';
const payButton = () =>
  [...container.querySelectorAll('button')].find((b) => b.textContent?.includes('1,100,000')) as HTMLButtonElement | undefined;

describe('현장결제 결제 페이지', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('ko');
  });

  beforeEach(() => {
    info.value = { ...base };
    info.fail = false;
    startPayment.mockClear();
    preparePayment.mockClear();
    sessionStorage.clear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('품목·작가·금액을 보여 주고, 결제하면 토큰을 남긴 채 기존 결제를 시작한다', async () => {
    await render();

    expect(text()).toContain('버즈 원작');
    expect(text()).toContain('박준상');

    await act(async () => { payButton()!.click(); });

    expect(preparePayment).toHaveBeenCalledWith(base.orderNo);
    expect(preparePayment.mock.invocationCallOrder[0]).toBeLessThan(startPayment.mock.invocationCallOrder[0]);
    expect(startPayment).toHaveBeenCalledTimes(1);
    expect(startPayment.mock.calls[0][0]).toMatchObject({
      orderNo: base.orderNo,
      amount: base.amount,
      orderName: '버즈 원작',
    });
    expect(sessionStorage.getItem('onSitePayToken')).toBe('tok123');
  });

  it('이미 결제된 링크는 결제 완료를 보여 주고 결제 버튼을 두지 않는다', async () => {
    info.value = { ...base, paid: true, payable: false };
    await render();

    expect(text()).toContain(i18n.t('onsite.paidTitle'));
    expect(payButton()).toBeUndefined();
  });

  it('만료·취소된 링크는 결제할 수 없다고 알린다', async () => {
    info.value = { ...base, payable: false };
    await render();

    expect(text()).toContain(i18n.t('onsite.closedTitle'));
    expect(payButton()).toBeUndefined();
  });

  it('결제창에서 실패하고 돌아오면 사유를 보여 주고 다시 결제할 수 있게 둔다', async () => {
    await render(`/pay/tok123?failed=${encodeURIComponent('결제 결과를 받지 못했습니다.')}`);

    expect(container.querySelector('[role="alert"]')?.textContent).toContain('결제 결과를 받지 못했습니다.');
    expect(payButton()).toBeDefined();
  });

  it('없는 링크는 찾을 수 없다고 알린다', async () => {
    info.fail = true;
    await render();

    expect(text()).toContain(i18n.t('onsite.missingTitle'));
  });
});
