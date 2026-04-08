import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import koalaKo from '@/locales/ko/koala.json';

const resources = {
  ko: {
    translation: koalaKo,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko', 
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;