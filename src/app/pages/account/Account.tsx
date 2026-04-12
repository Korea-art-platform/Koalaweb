import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import { useTranslation } from 'react-i18next';
import { updateMyProfile } from '@/api/user';
import { getMyOrders } from '@/api/order';
import { getWishlist } from '@/api/wishlist';

export default function Account() {
  const { t } = useTranslation();
  const { user, setUser } = useOutletContext<{ user: any; setUser: any }>();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' });
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, wishlistRes] = await Promise.all([getMyOrders(0, 1), getWishlist(0, 1)]);
        setStats({
          orders: ordersRes.data.data.totalElements ?? 0,
          wishlist: wishlistRes.data.data.totalElements ?? 0,
        });
      } catch (e) {
        console.error('Stats loading failed', e);
      }
    };
    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateMyProfile(form);
      setUser(res.data.data);
      alert(t('account.profile.saveSuccess'));
    } catch (e) {
      alert(t('account.profile.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl mb-8">{t('account.profile.title')}</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-2 text-gray-700">{t('account.profile.nameLabel')}</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-gray-700">{t('account.profile.emailLabel')}</label>
            <input type="email" value={user?.email ?? ''} readOnly className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl text-gray-400 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">{t('account.profile.emailReadOnly')}</p>
          </div>
          <div>
            <label className="block text-sm mb-2 text-gray-700">{t('account.profile.phoneLabel')}</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t('account.profile.phonePlaceholder')} className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300" />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={saving} className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-900 disabled:opacity-50">{saving ? t('account.profile.saving') : t('account.profile.saveButton')}</button>
            <button type="button" onClick={() => setForm({ name: user?.name ?? '', phone: user?.phone ?? '' })} className="px-8 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">{t('account.profile.cancel')}</button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-light mb-2">{stats.orders}</p>
          <p className="text-xs text-gray-400">{t('account.profile.stats.totalOrders')}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-light mb-2">{stats.wishlist}</p>
          <p className="text-xs text-gray-400">{t('account.profile.stats.wishlistItems')}</p>
        </div>
      </div>
    </>
  );
}