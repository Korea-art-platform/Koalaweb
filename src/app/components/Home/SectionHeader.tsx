import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  eyebrow: string;

  title: string;

  sub?: string;

  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  sub,
  viewAllHref,
  viewAllLabel = '전체보기',
}: SectionHeaderProps) {
  return (
    <div className="mb-6 md:mb-10 flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-1.5 md:gap-2.5">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.24em] text-koala-purple-light">
          + {eyebrow}
        </span>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>
        {sub && <p className="text-xs md:text-base text-gray-500 font-medium break-keep">{sub}</p>}
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="flex items-center gap-1.5 border-b-2 border-gray-900 pb-1 text-xs md:text-sm font-bold text-gray-900 hover:text-koala-purple hover:border-koala-purple transition-colors"
        >
          {viewAllLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
