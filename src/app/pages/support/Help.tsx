import { useNavigate } from 'react-router';
import { ArrowLeft, MessageSquare, Truck, RotateCcw, HelpCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import PageMeta from '@/app/components/common/PageMeta';
import { useTranslation } from 'react-i18next';

const HELP_SECTIONS = [
  {
    icon: HelpCircle,
    key: 'faq',
    path: '/faq',
  },
  {
    icon: Truck,
    key: 'shipping',
    path: '/shipping',
  },
  {
    icon: RotateCcw,
    key: 'returns',
    path: '/returns',
  },
  {
    icon: MessageSquare,
    key: 'contact',
    path: '/contact',
  },
];

export default function Help() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex-1 pt-20">
      <PageMeta title={t('support.help.metaTitle')} />
      <div className="sticky top-20 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">{t('support.help.title')}</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <div className="space-y-1">
          <p className="text-xl font-bold text-gray-900">{t('support.help.heading')}</p>
          <p className="text-sm text-gray-500">
            {t('support.help.hours')}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {HELP_SECTIONS.map(({ icon: Icon, key, path }) => (
            <Link
              key={path}
              to={path}
              className="group border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-sm transition-all space-y-4"
            >
              <div className="w-10 h-10 bg-gray-50 group-hover:bg-koala-navy rounded-xl flex items-center justify-center transition-colors">
                <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900">{t(`support.help.sections.${key}.title`)}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{t(`support.help.sections.${key}.desc`)}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-black transition-colors">
                {t(`support.help.sections.${key}.cta`)}
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 mb-0.5">{t('support.help.phoneTitle')}</p>
            <p className="text-xs text-gray-500">{t('support.help.phoneHours')}</p>
          </div>
          <a
            href="tel:18332817"
            className="flex-shrink-0 px-5 py-2.5 bg-koala-navy text-white text-xs font-bold rounded-xl hover:bg-koala-navy-hover transition-colors"
          >
            1833-2817
          </a>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 mb-0.5">{t('support.help.emailTitle')}</p>
            <p className="text-xs text-gray-500">{t('support.help.emailNote')}</p>
          </div>
          <a
            href="mailto:koala-art@heron.kr"
            className="flex-shrink-0 px-5 py-2.5 bg-koala-navy text-white text-xs font-bold rounded-xl hover:bg-koala-navy-hover transition-colors"
          >
            koala-art@heron.kr
          </a>
        </div>
      </div>
    </div>
  );
}
