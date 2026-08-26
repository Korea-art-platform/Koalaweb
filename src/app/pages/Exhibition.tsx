import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { getArtists } from '@/api/artist';
import { getBanners } from '@/api/banner';
import { toCdnUrl } from '@/app/lib/imageUrl';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // 작가 이름은 스크롤보다 느리게 흘러 지나간다 — 전시실을 걷는 느낌
  const nameX = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['12%', '-12%']);

  return (
    <section ref={ref} className="relative border-t border-white/5 py-24 md:py-36">
      <motion.p
        style={{ x: nameX }}
        className="pointer-events-none mb-10 select-none whitespace-nowrap px-6 text-[15vw]
          font-black leading-none tracking-tighter text-white/[0.055] md:mb-16 md:text-[11vw]"
      >
        {room.artist.name}
      </motion.p>

      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <div className="mb-10 flex items-end justify-between gap-4 md:mb-16">
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

        <div className="grid gap-5 md:grid-cols-3 md:gap-7">
          {room.photos.map((photo, i) => (
            <Frame key={photo.fileUrl} src={photo.fileUrl} caption={photo.title} delay={i * 0.09} />
          ))}
        </div>
      </div>
    </section>
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
    setTilt({ x: -py * 9, y: px * 9 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 0.68, 0.32, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="group relative"
      >
        <div className="relative overflow-hidden bg-white/[0.04] aspect-[4/5]">
          <ImageWithFallback
            src={src}
            alt={caption ?? ''}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 border border-koala-gold/0 transition-colors duration-500 group-hover:border-koala-gold/45"
          />
        </div>
        {caption && (
          <p className="mt-3 text-xs text-white/45 break-keep">{caption}</p>
        )}
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
