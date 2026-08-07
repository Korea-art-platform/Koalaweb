/**
 * 이미지 URL을 CDN 도메인으로 치환한다.
 *
 * 상품 이미지가 S3(시드니)에서 직접 서빙되고 있어 1장에 1.2초 넘게 걸린다.
 * DB에는 절대 S3 URL이 저장되어 있는데, 이걸 마이그레이션으로 일괄 변경하면
 * CDN을 걷어낼 때 되돌리기가 어렵다. 그래서 저장값은 그대로 두고
 * 렌더 시점에만 호스트를 바꾼다.
 *
 * VITE_IMAGE_CDN_BASE 가 없으면 아무것도 하지 않으므로,
 * CloudFront 배포 전에 이 코드를 먼저 올려도 동작에 변화가 없다.
 */

const CDN_BASE = import.meta.env.VITE_IMAGE_CDN_BASE as string | undefined

/** S3 직접 서빙 URL 판별 — 버킷명이 바뀌어도 매칭되도록 호스트 패턴으로 본다 */
const S3_HOST_PATTERN = /^[a-z0-9.-]+\.s3[.-][a-z0-9-]*\.?amazonaws\.com$/i

export function toCdnUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  if (!CDN_BASE) return url

  try {
    const parsed = new URL(url, window.location.origin)

    // S3 직접 서빙만 치환한다. 이미 CDN이거나 외부/데이터 URL은 손대지 않는다.
    if (!S3_HOST_PATTERN.test(parsed.host)) return url

    const base = CDN_BASE.replace(/\/$/, '')
    return `${base}${parsed.pathname}${parsed.search}`
  } catch {
    // 상대경로 등 파싱 불가한 값은 그대로 둔다
    return url
  }
}
