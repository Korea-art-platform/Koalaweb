import { Link, useLocation, useNavigate } from 'react-router';
import { Package, ChevronRight, Box } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import AccountSidebar from '@/app/components/layouts/AccountSidebar';
import { useEffect, useState } from 'react';
import { getMyProfile } from '@/api/user';
import { getMyOrders, cancelOrder } from '@/api/order';

const getStatusInfo = (status: string) => {
  const statuses: { [key: string]: { label: string; color: string } } = {
    PENDING_PAYMENT: { label: '결제 대기', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
    PAID: { label: '결제 완료', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    PREPARING: { label: '상품 준비 중', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
    SHIPPED: { label: '배송 중', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    DELIVERED: { label: '배송 완료', color: 'bg-green-50 text-green-600 border-green-100' },
    CANCELLED: { label: '주문 취소', color: 'bg-gray-50 text-gray-600 border-gray-100' },
  };
  return statuses[status] || { label: '확인 중', color: 'bg-gray-50 text-gray-600 border-gray-100' };
};

export default function AccountOrders() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          getMyProfile(),
          getMyOrders(page, 10),
        ]);
        setUser(profileRes.data.data);
        setOrders(ordersRes.data.data.content ?? []);
        setTotalPages(ordersRes.data.data.totalPages ?? 0);
      } catch (e) {
        console.error('주문 내역 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const handleCancel = async (orderNo: string) => {
    if (!window.confirm('주문을 취소하시겠습니까?')) return;
    try {
      await cancelOrder(orderNo);
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNo === orderNo ? { ...o, orderStatus: 'CANCELLED' } : o
        )
      );
    } catch (e: any) {
      alert(e.response?.data?.message || '주문 취소에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 md:pt-32 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">마이페이지</h1>
            <p className="text-xs md:text-sm text-gray-400 font-medium">
              회원님의 활동과 주문 내역을 관리하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <AccountSidebar currentPath={location.pathname} user={user} />
            </div>

            <div className="lg:col-span-3">
              <div className="mb-6 md:mb-8 px-1">
                <h2 className="text-xl md:text-2xl font-bold mb-1 italic">Order History</h2>
                <p className="text-xs md:text-sm text-gray-400 font-medium">
                  총 {orders.length}개의 주문 내역
                </p>
              </div>

              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl h-40" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 md:p-20 shadow-sm border border-dashed border-gray-200 text-center">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-bold mb-2">아직 주문 내역이 없습니다</h3>
                  <Link
                    to="/store"
                    className="inline-block mt-6 px-8 py-3.5 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all font-bold text-sm"
                  >
                    스토어 구경하기
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.orderStatus);
                    return (
                      <div
                        key={order.orderNo}
                        className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200 transition-all group"
                      >
                        {/* 주문 상단 */}
                        <div className="px-5 py-4 md:px-8 md:py-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-y-3">
                          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
                            <div className="shrink-0">
                              <p className="text-[9px] md:text-[10px] text-gray-400 uppercase mb-0.5 font-bold">주문 번호</p>
                              <p className="text-[12px] md:text-sm font-black text-gray-900">{order.orderNo}</p>
                            </div>
                            <div className="shrink-0">
                              <p className="text-[9px] md:text-[10px] text-gray-400 uppercase mb-0.5 font-bold">주문 일자</p>
                              <p className="text-[12px] md:text-sm font-bold text-gray-700">
                                {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                            <div className="shrink-0">
                              <p className="text-[9px] md:text-[10px] text-gray-400 uppercase mb-0.5 font-bold">총 결제 금액</p>
                              <p className="text-[12px] md:text-sm font-black text-black">
                                ₩{order.totalAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] md:text-[11px] font-black border uppercase tracking-tighter ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* 주문 상품 */}
                        <div className="p-5 md:p-8">
                          <div className="space-y-4">
                            <div className="flex gap-4 md:gap-5 items-center">
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-50">
                                <img
                                  src={order.firstSkuImageUrl ?? 'https://via.placeholder.com/80'}
                                  alt={order.firstSkuName}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm md:text-base mb-0.5 truncate">
                                  {order.firstSkuName}
                                </h4>
                                {order.itemCount > 1 && (
                                  <span className="text-[9px] md:text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-bold">
                                    외 {order.itemCount - 1}개
                                  </span>
                                )}
                              </div>
                              <div className="text-right font-black text-gray-900 text-sm md:text-base">
                                ₩{order.totalAmount.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {/* 버튼 */}
                          <div className="flex flex-col sm:flex-row gap-2 mt-8 pt-6 border-t border-gray-50">
                            {order.orderStatus === 'SHIPPED' && (
                              <button className="flex items-center justify-center gap-2 px-5 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all text-xs font-bold">
                                <Box className="w-4 h-4" /> 배송 조회
                              </button>
                            )}
                            {['PENDING_PAYMENT', 'PAID', 'PREPARING'].includes(order.orderStatus) && (
                              <button
                                onClick={() => handleCancel(order.orderNo)}
                                className="flex items-center justify-center gap-2 px-5 py-3 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all text-xs font-bold"
                              >
                                주문 취소
                              </button>
                            )}
                            <Link
                              to={`/account/orders/${order.orderNo}`}
                              className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-xs font-bold text-gray-600"
                            >
                              상세 보기 <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-6 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30 hover:border-black transition-colors"
                      >
                        이전
                      </button>
                      <span className="px-6 py-2 text-sm text-gray-500">
                        {page + 1} / {totalPages}
                      </span>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="px-6 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30 hover:border-black transition-colors"
                      >
                        다음
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
