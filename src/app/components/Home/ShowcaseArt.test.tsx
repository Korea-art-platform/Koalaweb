import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

vi.mock('framer-motion', () => {
  const strip = (props: Record<string, unknown>) => {
    const { initial, animate, exit, transition, variants, custom, ...rest } = props;
    void initial; void animate; void exit; void transition; void variants; void custom;
    return rest;
  };
  const motion = new Proxy({}, {
    get: (_t, tag: string) =>
      React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) =>
        React.createElement(tag, { ...strip(props), ref })),
  });
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => children, useReducedMotion: () => true };
});

import ShowcaseArt from './ShowcaseArt';

let container: HTMLDivElement;
let root: Root;

async function render(props: Record<string, unknown>) {
  await act(async () => {
    root.render(<ShowcaseArt effects={[]} alt="작품" {...props} />);
  });
}

const images = () => [...container.querySelectorAll('img')];
const titleText = () => container.querySelector('.font-display-ko')?.textContent ?? null;

describe('히어로 작품명', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('작품명 이미지가 없으면 이름을 글자로 그린다', async () => {
    await render({ imageUrl: 'https://cdn.test/art.png', name: '버즈 아기갈매기' });

    expect(titleText()).toBe('버즈 아기갈매기');
    expect(images().some((i) => i.getAttribute('src') === 'https://cdn.test/art.png')).toBe(true);
  });

  it('작품명 이미지를 올리면 글자 대신 그 이미지를 깐다', async () => {
    await render({
      imageUrl: 'https://cdn.test/art.png',
      name: '버즈 아기갈매기',
      titleImageUrl: 'https://cdn.test/title.png',
    });

    expect(titleText()).toBeNull();
    expect(images().some((i) => i.getAttribute('src') === 'https://cdn.test/title.png')).toBe(true);
  });

  it('작품명 이미지는 읽어 주지 않는다', async () => {
    await render({ name: '버즈', titleImageUrl: 'https://cdn.test/title.png' });

    const title = images().find((i) => i.getAttribute('src') === 'https://cdn.test/title.png');
    expect(title?.getAttribute('alt')).toBe('');
    expect(title?.getAttribute('aria-hidden')).toBe('true');
  });
});
