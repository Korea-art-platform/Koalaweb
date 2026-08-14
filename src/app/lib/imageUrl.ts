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
