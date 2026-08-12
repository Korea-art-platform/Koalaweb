import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { HOME_FAQS } from '@/data/faq';
import type { NoticeItem } from '@/api/notice';

interface Props {
  notices: NoticeItem[];
}

/**
 * 005 — 공지사항 + 자주 묻는 질문.
 * 좌: 최신 공지 3건(등록된 것만) / 우: 배송·교환반품 등 상시 FAQ.
 */
export default function HomeNotices({ notices }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const hasNotices = notices.length > 0;

  return (
    <section className="px-4 md:px-12 py-12 md:py-24">
      <div className="max-w-[1800px] mx-auto">
        <SectionHeader
          eyebrow="News & Help"
          title="공지사항 · 자주 묻는 질문"
          sub="새로운 소식과 자주 문의주시는 내용을 모았습니다"
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── 좌: 공지사항 ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm md:text-base font-bold text-gray-900">공지사항</h3>
              <Link
                to="/notice"
                className="text-xs font-bold text-gray-400 hover:text-koala-purple transition-colors"
              >
                전체보기 +
              </Link>
            </div>

            {hasNotices ? (
              <div className="flex flex-col border-t border-gray-200">
                {notices.slice(0, 3).map((n) => (
                  <Link
                    key={n.noticeCode}
                    to={`/notice/${n.noticeCode}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-5 border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[11px] font-bold tabular-nums text-gray-400 whitespace-nowrap">
                      {new Date(n.createdAt).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                    </span>
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
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-koala-purple group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border-t border-gray-200 py-10 text-center text-sm text-gray-400">
                등록된 공지사항이 없습니다.
              </div>
            )}
          </div>

          {/* ── 우: 자주 묻는 질문 ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm md:text-base font-bold text-gray-900">자주 묻는 질문</h3>
              <Link
                to="/faq"
                className="text-xs font-bold text-gray-400 hover:text-koala-purple transition-colors"
              >
                전체보기 +
              </Link>
            </div>

            <div className="flex flex-col border-t border-gray-200">
              {HOME_FAQS.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={item.q} className="border-b border-gray-200">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-start justify-between gap-3 py-4 text-left group"
                    >
                      <span className="flex items-start gap-2.5 min-w-0">
                        <span className="text-koala-purple font-bold text-sm shrink-0">Q</span>
                        <span className={`text-sm md:text-base font-bold transition-colors ${isOpen ? 'text-koala-purple' : 'text-gray-900 group-hover:text-koala-purple'}`}>
                          {item.q}
                        </span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 mt-0.5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden min-h-0">
                        <p className="pl-6 pr-8 pb-4 text-xs md:text-sm text-gray-500 leading-relaxed break-keep">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
