import { useEffect, useRef, useState } from 'react';
import { toCdnUrl } from '@/app/lib/imageUrl';

type Props = {
  imageUrl?: string | null;
  videoUrl?: string | null;
  alt?: string;
  className?: string;
  eager?: boolean;
  active?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  onFallback?: () => void;
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
  active = true,
  loop = true,
  onEnded,
  onFallback,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion);
  const [onScreen, setOnScreen] = useState(true);

  // 서버는 S3 주소를 그대로 내려준다. CDN 으로 바꾸지 않으면 시드니 버킷에서
  // 직접 받게 되고, 히어로는 첫 화면이라 그 지연이 그대로 체감된다.
  // 영상은 이미지보다 훨씬 커서 더 중요하다.
  const posterSrc = toCdnUrl(imageUrl);
  const videoSrc = toCdnUrl(videoUrl);

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

    // 캐러셀은 모든 슬라이드를 동시에 그려 두고 opacity 로만 바꾼다.
    // 보이지 않는 영상까지 돌면 대역폭이 낭비되고, 끝나는 순간 onEnded 가
    // 엉뚱하게 발화해 화면이 저절로 넘어간다.
    if (!active) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    // 화면 밖으로 나가면 멈춘다. 안 보이는 영상을 계속 디코딩할 이유가 없다.
    // 되감지는 않는다 — 다시 올라오면 보던 자리에서 이어진다.
    if (!onScreen) {
      video.pause();
      return;
    }

    const play = () => video.play().catch(() => {});
    play();

    // 다른 탭에서 돌아왔을 때 멈춰 있으면 다시 시도한다
    const onVisible = () => {
      if (!document.hidden && video.paused) play();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [videoUrl, reduceMotion, loadFailed, active, onScreen]);

  const showVideo = Boolean(videoSrc) && !loadFailed && !reduceMotion;

  // 화면에 있는지 지켜본다. 경계보다 조금 이르게 켜 두어야, 스크롤로 들어오는
  // 순간 멈춰 있던 첫 프레임이 잠깐 보이는 일이 없다.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: '200px' },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [showVideo]);

  // 영상이 있는 배너인데 이미지로 내려갔다면 onEnded 가 영영 오지 않는다.
  // 부모가 시간 기반 전환으로 갈아탈 수 있도록 알려 준다.
  const fallbackNotified = useRef<string | null>(null);
  useEffect(() => {
    if (!videoUrl || showVideo) return;
    if (fallbackNotified.current === videoUrl) return;
    fallbackNotified.current = videoUrl;
    onFallback?.();
  }, [videoUrl, showVideo, onFallback]);

  if (showVideo) {
    return (
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        className={className}
        // muted 없이는 자동재생이 브라우저에 막힌다. 셋은 한 묶음이다.
        autoPlay
        muted
        loop={loop}
        // 없으면 iOS 사파리가 영상을 전체화면으로 띄운다
        playsInline
        preload={eager ? 'auto' : 'metadata'}
        onEnded={onEnded}
        onError={() => setLoadFailed(true)}
        aria-label={alt || undefined}
      />
    );
  }

  if (!posterSrc) return null;

  return (
    <img
      src={posterSrc}
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
