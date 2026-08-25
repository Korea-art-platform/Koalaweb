import { useEffect, useState } from 'react';
import { toCdnUrl, toThumbUrl } from '@/app/lib/imageUrl';

/**
 * 작게 그려지는 이미지에 축소본을 먼저 물린다.
 *
 * ImageWithFallback 을 쓰지 않고 <img> 를 직접 쓰는 자리를 위한 훅이다.
 * 예전에 올라간 이미지에는 축소본이 없으므로 실패하면 원본으로 되돌아간다.
 */
export function useThumbSrc(url?: string | null, placeholder = '/placeholder.svg') {
  const original = toCdnUrl(url) ?? placeholder;
  const thumb = toThumbUrl(url) ?? original;

  const [src, setSrc] = useState(thumb);
  useEffect(() => { setSrc(toThumbUrl(url) ?? toCdnUrl(url) ?? placeholder); }, [url, placeholder]);

  const onError = () => setSrc((prev) => (prev !== original ? original : placeholder));

  return { src, onError };
}
