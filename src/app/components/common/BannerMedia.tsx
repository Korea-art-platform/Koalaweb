import { useEffect, useRef, useState } from 'react';

type Props = {
  imageUrl?: string | null;
  videoUrl?: string | null;
  alt?: string;
  className?: string;
  eager?: boolean;
};

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function BannerMedia({
  imageUrl,
  videoUrl,
  alt = '',
  className = 'w-full h-full object-cover object-center',
  eager = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduceMotion(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // 자동재생이 막혀도 이미지로 바꾸지 않는다. poster 가 그 자리를 대신하기 때문이다.
  // 예전에는 play() 거부를 전부 실패로 봤는데, 그러면 StrictMode 의 이펙트 재실행이나
  // 탭 전환처럼 재생이 잠깐 끊기는 것만으로 영상이 세션 내내 사라졌다.
  // 여기서는 재생을 한 번 더 시도만 하고, 실제 로딩 실패(onError)일 때만 이미지로 내려간다.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion || loadFailed) return;

    const play = () => video.play().catch(() => {});
    play();

    // 다른 탭에서 돌아왔을 때 멈춰 있으면 다시 시도한다
    const onVisible = () => {
      if (!document.hidden && video.paused) play();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [videoUrl, reduceMotion, loadFailed]);

  const showVideo = Boolean(videoUrl) && !loadFailed && !reduceMotion;

  if (showVideo) {
    return (
      <video
        ref={videoRef}
        src={videoUrl ?? undefined}
        poster={imageUrl ?? undefined}
        className={className}
        // muted 없이는 자동재생이 브라우저에 막힌다. 셋은 한 묶음이다.
        autoPlay
        muted
        loop
        // 없으면 iOS 사파리가 영상을 전체화면으로 띄운다
        playsInline
        preload={eager ? 'auto' : 'metadata'}
        onError={() => setLoadFailed(true)}
        aria-label={alt || undefined}
      />
    );
  }

  if (!imageUrl) return null;

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      // React 18 은 카멜케이스 fetchPriority 를 모른다(19 부터 지원).
      // 그대로 쓰면 콘솔 경고가 뜨므로 소문자 DOM 속성으로 넘긴다.
      {...{ fetchpriority: eager ? 'high' : 'auto' }}
      decoding="async"
    />
  );
}
