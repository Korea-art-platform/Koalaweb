import React, { useEffect, useState } from 'react'
import { toCdnUrl, toThumbUrl } from '../../lib/imageUrl'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** 목록·카드처럼 작게 그려지는 자리. 축소본(_t480)을 먼저 시도한다. */
  thumb?: boolean
}

/** 원본 가로폭. 업로드본이 이보다 작아도 브라우저가 알아서 고르므로 넉넉히 잡는다. */
const ORIGINAL_WIDTH_HINT = 1600
const THUMB_WIDTH = 480
const DEFAULT_SIZES = '(max-width: 767px) 50vw, 33vw'

export function ImageWithFallback({ thumb = false, ...props }: Props) {
  const { src, alt, style, className, loading, decoding, sizes, ...rest } = props

  const original = toCdnUrl(typeof src === 'string' ? src : undefined) ?? (src as string | undefined)
  const preferred = thumb ? toThumbUrl(typeof src === 'string' ? src : undefined) : original

  // 축소본 → 원본 → 에러 아이콘 순으로 물러난다.
  // 예전에 올라간 이미지에는 축소본이 아직 없을 수 있다.
  const [stage, setStage] = useState<0 | 1 | 2>(0)

  useEffect(() => { setStage(0) }, [src, thumb])

  const handleError = () => {
    setStage((s) => (s === 0 && preferred !== original ? 1 : 2))
  }

  if (stage === 2) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    )
  }

  // 카드가 작게 그려지는 폰에서는 축소본을, 크게 그려지는 화면에서는 원본을 받게 한다.
  // 한쪽만 쓰면 폰에서 과하게 크거나 데스크톱에서 흐려진다.
  const responsive = stage === 0 && thumb && preferred && original && preferred !== original

  return (
    <img
      src={stage === 0 ? preferred : original}
      srcSet={responsive ? `${preferred} ${THUMB_WIDTH}w, ${original} ${ORIGINAL_WIDTH_HINT}w` : undefined}
      sizes={responsive ? (sizes ?? DEFAULT_SIZES) : sizes}
      alt={alt}
      className={className}
      style={style}

      loading={loading ?? 'lazy'}
      decoding={decoding ?? 'async'}
      {...rest}
      onError={handleError}
    />
  )
}
