import { Link } from 'react-router';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import {
  ShoppingBag, Package, Users, Star, Image as ImageIcon,
  LogOut, UserCog, RotateCcw,
} from 'lucide-react';

const NAV_CARDS = [
  { label: '주문 관리', desc: '신규 주문 확인 및 배송 처리', icon: ShoppingBag, href: '/admin/orders', color: 'bg-blue-50 text-blue-600' },
  { label: '상품 관리', desc: 'SKU 등록·수정·게시 상태 관리', icon: Package, href: '/admin/products', color: 'bg-violet-50 text-violet-600' },
  { label: '반품/교환', desc: '반품·교환 신청 접수 및 승인 처리', icon: RotateCcw, href: '/admin/returns', color: 'bg-orange-50 text-orange-600' },
  { label: '아티스트', desc: '아티스트 프로필 등록 및 관리', icon: Users, href: '/admin/artists', color: 'bg-amber-50 text-amber-600' },
  { label: '리뷰 관리', desc: '승인 대기 리뷰 검토 및 처리', icon: Star, href: '/admin/reviews', color: 'bg-green-50 text-green-600' },
  { label: '배너 관리', desc: '홈 배너 등록 및 노출 설정', icon: ImageIcon, href: '/admin/banners', color: 'bg-pink-50 text-pink-600' },
  { label: '회원 관리', desc: '회원 조회 및 계정 상태 관리', icon: UserCog, href: '/admin/users', color: 'bg-gray-100 text-gray-600' },
];

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs text-gray-400 mb-1">대시보드</p>
          <h1 className="text-xl font-bold text-gray-900">
            안녕하세요, {admin?.name ?? '관리자'}님
          </h1>
          {admin && (
            <p className="text-xs text-gray-400 mt-1">{admin.email}</p>
          )}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors py-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          로그아웃
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NAV_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              to={card.href}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-black transition-colors">
                {card.label}
              </div>
              <div className="text-xs text-gray-400">{card.desc}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
