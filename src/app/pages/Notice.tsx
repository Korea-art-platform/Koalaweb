import { useState, useEffect } from 'react';
import Navigation from '@/app/components/layouts/Header';
import { Bell, Pin, ChevronDown, ChevronUp } from 'lucide-react';
import { getNotices, type NoticeItem } from '@/api/notice';

export default function Notice() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getNotices()
      .then((res) => setNotices(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (code: string) =>
    setExpanded((prev) => (prev === code ? null : code));

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Notice</p>
          <h1 className="text-3xl font-bold tracking-tight">공지사항</h1>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">아직 등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notices.map((n) => (
              <div key={n.noticeCode} className="py-4">
                <button
                  onClick={() => toggle(n.noticeCode)}
                  className="w-full flex items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {n.isPinned && <Pin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
                    <span className="font-medium text-gray-900 text-sm truncate">{n.title}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    {expanded === n.noticeCode
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>
                {expanded === n.noticeCode && (
                  <div className="mt-3 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg px-4 py-3">
                    {n.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
