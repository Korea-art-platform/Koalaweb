import { Link, useNavigate } from 'react-router';
import { User, MapPin, CreditCard, Package, Heart, LogOut } from 'lucide-react';
// 💡 1. 다국어 훅을 불러옵니다.
import { useTranslation } from 'react-i18next';

// 💡 2. label(한글) 대신 다국어 JSON의 경로가 될 key를 넣습니다.
const menuItems = [
  { icon: User, key: 'account.sidebar.profile', path: '/account' },
  { icon: Package, key: 'account.sidebar.orders', path: '/account/orders' },
  { icon: MapPin, key: 'account.sidebar.addresses', path: '/account/addresses' },
  { icon: CreditCard, key: 'account.sidebar.payment', path: '/account/payment-methods' },
  { icon: Heart, key: 'account.sidebar.wishlist', path: '/account/wishlist' },
];

interface Props {
  currentPath: string;
  user: any;
}

export default function AccountSidebar({ currentPath, user }: Props) {
  const navigate = useNavigate();
  // 💡 3. 번역 함수 t를 꺼냅니다.
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new Event('cart-updated'));
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : 'KA';

  // 💡 4. 이름이 없을 때 보여줄 기본값("사용자")도 다국어 처리합니다.
  const displayUserName = user?.name ?? (t('account.sidebar.defaultUser') as string);

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-28">
      {/* 유저 프로필 */}
      <div className="flex items-center gap-4 pb-4 md:pb-6 mb-4 md:mb-6 border-b border-gray-100">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-black flex items-center justify-center text-white font-bold text-sm">
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

      <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-black text-white font-bold'
                  : 'text-gray-400 hover:text-black hover:bg-gray-50'
              }`} >
              <Icon className="w-4 h-4" />
              <span className="text-xs md:text-sm">{t(item.key) as string}</span>
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 mt-6 w-full text-gray-400 hover:text-red-500 transition-colors border-t border-gray-100 pt-6 font-bold" >
        <LogOut className="w-4 h-4" />
        <span className="text-sm">{t('account.sidebar.logout') as string}</span>
      </button>
    </div>
  );
}