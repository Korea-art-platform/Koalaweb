import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import koalaKo from '@/locales/ko/koala.json';
import koalaEn from '@/locales/en/koala.json';

export const LANGUAGES = ['ko', 'en'];
export const LANGUAGE_STORAGE_KEY = 'koala.lang';

function savedLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return LANGUAGES.includes(saved) ? saved : null;
  } catch {
    return null;
  }
}

function browserLanguage() {
  const tag = typeof navigator === 'undefined' ? '' : navigator.language || '';
  return tag.toLowerCase().startsWith('en') ? 'en' : 'ko';
}

function remember(lng) {
  const base = LANGUAGES.includes(lng) ? lng : 'ko';
  if (typeof document !== 'undefined') document.documentElement.lang = base;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, base);
  } catch {
    /* 저장이 막힌 브라우저에서도 화면은 그대로 동작한다 */
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: koalaKo },
      en: { translation: koalaEn },
    },
    lng: savedLanguage() ?? browserLanguage(),
    fallbackLng: 'ko',
    supportedLngs: LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
  });

remember(i18n.language);
i18n.on('languageChanged', remember);

export default i18n;
