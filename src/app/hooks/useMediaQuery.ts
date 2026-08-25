import { useEffect, useState } from 'react';

/**
 * CSS 로만 숨긴 영역은 DOM 에 남아 있어서 그 안의 이미지까지 전부 내려받는다.
 * 모바일에서 PC 전용 영역의 이미지를 받지 않으려면 렌더 자체를 막아야 한다.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(query).matches
      : false
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Tailwind 의 lg 브레이크포인트와 같은 값 */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}
