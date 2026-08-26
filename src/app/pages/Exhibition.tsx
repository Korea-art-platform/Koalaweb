import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion, type MotionValue } from 'framer-motion';
import { getArtists } from '@/api/artist';
import { getBanners } from '@/api/banner';
import { toCdnUrl } from '@/app/lib/imageUrl';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { ImageLightbox } from '@/app/components/common/ImageLightbox';
import { useIsDesktop } from '@/app/hooks/useMediaQuery';
import type { Artist, Banner, PageResponse } from '@/api/types';

const ROLE = 'EXHIBITION';

interface Room {
  artist: Artist;
  photos: { fileUrl: string; title?: string }[];
}

export default function Exhibition() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [intro, setIntro] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [artistRes, bannerRes] = await Promise.allSettled([
          getArtists(0, 20),
          getBanners('EXHIBITION'),
        ]);

        if (artistRes.status === 'fulfilled') {
          const page: PageResponse<Artist> = artistRes.value.data.data;
          const list = (page.content ?? [])
            .map((a) => ({
              artist: a,
              photos: (a.mediaList ?? [])
                .filter((m) => m.mediaRole === ROLE)
                .sort((x, y) => (x.sortOrder ?? 0) - (y.sortOrder ?? 0))
                .map((m) => ({ fileUrl: m.fileUrl, title: m.title })),
            }))
            .filter((r) => r.photos.length > 0);
          setRooms(list);
        }

        if (bannerRes.status === 'fulfilled') {
          const list: Banner[] = bannerRes.value.data.data ?? [];
          setIntro(list[0] ?? null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const title = intro?.title ?? '작가의 전시';
  const subtitle = intro?.subtitle ?? 'KOALA EXHIBITION';
  const note =
    intro?.description ??
    '작가들이 걸어온 전시의 순간들을 모았습니다. 스크롤을 따라 한 사람씩 만나 보세요.';

  return (
    <main className="bg-[#0d0812] text-white">
      <Entrance title={title} subtitle={subtitle} cover={intro?.imageUrl} />
      <Preface note={note} />

      {loading ? (
        <div className="py-40 text-center text-sm text-white/30">전시를 준비하고 있습니다...</div>
      ) : rooms.length === 0 ? (
        <div className="py-40 text-center">
          <p className="text-sm text-white/40">아직 등록된 전시 사진이 없습니다.</p>
          <Link to="/artist-lab" className="mt-6 inline-block text-sm text-koala-gold underline">
            작가의 연구소로 가기
          </Link>
        </div>
      ) : (
        <>
          {rooms.map((room, i) => (
            <ArtistRoom key={room.artist.artistCode} room={room} index={i} />
          ))}
          <Index rooms={rooms} />
        </>
      )}

      <Exit />
    </main>
  );
}

function Entrance({ title, subtitle, cover }: { title: string; subtitle: string; cover?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.18]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden">
      {cover && (
        <motion.div style={{ scale }} className="absolute inset-0">
          <img
            src={toCdnUrl(cover)}
            alt=""
            className="h-full w-full object-cover opacity-35"
          />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0812]/60 via-[#0d0812]/40 to-[#0d0812]" />

      <motion.div
        style={{ opacity: fade }}
        className="relative flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.4em] text-koala-gold">
          {subtitle}
        </p>
        <h1 className="max-w-3xl text-4xl font-black leading-[1.15] tracking-tight break-keep md:text-7xl">
          {title}
        </h1>
        <ChevronDown className="mt-16 h-6 w-6 animate-bounce text-white/30" />
      </motion.div>
    </section>
  );
}

function Preface({ note }: { note: string }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-32 md:py-48">
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.8, ease: [0.22, 0.68, 0.32, 1] }}
        className="text-center text-base leading-loose text-white/55 break-keep md:text-lg"
      >
        {note}
      </motion.p>
    </section>
  );
}

