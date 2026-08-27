import { useEffect, useRef, useState } from 'react';

/**
 * 화면에 들어왔는지 알려준다. 한 번 들어오면 계속 true 다 —
 * 스크롤을 되돌릴 때마다 글이 다시 사라지면 읽던 사람이 놓친다.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(margin = '-12%') {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSeen(true);
      return;
    }

    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { rootMargin: `0px 0px ${margin} 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, margin]);

  return { ref, seen };
}
