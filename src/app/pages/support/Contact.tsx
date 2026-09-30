import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import PageMeta from '@/app/components/common/PageMeta';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex-1 pt-20">
      <PageMeta title={t('support.contact.metaTitle')} description={t('support.contact.metaDescription')} />
      <div className="sticky top-20 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">{t('support.contact.title')}</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('support.contact.introBefore')}
            <Link to="/faq" className="text-black underline underline-offset-2">{t('support.contact.introLink')}</Link>
            {t('support.contact.introAfter')}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-gray-100 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-koala-navy rounded-xl flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('support.contact.emailLabel')}</p>
                <p className="text-sm font-bold text-gray-900">koala-art@heron.kr</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t('support.contact.emailNote')}
            </p>
            <a
              href="mailto:koala-art@heron.kr"
              className="block w-full py-2.5 bg-koala-navy text-white text-xs font-bold rounded-xl text-center hover:bg-koala-navy-hover transition-colors"
            >
              {t('support.contact.sendEmail')}
            </a>
          </div>
          <div className="border border-gray-100 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t('support.contact.hoursLabel')}</p>
                <p className="text-sm font-bold text-gray-900">{t('support.contact.hours')}</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p>{t('support.contact.lunch')}</p>
              <p>{t('support.contact.weekend')}</p>
              <p className="text-gray-400 pt-1">{t('support.contact.afterHours')}</p>
            </div>
          </div>
        </div>
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">{t('support.contact.tipsTitle')}</h2>
          <div className="space-y-3">
            {[
              {
                icon: MessageSquare,
                title: t('support.contact.tips.order.title'),
                desc: t('support.contact.tips.order.desc'),
              },
              {
                icon: MessageSquare,
                title: t('support.contact.tips.delivery.title'),
                desc: t('support.contact.tips.delivery.desc'),
              },
              {
                icon: MessageSquare,
                title: t('support.contact.tips.account.title'),
                desc: t('support.contact.tips.account.desc'),
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-800 mb-0.5">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">{t('support.contact.relatedTitle')}</h2>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {[
              { label: t('support.contact.related.faq'), path: '/faq' },
              { label: t('support.contact.related.shipping'), path: '/shipping' },
              { label: t('support.contact.related.returns'), path: '/returns' },
            ].map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">{label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </section>
        <div className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          {t('support.contact.partnerBefore')}<a href="mailto:koala-art@heron.kr" className="underline underline-offset-2 hover:text-black transition-colors">koala-art@heron.kr</a>{t('support.contact.partnerAfter')}
        </div>
      </div>
    </div>
  );
}
