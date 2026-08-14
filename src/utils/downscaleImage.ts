const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

const SKIP_UNDER_BYTES = 300 * 1024;

export async function downscaleImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/gif') return file;
  if (file.size <= SKIP_UNDER_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const scale = MAX_DIMENSION / Math.max(width, height);

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

    const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outType, JPEG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], renameFor(file.name, outType), {
      type: outType,
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

function renameFor(name: string, type: string): string {
  const base = name.replace(/\.[^.]+$/, '');
  return type === 'image/png' ? `${base}.png` : `${base}.jpg`;
}