function ArtistRoom({ room, index }: { room: Room; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // 작가 이름은 스크롤보다 느리게 흘러 지나간다 — 전시실을 걷는 느낌
  const nameX = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['12%', '-12%']);

  // 스크롤에 따라 원이 아주 조금 돈다. 크게 돌리면 사진을 읽기 어려워진다.
  const spin = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-7, 7]);

  return (
    <section ref={ref} className="relative border-t border-white/5 py-24 md:py-36">
      <motion.p
        style={{ x: nameX }}
        className="pointer-events-none mb-6 select-none whitespace-nowrap px-6 text-[15vw]
          font-black leading-none tracking-tighter text-white/[0.055] md:mb-10 md:text-[11vw]"
      >
        {room.artist.name}
      </motion.p>

      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-koala-gold">
              Room {String(index + 1).padStart(2, '0')}
            </p>
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl">{room.artist.name}</h2>
          </div>
          <Link
            to={`/artist/${room.artist.artistCode}`}
            className="flex shrink-0 items-center gap-1.5 border-b border-white/25 pb-1 text-xs
              text-white/60 transition-colors hover:border-koala-gold hover:text-koala-gold md:text-sm"
          >
            작가 보기 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isDesktop ? (
          <Ring room={room} spin={spin} />
        ) : (
          <Stack room={room} />
        )}
      </div>
    </section>
  );
}

/**
 * 작가를 가운데 두고 전시 사진이 그 주위를 둘러싼다. 끌어서 돌려 볼 수 있다.
 *
 * 원 위의 좌표는 삼각함수로 직접 계산한다. rotate + translate 로 배치하면
 * 부모가 회전할 때 사진까지 같이 기울어져 얼굴과 글자가 돌아가 버린다.
 */
