import { Link, useLocation } from 'react-router';
import { Globe, Eye, ShoppingBag, ShoppingCart, User, Search } from 'lucide-react';
import { ViewModeProvider, useViewMode } from '../../context/ViewModeContext';
import { useEffect, useState } from 'react';

export function Header() {
  const location = useLocation();
  const { mode, setMode } = useViewMode();
  const [isHeroActive, setIsHeroActive] = useState(false);

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
      const headerHeight = 88;

      // hero 영역이 헤더 아래로 아직 남아있으면 transparent 유지
      setIsHeroActive(heroRect.bottom > headerHeight);
    };

    updateHeaderState();

    window.addEventListener('scroll', updateHeaderState);
    window.addEventListener('resize', updateHeaderState);

    return () => {
      window.removeEventListener('scroll', updateHeaderState);
      window.removeEventListener('resize', updateHeaderState);
    };
  }, [location.pathname]);

  const isTransparent = location.pathname === '/' && isHeroActive;

  const navBgClass = isTransparent
    ? 'bg-transparent border-transparent backdrop-blur-0'
    : 'bg-white/95 border-gray-100 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.04)]';

  const logoTextClass = isTransparent ? 'text-white' : 'text-black';
  const subLogoTextClass = isTransparent ? 'text-white/70' : 'text-gray-400';

  const getNavLinkClass = (active: boolean) => {
    if (isTransparent) {
      return active
        ? 'text-white'
        : 'text-white/70 hover:text-white';
    }

    return active
      ? 'text-black'
      : 'text-gray-400 hover:text-black';
  };

  const iconClass = isTransparent
    ? 'text-white/80 hover:text-white'
    : 'text-gray-400 hover:text-black';

  const modeWrapClass = isTransparent
    ? 'bg-white/10 border border-white/15 backdrop-blur-sm'
    : 'bg-gray-50';

  const activeModeClass = isTransparent
    ? 'bg-white text-black shadow-sm'
    : 'bg-white shadow-sm text-black';

  const inactiveModeClass = isTransparent
    ? 'text-white/70 hover:text-white'
    : 'text-gray-400 hover:text-black';

  const cartBadgeClass = isTransparent
    ? 'bg-white text-black'
    : 'bg-black text-white';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${navBgClass}`}
    >
      <div className="max-w-[1600px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className={`text-2xl tracking-tight transition-colors duration-300 ${logoTextClass}`}>
              KoALa
            </div>
            <div className={`text-xs tracking-wide transition-colors duration-300 ${subLogoTextClass}`}>
              Korean Art Lab
            </div>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-12">
            <Link
              to="/"
              className={`text-sm transition-colors duration-300 ${getNavLinkClass(
                location.pathname === '/'
              )}`}
            >
              작품 갤러리
            </Link>

            <Link
              to="/artist-lab"
              className={`text-sm transition-colors duration-300 ${getNavLinkClass(
                location.pathname.startsWith('/artist')
              )}`}
            >
              작가의 연구소
            </Link>

            <Link
              to="/store"
              className={`text-sm transition-colors duration-300 ${getNavLinkClass(
                location.pathname.startsWith('/store') ||
                  location.pathname.startsWith('/product')
              )}`}
            >
              스마트 스토어
            </Link>

            <Link
              to="/ar-view"
              className={`text-sm transition-colors duration-300 ${getNavLinkClass(
                location.pathname === '/ar-view'
              )}`}
            >
              AR 뷰어
            </Link>

            <Link
              to="/resell"
              className={`text-sm transition-colors duration-300 ${getNavLinkClass(
                location.pathname === '/resell'
              )}`}
            >
              리셀 마켓
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Mode Toggle */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${modeWrapClass}`}
            >
              <button
                onClick={() => setMode('gallery')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all duration-300 ${
                  mode === 'gallery' ? activeModeClass : inactiveModeClass
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Gallery
              </button>

              <button
                onClick={() => setMode('shop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all duration-300 ${
                  mode === 'shop' ? activeModeClass : inactiveModeClass
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Shop
              </button>
            </div>

            {/* Search Icon */}
            <Link to="/search" className={`transition-colors duration-300 ${iconClass}`}>
              <Search className="w-5 h-5" />
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className={`relative transition-colors duration-300 ${iconClass}`}>
              <ShoppingCart className="w-5 h-5" />
              <span
                className={`absolute -top-1 -right-1 w-4 h-4 text-xs rounded-full flex items-center justify-center transition-all duration-300 ${cartBadgeClass}`}
              >
                2
              </span>
            </Link>

            {/* User Menu */}
            <Link to="/account" className={`transition-colors duration-300 ${iconClass}`}>
              <User className="w-5 h-5" />
            </Link>

            {/* Language Selector */}
            <button
              className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${iconClass}`}
            >
              <Globe className="w-4 h-4" />
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Navigation() {
  return (
    <ViewModeProvider>
      <Header />
    </ViewModeProvider>
  );
}