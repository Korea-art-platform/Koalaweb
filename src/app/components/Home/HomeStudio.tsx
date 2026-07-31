import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { Banner } from '@/api/types';

interface Props {
  /** MAIN_SUB 배너의 '이미지'만 사용한다 (공방 사진을 어드민에서 교체 가능하게) */
  banner: Banner | null;
}

/**
 * 004 — 작가의 공방.
 * 문구는 고정, 이미지는 어드민의 MAIN_SUB 배너에서 가져온다.
 * (배너 미등록 시 브랜드 플레이스홀더 표시 — 공방 사진 준비 전까지)
 */
export default function HomeStudio({ banner }: Props) {
  const title = '작가의 공방에서';
  const description =
    '흙을 빚고 색을 입히는 손끝에서 작품이 태어납니다. 작가가 머무는 공간과 그 과정을 소개합니다.';
  const linkUrl = '/artist-lab';
  const imageUrl = banner?.imageUrl ?? null;

  return (
    <section className="px-4 md:px-12 pt-12 md:pt-24">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid lg:grid-cols-2 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100">
          {/* 이미지 (좌) */}
          <div className="relative min-h-[260px] md:min-h-[420px] bg-koala-purple overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              /* 공방 사진 준비 전 — 브랜드 컬러 플레이스홀더 */
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-koala-purple to-koala-purple-light">
                <img src="/logo-symbol-white.svg" alt="" className="w-24 h-24 opacity-20" />
              </div>
            )}
          </div>

          {/* 내용 (우) */}
          <div className="flex flex-col justify-center gap-4 md:gap-6 bg-gray-50 p-8 md:p-14">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.24em] text-koala-purple">
              + 004 — Studio
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 break-keep">
              {title}
            </h2>
            <p className="text-sm md:text-base text-gray-500 leading-relaxed break-keep max-w-md">
              {description}
            </p>
            <Link
              to={linkUrl}
              className="mt-2 self-start inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-koala-purple text-white text-sm font-bold hover:bg-koala-purple-hover transition-colors"
            >
              작가 만나보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
