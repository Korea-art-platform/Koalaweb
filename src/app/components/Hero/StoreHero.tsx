import { useTranslation } from 'react-i18next';

interface StoreHeroProps {
  artistCount: number;
  /** 지금 조건에 맞는 작품 수. 아직 모르면 null */
  total: number | null;
}

// 스토어 머리 — 왼쪽 제목, 오른쪽 작가 수·작품 수
export default function StoreHero({ artistCount, total }: StoreHeroProps) {
  const { t } = useTranslation();

  return (
    <section data-hero="light" className="mx-auto max-w-[1320px] px-5 pt-28 pb-6 md:px-10 md:pt-36 md:pb-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#856EA6] md:text-[11px]">
            {t('store.hero.badge')}
          </p>
          <h1 className="font-serif-ko mt-2 text-[28px] font-bold leading-tight text-gray-900 md:mt-3 md:text-[40px]">
            {t('store.hero.title')}
          </h1>
          <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-gray-500 break-keep md:mt-3 md:text-sm">
            {t('store.hero.description')}
          </p>
        </div>
        {(artistCount > 0 || total != null) && (
          <p className="text-[13px] text-gray-500 md:text-right">
            {artistCount > 0 && <>작가 <b className="font-semibold text-gray-900">{artistCount}명</b></>}
            {artistCount > 0 && total != null && <span className="mx-2 text-gray-300">·</span>}
            {total != null && <>작품 <b className="font-semibold tabular-nums text-gray-900">{total}점</b></>}
          </p>
        )}
      </div>
    </section>
  );
}
