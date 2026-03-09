import { Link, useLocation } from 'react-router';
import { Globe, Eye, ShoppingBag, ShoppingCart, User, Search } from 'lucide-react';
import { ViewModeProvider, useViewMode } from '../../context/ViewModeContext';
import { useEffect, useState } from 'react';

export function Header() {
  const location = useLocation();
  const { mode, setMode } = useViewMode();
  const [isHeroActive, setIsHeroActive] = useState(false);
  
  // --- 장바구니 관련 상태 ---
  const [cartCount, setCartCount] = useState(0);
  const [isPop, setIsPop] = useState(false); // 수량 변경 시 애니메이션

  // 장바구니 수량 계산 함수
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      // 각 아이템의 quantity를 모두 더함
      const total = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } else {
      setCartCount(0);
    }
  };

  // 1. 헤더 배경 상태 제어 (스크롤 감지)
  useEffect(() => {
    const updateHeaderState = () => {
      const isHome = location.pathname === '/';
      if (!isHome) {
        setIsHeroActive(false);
        return;
      }
      const hero = document.getElementById('home-hero');
      if (!hero) {
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

  // 2. ⭐ 장바구니 실시간 동기화 (핵심 로직)
  useEffect(() => {
    updateCartCount(); // 초기 로드 시 실행

    // 'cart-updated' 커스텀 이벤트를 들으면 즉시 수량 업데이트
    window.addEventListener('cart-updated', updateCartCount);
    // 다른 탭에서 변경했을 때를 대비한 storage 이벤트
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // 3. 수량이 변할 때 톡톡 튀는 애니메이션
  useEffect(() => {
    if (cartCount >= 0) {
      setIsPop(true);
      const timer = setTimeout(() => setIsPop(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // --- 스타일 관련 변수 (투명/불투명 제어) ---
  const isTransparent = location.pathname === '/' && isHeroActive;

  const navBgClass = isTransparent
    ? 'bg-transparent border-transparent backdrop-blur-0'
    : 'bg-white/95 border-gray-100 backdrop-blur-sm shadow-sm';

  const logoClass = isTransparent ? 'text-white' : 'text-black';
  const iconClass = isTransparent ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-black';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${navBgClass}`}>
      <div className="max-w-[1600px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-3">
            <span className={`text-2xl font-bold tracking-tight ${logoClass}`}>KoALa</span>
            <span className={`text-[10px] uppercase tracking-widest hidden sm:block ${isTransparent ? 'text-white/50' : 'text-gray-400'}`}>
              Korean Art Lab
            </span>
          </Link>

          {/* 중앙 메뉴 */}
          <div className="flex items-center gap-10">
            {['작품 갤러리', '작가의 연구소', '스마트 스토어', 'AR 뷰어'].map((menu, i) => {
              const paths = ['/', '/artist-lab', '/store', '/ar-view'];
              const isActive = location.pathname === paths[i];
              return (
                <Link 
                  key={menu} 
                  to={paths[i]} 
                  className={`text-sm font-medium transition-colors ${
                    isActive 
                      ? (isTransparent ? 'text-white' : 'text-black') 
                      : (isTransparent ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-black')
                  }`}
                >
                  {menu}
                </Link>
              );
            })}
          </div>

          {/* 오른쪽 아이콘 섹션 */}
          <div className="flex items-center gap-6">
            {/* 모드 토글 */}
            <div className={`flex items-center p-1 rounded-full ${isTransparent ? 'bg-white/10' : 'bg-gray-100'}`}>
              <button onClick={() => setMode('gallery')} className={`px-3 py-1 rounded-full text-[11px] transition-all ${mode === 'gallery' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>갤러리</button>
              <button onClick={() => setMode('shop')} className={`px-3 py-1 rounded-full text-[11px] transition-all ${mode === 'shop' ? 'bg-white text-black shadow-sm' : 'text-gray-400'}`}>스토어</button>
            </div>

            <Search className={`w-5 h-5 cursor-pointer ${iconClass}`} />

            {/* 장바구니 아이콘 (숫자 배지 포함) */}
            <Link to="/cart" className={`relative transition-transform ${iconClass} ${isPop ? 'scale-110' : 'scale-100'}`}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold animate-in zoom-in ${
                  isTransparent ? 'bg-white text-black' : 'bg-black text-white'
                }`}>
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/account/orders"><User className={`w-5 h-5 ${iconClass}`} /></Link>
            <Globe className={`w-5 h-5 cursor-pointer ${iconClass}`} />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Context Provider로 감싼 최종 Export
export default function Navigation() {
  return (
    <ViewModeProvider>
      <Header />
    </ViewModeProvider>
  );
}