function Ring({
  room,
  spin,
}: {
  room: Room;
  spin: MotionValue<number>;
}) {
  const photos = room.photos.slice(0, 5);
  const step = 360 / photos.length;
  const RADIUS = 36;

  const boxRef = useRef<HTMLDivElement>(null);
  const drag = useMotionValue(0);
  const [dragging, setDragging] = useState(false);

  // 스크롤에 따른 미세한 회전과 사용자가 끌어 돌린 각도를 더한다
  const angle = useTransform([spin, drag], ([a, b]) => (a as number) + (b as number));
  const counter = useTransform(angle, (v) => -v);

  const startAngle = (e: React.PointerEvent) => {
    const r = boxRef.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const from = startAngle(e);
    const base = drag.get();
    setDragging(true);

    const move = (ev: PointerEvent) => {
      const r = boxRef.current?.getBoundingClientRect();
      if (!r) return;
      const now =
        (Math.atan2(ev.clientY - (r.top + r.height / 2), ev.clientX - (r.left + r.width / 2)) * 180) /
        Math.PI;
      let d = now - from;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      drag.set(base + d);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  return (
    <div className="relative">
      <div
        ref={boxRef}
        onPointerDown={onPointerDown}
        className={`relative mx-auto aspect-square w-full max-w-[760px] touch-none select-none
          ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <motion.div style={{ rotate: angle }} className="absolute inset-0">
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2
              rounded-full border border-dashed border-white/[0.07]"
          />

          {photos.map((photo, i) => {
            const rad = ((i * step - 90) * Math.PI) / 180;
            return (
              <div
                key={photo.fileUrl}
                className="absolute w-[23%]"
                style={{
                  left: `${50 + RADIUS * Math.cos(rad)}%`,
                  top: `${50 + RADIUS * Math.sin(rad)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.div style={{ rotate: counter }}>
                  <Frame src={photo.fileUrl} caption={photo.title} delay={i * 0.08} />
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.8, ease: [0.22, 0.68, 0.32, 1] }}
          className="pointer-events-none absolute left-1/2 top-1/2 w-[30%] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative aspect-square overflow-hidden rounded-full border border-koala-gold/35 bg-white/[0.04]">
            <ImageWithFallback
              src={room.artist.profileImageUrl ?? '/placeholder.svg'}
              alt={room.artist.name}
              thumb
              className="h-full w-full object-cover"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-black/45 to-transparent"
            />
          </div>
        </motion.div>
      </div>

      <p className="mt-2 text-center text-[11px] text-white/25">끌어서 돌려 보세요</p>
    </div>
  );
}

/**
 * 모바일에서는 원이 좁아 사진이 겹친다. 만화 컷처럼 크기를 달리해 쌓고,
 * 누르면 상품 상세와 같은 확대 보기로 띄운다.
 */
function Stack({ room }: { room: Room }) {
  const photos = room.photos.slice(0, 5);
  const [open, setOpen] = useState<number | null>(null);

  // 컷마다 크기를 달리해 단조로운 격자를 피한다
  const spans = ['col-span-2 aspect-[16/10]', 'aspect-square', 'aspect-square',
                 'col-span-2 aspect-[16/11]', 'col-span-2 aspect-[16/10]'];

  return (
    <>
      <div className="mx-auto mb-6 w-32">
        <div className="relative aspect-square overflow-hidden rounded-full border border-koala-gold/35 bg-white/[0.04]">
          <ImageWithFallback
            src={room.artist.profileImageUrl ?? '/placeholder.svg'}
            alt={room.artist.name}
            thumb
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.fileUrl}
            type="button"
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.55, delay: i * 0.06 }}
            className={`relative overflow-hidden bg-white/[0.04] ${spans[i] ?? 'aspect-square'}`}
          >
            <ImageWithFallback
              src={photo.fileUrl}
              alt={photo.title ?? ''}
              className="h-full w-full object-cover"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 border border-white/10"
            />
            {photo.title && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2.5 py-2 text-left text-[11px] text-white/80">
                {photo.title}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {open !== null && (
        <ImageLightbox
          images={photos.map((p) => toCdnUrl(p.fileUrl) ?? p.fileUrl)}
          initialIndex={open}
          title={room.artist.name}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}

/** 마우스 방향으로 살짝 기울어 입체감을 준다. 터치 기기에서는 기울이지 않는다. */
function Frame({ src, caption, delay }: { src: string; caption?: string; delay: number }) {
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();
  const tiltable = isDesktop && !reduce;

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });

  useEffect(() => { rx.set(tilt.x); ry.set(tilt.y); }, [tilt, rx, ry]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltable) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 10, y: px * 10 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.68, 0.32, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="group relative"
      >
        <div className="relative overflow-hidden bg-white/[0.04] aspect-square">
          <ImageWithFallback
            src={src}
            alt={caption ?? ''}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 border border-koala-gold/0 transition-colors duration-500 group-hover:border-koala-gold/50"
          />
        </div>
        {caption && <p className="mt-2 text-[11px] text-white/45 break-keep">{caption}</p>}
      </motion.div>
    </motion.div>
  );
}

function Index({ rooms }: { rooms: Room[] }) {
  const all = rooms.flatMap((r) => r.photos.map((p) => ({ ...p, artist: r.artist })));

  return (
    <section className="border-t border-white/5 py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-koala-gold">
          Index
        </p>
        <h2 className="mb-10 text-2xl font-bold tracking-tight md:text-4xl md:mb-14">도록</h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6 md:gap-4">
          {all.map((item) => (
            <Link
              key={item.fileUrl}
              to={`/artist/${item.artist.artistCode}`}
              className="group relative overflow-hidden bg-white/[0.04] aspect-square"
            >
              <ImageWithFallback
                src={item.fileUrl}
                alt={item.title ?? item.artist.name}
                thumb
                className="h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 text-[11px] text-white/80">
                {item.artist.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Exit() {
  return (
    <section className="border-t border-white/5 px-6 py-28 text-center md:py-40">
      <p className="mb-8 text-sm text-white/40">관람해 주셔서 감사합니다</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/store"
          className="inline-flex items-center gap-2 bg-koala-gold px-7 py-3.5 text-sm font-bold text-koala-navy transition hover:brightness-105"
        >
          작품 보러가기 <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/artist-lab"
          className="inline-flex items-center gap-2 border border-white/20 px-7 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/50 hover:text-white"
        >
          작가의 연구소
        </Link>
      </div>
    </section>
  );
}
