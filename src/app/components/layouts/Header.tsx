import { Link, useLocation, useNavigate } from 'react-router';
import {
  ShoppingCart, User, Menu, X, Search,
  ChevronRight, LogOut, Settings, Bell, Headset
} from 'lucide-react';
import { ViewModeProvider } from '@/app/context/ViewModeContext';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CART_QUERY_KEY } from '@/app/hooks/useCart';
import { getCart } from '@/api/cart';
import { getArtists } from '@/api/artist';
import type { Cart, Artist, PageResponse } from '@/api/types';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/context/AuthContext';
import { logout as logoutApi } from '@/api/auth';

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const { setAuthenticated, isAuthenticated } = useAuth();
  const [isHeroActive, setIsHeroActive] = useState(false);
  const [isHeroDark, setIsHeroDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
  }, [isMenuOpen]);
  const [isPop, setIsPop] = useState(false);

  // 1. 작가 목록 (헤더 노출용)
  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ['artists', 'header'],
    queryFn: async () => {
      const res = await getArtists(0, 10);
      const page: PageResponse<Artist> = res.data.data;
      return page.content ?? [];
    },
    staleTime: 1000 * 60 * 10, // 10분 캐시
  });

  // 2. 장바구니 수량 — react-query 캐시에서 읽기
  const { data: cart } = useQuery<Cart | null>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const res = await getCart();
      return res.data.data ?? null;
    },
    retry: false,
  });
  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  // 2. 스크롤 및 투명 헤더 로직 (Home 전용)
  useEffect(() => {
    const updateHeaderState = () => {
      // 투명 헤더를 허용할 경로 정의
      const allowedPaths = ['/'];
      const isAllowed = allowedPaths.includes(location.pathname);

      // 허용된 페이지가 아니거나 [data-hero] 요소가 없으면 일반 헤더로 강제 고정
      const hero = document.querySelector('[data-hero]');
      
      if (!isAllowed || !hero) {
        setIsHeroActive(false);
        setIsHeroDark(false);
        return;
      }

      // 허용된 페이지일 때만 스크롤 위치 계산
      const heroRect = hero.getBoundingClientRect();
      setIsHeroActive(heroRect.bottom > 72);
      setIsHeroDark(hero.getAttribute('data-hero') === 'dark');
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
    window.addEventListener('resize', updateHeaderState);
    
    return () => {
      window.removeEventListener('scroll', updateHeaderState);
      window.removeEventListener('resize', updateHeaderState);
    };
  }, [location.pathname]);

  // 3. 카트 수량 변동 시 팝 애니메이션
  useEffect(() => {
    if (cartCount > 0) {
      setIsPop(true);
      const timer = setTimeout(() => setIsPop(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // 스타일 제어 변수
  const isTransparent = isHeroActive;
  const navBgClass = isTransparent
    ? 'bg-transparent border-transparent'
    : 'bg-white/95 border-b border-gray-100 backdrop-blur-sm shadow-sm';

  // 히어로 위에 흰 글씨로 얹혀 있는 상태인지 — 호버 색을 여기에 맞춘다
  const onDark = isTransparent && isHeroDark;

  const iconClass = onDark ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-black';

  /**
   * 아이콘 버튼 — 원형 배경이 깔리고 살짝 커진다.
   *
   * <p>색만 바꾸면 어두운 히어로 위에서는 변화가 거의 안 보인다.
   * {@code -m-2} 로 늘어난 여백을 상쇄해 아이콘 간격은 그대로 둔다.
   */
  const iconButtonClass = `relative p-2 -m-2 rounded-full transition-all duration-200
    hover:scale-110 active:scale-95
    ${onDark ? 'hover:bg-white/15' : 'hover:bg-gray-100'}`;

  /** 메뉴 링크 — 밑줄이 왼쪽에서 차오른다. 현재 페이지는 밑줄이 켜진 채 고정 */
  const navLinkClass = (active: boolean) =>
    `group relative py-1 text-sm font-medium transition-colors duration-200 ${
      active
        ? (onDark ? 'text-white' : 'text-black')
        : (onDark ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-black')
    }`;

  const navUnderlineClass = (active: boolean) =>
    `pointer-events-none absolute left-0 -bottom-0.5 h-[2px] w-full origin-left
     transition-transform duration-300 ease-out group-hover:scale-x-100
     ${active ? 'scale-x-100' : 'scale-x-0'}
     ${onDark ? 'bg-white' : 'bg-koala-purple'}`;

  const menus = [
    { key: 'lab', path: '/artist-lab' },
    { key: 'store', path: '/store' },
  ];

  const subMenus = [
    { key: 'notice', path: '/notice', icon: Bell },
    { key: 'customerService', path: '/contact', icon: Headset },
    { key: 'settings', path: '/account/settings', icon: Settings },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isMenuOpen ? 'z-[400] bg-white' : 'z-50 ' + navBgClass}`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="z-[120] group"
            >
              <img
                src={!isMenuOpen && onDark ? '/logo-white.svg' : '/logo.svg'}
                alt="KOALA"
                className="h-12 w-auto transition-opacity duration-200 group-hover:opacity-75"
              />
            </Link>

            {/* [WEB] 중앙 메뉴 */}
            <div className="hidden lg:flex items-center gap-8">
              {menus.map((menu) => {
                const active = location.pathname === menu.path;
                return (
                  <Link key={menu.key} to={menu.path} className={navLinkClass(active)}>
                    {t(`header.menus.${menu.key}`)}
                    <span className={navUnderlineClass(active)} />
                  </Link>
                );
              })}

              {artists.length > 0 && (
                <span className={`text-xs ${onDark ? 'text-white/20' : 'text-gray-200'}`}>|</span>
              )}

              {artists.map((artist) => {
                const active = location.pathname === `/artist/${artist.artistCode}`;
                return (
                  <Link
                    key={artist.artistCode}
                    to={`/artist/${artist.artistCode}`}
                    className={navLinkClass(active)}
                  >
                    {artist.name}
                    <span className={navUnderlineClass(active)} />
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => { setIsMenuOpen(false); navigate('/search'); }}
                aria-label="검색"
                className={`z-[120] ${iconButtonClass} ${isMenuOpen ? 'text-black' : iconClass}`}
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                aria-label="장바구니"
                className={`z-[120] ${iconButtonClass} ${isMenuOpen ? 'text-black' : iconClass} ${isPop ? 'scale-110' : ''}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {/* 아이콘에 p-2 가 붙어 배지도 그만큼 안쪽으로 들어온다 */}
                {cartCount > 0 && (
                  <span className={`absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isMenuOpen ? 'bg-koala-navy text-white' : (onDark ? 'bg-white text-black' : 'bg-koala-navy text-white')
                  }`}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* [MOBILE] 햄버거 버튼 */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="메뉴"
                className={`lg:hidden z-[120] ${iconButtonClass} ${isMenuOpen ? 'text-black' : iconClass}`}
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>

              <Link
                to="/account/orders"
                aria-label="마이페이지"
                className={`hidden lg:block ${iconButtonClass} ${iconClass}`}
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* [MOBILE] 사이드바(드로어) 메뉴 */}
      <div className={`fixed top-0 left-0 w-full h-[100dvh] z-[300] bg-white lg:hidden overflow-y-auto transition-all duration-400 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex flex-col px-8 pt-28 pb-[max(48px,env(safe-area-inset-bottom))]">
          <div className="flex flex-col gap-6 mb-10">
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

            {artists.length > 0 && (
              <div className={`border-t border-gray-100 pt-6 flex flex-col gap-4 transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionDelay: `${menus.length * 50 + 50}ms` }}
              >
                <p className="text-xs text-gray-400 tracking-widest uppercase font-semibold">작가</p>
                {artists.map((artist, index) => (
                  <Link
                    key={artist.artistCode}
                    to={`/artist/${artist.artistCode}`}
                    className={`text-2xl font-bold text-black tracking-tight transition-all duration-500 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                    style={{ transitionDelay: `${(menus.length + index) * 50 + 100}ms` }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {artist.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className={`border-t border-gray-100 pt-6 space-y-1 transition-all duration-700 delay-150 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
            {subMenus.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between py-4 active:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-lg font-medium text-gray-700">{t(`header.subMenus.${item.key}`)}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </Link>
            ))}

            {isAuthenticated && (
              <button
                className="w-full flex items-center justify-between py-4 px-2 -mx-2 active:bg-red-50 rounded-lg transition-colors group"
                onClick={async () => {
                  setIsMenuOpen(false);
                  try { await logoutApi(); } catch { /* ignore */ }
                  finally {
                    setAuthenticated(false);
                    window.dispatchEvent(new Event('cart-updated'));
                    navigate('/login');
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-lg font-medium text-red-500">{t('header.logout')}</span>
                </div>
              </button>
            )}
          </div>

          <Link
            to="/account/orders"
            className="mt-8 flex items-center justify-between bg-zinc-900 text-white p-5 rounded-2xl active:scale-95 transition-all shadow-xl shadow-zinc-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">{t('header.myPage')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/40" />
          </Link>
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