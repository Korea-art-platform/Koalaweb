import { Link, useLocation } from 'react-router';
import { Globe, Eye, ShoppingBag, ShoppingCart, User, Search } from 'lucide-react';
import { ViewModeProvider, useViewMode } from '../context/ViewModeContext';

function NavigationContent() {
  const location = useLocation();
  const { mode, setMode } = useViewMode();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="text-2xl tracking-tight">
              KoALa
            </div>
            <div className="text-xs text-gray-400 tracking-wide">
              Korean Art Laboratory
            </div>
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center gap-12">
            <Link
              to="/"
              className={`text-sm transition-colors ${
                location.pathname === '/' ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              The Gallery
            </Link>
            <Link
              to="/artist-lab"
              className={`text-sm transition-colors ${
                location.pathname.startsWith('/artist') ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              Artist Lab
            </Link>
            <Link
              to="/store"
              className={`text-sm transition-colors ${
                location.pathname.startsWith('/store') || location.pathname.startsWith('/product') ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              Smart Store
            </Link>
            <Link
              to="/ar-view"
              className={`text-sm transition-colors ${
                location.pathname === '/ar-view' ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              AR View
            </Link>
            <Link
              to="/resell"
              className={`text-sm transition-colors ${
                location.pathname === '/resell' ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              Resell Market
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50">
              <button
                onClick={() => setMode('gallery')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all ${
                  mode === 'gallery' ? 'bg-white shadow-sm' : 'text-gray-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Gallery
              </button>
              <button
                onClick={() => setMode('shop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all ${
                  mode === 'shop' ? 'bg-white shadow-sm' : 'text-gray-400'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Shop
              </button>
            </div>

            {/* Search Icon */}
            <Link
              to="/search"
              className="text-gray-400 hover:text-black transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-gray-400 hover:text-black transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Link>

            {/* User Menu */}
            <Link
              to="/account"
              className="text-gray-400 hover:text-black transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Language Selector */}
            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors">
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
      <NavigationContent />
    </ViewModeProvider>
  );
}