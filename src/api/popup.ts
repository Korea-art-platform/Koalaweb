import instance from './instance';
import type { PopupLanguage, PublicPopup } from './types';

export async function getPopups(lang: PopupLanguage, page: 'home' | 'other'): Promise<PublicPopup[]> {
  const res = await instance.get('/api/v1/popups', { params: { lang, page } });
  return (res.data?.data ?? []) as PublicPopup[];
}
