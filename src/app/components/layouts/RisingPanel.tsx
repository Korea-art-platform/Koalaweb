import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * 히어로 위로 올라와 덮는 판.
 *
 * 스크롤을 내릴 때 히어로가 밀려 올라가는 게 아니라, 아래 내용이 한 장의 판처럼
 * 올라와 히어로를 가린다. 히어로는 StickyHero 로 제자리에 붙여 둔다.
 *
 * data-hero-cover 는 헤더가 읽는다. 히어로가 붙어 있으면 화면에서 사라지지 않아
 * "히어로가 보이는가"로는 지나쳤는지 알 수 없다. 이 판의 윗변이 헤더에 닿은
 * 순간이 곧 히어로가 끝난 순간이다.
 */
export function RisingPanel({ children, className = '' }: Props) {
  return (
    <div
      data-hero-cover
      className={`relative z-10 bg-white rounded-t-[1.5rem] md:rounded-t-[2.25rem] shadow-[0_-20px_50px_-20px_rgba(13,9,18,0.55)] ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * 제자리에 붙어 있는 히어로.
 *
 * sticky 는 부모 높이 안에서만 붙는다. 히어로를 딱 맞는 상자로 감싸면 붙을
 * 여유가 0 이라 아예 붙지 않으니, 이 컴포넌트는 페이지 전체를 부모로 삼는
 * 자리에 그대로 놓아야 한다 — 중간에 다른 상자로 또 감싸면 동작하지 않는다.
 */
export function StickyHero({ children }: Props) {
  return <div className="sticky top-0 z-0">{children}</div>;
}

/**
 * 올라온 판에 완전히 가려졌는지 알려준다.
 *
 * 히어로가 붙어 있으면 화면 밖으로 나가지 않아, IntersectionObserver 로는
 * 가려졌는지 알 수 없다 — 판에 덮여 안 보일 뿐 여전히 "화면 안"이다.
 * 판의 윗변이 히어로 위쪽까지 올라온 순간을 다 가려진 것으로 본다.
 *
 * 살짝 걸친 정도로는 참으로 두지 않는다. 스크롤을 조금 움직일 때마다 값이
 * 오가면 영상이 멈췄다 처음부터 다시 재생되기를 되풀이한다.
 */
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
      setCovered(cover.getBoundingClientRect().top <= hero.top + 1);
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

/**
 * 히어로 구간을 지났는지 알려준다.
 *
 * 히어로 위에 떠 있는 것(퀵메뉴 같은 것)을 숨기는 데 쓴다. 히어로는 첫 화면의
 * 인상을 만드는 자리라 그 위에 떠다니는 버튼이 없는 편이 낫다.
 *
 * 덮개가 없는 화면에는 가릴 히어로도 없으니 늘 참을 돌려준다. 스토어처럼
 * 제목 줄만 있는 화면에서까지 버튼이 사라지면 그건 그냥 고장으로 보인다.
 *
 * 기준점 72px 은 헤더 높이다. 헤더가 불투명해지는 순간과 같이 맞춰야
 * 두 가지가 따로 노는 것처럼 보이지 않는다.
 */
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

    // 화면을 옮기면 스크롤이 맨 위로 돌아가므로 여기서 한 번 다시 잰다.
    // 이게 없으면 홈에서 숨긴 상태가 다음 화면까지 따라간다.
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
