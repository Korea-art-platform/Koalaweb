import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function RisingPanel({ children, className = '' }: Props) {
  return (
    <div
      data-hero-cover
      className={`relative z-10 bg-white md:rounded-t-[2.25rem] shadow-[0_-20px_50px_-20px_rgba(13,9,18,0.55)] ${className}`}
    >
      {children}
    </div>
  );
}

export function StickyHero({ children }: Props) {
  return <div className="relative z-0 md:sticky md:top-0">{children}</div>;
}

export function useCoveredByPanel(ref: React.RefObject<HTMLElement | null>) {
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const el = ref.current;
      const cover = document.querySelector('[data-hero-cover]');
      if (!el || !cover) return;
      const hero = el.getBoundingClientRect();
      const coverTop = cover.getBoundingClientRect().top;
      setCovered(coverTop <= hero.top + 1 || hero.bottom <= 0);
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return covered;
}

export function usePastHero() {
  const { pathname } = useLocation();
  const [past, setPast] = useState(true);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const cover = document.querySelector('[data-hero-cover]');
      if (!cover) { setPast(true); return; }
      setPast(cover.getBoundingClientRect().top <= 72);
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return past;
}
