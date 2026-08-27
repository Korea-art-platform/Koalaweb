import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toCdnUrl } from '@/app/lib/imageUrl';
import type { Artist } from '@/api/types';

interface Props {
  artists: Artist[];
}

/** 카드 사이 각도. 넓히면 바퀴가 커 보이고, 좁히면 카드가 겹친다. */
const STEP = 21;
/** 손가락이 이만큼 움직이면 카드 한 칸이 넘어간다. */
const PX_PER_CARD = 190;
/** 이 각도를 넘어간 카드는 바퀴 뒤편이라 그리지 않는다. */
const VISIBLE = STEP * 2.6;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * 작가 사진을 큰 바퀴의 윗면에 얹고, 옆으로 밀어 돌린다.
 *
 * 바퀴 중심은 화면 아래 한참 밑에 있다. 그래서 가운데 카드는 똑바로 서 있고
 * 양옆으로 갈수록 자연스럽게 기울며 내려간다 — 회전판에 붙어 있는 것처럼 보인다.
 *
 * 끌던 손을 놓으면 관성으로 조금 더 굴러가다 가장 가까운 카드에 맞춰 선다.
 * 아무 데나 멈추면 카드가 반쯤 걸린 채로 남아 무엇을 보는 중인지 흐려진다.
 *
 * 끌기와 누르기는 움직인 거리로 가른다. 몇 픽셀만 움직여도 이동으로 치면
 * 카드를 눌러 작가 페이지로 갈 수가 없다.
 */
export default function ArtistWheel({ artists }: Props) {
  const [radius, setRadius] = useState(760);
  // 움직임을 줄여 달라고 했으면 굴러가는 연출 없이 곧바로 자리를 잡는다.
  const [instant, setInstant] = useState(false);
  const [angle, setAngle] = useState(0);
  const [dragging, setDragging] = useState(false);

  const maxAngle = (artists.length - 1) * STEP;
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef({ id: -1, startX: 0, startAngle: 0, moved: 0, lastX: 0, lastT: 0, v: 0 });
  const spin = useRef(0);

  useEffect(() => {
    setInstant(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // 첫 카드에서 시작하면 왼쪽이 텅 빈 채로 열린다. 가운데 작가에 맞춰 두면
  // 양옆이 함께 보여 바퀴라는 게 한눈에 읽힌다.
  useEffect(() => {
    if (artists.length > 0) setAngle(Math.floor((artists.length - 1) / 2) * STEP);
  }, [artists.length]);

  // 바퀴가 화면보다 작으면 카드가 급하게 기운다. 폭에 맞춰 반지름을 키운다.
  useEffect(() => {
    const fit = () => setRadius(Math.max(560, Math.min(1200, window.innerWidth * 0.78)));
    fit();
    window.addEventListener('resize', fit, { passive: true });
    return () => window.removeEventListener('resize', fit);
  }, []);

  const rollTo = useCallback((from: number, target: number) => {
    cancelAnimationFrame(spin.current);
    if (instant) { setAngle(target); return; }

    let current = from;
    const step = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.05) { setAngle(target); return; }
      setAngle(current);
      spin.current = requestAnimationFrame(step);
    };
    spin.current = requestAnimationFrame(step);
  }, [instant]);

  /** 놓은 속도만큼 더 굴러갈 거리를 셈해, 그 지점에서 가장 가까운 칸에 세운다. */
  const settle = useCallback((from: number, velocity: number) => {
    const glide = clamp(velocity * 120, -STEP * 2, STEP * 2);
    rollTo(from, clamp(Math.round((from + glide) / STEP) * STEP, 0, maxAngle));
  }, [rollTo, maxAngle]);

  // 지금 자리에서 목표까지 굴러가야 한다. 목표를 출발점으로 넘기면 순간이동한다.
  const move = (delta: number) => {
    const here = Math.round(angle / STEP);
    rollTo(angle, clamp((here + delta) * STEP, 0, maxAngle));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    cancelAnimationFrame(spin.current);
    drag.current = {
      id: e.pointerId, startX: e.clientX, startAngle: angle,
      moved: 0, lastX: e.clientX, lastT: e.timeStamp, v: 0,
    };
    setDragging(true);
    stage.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));

    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = ((e.clientX - d.lastX) / PX_PER_CARD) * STEP / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;

    setAngle(clamp(d.startAngle - (dx / PX_PER_CARD) * STEP, 0, maxAngle));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    d.id = -1;
    setDragging(false);
    settle(angle, -d.v);
  };

  useEffect(() => () => cancelAnimationFrame(spin.current), []);

  if (artists.length === 0) return null;

  const active = Math.round(angle / STEP);

  return (
    <div className="relative">
      <div
        ref={stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`relative h-[420px] md:h-[500px] overflow-hidden select-none touch-pan-y ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {artists.map((artist, i) => {
          const a = i * STEP - angle;
          if (Math.abs(a) > VISIBLE) return null;

          const rad = (a * Math.PI) / 180;
          // 중심이 아래에 있으니, 위로 올라온 만큼만 화면에 보인다.
          const x = Math.sin(rad) * radius;
          const dip = (1 - Math.cos(rad)) * radius;
          const near = 1 - Math.min(1, Math.abs(a) / VISIBLE);

          return (
            <div
              key={artist.artistCode}
              className="absolute left-1/2 top-6 md:top-8 w-[190px] md:w-[240px] will-change-transform"
              style={{
                transform: `translate(-50%, 0) translate(${x}px, ${dip}px) rotate(${a}deg)`,
                opacity: 0.25 + near * 0.75,
                zIndex: Math.round(near * 100),
              }}
            >
              <Link
                to={`/artist/${artist.artistCode}`}
                draggable={false}
                // 끌다가 놓은 것이지 누른 것이 아니면 따라가지 않는다.
                onClick={(e) => { if (drag.current.moved > 8) e.preventDefault(); }}
                className="block group"
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 shadow-[0_24px_60px_-30px_rgba(62,34,89,0.55)]">
                  {artist.profileImageUrl ? (
                    <img
                      src={toCdnUrl(artist.profileImageUrl)}
                      alt={artist.name}
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      준비 중
                    </div>
                  )}
                </div>
                <p
                  className="mt-4 text-center text-base md:text-lg font-bold tracking-tight text-gray-900 transition-opacity"
                  style={{ opacity: near }}
                >
                  {artist.name}
                </p>
              </Link>
            </div>
          );
        })}
      </div>

      {/* 가운데 작가의 소개는 바퀴 밖에 둔다. 카드에 얹으면 기울어져 읽기 어렵다. */}
      <p className="mt-2 md:mt-4 min-h-[3.5rem] text-center text-sm text-gray-500 leading-[1.8] break-keep max-w-xl mx-auto px-4 line-clamp-2">
        {artists[active]?.description}
      </p>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => move(-1)}
          disabled={active <= 0}
          aria-label="이전 작가"
          className="p-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-koala-purple hover:text-koala-purple disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {artists.map((artist, i) => (
            <button
              key={artist.artistCode}
              onClick={() => rollTo(angle, i * STEP)}
              aria-label={artist.name}
              aria-current={i === active ? 'true' : undefined}
              className={`rounded-full transition-all duration-300 ${
                i === active ? 'w-6 h-1.5 bg-koala-gold-deep' : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => move(1)}
          disabled={active >= artists.length - 1}
          aria-label="다음 작가"
          className="p-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-koala-purple hover:text-koala-purple disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
