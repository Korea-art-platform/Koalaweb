import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from '@/locales/i18n';
import type { PublicPopup } from '@/api/types';

const POPUPS: PublicPopup[] = [
  {
    popupCode: 'P1', title: '가을 신작 드랍', displayType: 'IMAGE',
    imageUrl: 'https://example.com/a.png', body: null,
    showDismiss: true, showLinkButton: true, landingUrl: '/store',
  },
  {
    popupCode: 'P2', title: '연휴 배송 안내', displayType: 'TEMPLATE',
    imageUrl: null, body: '첫 줄\n둘째 줄',
    showDismiss: true, showLinkButton: false, landingUrl: null,
  },
];

const getPopups = vi.fn(async () => POPUPS);

vi.mock('@/api/popup', () => ({
  getPopups: (...args: unknown[]) => getPopups(...(args as [])),
}));

vi.mock('framer-motion', () => {
  const strip = (props: Record<string, unknown>) => {
    const { initial, animate, exit, transition, ...rest } = props;
    void initial; void animate; void exit; void transition;
    return rest;
  };
  const motion = new Proxy({}, {
    get: (_t, tag: string) =>
      React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) =>
        React.createElement(tag, { ...strip(props), ref })),
  });
  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
    useReducedMotion: () => true,
  };
});

import PopupLayer from './PopupLayer';

let container: HTMLDivElement;
let root: Root;

function Probe() {
  const location = useLocation();
  return <span data-testid="path">{location.pathname}</span>;
}

async function flush() {
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  }
}

async function renderAt(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  await act(async () => {
    root.render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="*" element={<><PopupLayer /><Probe /></>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  });
  await flush();
}

const dialog = () => document.querySelector('[role="dialog"]');
const title = () => dialog()?.querySelector('h2')?.textContent ?? null;
const button = (text: string) =>
  [...(dialog()?.querySelectorAll('button') ?? [])].find((b) => b.textContent?.trim() === text) as HTMLButtonElement | undefined;
const path = () => document.querySelector('[data-testid="path"]')?.textContent;

async function click(el: HTMLElement | null | undefined) {
  expect(el).toBeTruthy();
  await act(async () => {
    el!.click();
  });
  await flush();
}

describe('사이트 팝업', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('ko');
  });

  beforeEach(() => {
    localStorage.clear();
    getPopups.mockClear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    document.body.style.overflow = '';
  });

  it('현재 언어와 페이지 종류로 불러온다', async () => {
    await renderAt('/');
    expect(getPopups).toHaveBeenCalledWith('ko', 'home');
  });

  it('닫으면 다음 팝업이 뜨고, 모두 닫으면 사라진다', async () => {
    await renderAt('/about');
    expect(title()).toBe('가을 신작 드랍');
    expect(document.body.style.overflow).toBe('hidden');

    await click(button('닫기'));
    expect(title()).toBe('연휴 배송 안내');
    expect(dialog()?.querySelector('p')?.textContent).toBe('첫 줄\n둘째 줄');
    expect(button('자세히 보기')).toBeUndefined();

    await click(button('닫기'));
    expect(dialog()).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('자세히 보기는 내부 경로로 이동하고 그 팝업을 닫는다', async () => {
    await renderAt('/about');
    await click(button('자세히 보기'));

    expect(path()).toBe('/store');
    expect(title()).toBe('연휴 배송 안내');
  });

  it('오늘 하루 보지 않기는 자정까지 숨기고 다음으로 넘어간다', async () => {
    await renderAt('/about');
    await click(dialog()?.querySelector('input[type="checkbox"]') as HTMLElement);

    const stored = Number(localStorage.getItem('koala.popup.hide.P1'));
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    expect(stored).toBe(midnight.getTime());
    expect(title()).toBe('연휴 배송 안내');
  });

  it('오늘 숨긴 팝업은 다시 그려도 뜨지 않는다', async () => {
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    localStorage.setItem('koala.popup.hide.P1', String(midnight.getTime()));

    await renderAt('/about');
    expect(title()).toBe('연휴 배송 안내');
  });

  it('Esc 로 닫힌다', async () => {
    await renderAt('/about');
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    await flush();
    expect(title()).toBe('연휴 배송 안내');
  });

  it('결제 화면에서는 불러오지도 띄우지도 않는다', async () => {
    await renderAt('/checkout');
    expect(getPopups).not.toHaveBeenCalled();
    expect(dialog()).toBeNull();
  });
});
