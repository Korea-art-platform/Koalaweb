const CDN_BASE = import.meta.env.VITE_IMAGE_CDN_BASE as string | undefined

const S3_HOST_PATTERN = /^[a-z0-9.-]+\.s3[.-][a-z0-9-]*\.?amazonaws\.com$/i

export function toCdnUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  if (!CDN_BASE) return url

  try {
    const parsed = new URL(url, window.location.origin)

    if (!S3_HOST_PATTERN.test(parsed.host)) return url

    const base = CDN_BASE.replace(/\/$/, '')
    return `${base}${parsed.pathname}${parsed.search}`
  } catch {
    return url
  }
}

/**
 * 축소본 주소. 서버(ImageDerivatives.java)와 같은 규칙이라 한쪽만 바꾸면 안 된다.
 *
 * 목록·카드는 88~240px 로 그려지는데 원본은 2000px 이다. 그대로 쓰면 홈 한 번에
 * 8MB 가 넘어간다. 업로드 시 원본 옆에 _t480 을 함께 만들어 두고 여기서 가리킨다.
 *
 * 예전에 올라간 이미지에는 축소본이 없을 수 있다. 그래서 ImageWithFallback 이
 * 로딩 실패를 감지하면 원본으로 되돌아간다.
 */
const THUMB_SUFFIX = '_t480'

/**
 * 기존 이미지에는 축소본이 아직 없다. 없는 상태로 켜면 이미지마다 실패 요청을
 * 한 번 거치고 원본을 받게 되어 지금보다 느려진다.
 * 일괄 생성(어드민 image-derivatives)을 끝낸 뒤 Variables 에서 켠다.
 */
const THUMBS_ENABLED = (import.meta.env.VITE_IMAGE_THUMBS as string | undefined) === 'true'

export function toThumbUrl(url: string | undefined | null): string | undefined {
  const resolved = toCdnUrl(url)
  if (!resolved) return undefined
  if (!THUMBS_ENABLED) return resolved
  if (!/\.(jpe?g|png)(\?|$)/i.test(resolved)) return resolved

  const [path, query] = resolved.split('?')
  const dot = path.lastIndexOf('.')
  const slash = path.lastIndexOf('/')
  if (dot <= slash) return resolved
  if (path.slice(0, dot).endsWith(THUMB_SUFFIX)) return resolved

  const thumb = path.slice(0, dot) + THUMB_SUFFIX + path.slice(dot)
  return query ? `${thumb}?${query}` : thumb
}
