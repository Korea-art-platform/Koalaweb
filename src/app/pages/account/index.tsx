import { useLocation, useNavigate } from 'react-router';
import Navigation from '../../components/layouts/Header';
import AccountSidebar from '../../components/layouts/AccountSidebar';
import { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile } from '../../../api/user';
import { getMyOrders } from '../../../api/order';
import { getWishlist } from '../../../api/wishlist';

export default function Account() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [stats, setStats] = useState({ orders: 0, wishlist: 0 });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes, wishlistRes] = await Promise.all([
          getMyProfile(),
          getMyOrders(0, 1),
          getWishlist(0, 1),
        ]);
        const profile = profileRes.data.data;
        setUser(profile);
        setForm({ name: profile.name ?? '', phone: profile.phone ?? '' });
        setStats({
          orders: ordersRes.data.data.totalElements ?? 0,
          wishlist: wishlistRes.data.data.totalElements ?? 0,
        });
      } catch (e) {
        console.error('프로필 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateMyProfile(form);
      setUser(res.data.data);
      alert('저장되었습니다.');
    } catch (e) {
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navigation />
        <div className="pt-24 pb-16 px-8 animate-pulse">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="h-80 bg-white rounded-3xl" />
            <div className="lg:col-span-3 h-80 bg-white rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl tracking-tight mb-2">My Account</h1>
            <p className="text-sm text-gray-400">
              Manage your KoALa account and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <AccountSidebar currentPath={location.pathname} user={user} />
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl mb-8">프로필 정보</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* 이름 */}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">이름</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>

                  {/* 이메일 (읽기 전용) */}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">이메일</label>
                    <input
                      type="email"
                      value={user?.email ?? ''}
                      readOnly
                      className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">이메일은 변경할 수 없습니다.</p>
                  </div>

                  {/* 전화번호 */}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">전화번호</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="01012345678"
                      className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>

                  {/* 저장 버튼 */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
                    >
                      {saving ? '저장 중...' : '변경사항 저장'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ name: user?.name ?? '', phone: user?.phone ?? '' })}
                      className="px-8 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </form>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <p className="text-3xl font-light mb-2">{stats.orders}</p>
                  <p className="text-xs text-gray-400">Total Orders</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <p className="text-3xl font-light mb-2">{stats.wishlist}</p>
                  <p className="text-xs text-gray-400">Wishlist Items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
