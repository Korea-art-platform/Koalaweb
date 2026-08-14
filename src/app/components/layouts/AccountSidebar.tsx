import { Link, useNavigate } from 'react-router';
import { User, MapPin, CreditCard, Package, Heart, LogOut, Settings, MessageCircle } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/context/AuthContext';
import { logout as logoutApi } from '@/api/auth';

const menuItems = [
  { icon: User, key: 'account.sidebar.profile', path: '/account' },
  { icon: Package, key: 'account.sidebar.orders', path: '/account/orders' },
  { icon: MapPin, key: 'account.sidebar.addresses', path: '/account/addresses' },

  { icon: Heart, key: 'account.sidebar.wishlist', path: '/account/wishlist' },
  { icon: MessageCircle, key: 'account.sidebar.inquiry', path: '/account/inquiry' },
  { icon: Settings, key: 'account.sidebar.settings', path: '/account/settings' },
];

interface Props {
  currentPath: string;
  user: any;
}

export default function AccountSidebar({ currentPath, user }: Props) {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { setAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
    } finally {
      setAuthenticated(false);
      window.dispatchEvent(new Event('cart-updated'));
      navigate('/login');
    }
  };

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : 'KA';

  const displayUserName = user?.name ?? (t('account.sidebar.defaultUser') as string);

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-28">
      <div className="flex items-center gap-4 pb-4 md:pb-6 mb-4 md:mb-6 border-b border-gray-100">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-koala-navy flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-gray-900 text-sm md:text-base">
            {t('account.sidebar.greeting', { name: displayUserName }) as string}
          </p>
          <p className="text-[10px] md:text-[11px] text-gray-400 font-mono truncate">
            {user?.email ?? ''}
          </p>
        </div>
      </div>
      <nav className="grid grid-cols-2 lg:flex lg:flex-col gap-1.5 lg:gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 rounded-xl transition-all whitespace-nowrap min-h-[44px] ${
                isActive
                  ? 'bg-koala-navy text-white font-bold'
                  : 'text-gray-400 hover:text-black hover:bg-gray-50'
              }`} >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs md:text-sm">{t(item.key) as string}</span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 mt-4 md:mt-6 w-full text-gray-400 hover:text-red-500 transition-colors border-t border-gray-100 pt-4 md:pt-6 font-bold min-h-[44px]" >
        <LogOut className="w-4 h-4" />
        <span className="text-sm">{t('account.sidebar.logout') as string}</span>
      </button>
    </div>
  );
}
