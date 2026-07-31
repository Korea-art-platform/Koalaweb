import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import type { NoticeItem } from '@/api/notice';

interface Props {
  notices: NoticeItem[];
}

/** 005 — 공지사항 (최신 3건). 등록된 공지가 없으면 숨긴다. */
export default function HomeNotices({ notices }: Props) {
  if (notices.length === 0) return null;

  return (
    <section className="px-4 md:px-12 py-12 md:py-24">
      <div className="max-w-[1800px] mx-auto">
        <SectionHeader
          num="005"
          eyebrow="News"
          title="공지사항"
          viewAllHref="/notice"
        />

        <div className="flex flex-col border-t border-gray-200">
          {notices.slice(0, 3).map((n) => (
            <Link
              key={n.noticeCode}
              to={`/notice/${n.noticeCode}`}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-8 border-b border-gray-200 px-1 md:px-2 py-4 md:py-6 hover:bg-gray-50 transition-colors"
            >
              <span className="text-[11px] md:text-xs font-bold tabular-nums text-gray-400 whitespace-nowrap">
                {new Date(n.createdAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })}
              </span>
              <span className="flex flex-col gap-1 min-w-0">
                <span className="flex items-center gap-2 min-w-0">
                  {n.isPinned && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded bg-koala-purple text-white text-[9px] font-bold">
                      중요
                    </span>
                  )}
                  <span className="text-sm md:text-base font-bold text-gray-900 truncate group-hover:text-koala-purple transition-colors">
                    {n.title}
                  </span>
                </span>
              </span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-koala-purple group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
