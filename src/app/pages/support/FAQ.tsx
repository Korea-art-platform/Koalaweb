import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { faqsFor } from '@/data/faq';
import { useIsEnglish } from '@/app/lib/lang';
import PageMeta from '@/app/components/common/PageMeta';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const faqs = faqsFor(useIsEnglish());
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleCategoryChange = (idx: number) => {
    setActiveCategory(idx);
    setOpenIndex(null);
  };

  return (
    <div className="flex-1 pt-20">
      <PageMeta title={t('support.faq.title')} description={t('support.faq.metaDescription')} />
      <div className="sticky top-20 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">{t('support.faq.title')}</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-sm text-gray-500 mb-8">
          {t('support.faq.introBefore')}
          <a href="/contact" className="text-black underline underline-offset-2">{t('support.faq.introLink')}</a>{t('support.faq.introAfter')}
        </p>
        <div className="flex gap-2 flex-wrap mb-8">
          {faqs.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleCategoryChange(i)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === i
                  ? 'bg-koala-navy text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="divide-y divide-gray-100">
          {(faqs[activeCategory] ?? faqs[0]).items.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center py-5 text-left gap-4"
              >
                <span className="text-sm font-medium text-gray-900">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="pb-5 text-sm text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">{t('support.faq.moreTitle')}</p>
          <p className="text-xs text-gray-500 mb-4">{t('support.faq.moreHours')}</p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-koala-navy text-white text-xs font-bold rounded-xl hover:bg-koala-navy-hover transition-colors"
          >
            {t('support.faq.moreCta')}
          </a>
        </div>
      </div>
    </div>
  );
}
