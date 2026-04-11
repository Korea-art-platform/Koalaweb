import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Package, Users, ShoppingBag, Star, Image as ImageIcon } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const navItems = [
    { label: '대시보드', path: '/admin', icon: LayoutDashboard },
    { label: '상품관리', path: '/admin/products', icon: Package },
    { label: '아티스트', path: '/admin/artists', icon: Users },
    { label: '주문', path: '/admin/orders', icon: ShoppingBag },
    { label: '리뷰', path: '/admin/reviews', icon: Star },
    { label: '배너', path: '/admin/banners', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col fixed h-full">
        <div className="p-6">
          <Link to="/" className="block">
            <div className="text-2xl font-bold tracking-tight">KoALa</div>
            <div className="text-xs text-gray-400 tracking-wide mt-1">ADMIN</div>
          </Link>
        </div>
        <nav className="mt-6 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
                           (item.path !== '/admin' && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 border-l-2 border-black rounded-l-none'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:ml-[240px]">
        {children}
      </main>
    </div>
  );
}
