import { useEffect, useRef, useState } from 'react';

/**
 * 스크롤을 애니메이션의 타임라인으로 쓴다.
 *
 * 긴 섹션 안에 sticky 무대를 두면, 무대가 화면에 붙어 있는 동안 스크롤한 양이
 * 곧 진행도가 된다. 섹션이 화면 위에 걸치기 시작할 때 0, 다 지나갈 때 1이다.
 *
 * 스크롤 라이브러리를 쓰지 않는 이유는 About 한 페이지 때문에 모든 페이지의
 * 번들을 불릴 이유가 없어서다. 대신 지켜야 할 것이 두 가지 있다.
 *
 * 하나, 리스너는 페이지 전체에 하나만 둔다. 씬마다 scroll 리스너를 붙이면
 * 스크롤 한 번에 리스너 수만큼 콜백이 돈다.
 *
 * 둘, 읽기와 쓰기를 섞지 않는다. rAF 안에서 모든 씬의 위치를 먼저 다 읽고,
 * 그 다음 상태를 바꾼다. 읽고-쓰고-읽고-쓰면 레이아웃이 그때마다 다시 계산된다.
 */

type Listener = (progress: number) => void;

interface Entry {
  el: HTMLElement;
  notify: Listener;
  last: number;
}

const entries = new Set<Entry>();
let frame = 0;

function measure(el: HTMLElement) {
  const rect = el.getBoundingClientRect();

  // 무대(고정되는 자식)의 실제 높이로 잰다. window.innerHeight 를 쓰면
  // 모바일에서 주소창이 접히는 순간 값이 바뀌어 진행도가 튄다 —
  // 스크롤은 그대로인데 화면이 한 번 덜컥한다.
  const stage = el.firstElementChild as HTMLElement | null;
  const stageHeight = stage ? stage.getBoundingClientRect().height : window.innerHeight;

  const travel = rect.height - stageHeight;
  if (travel <= 0) return rect.top <= 0 ? 1 : 0;
  return Math.min(1, Math.max(0, -rect.top / travel));
}

function tick() {
  frame = 0;
  // 먼저 전부 읽는다.
  const next: { entry: Entry; value: number }[] = [];
  entries.forEach((entry) => next.push({ entry, value: measure(entry.el) }));
  // 그 다음에 쓴다.
  for (const { entry, value } of next) {
    // 픽셀로 보이지도 않을 차이로 리렌더를 부르지 않는다.
    if (Math.abs(value - entry.last) < 0.001) continue;
    entry.last = value;
    entry.notify(value);
  }
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(tick);
}

function subscribe(el: HTMLElement, notify: Listener) {
  const entry: Entry = { el, notify, last: -1 };
  entries.add(entry);
  if (entries.size === 1) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }
  schedule();
  return () => {
    entries.delete(entry);
    if (entries.size === 0) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
    }
  };
}

/**
 * 이 요소가 화면을 지나가는 진행도(0~1)와, 움직임을 줄여야 하는지를 돌려준다.
 *
 * 움직임을 줄여 달라고 설정한 사람에게 진행도를 1로 밀어 주면 안 된다.
 * 진행도 1 은 "다 보이는 상태"가 아니라 대개 "이미 퇴장한 상태"다 —
 * 그렇게 두면 글자가 통째로 사라진 빈 화면을 보게 된다.
 *
 * 대신 reduced 를 그대로 넘겨, 씬마다 "움직이지 않는 읽을 수 있는 모습"을
 * 직접 그리게 한다. 어떤 모습이 읽을 수 있는지는 씬만 안다.
 */
export function useScrollScene<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      return;
    }

    return subscribe(el, setProgress);
  }, []);

  return { ref, progress, reduced };
}

/** 0~1 진행도를 [from, to] 구간에 대해 다시 0~1 로 편다. */
export function span(progress: number, from: number, to: number) {
  if (to <= from) return progress >= to ? 1 : 0;
  return Math.min(1, Math.max(0, (progress - from) / (to - from)));
}

/** 부드럽게 붙었다 떨어지게 한다. 등속으로 움직이면 기계처럼 보인다. */
export function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
