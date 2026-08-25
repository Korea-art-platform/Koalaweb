import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Package, Tags, Users, ShoppingBag, Star, Image as ImageIcon, RotateCcw, Bell, MessageCircle, Wallet, Store, Wrench } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const navGroups = [
    {
      title: null,
      items: [{ label: '대시보드', path: '/admin', icon: LayoutDashboard }],
    },
    {
      title: '운영',
      items: [
        { label: '주문', path: '/admin/orders', icon: ShoppingBag },
        { label: '반품/교환', path: '/admin/returns', icon: RotateCcw },
        { label: '1:1 문의', path: '/admin/inquiries', icon: MessageCircle },
        { label: '리뷰', path: '/admin/reviews', icon: Star },
      ],
    },
    {
      title: '카탈로그',
      items: [
        { label: '상품관리', path: '/admin/products', icon: Package },
        { label: '카테고리', path: '/admin/categories', icon: Tags },
        { label: '아티스트', path: '/admin/artists', icon: Users },
      ],
    },
    {
      title: '콘텐츠',
      items: [
        { label: '배너', path: '/admin/banners', icon: ImageIcon },
        { label: '공지사항', path: '/admin/notices', icon: Bell },
        { label: '입점 매장', path: '/admin/stores', icon: Store },
      ],
    },
    {
      title: '정산',
      items: [{ label: '정산', path: '/admin/settlements', icon: Wallet }],
    },
    {
      title: '시스템',
      items: [{ label: '유지보수', path: '/admin/maintenance', icon: Wrench }],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <aside className="w-[240px] bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col fixed h-full">
        <div className="p-6">
          <Link to="/" className="block">
            <div className="text-2xl font-bold tracking-tight">KOALA</div>
            <div className="text-xs text-gray-400 tracking-wide mt-1">ADMIN</div>
          </Link>
        </div>
        <nav className="mt-4 flex flex-col gap-4 px-3 pb-8 overflow-y-auto">
          {navGroups.map((group, gi) => (
            <div key={gi} className="flex flex-col gap-1">
              {group.title && (
                <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
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
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 md:ml-[240px]">
        {children}
      </main>
    </div>
  );
}
