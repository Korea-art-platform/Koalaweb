import { User, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation('koala');
  return (
    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mx-auto mb-6">
        <User className="w-10 h-10 text-gray-400" />
      </div>
      <h1 className="text-4xl font-medium tracking-tight mb-4">{t('onboarding.welcome.title')}</h1>
      <p className="text-gray-400 leading-relaxed mb-8 max-w-md mx-auto">{t('onboarding.welcome.desc')}</p>
      <button onClick={onNext} className="inline-flex items-center gap-2 px-10 py-4 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-all active:scale-95">
        {t('onboarding.welcome.start')}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}