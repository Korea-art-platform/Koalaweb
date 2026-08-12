/**
 * 업로드 전 이미지 축소.
 *
 * 서버도 긴 변 1600px 로 줄이지만, 그 전에 원본을 통째로 올려야 한다.
 * 요즘 휴대폰 사진 한 장이 5~8MB 라 업로드 자체가 오래 걸리고 서버 메모리도 그만큼 쓴다.
 * 브라우저에서 먼저 줄이면 올라가는 양이 10분의 1 수준으로 떨어진다.
 *
 * 결과가 어차피 서버에서 만들어질 것과 같으므로 화질이 더 나빠지지는 않는다.
 *
 * 건드리지 않는 경우:
 * - 동영상 (여기서 다룰 수 없다)
 * - GIF (애니메이션이 첫 프레임만 남고 깨진다)
 * - 이미 충분히 작은 이미지 (재인코딩은 화질 손실만 남긴다)
 * - 디코딩 실패 (원본을 그대로 올려 등록 자체가 막히지 않게)
 */

/** 서버의 koala.image.max-dimension 과 같은 값 */
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

/** 이보다 작으면 줄일 이유가 없다 */
const SKIP_UNDER_BYTES = 300 * 1024;

export async function downscaleImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/gif') return file;
  if (file.size <= SKIP_UNDER_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = MAX_DIMENSION / Math.max(width, height);

    // 이미 작으면 그대로 둔다
    if (scale >= 1) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    // PNG 는 투명도가 있을 수 있어 포맷을 유지한다. 나머지는 JPEG 로 굳힌다
    const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outType, JPEG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;   // 오히려 커지면 의미가 없다

    return new File([blob], renameFor(file.name, outType), {
      type: outType,
      lastModified: file.lastModified,
    });
  } catch {
    // 축소는 부가 기능이다 — 실패했다고 업로드를 막지 않는다
    return file;
  }
}

/** JPEG 로 바뀌었으면 확장자도 맞춘다 — 서버가 매직바이트로 검사하므로 불일치는 혼란만 준다 */
function renameFor(name: string, type: string): string {
  const base = name.replace(/\.[^.]+$/, '');
  return type === 'image/png' ? `${base}.png` : `${base}.jpg`;
}
