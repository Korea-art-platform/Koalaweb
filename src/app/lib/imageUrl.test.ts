import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('축소본 주소', () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => vi.unstubAllEnvs());

  async function load(thumbs: string) {
    vi.stubEnv('VITE_IMAGE_THUMBS', thumbs);
    vi.stubEnv('VITE_IMAGE_CDN_BASE', '');
    return import('./imageUrl');
  }

  it('스위치가 꺼져 있으면 원본을 그대로 쓴다 — 축소본이 아직 없는 동안 실패 요청을 만들지 않는다', async () => {
    const { toThumbUrl } = await load('false');
    expect(toThumbUrl('https://cdn.example.com/skus/A/main/abc.jpg'))
      .toBe('https://cdn.example.com/skus/A/main/abc.jpg');
  });

  it('확장자 앞에 _t480 을 붙인다 — 서버(ImageDerivatives)와 같은 규칙이어야 한다', async () => {
    const { toThumbUrl } = await load('true');
    expect(toThumbUrl('https://cdn.example.com/skus/A/main/abc.jpg'))
      .toBe('https://cdn.example.com/skus/A/main/abc_t480.jpg');
  });

  it('이미 축소본이면 두 번 붙이지 않는다', async () => {
    const { toThumbUrl } = await load('true');
    expect(toThumbUrl('https://cdn.example.com/skus/A/main/abc_t480.jpg'))
      .toBe('https://cdn.example.com/skus/A/main/abc_t480.jpg');
  });

  it('이미지가 아닌 주소는 건드리지 않는다 — 영상 배너가 깨지면 안 된다', async () => {
    const { toThumbUrl } = await load('true');
    expect(toThumbUrl('https://cdn.example.com/banners/hero.mp4'))
      .toBe('https://cdn.example.com/banners/hero.mp4');
  });

  it('쿼리스트링을 보존한다', async () => {
    const { toThumbUrl } = await load('true');
    expect(toThumbUrl('https://cdn.example.com/skus/A/main/abc.png?v=2'))
      .toBe('https://cdn.example.com/skus/A/main/abc_t480.png?v=2');
  });

  it('빈 값이면 undefined', async () => {
    const { toThumbUrl } = await load('true');
    expect(toThumbUrl(null)).toBeUndefined();
  });
});
