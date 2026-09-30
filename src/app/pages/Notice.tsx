import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Bell, Pin, ChevronRight } from 'lucide-react';
import { getNotices, type NoticeItem } from '@/api/notice';
import { useTranslation } from 'react-i18next';
import i18n from '@/locales/i18n';

export default function NoticeList() {
  const { t } = useTranslation();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getNotices()
      .then((res) => setNotices(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1">
      <Helmet>
        <title>{t('notice.metaTitle')}</title>
        <meta name="description" content={t('notice.metaDescription')} />
      </Helmet>
      <div className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Notice</p>
          <h1 className="text-3xl font-bold tracking-tight">{t('notice.title')}</h1>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">{t('common.loading')}</div>
        ) : notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">{t('notice.empty')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notices.map((n) => (
              <button
                key={n.noticeCode}
                onClick={() => navigate(`/notice/${n.noticeCode}`)}
                className="w-full py-4 flex items-center justify-between gap-3 text-left hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {n.isPinned && (
                    <Pin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                  )}
                  <span className="font-medium text-gray-900 text-sm truncate">
                    {n.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleDateString(i18n.language)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
