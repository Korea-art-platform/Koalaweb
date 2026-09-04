import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

import { getSkus } from '@/api/sku';
import { getArtists } from '@/api/artist';
import type { Sku, Artist, PageResponse } from '@/api/types';

import IrisOpening from '@/app/components/about/IrisOpening';
import DriftGallery from '@/app/components/about/DriftGallery';
import Reveal from '@/app/components/about/Reveal';
import SceneNav, { type Scene } from '@/app/components/about/SceneNav';
import ArtistWheel from '@/app/components/about/ArtistWheel';

const SCENES: Scene[] = [
  { id: 'scene-open', label: 'Opening' },
  { id: 'scene-why', label: 'Why' },
  { id: 'scene-tiers', label: 'Tiers' },
  { id: 'scene-artists', label: 'Artists' },
];

const WHY: string[][] = [
  ['한국에는 좋은 작가가 많습니다.', '그런데 그 작품을 곁에 두는 일은', '아직도 어렵습니다.'],
  ['어디서 사는지, 진짜가 맞는지,', '이 값이 맞는지 —', '아는 사람만 아는 채로 남아 있습니다.'],
  ['KOALA는 그 사이를 좁히려고 만들었습니다.'],
];

const TIERS = [
  {
    no: '000',
    name: '원작',
    en: 'Original',
    body: '작가의 손에서 하나만 나온 작품입니다. 같은 것이 다시 나오지 않습니다.',
  },
  {
    no: '001',
    name: '한정판',
    en: 'Limited',
    body: '정해진 수량만 만들고 멈춘 작품입니다. 몇 번째인지까지 함께 적습니다.',
  },
  {
    no: '002',
    name: '오픈에디션',
    en: 'Open Edition',
    body: '더 많은 사람이 곁에 둘 수 있게 연 작품입니다. 처음 사는 분께 권합니다.',
  },
];


export default function About() {
  const { data: artworks = [] } = useQuery<Sku[]>({
    queryKey: ['about', 'artworks'],
    queryFn: async () => {
      const res = await getSkus(0, 12);
      const page = res.data.data as PageResponse<Sku>;
      return (page.content ?? []).filter((s) => s.primaryImageUrl);
    },
    staleTime: 1000 * 60 * 30,
  });

  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ['about', 'artists'],
    queryFn: async () => {
      const res = await getArtists(0, 12);
      const page = res.data.data as PageResponse<Artist>;
      return page.content ?? [];
    },
    staleTime: 1000 * 60 * 30,
  });

  const driftImages = artworks.map((s) => s.primaryImageUrl!).slice(0, 6);

  return (
    <main className="bg-background">
      <Helmet>
        <title>회사 소개 — KOALA</title>
        <meta
          name="description"
          content="헤론이 만드는 KOALA-ART는 한국 작가의 작품을 원작·한정판·오픈에디션으로 나누어 소개하는 미술품 거래 플랫폼입니다."
        />
      </Helmet>

      <SceneNav scenes={SCENES} />

      <section id="scene-open">
        <IrisOpening lines={['작가의 손에서 나온 것을,', '그대로.']} />
      </section>

      <section id="scene-why">
        {driftImages.length > 0 && <DriftGallery images={driftImages} paragraphs={WHY} />}
      </section>

      {/* ── 세 단계 ─────────────────────────────────────────── */}
      <section id="scene-tiers" className="px-5 md:px-12 py-28 md:py-40 bg-[#F7F5FA]">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <p className="text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-koala-purple-light mb-5">
              What we sell
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 break-keep max-w-3xl leading-[1.3]">
              같은 작가의 작품이라도 무게가 다릅니다.
            </h2>
            <p className="mt-5 text-sm md:text-lg text-gray-500 break-keep max-w-2xl leading-relaxed">
              어느 쪽인지 흐리지 않습니다. 세 가지로 나누어 작품 사진 위에 그대로 적습니다.
            </p>
          </Reveal>

          <div className="mt-14 md:mt-20 grid gap-px bg-gray-200 md:grid-cols-3 border border-gray-200">
            {TIERS.map((tier, i) => {
              /* 세 칸이 같은 색을 입으면 등급을 나눈다는 이 섹션의 말과 화면이
                 어긋난다. 금색은 첫 칸에만 두고 테두리로 한 번 더 짚는다 —
                 상품 카드에서 원작만 금색인 규칙이 여기서 설명된다. */
              const original = i === 0;
              return (
              <Reveal
                key={tier.no}
                index={i}
                className={`bg-[#F7F5FA] ${
                  original ? 'shadow-[inset_0_0_0_1px_rgba(199,161,90,0.55)]' : ''
                }`}
              >
                <div className="h-full p-7 md:p-9">
                  <span
                    className={`block text-[11px] font-bold tracking-[0.22em] tabular-nums ${
                      original ? 'text-koala-gold-text' : 'text-koala-purple-light'
                    }`}
                  >
                    {tier.no}
                  </span>
                  <h3 className="mt-5 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-xs font-bold tracking-[0.14em] uppercase text-gray-400">
                    {tier.en}
                  </p>
                  <p className="mt-5 text-sm md:text-base text-gray-600 leading-[1.85] break-keep">
                    {tier.body}
                  </p>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 작가 ────────────────────────────────────────────── */}
      <section id="scene-artists" className="py-28 md:py-40 overflow-hidden">
        <div className="px-5 md:px-12">
          <div className="max-w-[1200px] mx-auto">
            <Reveal>
              <p className="text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-koala-purple-light mb-5">
                Artists
              </p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 break-keep leading-[1.3]">
                지금 KOALA와 함께하는 작가들
              </h2>
              <p className="mt-6 text-sm md:text-base text-gray-500">
                옆으로 밀어 돌려 보세요.
              </p>
            </Reveal>
          </div>
        </div>

        {/* 바퀴는 화면 전체 폭을 쓴다. 컨테이너 안에 가두면 가장자리 카드가 잘린다. */}
        <div className="mt-10 md:mt-14">
          <ArtistWheel artists={artists} />
        </div>
      </section>

    </main>
  );
}
