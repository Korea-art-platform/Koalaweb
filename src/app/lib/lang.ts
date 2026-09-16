import { useTranslation } from 'react-i18next';

export function useIsEnglish(): boolean {
  const { i18n } = useTranslation();
  return Boolean(i18n.language?.toLowerCase().startsWith('en'));
}
