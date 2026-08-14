import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downscaleImage } from './downscaleImage';

describe('downscaleImage', () => {
  const bigJpeg = () =>
    new File([new Uint8Array(2 * 1024 * 1024)], 'photo.jpg', { type: 'image/jpeg' });

  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  describe('건드리지 않는 것', () => {
    beforeEach(() => {
      stubBitmap({ width: 4000, height: 3000 });
      stubCanvas({ outputSize: 100_000 });
    });

    it('동영상은 그대로 둔다 — 여기서 다룰 수 있는 형식이 아니다', async () => {
      const video = new File([new Uint8Array(9_000_000)], 'clip.mp4', { type: 'video/mp4' });
      expect(await downscaleImage(video)).toBe(video);
    });

    it('GIF 는 그대로 둔다 — 재인코딩하면 애니메이션이 첫 프레임만 남는다', async () => {
      const gif = new File([new Uint8Array(2_000_000)], 'anim.gif', { type: 'image/gif' });
      expect(await downscaleImage(gif)).toBe(gif);
    });

    it('작은 이미지는 그대로 둔다 — 재인코딩은 화질 손실만 남는다', async () => {
      const small = new File([new Uint8Array(10_000)], 'thumb.jpg', { type: 'image/jpeg' });
      expect(await downscaleImage(small)).toBe(small);
    });

    it('긴 변이 이미 1600px 이하면 그대로 둔다', async () => {
      stubBitmap({ width: 1200, height: 800 });
      const file = bigJpeg();
      expect(await downscaleImage(file)).toBe(file);
    });
  });

  describe('실패해도 업로드를 막지 않는다', () => {
    it('디코딩에 실패하면 원본을 반환한다', async () => {
      vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('decode failed')));

      const file = bigJpeg();

      await expect(downscaleImage(file)).resolves.toBe(file);
    });

    it('canvas 를 쓸 수 없어도 원본을 반환한다', async () => {
      stubBitmap({ width: 4000, height: 3000 });
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

      const file = bigJpeg();
      await expect(downscaleImage(file)).resolves.toBe(file);
    });
  });

  describe('축소', () => {
    it('긴 변을 1600px 으로 맞추고 비율을 지킨다', async () => {
      stubBitmap({ width: 4000, height: 3000 });
      const captured = stubCanvas({ outputSize: 200_000 });

      const result = await downscaleImage(bigJpeg());

      expect(captured.width).toBe(1600);
      expect(captured.height).toBe(1200);
      expect(result.type).toBe('image/jpeg');
    });

    it('PNG 는 PNG 로 유지한다 — 투명도가 있을 수 있다', async () => {
      stubBitmap({ width: 4000, height: 3000 });
      stubCanvas({ outputSize: 200_000, outputType: 'image/png' });

      const png = new File([new Uint8Array(2_000_000)], 'logo.png', { type: 'image/png' });
      const result = await downscaleImage(png);

      expect(result.type).toBe('image/png');
      expect(result.name).toMatch(/\.png$/);
    });

    it('줄였는데 오히려 커지면 원본을 쓴다', async () => {
      stubBitmap({ width: 4000, height: 3000 });

      stubCanvas({ outputSize: 5 * 1024 * 1024 });

      const file = bigJpeg();
      expect(await downscaleImage(file)).toBe(file);
    });
  });

  function stubBitmap({ width, height }: { width: number; height: number }) {
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({
      width, height, close: vi.fn(),
    }));
  }

  function stubCanvas({ outputSize, outputType = 'image/jpeg' }:
                      { outputSize: number; outputType?: string }) {
    const captured = { width: 0, height: 0 };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      imageSmoothingQuality: '',
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);

    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (
      this: HTMLCanvasElement, cb: BlobCallback
    ) {
      captured.width = this.width;
      captured.height = this.height;
      cb(new Blob([new Uint8Array(outputSize)], { type: outputType }));
    });

    return captured;
  }
});
