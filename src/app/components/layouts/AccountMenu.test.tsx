import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import i18n from '@/locales/i18n';

const authed = { value: false };
const logout = vi.fn(async () => {});

vi.mock('@/app/context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: authed.value }),
}));

vi.mock('@/app/hooks/useLogout', () => ({
  useLogout: () => logout,
}));

import AccountMenu from './AccountMenu';

let container: HTMLDivElement;
let root: Root;

function Probe() {
  const location = useLocation();
  return <span data-testid="path">{location.pathname}</span>;
}

async function render() {
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<><AccountMenu /><Probe /></>} />
        </Routes>
      </MemoryRouter>,
    );
  });
}

const trigger = () => container.querySelector('button[aria-haspopup="menu"]') as HTMLButtonElement;
const menu = () => container.querySelector('[role="menu"]');
const labels = () => [...(menu()?.querySelectorAll('[role="menuitem"]') ?? [])].map((el) => el.textContent?.trim());
const item = (text: string) =>
  [...(menu()?.querySelectorAll('[role="menuitem"]') ?? [])].find((el) => el.textContent?.trim() === text) as HTMLElement | undefined;
const path = () => container.querySelector('[data-testid="path"]')?.textContent;

async function click(el: HTMLElement | null | undefined) {
  expect(el).toBeTruthy();
  await act(async () => { el!.click(); });
}

describe('헤더 계정 메뉴', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('ko');
  });

  beforeEach(() => {
    authed.value = false;
    logout.mockClear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('처음에는 닫혀 있고 눌러야 열린다', async () => {
    await render();
    expect(menu()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');

    await click(trigger());
    expect(menu()).not.toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('로그인하지 않았으면 로그인과 주문 조회만 보인다', async () => {
    await render();
    await click(trigger());

    expect(labels()).toEqual(['로그인', '주문 조회']);
  });

  it('로그인했으면 내 정보·주문 내역·주문 조회·로그아웃이 보인다', async () => {
    authed.value = true;
    await render();
    await click(trigger());

    expect(labels()).toEqual(['내 정보', '주문 내역', '주문 조회', '로그아웃']);
  });

  it('주문 조회를 누르면 그 화면으로 가고 메뉴가 닫힌다', async () => {
    await render();
    await click(trigger());
    await click(item('주문 조회'));

    expect(path()).toBe('/order-lookup');
    expect(menu()).toBeNull();
  });

  it('로그아웃을 누르면 로그아웃이 실행된다', async () => {
    authed.value = true;
    await render();
    await click(trigger());
    await click(item('로그아웃'));

    expect(logout).toHaveBeenCalledOnce();
  });

  it('Esc 로 닫힌다', async () => {
    await render();
    await click(trigger());

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(menu()).toBeNull();
  });

  it('바깥을 누르면 닫힌다', async () => {
    await render();
    await click(trigger());

    await act(async () => {
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    });
    expect(menu()).toBeNull();
  });
});
