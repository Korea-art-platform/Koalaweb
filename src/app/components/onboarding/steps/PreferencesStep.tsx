import { Heart, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PREFERENCE_KEYS = ['artworks', 'designToys', 'limitedEditions', 'collaborations'] as const;
type PrefKeys = typeof PREFERENCE_KEYS[number];

interface Props {
  preferences: Record<PrefKeys, boolean>;
  onChange: (prefs: Record<PrefKeys, boolean>) => void;
  onNext: () => void;
  onSkip: () => void;
}

export default function PreferencesStep({ preferences, onChange, onNext, onSkip }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
      <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
        <Heart className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-3xl font-medium tracking-tight mb-3">{t('auth.onboarding.preferences.title')}</h2>
      <p className="text-gray-400 mb-8">{t('auth.onboarding.preferences.desc')}</p>
      <div className="space-y-3 mb-8">
        {PREFERENCE_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => onChange({ ...preferences, [key]: !preferences[key] })}
            className={`w-full p-5 rounded-xl border-2 transition-all text-left ${preferences[key] ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{t(`onboarding.preferences.items.${key}.label`)}</div>
                <div className="text-sm text-gray-400">{t(`onboarding.preferences.items.${key}.desc`)}</div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${preferences[key] ? 'border-black bg-koala-navy' : 'border-gray-200'}`}>
                {preferences[key] && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={onSkip} className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          {t('auth.onboarding.preferences.skip')}
        </button>
        <button onClick={onNext} className="flex-1 py-4 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors font-medium">
          {t('auth.onboarding.preferences.next')}
        </button>
      </div>
    </div>
  );
}
