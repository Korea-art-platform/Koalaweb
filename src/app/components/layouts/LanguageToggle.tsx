import { useTranslation } from 'react-i18next';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const current = i18n.language?.startsWith('en') ? 'en' : 'ko';
  const next = current === 'ko' ? 'en' : 'ko';

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(next)}
      aria-label={`${t('header.language.switch')} — ${t(`header.language.${next}`)}`}
      title={t('header.language.switch')}
      className={`text-xs font-bold tracking-wide tabular-nums ${className}`}
    >
      <span aria-hidden>{current.toUpperCase()}</span>
      <span aria-hidden className="mx-1 opacity-40">/</span>
      <span aria-hidden className="opacity-40">{next.toUpperCase()}</span>
    </button>
  );
}

export function LanguageChoice({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const current = i18n.language?.startsWith('en') ? 'en' : 'ko';

  return (
    <div
      role="group"
      aria-label={t('header.language.switch')}
      className={`flex items-center gap-1 rounded-full bg-gray-100 p-1 ${className}`}
    >
      {(['ko', 'en'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => i18n.changeLanguage(lang)}
          aria-pressed={current === lang}
          className={`flex h-11 min-w-[72px] items-center justify-center rounded-full px-3 text-sm font-bold transition-colors ${
            current === lang ? 'bg-white text-black shadow-sm' : 'text-gray-500'
          }`}
        >
          {t(`header.language.${lang}`)}
        </button>
      ))}
    </div>
  );
}
