import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import Navigation from '@/app/components/layouts/Header';
import AccountSidebar from '@/app/components/layouts/AccountSidebar';
import { getMyProfile } from '@/api/user';
import { useAuth } from '@/app/context/AuthContext';

export default function AccountLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthenticated } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMyProfile();
        setUser(res.data.data);
      } catch (e: any) {
        if (e.response?.status === 401 || e.response?.status === 403) {
          setAuthenticated(false);
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

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
      <div className="pt-24 md:pt-32 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{t('account.title')}</h1>
            <p className="text-xs md:text-sm text-gray-400 font-medium">{t('account.description')}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <AccountSidebar currentPath={location.pathname} user={user} />
            </div>
            <div className="lg:col-span-3">
              {/* 🌟 자식 컴포넌트들에게 공통 user 데이터를 넘겨줍니다 */}
              <Outlet context={{ user, setUser }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}