import { Link, useLocation } from 'react-router';
import { Globe, ShoppingCart, User, Menu, X, Search, ChevronRight } from 'lucide-react';
import { ViewModeProvider, useViewMode } from '@/app/context/ViewModeContext';
import { useEffect, useState } from 'react';
import { getCart } from '@/api/cart';
import { useTranslation } from 'react-i18next'; // i18n 훅 추가

export function Header() {
  const { t } = useTranslation(); // 번역 함수 가져오기
  const location = useLocation();
  const { mode, setMode } = useViewMode();
  const [isHeroActive, setIsHeroActive] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPop, setIsPop] = useState(false);

  // 1. 장바구니 수량 업데이트 (API 기반)
  const updateCartCount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const res = await getCart();
        const items = res?.data?.data?.items ?? [];
        const total = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          const total = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      }
    } catch (e) {
      console.error('장바구니 조회 실패:', e);
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        const total = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      }
    }
  };

  // 2. 스크롤 감지 (Home Hero 섹션 대응)
  useEffect(() => {
    const updateHeaderState = () => {
      const isHome = location.pathname === '/';
      const hero = document.getElementById('home-hero');
      if (!isHome || !hero) {
        setIsHeroActive(false);
        return;
      }
      const heroRect = hero.getBoundingClientRect();
      setIsHeroActive(heroRect.bottom > 88);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState);
    window.addEventListener('resize', updateHeaderState);
    return () => {
      window.removeEventListener('scroll', updateHeaderState);
      window.removeEventListener('resize', updateHeaderState);
    };
  }, [location.pathname]);

  // 3. 장바구니 동기화
  useEffect(() => {
    updateCartCount();
    const handleCartUpdate = () => {
      updateCartCount();
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  // 4. 장바구니 애니메이션
  useEffect(() => {
    if (cartCount >= 0) {
      setIsPop(true);
      const timer = setTimeout(() => setIsPop(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // 스타일 변수
  const isTransparent = location.pathname === '/' && isHeroActive;
  const navBgClass = isTransparent
    ? 'bg-transparent border-transparent'
    : 'bg-white/95 border-b border-gray-100 backdrop-blur-sm shadow-sm';

  const logoClass = isTransparent ? 'text-white' : 'text-black';
  const iconClass = isTransparent ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-black';

  // 메뉴 리스트 (하드코딩된 이름 대신 다국어 key 사용)
  const menus = [
    { key: 'gallery', path: '/' },
    { key: 'lab', path: '/artist-lab' },
    { key: 'store', path: '/store' }
  ];

  return (
    <>
      {/* 상단 네비게이션 바 */}
      <nav className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isMenuOpen ? 'z-[110] bg-white' : 'z-50 ' + navBgClass}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center justify-between">

            {/* 로고 */}
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-bold tracking-tight z-[120] transition-colors ${isMenuOpen ? 'text-black' : logoClass}`}
            >
              {t('header.logo')}
            </Link>

            {/* [WEB] 중앙 메뉴 */}
            <div className="hidden lg:flex items-center gap-10">
              {menus.map((menu) => (
                <Link
                  key={menu.key}
                  to={menu.path}
                  className={`text-sm font-medium transition-colors ${location.pathname === menu.path
                    ? (isTransparent ? 'text-white' : 'text-black')
                    : (isTransparent ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-black')
                    }`}
                >
                  {t(`header.menus.${menu.key}`)}
                </Link>
              ))}
            </div>

            {/* 오른쪽 섹션 */}
            <div className="flex items-center gap-4 md:gap-6">
              <Search className={`hidden lg:block w-5 h-5 cursor-pointer ${iconClass}`} />

              {/* 장바구니 */}
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className={`relative z-[120] transition-transform ${isMenuOpen ? 'text-black' : iconClass} ${isPop ? 'scale-110' : 'scale-100'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${isMenuOpen ? 'bg-black text-white' : (isTransparent ? 'bg-white text-black' : 'bg-black text-white')
                    }`}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* [MOBILE] 햄버거 버튼 */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden z-[120] p-2 -mr-2 transition-colors ${isMenuOpen ? 'text-black' : iconClass}`}
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>

              <Link to="/account/orders" className={`hidden lg:block ${iconClass}`}>
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* [MOBILE] 드로어 메뉴 */}
      <div className={`fixed top-0 left-0 w-full h-[100dvh] z-[100] bg-white lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        style={{ transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out' }}
      >
        <div className="h-full w-full flex flex-col pt-32 pb-12 px-10 overflow-hidden">

          {/* 메뉴 링크 — flex-1 + min-h-0 으로 iOS Safari에서 올바르게 수축 */}
          <div className="flex-1 min-h-0 flex flex-col gap-6 md:gap-8 overflow-y-auto">
            {menus.map((menu, index) => (
              <Link
                key={menu.key}
                to={menu.path}
                className={`text-4xl font-black text-black tracking-tighter transition-all duration-500 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(`header.menus.${menu.key}`)}
              </Link>
            ))}
          </div>

          {/* 하단 마이페이지 & 글로벌 — flex-shrink-0 으로 항상 보임 */}
          <div className="flex-shrink-0 mt-8 space-y-8">
            <div className="grid grid-cols-4 gap-3">
              <Link
                to="/account/orders"
                className="col-span-3 flex items-center justify-between bg-black text-white p-5 rounded-2xl active:scale-95 transition-transform"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center gap-4">
                  <User className="w-5 h-5 text-white/60" />
                  <span className="text-lg font-bold">{t('header.myPage')}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40" />
              </Link>

              <button className="col-span-1 flex items-center justify-center bg-gray-100 rounded-2xl active:scale-95 transition-transform">
                <Globe className="w-6 h-6 text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Navigation() {
  return (
    <ViewModeProvider>
      <Header />
    </ViewModeProvider>
  );
}