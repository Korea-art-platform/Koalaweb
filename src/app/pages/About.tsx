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
import { useIsEnglish } from '@/app/lib/lang';
import { useTranslation } from 'react-i18next';

const SCENES: Scene[] = [
  { id: 'scene-open', label: 'Opening' },
  { id: 'scene-why', label: 'Why' },
  { id: 'scene-tiers', label: 'Tiers' },
  { id: 'scene-artists', label: 'Artists' },
];

const WHY: string[][] = [
  ['about.why.a1', 'about.why.a2', 'about.why.a3'],
  ['about.why.b1', 'about.why.b2', 'about.why.b3'],
  ['about.why.c1'],
];

const TIERS = [
  {
    no: '000',
    key: 'original',
    en: 'Original',
  },
  {
    no: '001',
    key: 'limited',
    en: 'Limited',
  },
  {
    no: '002',
    key: 'open',
    en: 'Open Edition',
  },
];


export default function About() {
  const { t } = useTranslation();
  const english = useIsEnglish();
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
        <title>{t('about.metaTitle')}</title>
        <meta
          name="description"
          content={t('about.metaDescription')}
        />
      </Helmet>

      <SceneNav scenes={SCENES} />

      <section id="scene-open">
        <IrisOpening lines={[t('about.iris1'), t('about.iris2')]} />
      </section>

      <section id="scene-why">
        {driftImages.length > 0 && <DriftGallery images={driftImages} paragraphs={WHY.map((p) => p.map((k) => t(k)))} />}
      </section>

      {/* ── 세 단계 ─────────────────────────────────────────── */}
      <section id="scene-tiers" className="px-5 md:px-12 py-28 md:py-40 bg-[#F7F5FA]">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <p className="text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-koala-purple-light mb-5">
              What we sell
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 break-keep max-w-3xl leading-[1.3]">
              {t('about.tiersHeading')}
            </h2>
            <p className="mt-5 text-sm md:text-lg text-gray-500 break-keep max-w-2xl leading-relaxed">
              {t('about.tiersDesc')}
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
                    {t(`about.tiers.${tier.key}.name`)}
                  </h3>
                  {!english && (
                  <p className="mt-1 text-xs font-bold tracking-[0.14em] uppercase text-gray-400">
                    {tier.en}
                  </p>
                  )}
                  <p className="mt-5 text-sm md:text-base text-gray-600 leading-[1.85] break-keep">
                    {t(`about.tiers.${tier.key}.body`)}
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
                {t('about.artistsHeading')}
              </h2>
              <p className="mt-6 text-sm md:text-base text-gray-500">
                {t('about.artistsHint')}
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
