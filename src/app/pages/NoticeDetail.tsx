import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Pin } from 'lucide-react';
import { getNotice, type NoticeItem } from '@/api/notice';
import { noticeToSafeHtml } from '@/app/lib/html';

export default function NoticeDetail() {
  const { noticeCode } = useParams<{ noticeCode: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<NoticeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!noticeCode) return;
    getNotice(noticeCode)
      .then((res) => setNotice(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [noticeCode]);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Helmet>
        <title>{notice ? `${notice.title} — KOALA` : '공지사항 — KOALA'}</title>
      </Helmet>
      <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/notice')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          공지사항 목록
        </button>

        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : notFound || !notice ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm mb-4">존재하지 않는 공지사항입니다.</p>
            <button
              onClick={() => navigate('/notice')}
              className="text-sm text-black underline"
            >
              목록으로 돌아가기
            </button>
          </div>
        ) : (
          <article>
            <div className="mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                {notice.isPinned && (
                  <span className="inline-flex items-center gap-1 text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                    <Pin className="w-3 h-3" />
                    중요
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-gray-900 leading-snug mb-3">
                {notice.title}
              </h1>
              <p className="text-xs text-gray-400">
                {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div
              className="koala-prose"
              dangerouslySetInnerHTML={{ __html: noticeToSafeHtml(notice.content) }}
            />
          </article>
        )}
      </div>
    </div>
  );
}
