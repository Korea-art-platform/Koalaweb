import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downscaleImage } from './downscaleImage';

/**
 * 업로드 전 이미지 축소.
 *
 * 이 함수는 관리자가 상품 사진을 올릴 때마다 실행된다. 잘못 동작하면
 * 원본이 깨진 채로 저장되고, 그 사실은 상세 페이지를 열어봐야 안다.
 *
 * jsdom 에는 canvas 구현이 없어 실제 픽셀 처리는 검증할 수 없다.
 * 대신 "무엇을 건드리고 무엇을 건드리지 않는가"라는 판단 부분을 본다 —
 * 실수가 나면 여기서 난다.
 */
describe('downscaleImage', () => {
  const bigJpeg = () =>
    new File([new Uint8Array(2 * 1024 * 1024)], 'photo.jpg', { type: 'image/jpeg' });

  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  /*
   * 여기서는 축소가 "가능한 상태"를 먼저 만들어 둔다.
   * 스텁 없이 두면 createImageBitmap 이 없어 예외 → 원본 반환이 되어,
   * 가드를 지워도 테스트가 통과해 버린다(엉뚱한 이유로 통과).
   * 축소가 실제로 동작하는 상황에서 "그래도 건드리지 않는다"를 확인해야 의미가 있다.
   */
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
      // 축소는 부가 기능이다. 여기서 예외가 새어 나가면 상품 등록 자체가 막힌다
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
      expect(captured.height).toBe(1200);   // 3000 * (1600/4000)
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
      // 원본(2MB)보다 큰 결과
      stubCanvas({ outputSize: 5 * 1024 * 1024 });

      const file = bigJpeg();
      expect(await downscaleImage(file)).toBe(file);
    });
  });

  // ── 테스트 도우미 ────────────────────────────────────────

  function stubBitmap({ width, height }: { width: number; height: number }) {
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({
      width, height, close: vi.fn(),
    }));
  }

  /** canvas 는 jsdom 에 없으므로 크기만 기록하고 결과 Blob 을 흉내낸다 */
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
