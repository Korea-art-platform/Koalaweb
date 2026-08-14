import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import {
  ShoppingBag, Package, Users, Star, Image as ImageIcon,
  LogOut, UserCog, RotateCcw, TrendingUp, Bell,
  ShoppingCart, Clock, AlertTriangle,
} from 'lucide-react';
import {
  getDashboardStats, getDailyRevenue, getPaymentsNeedingAttention,
  type DashboardStats, type DailyRevenue, type PaymentNeedingAttention,
} from '@/api/adminApi';

const ATTENTION_STATUS_LABEL: Record<string, string> = {
  IN_DOUBT: '승인 여부 미확정',
  IN_PROGRESS: '승인 처리 중',
  CANCEL_IN_PROGRESS: '환불 처리 중',
};

const NAV_CARDS = [
  { label: '주문 관리',  desc: '신규 주문 확인 및 배송 처리',     icon: ShoppingBag, href: '/admin/orders',   color: 'bg-blue-50 text-blue-600' },
  { label: '상품 관리',  desc: 'SKU 등록·수정·게시 상태 관리',   icon: Package,     href: '/admin/products', color: 'bg-violet-50 text-violet-600' },
  { label: '반품/교환',  desc: '반품·교환 신청 접수 및 승인 처리', icon: RotateCcw,   href: '/admin/returns',  color: 'bg-orange-50 text-orange-600' },
  { label: '아티스트',   desc: '아티스트 프로필 등록 및 관리',    icon: Users,       href: '/admin/artists',  color: 'bg-amber-50 text-amber-600' },
  { label: '리뷰 관리',  desc: '승인 대기 리뷰 검토 및 처리',    icon: Star,        href: '/admin/reviews',  color: 'bg-green-50 text-green-600' },
  { label: '배너 관리',  desc: '홈 배너 등록 및 노출 설정',      icon: ImageIcon,   href: '/admin/banners',  color: 'bg-pink-50 text-pink-600' },
  { label: '회원 관리',  desc: '회원 조회 및 계정 상태 관리',    icon: UserCog,     href: '/admin/users',    color: 'bg-gray-100 text-gray-600' },
  { label: '공지사항',   desc: '공지사항 등록 및 관리',          icon: Bell,        href: '/admin/notices',  color: 'bg-cyan-50 text-cyan-600' },
];

function fmt(n: number) {
  return n?.toLocaleString('ko-KR') ?? '0';
}

function fmtMoney(n: number) {
  if (!n) return '₩0';
  if (n >= 100_000_000) return `₩${(n / 100_000_000).toFixed(1)}억`;
  if (n >= 10_000) return `₩${(n / 10_000).toFixed(0)}만`;
  return `₩${fmt(n)}`;
}

function MiniBarChart({ data }: { data: DailyRevenue[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => Number(d.revenue)), 1);

  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full bg-koala-navy rounded-sm transition-all"
            style={{ height: `${(Number(d.revenue) / max) * 72}px`, minHeight: 2 }}
          />
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {d.date.slice(5)}<br />{fmtMoney(Number(d.revenue))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: string; sub: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">{label}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="text-xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-[11px] text-gray-400">{sub}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [daily, setDaily] = useState<DailyRevenue[]>([]);
  const [attention, setAttention] = useState<PaymentNeedingAttention[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
    getDailyRevenue().then(setDaily).catch(() => {});
    getPaymentsNeedingAttention().then(setAttention).catch(() => {});
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs text-gray-400 mb-1">대시보드</p>
          <h1 className="text-xl font-bold text-gray-900">
            안녕하세요, {admin?.name ?? '관리자'}님
          </h1>
          {admin && <p className="text-xs text-gray-400 mt-1">{admin.email}</p>}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors py-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          로그아웃
        </button>
      </div>

      {attention.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h2 className="text-sm font-bold text-red-900">
              확인 필요 결제 {attention.length}건
            </h2>
          </div>
          <p className="text-xs text-red-700 mb-3">
            PG 응답을 받지 못해 승인·취소 여부가 확정되지 않았습니다.
            토스 콘솔에서 실제 상태를 확인한 뒤 수동 처리해 주세요.
          </p>
          <div className="space-y-2">
            {attention.map((p) => (
              <Link
                key={p.paymentNo}
                to={`/admin/orders/${p.orderNo}`}
                className="flex items-center justify-between bg-white rounded-lg border border-red-100 px-4 py-2.5 hover:border-red-300 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-900">
                    {p.orderNo}
                    <span className="ml-2 text-[11px] font-medium text-red-600">
                      {ATTENTION_STATUS_LABEL[p.status] ?? p.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">
                    {p.paymentNo}
                    {p.failureMessage ? ` · ${p.failureMessage}` : ''}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-700 shrink-0 ml-3">
                  {fmt(p.requestedAmount)}원
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="오늘 주문"
          value={fmt(stats?.todayOrders ?? 0)}
          sub={`이번 주 ${fmt(stats?.weekOrders ?? 0)}건`}
          icon={ShoppingCart}
          color="text-blue-500"
        />
        <StatCard
          label="이번 달 매출"
          value={fmtMoney(stats?.monthRevenue ?? 0)}
          sub={`누적 ${fmtMoney(stats?.totalRevenue ?? 0)}`}
          icon={TrendingUp}
          color="text-green-500"
        />
        <StatCard
          label="처리 대기"
          value={fmt(stats?.pendingOrders ?? 0)}
          sub={`배송 준비 ${fmt(stats?.processingOrders ?? 0)}건`}
          icon={Clock}
          color="text-orange-500"
        />
        <StatCard
          label="전체 회원"
          value={fmt(stats?.totalUsers ?? 0)}
          sub={`오늘 가입 ${fmt(stats?.todaySignups ?? 0)}명`}
          icon={Users}
          color="text-violet-500"
        />
      </div>

      {daily.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">최근 14일 매출</h2>
            <span className="text-xs text-gray-400">일별 결제 완료 기준</span>
          </div>
          <MiniBarChart data={daily} />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-300">{daily[0]?.date.slice(5)}</span>
            <span className="text-[10px] text-gray-300">{daily[daily.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      )}

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
