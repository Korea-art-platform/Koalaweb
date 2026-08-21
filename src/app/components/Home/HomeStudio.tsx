import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { Banner } from '@/api/types';
import BannerMedia from '@/app/components/common/BannerMedia';

interface Props {
  banner: Banner | null;
}

export default function HomeStudio({ banner }: Props) {
  const title = '작가의 공방에서';
  const description =
    '흙을 빚고 색을 입히는 손끝에서 작품이 태어납니다. 작가가 머무는 공간과 그 과정을 소개합니다.';
  const linkUrl = '/artist-lab';
  const imageUrl = banner?.imageUrl ?? null;
  const videoUrl = banner?.videoUrl ?? null;

  return (
    <section className="px-4 md:px-12 pt-12 md:pt-24">
      <div className="max-w-[1800px] mx-auto">
        <Link
          to={linkUrl}
          className="group block rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 hover:border-koala-purple transition-colors duration-500"
        >
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[260px] md:min-h-[420px] bg-koala-purple overflow-hidden">
              {imageUrl || videoUrl ? (
                <BannerMedia
                  imageUrl={imageUrl}
                  videoUrl={videoUrl}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-koala-purple to-koala-purple-light">
                  <img src="/logo-symbol-white.svg" alt="" className="w-24 h-24 opacity-20" />
                </div>
              )}
            </div>
            <div className="relative overflow-hidden flex flex-col justify-center bg-gray-50 p-8 md:p-14">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                style={{ background: 'linear-gradient(120deg, #3E2259 0%, #533274 46%, #7c5a86 72%, #b58f4e 100%)' }}
              />
              <div className="relative z-10 flex flex-col gap-4 md:gap-6">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.24em] text-koala-gold-deep transition-colors duration-500 group-hover:text-koala-gold-soft">
                  + 004 — Studio
                </span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 break-keep transition-colors duration-500 group-hover:text-white">
                  {title}
                </h2>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed break-keep max-w-md transition-colors duration-500 group-hover:text-white/80">
                  {description}
                </p>
                <span className="mt-2 self-start inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-koala-purple text-white text-sm font-bold transition-colors duration-500 group-hover:bg-white group-hover:text-koala-purple">
                  작가 만나보기
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
