import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import {
  ShoppingBag, Package, Users, Star, Image as ImageIcon,
  LogOut, UserCog, RotateCcw, TrendingUp, Bell, MessageCircle,
  ShoppingCart, Clock, AlertTriangle,
} from 'lucide-react';
import {
  getDashboardStats, getDailyRevenue, getPaymentsNeedingAttention, resolveStuckPayment,
  type DashboardStats, type DailyRevenue, type PaymentNeedingAttention,
} from '@/api/adminApi';

const ATTENTION_STATUS_LABEL: Record<string, string> = {
  IN_DOUBT: '승인 여부 미확정',
  IN_PROGRESS: '승인 처리 중',
  CANCEL_IN_PROGRESS: '환불 처리 중',
};

const NAV_CARDS = [
  { label: '주문 관리',  desc: '신규 주문 확인 및 배송 처리',       icon: ShoppingBag,   href: '/admin/orders',    color: 'bg-blue-50 text-blue-600' },
  { label: '반품/교환',  desc: '반품·교환 신청 접수 및 승인 처리',   icon: RotateCcw,     href: '/admin/returns',   color: 'bg-orange-50 text-orange-600' },
  { label: '1:1 문의',   desc: '고객 문의 확인 및 답변',            icon: MessageCircle, href: '/admin/inquiries', color: 'bg-cyan-50 text-cyan-600' },
  { label: '리뷰 관리',  desc: '승인 대기 리뷰 검토 및 처리',       icon: Star,          href: '/admin/reviews',   color: 'bg-green-50 text-green-600' },
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
  const [resolving, setResolving] = useState<string | null>(null);

  const loadAttention = () => getPaymentsNeedingAttention().then(setAttention).catch(() => {});

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
    getDailyRevenue().then(setDaily).catch(() => {});
    loadAttention();
  }, []);

  const handleResolve = async (
    p: PaymentNeedingAttention,
    outcome: 'CAPTURED' | 'CANCELLED' | 'FAILED',
    label: string,
  ) => {
    if (!window.confirm(
      `${p.orderNo} 결제를 '${label}'(으)로 종결합니다.\n` +
      `PG 콘솔에서 실제 상태를 확인하셨나요? 되돌릴 수 없습니다.`,
    )) return;
    setResolving(p.paymentNo);
    try {
      await resolveStuckPayment(p.paymentNo, outcome, label);
      await loadAttention();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? '처리에 실패했습니다.');
    } finally {
      setResolving(null);
    }
  };

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
            <strong> PG 콘솔에서 실제 상태를 확인한 뒤</strong> 아래에서 종결해 주세요.
          </p>
          <div className="space-y-2">
            {attention.map((p) => (
              <div
                key={p.paymentNo}
                className="bg-white rounded-lg border border-red-100 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <Link to={`/admin/orders/${p.orderNo}`} className="min-w-0 group">
                    <div className="text-xs font-semibold text-gray-900 group-hover:underline">
                      {p.orderNo}
                      <span className="ml-2 text-[11px] font-medium text-red-600">
                        {ATTENTION_STATUS_LABEL[p.status] ?? p.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 truncate">
                      {p.paymentNo}
                      {p.failureMessage ? ` · ${p.failureMessage}` : ''}
                    </div>
                  </Link>
                  <div className="text-xs font-semibold text-gray-700 shrink-0">
                    {fmt(p.requestedAmount)}원
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-red-50">
                  <span className="text-[11px] text-gray-400 self-center mr-1">실제 상태로 종결:</span>
                  <button
                    disabled={resolving === p.paymentNo}
                    onClick={() => handleResolve(p, 'CAPTURED', '정상 결제')}
                    className="text-[11px] px-2.5 py-1 rounded-md border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-40"
                  >
                    정상 결제됨 (돈 받음)
                  </button>
                  <button
                    disabled={resolving === p.paymentNo}
                    onClick={() => handleResolve(p, 'CANCELLED', '취소 완료')}
                    className="text-[11px] px-2.5 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                  >
                    취소·환불 완료
                  </button>
                  <button
                    disabled={resolving === p.paymentNo}
                    onClick={() => handleResolve(p, 'FAILED', '결제 실패')}
                    className="text-[11px] px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40"
                  >
                    결제 안 됨 (실패)
                  </button>
                </div>
              </div>
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

      <h2 className="text-sm font-semibold text-gray-900 mb-3">처리할 업무</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
