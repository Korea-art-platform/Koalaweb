import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';

const state = { enabled: true, pinOk: true };
const openOnSiteSession = vi.fn(async (pin: string) => {
  if (!state.pinOk) {
    throw Object.assign(new Error('bad pin'), {
      response: { status: 401, data: { error: { code: 'OS002', message: 'PIN 이 맞지 않습니다.' } } },
    });
  }
  return { sessionToken: `tok-${pin}`, expiresAt: new Date(Date.now() + 3_600_000).toISOString() };
});

vi.mock('@/api/onsite', () => ({
  ONSITE_SESSION_KEY: 'koala.onsiteSession',
  getOnSiteStatus: vi.fn(async () => state.enabled),
  openOnSiteSession: (pin: string) => openOnSiteSession(pin),
  createOnSiteDeskPayment: vi.fn(),
  getOnSiteDeskPayments: vi.fn(async () => []),
}));

vi.mock('@/app/components/onsite/OnSitePaymentDesk', () => ({
  default: () => <div data-testid="desk">desk</div>,
}));

import OnSiteDesk from './OnSiteDesk';

let container: HTMLDivElement;
let root: Root;

async function render() {
  await act(async () => {
    root.render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/onsite']}>
          <OnSiteDesk />
        </MemoryRouter>
      </HelmetProvider>,
    );
  });
  await act(async () => { await Promise.resolve(); });
}

const text = () => container.textContent ?? '';
const desk = () => container.querySelector('[data-testid="desk"]');
const pinInput = () => container.querySelector('input[aria-label="PIN"]') as HTMLInputElement | null;

async function typePin(value: string) {
  const input = pinInput()!;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
  await act(async () => {
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

async function submit() {
  await act(async () => {
    container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await act(async () => { await Promise.resolve(); });
}

describe('현장결제 페이지 (관리자 계정 없이)', () => {
  beforeEach(() => {
    state.enabled = true;
    state.pinOk = true;
    openOnSiteSession.mockClear();
    localStorage.clear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('꺼져 있으면 꺼져 있다고만 알리고 PIN 칸을 두지 않는다', async () => {
    state.enabled = false;
    await render();

    expect(text()).toContain('현장결제가 꺼져 있습니다');
    expect(pinInput()).toBeNull();
    expect(desk()).toBeNull();
  });

  it('PIN 이 맞으면 결제 화면을 열고 입장권을 기억한다', async () => {
    await render();
    expect(desk()).toBeNull();

    await typePin('482915');
    await submit();

    expect(openOnSiteSession).toHaveBeenCalledWith('482915');
    expect(desk()).not.toBeNull();
    expect(localStorage.getItem('koala.onsiteSession')).toContain('tok-482915');
  });

  it('PIN 이 틀리면 결제 화면을 열지 않는다', async () => {
    state.pinOk = false;
    await render();

    await typePin('000000');
    await submit();

    expect(desk()).toBeNull();
    expect(text()).toContain('PIN 이 맞지 않습니다');
  });

  it('저장된 입장권이 살아 있으면 PIN 없이 바로 연다', async () => {
    localStorage.setItem('koala.onsiteSession', JSON.stringify({
      sessionToken: 'tok-saved',
      expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
    }));
    await render();

    expect(desk()).not.toBeNull();
    expect(openOnSiteSession).not.toHaveBeenCalled();
  });
});
