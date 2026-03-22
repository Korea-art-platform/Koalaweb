import { Link, useNavigate } from 'react-router';
import { User, MapPin, CreditCard, Package, Heart, Settings, LogOut } from 'lucide-react';

const menuItems = [
    { icon: User, label: '프로필 설정', path: '/account' },
    { icon: Package, label: '주문 내역', path: '/account/orders' },
    { icon: MapPin, label: '배송지 관리', path: '/account/addresses' },
    { icon: CreditCard, label: '결제 수단', path: '/account/payment-methods' },
    { icon: Heart, label: '위시리스트', path: '/account/wishlist' },
    { icon: Settings, label: '알림 설정', path: '/account/settings' },
];

interface Props {
    currentPath: string;
    user: any;
}

export default function AccountSidebar({ currentPath, user }: Props) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('cart-updated'));
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.slice(0, 2).toUpperCase()
        : 'KA';

    return (
        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-28">
            {/* 유저 프로필 */}
            <div className="flex items-center gap-4 pb-4 md:pb-6 mb-4 md:mb-6 border-b border-gray-100">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-black flex items-center justify-center text-white font-bold text-sm">
                    {initials}
                </div>
                <div className="overflow-hidden">
                    <p className="font-bold text-gray-900 text-sm md:text-base">{user?.name ?? '사용자'}님</p>
                    <p className="text-[10px] md:text-[11px] text-gray-400 font-mono truncate">{user?.email ?? ''}</p>
                </div>
            </div>

            {/* 메뉴 */}
            <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl transition-all whitespace-nowrap ${isActive
                                    ? 'bg-black text-white font-bold'
                                    : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs md:text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* 로그아웃 */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 mt-6 w-full text-gray-400 hover:text-red-500 transition-colors border-t border-gray-100 pt-6 font-bold"
            >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">로그아웃</span>
            </button>
        </div>
    );
}