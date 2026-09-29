import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import i18n from '@/locales/i18n';
import type { Banner } from '@/api/types';

vi.mock('framer-motion', () => {
  const strip = (props: Record<string, unknown>) => {
    const { initial, animate, exit, transition, variants, custom, whileInView, viewport, ...rest } = props;
    void initial; void animate; void exit; void transition; void variants; void custom; void whileInView; void viewport;
    return rest;
  };
  const motion = new Proxy({}, {
    get: (_t, tag: string) =>
      React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) =>
        React.createElement(tag, { ...strip(props), ref })),
  });
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => children, useReducedMotion: () => true };
});

vi.mock('@/app/hooks/useMediaQuery', () => ({ useIsDesktop: () => true }));
vi.mock('@/app/components/layouts/RisingPanel', () => ({ useCoveredByPanel: () => false }));

import HomeHero from './HomeHero';

const base: Banner = {
  id: 1,
  bannerCode: 'B1',
  bannerType: 'MAIN',
  title: '가을 신작',
  imageUrl: 'https://cdn.test/full.png',
  skuCode: 'SKU1',
  skuName: '청자 오브제',
  artistCode: 'A1',
  displayPrice: 220000,
} as unknown as Banner;

let container: HTMLDivElement;
let root: Root;

async function render(banner: Banner) {
  await act(async () => {
    root.render(
      <MemoryRouter>
        <HomeHero banners={[banner]} />
      </MemoryRouter>,
    );
  });
}

const images = () => [...container.querySelectorAll('img')].map((i) => i.getAttribute('src'));
const bigName = () => container.querySelector('.font-display-ko')?.textContent ?? null;

describe('메인 히어로', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('ko');
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('조립 방식이면 작품 이름을 뒤에 크게 그린다', async () => {
    await render({ ...base, layoutMode: 'COMPOSED' });

    expect(bigName()).toBe('청자 오브제');
    expect(images()).toContain('https://cdn.test/full.png');
  });

  it('전체 이미지 방식이면 배너 한 장만 걸고 글자는 덧그리지 않는다', async () => {
    await render({ ...base, layoutMode: 'FULL' });

    expect(bigName()).toBeNull();
    expect(images()).toEqual(['https://cdn.test/full.png']);
  });

  it('전체 이미지 방식에서도 가격과 쇼핑 버튼은 남는다', async () => {
    await render({ ...base, layoutMode: 'FULL' });

    expect(container.textContent).toContain('₩220,000');
    const links = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(links).toContain('/store');
    expect(links).toContain('/artist/A1');
  });
});
