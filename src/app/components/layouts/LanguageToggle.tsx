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
