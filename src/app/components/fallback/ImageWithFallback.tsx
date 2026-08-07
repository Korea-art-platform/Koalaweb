import React, { useState } from 'react'
import { toCdnUrl } from '../../lib/imageUrl'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, loading, decoding, ...rest } = props

  // S3 직접 서빙 → CDN 치환 (VITE_IMAGE_CDN_BASE 미설정이면 원본 그대로)
  const resolvedSrc = toCdnUrl(typeof src === 'string' ? src : undefined) ?? src

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      style={style}
      // 목록에서 화면 밖 이미지를 미리 받지 않도록 기본을 lazy 로 둔다.
      // 히어로처럼 첫 화면에 바로 보여야 하는 곳은 loading="eager" 로 덮어쓰면 된다.
      loading={loading ?? 'lazy'}
      decoding={decoding ?? 'async'}
      {...rest}
      onError={handleError}
    />
  )
}
