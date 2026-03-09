import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import { ArrowLeft, MapPin, CreditCard, Package, Plus, Check, ChevronRight } from 'lucide-react';
import Navigation from '../components/layouts/Header';

// 1. 타입 정의
type PaymentMethodType = 'card' | 'toss' | 'kakao' | 'naver' | 'payco' | 'samsung';

interface PaymentMethod {
  id: PaymentMethodType;
  nameKo: string;
  icon: string;
  description: string;
  color: string;
}

// 2. 고정 데이터 (결제 수단 & 배송지)
const paymentMethods: PaymentMethod[] = [
  { id: 'toss', nameKo: '토스페이', icon: '💙', description: '토스 앱 간편 결제', color: '#0064FF' },
  { id: 'kakao', nameKo: '카카오페이', icon: '💛', description: '카카오톡 간편 결제', color: '#FEE500' },
  { id: 'naver', nameKo: '네이버페이', icon: '💚', description: '네이버 포인트 적립', color: '#03C75A' },
  { id: 'samsung', nameKo: '삼성페이', icon: '📱', description: '삼성 기기 터치 결제', color: '#1428A0' },
  { id: 'card', nameKo: '신용/체크카드', icon: '💳', description: '일반 카드 결제', color: '#000000' },
];

const savedAddresses = [
  { id: 1, name: '우리집', recipient: '김민지', address: '서울특별시 강남구 테헤란로 123', city: '강남아파트 101동', zipCode: '06123', phone: '010-1234-5678', isDefault: true },
  { id: 2, name: '회사', recipient: '김민지', address: '서울특별시 서초구 서초대로 456', city: '코알라 타워 5층', zipCode: '06789', phone: '010-1234-5678', isDefault: false },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 3. localStorage에서 실제 장바구니 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  // 4. 금액 계산 (부가세 제외: 상품가 + 배송비)
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = cartItems.length > 0 ? 15000 : 0;
    return { subtotal, shipping, total: subtotal + shipping };
  }, [cartItems]);

  // 5. 최종 결제 처리 로직
  const handleOrder = () => {
    if (!selectedMethod) {
      alert("결제 수단을 선택해 주세요.");
      return;
    }

    setIsProcessing(true);

    const address = savedAddresses.find(a => a.id === selectedAddress);
    const newOrder = {
      id: 'KA-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      status: 'Processing',
      items: cartItems,
      total: totals.total,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      shippingAddress: address,
      paymentMethod: paymentMethods.find(m => m.id === selectedMethod)?.nameKo
    };

    // 가상 결제 승인 프로세스 (2초)
    setTimeout(() => {
      // 주문 내역 저장
      const existingHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      localStorage.setItem('orderHistory', JSON.stringify([...existingHistory, newOrder]));

      // 장바구니 비우기
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));

      // 성공 페이지로 이동
      navigate('/checkout/success', { 
        state: { 
          orderNumber: newOrder.id, 
          orderInfo: totals, 
          shippingAddress: address 
        } 
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      
      <div className="pt-24 pb-20 px-8">
        <div className="max-w-[1300px] mx-auto">
          {/* 상단 네비게이션 */}
          <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-black mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 장바구니로 돌아가기
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* 메인 섹션: 정보 입력 */}
            <div className="lg:col-span-2 space-y-8">
              <h1 className="text-3xl font-medium tracking-tight">주문 및 결제</h1>

              {/* 1. 배송지 선택 */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" /> 배송 정보
                  </h2>
                  <button className="text-sm font-medium text-gray-400 hover:text-black flex items-center gap-1 transition-colors">
                    <Plus className="w-4 h-4" /> 새 주소 추가
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedAddress === addr.id ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between mb-4">
                        <span className="font-bold text-sm bg-white px-2 py-0.5 rounded-lg border border-gray-100">{addr.name}</span>
                        {selectedAddress === addr.id && (
                          <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center animate-in zoom-in">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 font-bold">{addr.recipient}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{addr.address}, {addr.city}</p>
                      <p className="text-xs text-gray-400 mt-2 font-mono">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. 주문 상품 리스트 */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-gray-400" /> 주문 상품 ({cartItems.length})
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-center border border-transparent hover:border-gray-100 transition-colors">
                      <img src={item.image} className="w-20 h-20 rounded-xl object-cover border bg-white" alt="" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 mb-0.5">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.artist} 작가</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">₩{item.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">수량: {item.quantity}개</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. 결제 수단 선택 (기존 PaymentSelection 통합) */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-gray-400" /> 결제 수단
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`group p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                        selectedMethod === method.id ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className="text-3xl transition-transform group-hover:scale-110">{method.icon}</div>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-gray-900">{method.nameKo}</span>
                        <span className="text-[10px] text-gray-400">{method.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* 오른쪽: 주문 요약 사이드바 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-xl font-medium mb-8">최종 주문 합계</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">상품 금액</span>
                    <span className="font-medium text-gray-900">₩{totals.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">배송비</span>
                    <span className="font-medium text-blue-600">₩{totals.shipping.toLocaleString()}</span>
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-900">최종 결제 금액</span>
                      <span className="text-3xl font-black text-black tracking-tighter">
                        ₩{totals.total.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 text-right leading-relaxed">
                      * 상품 금액에 부가세가 포함되어 있습니다.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={cartItems.length === 0 || !selectedMethod || isProcessing}
                  className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    cartItems.length > 0 && selectedMethod && !isProcessing
                      ? 'bg-black text-white hover:bg-gray-800 shadow-black/10 active:scale-[0.98]'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      결제 진행 중...
                    </>
                  ) : (
                    <>결제하기 <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>

                <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                  <p className="text-[10px] text-gray-400 leading-relaxed text-center">
                    보안 결제 시스템으로 고객님의 정보는 암호화되어 안전하게 보호됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}