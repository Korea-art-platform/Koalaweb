import { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { toCdnUrl } from '@/app/lib/imageUrl';

// 무대 조명 — 배경색 위에 얹는다. 히어로와 어드민 미리보기가 같이 쓴다
export const STAGE_LIGHT =
  'radial-gradient(60% 55% at 50% 42%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 45%, rgba(13,9,18,0.42) 100%)';

// 배경색이 없거나 형식이 틀리면 딥 퍼플
const HEX = /^#[0-9a-f]{6}$/i;
export const stageColor = (c?: string | null) => (c && HEX.test(c) ? c : '#3E2259');

const EASE = [0.22, 0.61, 0.36, 1] as const;

// 들어올 때 오른쪽 아래에서, 나갈 때 왼쪽 위로 — 이전으로 넘기면 좌우만 뒤집는다
function travel(x: number, y: number, delay: number): Variants {
  return {
    enter: (dir: number) => ({ opacity: 0, x: `${dir * x}%`, y: `${y}%`, scale: 0.55, filter: 'blur(0px)' }),
    center: {
      opacity: 1,
      x: '0%',
      y: '0%',
      scale: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 120, damping: 20, delay, opacity: { duration: 0.35, delay } },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: `${-dir * x}%`,
      y: `${-y}%`,
      scale: 0.8,
      filter: 'blur(8px)',
      transition: { duration: 0.55, ease: EASE, delay: delay / 2 },
    }),
  };
}

// 뒤에 까는 작품명 — 제자리에서 번지듯 바뀐다
const NAME: Variants = {
  enter: { opacity: 0, scale: 1.06 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE, delay: 0.1 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: EASE } },
};

// 글자 폭(em) — 한글 1, 공백 0.3, 나머지 0.62
const emsOf = (s: string) =>
  Array.from(s).reduce((w, ch) => w + (ch === ' ' ? 0.3 : /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(ch) ? 1 : 0.62), 0);

// 칸에 맞는 글자 크기(cqw) — 두 줄을 허용하면 더 크게 쓸 수 있을 때만 나눈다
function fitName(name: string, width: number, twoLines: boolean) {
  const cap = 58 * width;
  let best = { lines: [name], size: Math.min((100 * width) / emsOf(name), cap) };
  const words = name.split(' ');
  if (twoLines) {
    for (let i = 1; i < words.length; i += 1) {
      const lines = [words.slice(0, i).join(' '), words.slice(i).join(' ')];
      const size = Math.min((100 * width) / Math.max(...lines.map(emsOf)), cap * 0.6);
      if (size > best.size) best = { lines, size };
    }
  }
  return best;
}

// 구성 이미지 자리 — 1 오른쪽 위(작품 뒤), 2 오른쪽 아래, 3 왼쪽 아래
const SLOTS = [
  { className: 'right-[8%] top-[10%] w-[24%] z-[5]', x: 60, y: 45, delay: 0.14 },
  { className: 'right-[6%] bottom-[3%] w-[28%] z-20', x: 75, y: 30, delay: 0.2 },
  { className: 'left-[6%] bottom-[8%] w-[26%] z-20', x: 95, y: 30, delay: 0.26 },
];

interface ShowcaseArtProps {
  imageUrl?: string | null;
  effects: (string | null | undefined)[];
  alt: string;
  // 뒤에 크게 까는 작품명. nameWidth 는 작품 칸 너비 대비 글자 폭, nameLines 는 최대 줄 수
  name?: string | null;
  nameWidth?: number;
  nameLines?: 1 | 2;
  // 히어로에서만 — 넘길 때 움직임. reach 는 이동 거리 배수
  animate?: boolean;
  dir?: number;
  reach?: number;
}

export default function ShowcaseArt({
  imageUrl, effects, alt, name, nameWidth = 0.95, nameLines = 1, animate = false, dir = 1, reach = 1,
}: ShowcaseArtProps) {
  const main = toCdnUrl(imageUrl);
  const moves = useMemo(() => ({
    main: travel(50 * reach, 26 * reach, 0),
    slots: SLOTS.map((s) => travel(s.x * reach, s.y * reach, s.delay)),
  }), [reach]);
  const move = (variants: Variants) => (animate ? { variants, custom: dir } : {});
  const fit = name ? fitName(name, nameWidth, nameLines === 2) : null;

  return (
    <div className="relative aspect-square w-full [container-type:inline-size]">
      {fit && (
        <motion.span
          aria-hidden
          className="font-display-ko pointer-events-none absolute inset-x-0 top-[44%] z-0 flex -translate-y-1/2 select-none flex-col
            items-center whitespace-nowrap leading-[0.95] text-white/90"
          style={{ fontSize: `${fit.size}cqw` }}
          {...(animate ? { variants: NAME } : {})}
        >
          {fit.lines.map((line) => <span key={line}>{line}</span>)}
        </motion.span>
      )}
      {main && (
        <motion.div className="absolute left-[12%] top-[12%] z-10 h-[76%] w-[76%]" {...move(moves.main)}>
          {/* 바닥 그림자 */}
          <div aria-hidden className="absolute inset-x-[20%] bottom-[-2%] h-[8%] rounded-[50%] bg-[rgba(13,9,18,0.38)] blur-[12px]" />
          <img src={main} alt={alt} draggable={false} decoding="async" className="relative h-full w-full object-contain" />
        </motion.div>
      )}
      {SLOTS.map((slot, i) => {
        const src = toCdnUrl(effects[i]);
        if (!src) return null;
        return (
          <motion.div
            key={i}
            aria-hidden
            className={`pointer-events-none absolute aspect-square ${slot.className}`}
            {...move(moves.slots[i])}
          >
            <img
              src={src}
              alt=""
              draggable={false}
              decoding="async"
              className="h-full w-full object-contain drop-shadow-[0_8px_14px_rgba(13,9,18,0.4)]"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
