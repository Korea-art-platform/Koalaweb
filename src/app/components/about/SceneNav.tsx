import { useEffect, useState } from 'react';

export interface Scene {
  id: string;
  label: string;
}

interface Props {
  scenes: Scene[];
}

/**
 * 오른쪽에 붙어 있는 장면 표시기.
 *
 * 긴 페이지에서 지금 어디쯤인지 모르면 사람은 스크롤을 멈춘다. 점만 찍어 두면
 * 무슨 장면인지 모르니, 이름을 함께 두고 눌러서 건너뛸 수 있게 했다.
 *
 * "화면 한가운데에 걸친 섹션"으로 판정하지 않는다. 마지막 씬은 그 아래 푸터가
 * 올라오면 가운데를 내주고, 그 순간 표시기가 이전 씬에 멈춰 선다 — 화면은
 * 회사 소개인데 표시기는 작가를 가리키는 식이다.
 *
 * 대신 "가운데선을 이미 지난 것 중 마지막"을 고른다. 어디에 서 있든 답이
 * 하나로 정해지고, 페이지 맨 끝에서도 마지막 씬이 켜진 채로 남는다.
 */
export default function SceneNav({ scenes }: Props) {
  const [active, setActive] = useState(scenes[0]?.id);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      let current = scenes[0]?.id;
      for (const scene of scenes) {
        const el = document.getElementById(scene.id);
        if (el && el.getBoundingClientRect().top <= line) current = scene.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [scenes]);

  return (
    <nav
      aria-label="구간 이동"
      className="hidden lg:flex fixed right-6 xl:right-10 top-1/2 -translate-y-1/2 z-30 flex-col gap-4"
    >
      {scenes.map((scene) => {
        const on = active === scene.id;
        return (
          <a
            key={scene.id}
            href={`#${scene.id}`}
            aria-current={on ? 'true' : undefined}
            className="group flex items-center justify-end gap-3"
          >
            <span
              className={`text-[11px] font-bold tracking-[0.18em] uppercase transition-all duration-500 ${
                on
                  ? 'opacity-100 text-koala-purple'
                  : 'opacity-0 -translate-x-1 text-gray-400 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {scene.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-500 ${
                on
                  ? 'w-2.5 h-2.5 bg-koala-purple'
                  : 'w-1.5 h-1.5 bg-gray-300 group-hover:bg-gray-500'
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
