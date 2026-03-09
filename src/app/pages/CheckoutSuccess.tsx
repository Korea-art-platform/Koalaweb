import { Link, useLocation } from 'react-router';
import { CheckCircle, Package, MapPin, CreditCard, ChevronRight, Home } from 'lucide-react';
import Navigation from '../components/layouts/Header';
import { useEffect, useState } from 'react';

export default function CheckoutSuccess() {
  const location = useLocation();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // 1. 우선 navigate의 state에서 데이터를 가져옵니다.
    if (location.state) {
      setOrderData(location.state);
    } else {
      // 2. 만약 새로고침 등으로 state가 날아갔다면, localStorage에서 가장 최근 주문을 가져옵니다.
      const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      if (history.length > 0) {
        setOrderData({
          orderNumber: history[history.length - 1].id,
          // 통합된 데이터 구조에 맞춰 매핑
          orderInfo: {
            subtotal: history[history.length - 1].subtotal,
            shipping: history[history.length - 1].shipping,
            total: history[history.length - 1].total,
            items: history[history.length - 1].items
          },
          shippingAddress: history[history.length - 1].shippingAddress
        });
      }
    }
  }, [location]);

  // 데이터 로딩 중이거나 없을 때 처리
  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Package className="w-16 h-16 text-gray-200 mb-4" />
        <p className="text-gray-500 mb-8">주문 정보를 찾을 수 없습니다.</p>
        <Link to="/" className="px-8 py-3 bg-black text-white rounded-2xl font-medium">홈으로 돌아가기</Link>
      </div>
    );
  }

  const { orderNumber, orderInfo, shippingAddress } = orderData;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      
      <div className="pt-24 pb-20 px-8">
        <div className="max-w-2xl mx-auto">
          {/* 성공 섹션 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-[32px] mb-6 animate-in zoom-in duration-500">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3 text-gray-900">결제가 완료되었습니다!</h1>
            <p className="text-gray-400">KoALa와 함께해주셔서 감사합니다. 소중한 작품을 곧 보내드릴게요.</p>
          </div>

          {/* 핵심 주문 정보 카드 */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-2 gap-8 pb-8 border-b border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">주문 번호</p>
                <p className="text-lg font-bold text-gray-900">{orderNumber}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">주문 일자</p>
                <p className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString('ko-KR')}</p>
              </div>
            </div>

            <div className="py-8 border-b border-gray-100 space-y-6 text-sm">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">배송지 정보</p>
                  <p className="text-gray-600">{shippingAddress?.recipient} ({shippingAddress?.phone})</p>
                  <p className="text-gray-400 mt-0.5">{shippingAddress?.address} {shippingAddress?.city}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">결제 완료</p>
                  <p className="text-gray-600">선택하신 수단으로 결제가 정상 처리되었습니다.</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-gray-400">총 결제 금액</span>
                <span className="text-3xl font-black text-black tracking-tighter">₩{orderInfo?.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 구매 상품 목록 카드 */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">주문 상품 정보</h2>
            <div className="space-y-4">
              {/* 핵심 에러 방지: items가 존재할 때만 map 실행 */}
              {orderInfo?.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-5 items-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.artist} 작가</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₩{item.price?.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400">수량: {item.quantity}개</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 영수증 상세 내역 (부가세 삭제 버전) */}
            <div className="mt-8 pt-8 border-t border-gray-50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">상품 금액 합계</span>
                <span className="text-gray-900 font-medium">₩{orderInfo?.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">배송비</span>
                <span className="text-blue-600 font-medium">₩{orderInfo?.shipping?.toLocaleString()}</span>
              </div>
              {/* Tax(부가세) 행 삭제 완료 */}
            </div>
          </div>

          {/* 하단 버튼 액션 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/account/orders" 
              className="flex-1 py-5 bg-black text-white rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/5"
            >
              주문 내역 확인 <ChevronRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/store" 
              className="flex-1 py-5 bg-white border border-gray-200 text-gray-600 rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              <Home className="w-4 h-4" /> 쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}