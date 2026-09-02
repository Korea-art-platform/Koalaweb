import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { useIsDesktop } from '@/app/hooks/useMediaQuery';
import type { Artist } from '@/api/types';

interface Props {
  artists: Artist[];
}

/**
 * PC 는 다섯 명을 한눈에 늘어놓고, 좁은 화면은 이름으로 골라 한 명씩 크게 본다.
 *
 * 폭이 좁으면 격자 칸이 손톱만 해져 누가 누군지 알아볼 수 없고, 넓으면 한 명만
 * 큼직하게 띄우는 쪽이 오히려 나머지 네 명을 가린다.
 *
 * CSS 로 한쪽을 숨기지 않고 렌더를 나눈다. 숨긴 쪽도 DOM 에 남으면 그 안의
 * 사진을 전부 내려받는다.
 */
export default function HomeArtists({ artists }: Props) {
  const isDesktop = useIsDesktop();

  if (artists.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-24">
      <SectionHeader
        eyebrow="004 — Artists"
        title="작가"
        sub="작품을 만드는 사람들"
        viewAllHref="/artist-lab"
      />
      {isDesktop ? <ArtistGrid artists={artists} /> : <ArtistPicker artists={artists} />}
    </section>
  );
}

function ArtistGrid({ artists }: Props) {
  return (
    <div className="grid grid-cols-5 gap-x-6 gap-y-8">
      {artists.map((artist) => (
        <Link key={artist.artistCode} to={`/artist/${artist.artistCode}`} className="group block">
          {/* 평소에는 사진과 이름만 두고, 마우스를 올리면 그 위를 덮으며 소개가
              펼쳐진다. 다섯 장을 한눈에 보는 첫인상은 그대로 두면서, 궁금한
              한 명만 더 들여다볼 수 있게 한다.

              키보드로 넘길 때도 같이 열린다. hover 로만 열면 마우스를 쓰지
              않는 사람에게는 소개가 아예 없는 것과 같다. */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={artist.profileImageUrl ?? '/placeholder.svg'}
              alt={artist.name}
              thumb
              className="h-full w-full object-cover transition-transform duration-700
                group-hover:scale-105 motion-reduce:transition-none"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent
                opacity-70 transition-opacity duration-500 group-hover:opacity-0
                group-focus-visible:opacity-0 motion-reduce:transition-none"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-koala-purple/90 opacity-0 transition-opacity duration-500
                group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <p className="text-lg font-bold tracking-tight text-white">{artist.name}</p>
              <p className="mt-2 max-h-0 overflow-hidden break-keep text-xs leading-relaxed
                text-white/85 opacity-0 transition-all duration-500 line-clamp-[9]
                group-hover:max-h-64 group-hover:opacity-100
                group-focus-visible:max-h-64 group-focus-visible:opacity-100
                motion-reduce:transition-none">
                {artist.description?.trim() || '작가 소개가 곧 올라옵니다.'}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ArtistPicker({ artists }: Props) {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mounted = useRef(false);

  // 목록이 늦게 오거나 줄어들면 고른 자리가 범위를 벗어난다.
  useEffect(() => { setIndex(0); }, [artists.length]);

  useEffect(() => {
    // 처음 그릴 때는 옮기지 않는다. 화면을 열자마자 이 구간이 저 혼자
    // 움직이면 무엇이 움직였는지 알 수 없다.
    if (!mounted.current) { mounted.current = true; return; }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // block:'nearest' 가 없으면 이름을 고를 때마다 페이지가 그 자리로 딸려 올라간다.
    tabRefs.current[index]?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [index]);

  const active = artists[index] ?? artists[0];
  const href = `/artist/${active.artistCode}`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const last = artists.length - 1;
    let next = index;

    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;

    e.preventDefault();
    setIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      {/* 이름 줄은 섹션 여백 밖까지 흘려 보낸다. 화면 끝에서 잘린 이름이
          더 있다는 표시가 되어, 따로 화살표를 두지 않아도 된다. */}
      <div
        role="tablist"
        aria-label="작가 선택"
        onKeyDown={handleKeyDown}
        className="-mx-6 flex gap-5 overflow-x-auto border-b border-gray-200 px-6 no-scrollbar md:-mx-12 md:gap-8 md:px-12"
      >
        {artists.map((artist, i) => (
          <button
            key={artist.artistCode}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            id={`artist-tab-${artist.artistCode}`}
            aria-selected={i === index}
            aria-controls={`artist-panel-${artist.artistCode}`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            className={`relative shrink-0 whitespace-nowrap pb-3 text-base font-bold tracking-tight
              transition-colors duration-300 motion-reduce:transition-none
              focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-koala-purple
              md:text-xl ${
              i === index ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'
            }`}
          >
            {artist.name}
            <span
              aria-hidden
              className={`absolute inset-x-0 -bottom-px h-0.5 bg-koala-gold-deep
                transition-opacity duration-300 motion-reduce:transition-none ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`artist-panel-${active.artistCode}`}
        aria-labelledby={`artist-tab-${active.artistCode}`}
        className="mt-6 md:mt-10"
      >
        <Link to={href} className="group block">
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 sm:aspect-[3/2]">
            {/* key 를 걸어 다시 그리게 한다. 같은 자리에서 사진만 바뀌면
                무엇이 바뀌었는지 눈에 걸리지 않아 페이드를 한 번 준다. */}
            <div
              key={active.artistCode}
              className="absolute inset-0 animate-in fade-in duration-700 motion-reduce:animate-none"
            >
              <ImageWithFallback
                src={active.profileImageUrl ?? '/placeholder.svg'}
                alt={active.name}
                className="h-full w-full object-cover transition-transform duration-700
                  group-hover:scale-105 motion-reduce:transition-none"
              />
            </div>

            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent"
            />

            <p className="absolute inset-x-0 bottom-0 p-5 text-xl font-bold tracking-tight text-white md:p-8 md:text-3xl">
              {active.name}
            </p>
          </div>
        </Link>

        <div className="mt-5 flex flex-col gap-4 md:mt-7 md:flex-row md:items-start md:justify-between md:gap-16">
          {/* 줄 수는 지금 등록된 소개(112~140자)가 잘리지 않는 선에 맞춘다.
              자르는 목적은 요약이 아니라, 나중에 훨씬 긴 글이 들어왔을 때
              이 구간이 끝없이 늘어나지 않게 막아 두는 것이다. */}
          <p className="max-w-[68ch] whitespace-pre-line break-keep text-sm leading-relaxed text-gray-500 line-clamp-5 md:text-base md:line-clamp-4">
            {active.description?.trim() || '작가 소개가 곧 올라옵니다.'}
          </p>

          <Link
            to={href}
            className="flex shrink-0 items-center gap-1.5 self-start border-b-2 border-gray-900 pb-1
              text-xs font-bold text-gray-900 transition-colors hover:border-koala-purple
              hover:text-koala-purple motion-reduce:transition-none md:text-sm"
          >
            작가 페이지 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
