import { Link, useLocation } from 'react-router';
import { User, MapPin, CreditCard, Package, Heart, Settings, LogOut, ChevronRight, Box } from 'lucide-react';
import Navigation from '../components/layouts/Header';
import { useEffect, useState } from 'react';

const menuItems = [
  { icon: User, label: '프로필 설정', path: '/account' },
  { icon: Package, label: '주문 내역', path: '/account/orders' },
  { icon: MapPin, label: '배송지 관리', path: '/account/addresses' },
  { icon: CreditCard, label: '결제 수단', path: '/account/payment-methods' },
  { icon: Heart, label: '위시리스트', path: '/account/wishlist' },
  { icon: Settings, label: '알림 설정', path: '/account/settings' },
];

const getStatusInfo = (status: string) => {
  const statuses: { [key: string]: { label: string, color: string } } = {
    'In Transit': { label: '배송 중', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    'Delivered': { label: '배송 완료', color: 'bg-green-50 text-green-600 border-green-100' },
    'Processing': { label: '상품 준비 중', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
    'Cancelled': { label: '주문 취소', color: 'bg-gray-50 text-gray-600 border-gray-100' },
  };
  return statuses[status] || { label: '확인 중', color: 'bg-gray-50 text-gray-600 border-gray-100' };
};

export default function AccountOrders() {
  const location = useLocation();
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  useEffect(() => {
    // localStorage에서 실제 주문 내역 로드
    const savedHistory = localStorage.getItem('orderHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // 최신 주문이 위로 오도록 역순 정렬
      setOrderHistory(parsed.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-medium tracking-tight mb-2">마이페이지</h1>
            <p className="text-sm text-gray-400">회원님의 활동과 주문 내역을 관리하세요.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 사이드바 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-bold">KM</div>
                  <div>
                    <p className="font-semibold text-gray-900">김민지님</p>
                    <p className="text-[11px] text-gray-400 font-mono">kim@koala.art</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-gray-50 text-black font-medium' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <button className="flex items-center gap-3 px-4 py-3 mt-8 w-full text-gray-400 hover:text-red-500 transition-colors border-t border-gray-50 pt-6">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">로그아웃</span>
                </button>
              </div>
            </div>

            {/* 메인 리스트 */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-medium mb-1">주문 내역</h2>
                <p className="text-sm text-gray-400">총 {orderHistory.length}개의 주문 내역이 있습니다.</p>
              </div>

              <div className="space-y-6">
                {orderHistory.length > 0 ? (
                  orderHistory.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                      <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200 transition-all">
                        <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                          <div className="flex gap-8">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase mb-1">주문 번호</p>
                              <p className="text-sm font-bold text-gray-900">{order.id}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase mb-1">주문 일자</p>
                              <p className="text-sm font-medium">{order.date}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase mb-1">총 결제 금액</p>
                              <p className="text-sm font-bold text-black">₩{order.total.toLocaleString()}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="p-8">
                          <div className="space-y-6">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-5 items-center">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-50">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-0.5">{item.name}</h4>
                                  <p className="text-xs text-gray-400 mb-2">{item.artist} 작가</p>
                                  <p className="text-[11px] text-gray-500 bg-gray-50 inline-block px-2 py-1 rounded">수량: {item.quantity}개</p>
                                </div>
                                <div className="text-right font-bold text-gray-900">
                                  ₩{(item.price * item.quantity).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-3 mt-8 pt-8 border-t border-gray-50">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all text-xs font-medium">
                              <Box className="w-4 h-4" /> 배송 조회
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-xs font-medium text-gray-600">
                              상세 보기 <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-3xl p-20 shadow-sm border border-dashed border-gray-200 text-center">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">아직 주문 내역이 없습니다</h3>
                    <Link to="/store" className="inline-block mt-6 px-10 py-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all font-semibold">스토어 구경하기</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}