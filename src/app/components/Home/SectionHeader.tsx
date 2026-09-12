import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  eyebrow: string;

  title: string;

  sub?: string;

  viewAllHref?: string;
  viewAllLabel?: string;

  // 짙은 바탕 섹션용 — 글자를 밝은 쪽으로
  dark?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  sub,
  viewAllHref,
  viewAllLabel = '전체보기',
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 md:mb-10 flex flex-wrap items-end justify-between gap-3">
      {/* 설명이 길어도 전체보기 링크가 아랫줄로 밀리지 않게 글 칸이 줄어든다 */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2.5">
        <span
          className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.24em] ${
            dark ? 'text-koala-purple-lighter' : 'text-koala-purple-light'
          }`}
        >
          + {eyebrow}
        </span>
        <h2 className={`text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
        {sub && (
          <p className={`text-xs md:text-base font-medium break-keep ${dark ? 'text-white/60' : 'text-gray-500'}`}>{sub}</p>
        )}
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className={`flex shrink-0 items-center gap-1.5 border-b-2 pb-1 text-xs md:text-sm font-bold transition-colors ${
            dark
              ? 'border-white text-white hover:border-koala-purple-lighter hover:text-koala-purple-lighter'
              : 'border-gray-900 text-gray-900 hover:text-koala-purple hover:border-koala-purple'
          }`}
        >
          {viewAllLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
