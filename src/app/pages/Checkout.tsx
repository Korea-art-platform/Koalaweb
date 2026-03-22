import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, MapPin, CreditCard, Package, Plus, Check, ChevronRight } from 'lucide-react';
import Navigation from '../components/layouts/Header';
import { createOrder } from '../../api/order';
import { getCart } from '../../api/cart';

type PaymentMethodType = 'TOSS' | 'KAKAOPAY' | 'NAVERPAY' | 'CARD';

interface PaymentMethod {
  id: PaymentMethodType;
  nameKo: string;
  icon: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'TOSS', nameKo: '토스페이', icon: '💙', description: '토스 앱 간편 결제' },
  { id: 'KAKAOPAY', nameKo: '카카오페이', icon: '💛', description: '카카오톡 간편 결제' },
  { id: 'NAVERPAY', nameKo: '네이버페이', icon: '💚', description: '네이버 포인트 적립' },
  { id: 'CARD', nameKo: '신용/체크카드', icon: '💳', description: '일반 카드 결제' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 배송지 폼
  const [form, setForm] = useState({
    ordererName: '',
    ordererEmail: '',
    ordererPhone: '',
    recipientName: '',
    recipientPhone: '',
    zipCode: '',
    address1: '',
    address2: '',
    deliveryRequest: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await getCart();
        setCart(res.data.data);
      } catch (e) {
        console.error('장바구니 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const cartItems = cart?.items ?? [];
  const subtotal = cart?.subtotalAmount ?? 0;
  const shipping = cartItems.length > 0 ? (subtotal >= 50000 ? 0 : 3000) : 0;
  const total = subtotal + shipping;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrder = async () => {
    if (!selectedMethod) {
      alert('결제 수단을 선택해 주세요.');
      return;
    }
    if (!form.ordererName || !form.ordererEmail || !form.ordererPhone) {
      alert('주문자 정보를 입력해 주세요.');
      return;
    }
    if (!form.recipientName || !form.recipientPhone || !form.zipCode || !form.address1) {
      alert('배송지 정보를 입력해 주세요.');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await createOrder({
        ordererName: form.ordererName,
        ordererEmail: form.ordererEmail,
        ordererPhone: form.ordererPhone,
        shipment: {
          recipientName: form.recipientName,
          recipientPhone: form.recipientPhone,
          zipCode: form.zipCode,
          address1: form.address1,
          address2: form.address2,
          deliveryRequest: form.deliveryRequest,
        },
        cartItemIds: [],
      });

      const order = res.data.data;
      window.dispatchEvent(new Event('cart-updated'));

      navigate('/checkout/success', {
        state: {
          orderNo: order.orderNo,
          orderInfo: {
            subtotal,
            shipping,
            total,
            items: cartItems,
          },
          shippingAddress: {
            recipient: form.recipientName,
            phone: form.recipientPhone,
            address: form.address1,
            address2: form.address2,
          },
          paymentMethod: selectedMethod,
        },
      });
    } catch (e: any) {
      alert(e.response?.data?.message || '주문 생성에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navigation />
        <div className="pt-32 px-8 animate-pulse max-w-[1300px] mx-auto">
          <div className="h-10 bg-gray-100 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-white rounded-[32px]" />
              <div className="h-48 bg-white rounded-[32px]" />
            </div>
            <div className="h-80 bg-white rounded-[32px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-20 px-8">
        <div className="max-w-[1300px] mx-auto">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-black mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            장바구니로 돌아가기
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <h1 className="text-3xl font-medium tracking-tight">주문 및 결제</h1>

              {/* 주문자 정보 */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-gray-400" /> 주문자 정보
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'ordererName', label: '이름', placeholder: '홍길동' },
                    { name: 'ordererEmail', label: '이메일', placeholder: 'your@email.com' },
                    { name: 'ordererPhone', label: '전화번호', placeholder: '01012345678' },
                  ].map((field) => (
                    <div key={field.name} className={field.name === 'ordererEmail' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm text-gray-500 mb-2">{field.label}</label>
                      <input
                        name={field.name}
                        value={(form as any)[field.name]}
                        onChange={handleFormChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:outline-none focus:border-gray-300 transition-colors text-sm"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* 배송지 정보 */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-gray-400" /> 배송 정보
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'recipientName', label: '수령인', placeholder: '홍길동' },
                    { name: 'recipientPhone', label: '수령인 전화번호', placeholder: '01012345678' },
                    { name: 'zipCode', label: '우편번호', placeholder: '06234' },
                    { name: 'address1', label: '주소', placeholder: '서울시 강남구 테헤란로 123', colSpan: true },
                    { name: 'address2', label: '상세 주소', placeholder: '456호', colSpan: true },
                    { name: 'deliveryRequest', label: '배송 요청사항', placeholder: '문 앞에 놓아주세요', colSpan: true },
                  ].map((field: any) => (
                    <div key={field.name} className={field.colSpan ? 'md:col-span-2' : ''}>
                      <label className="block text-sm text-gray-500 mb-2">{field.label}</label>
                      <input
                        name={field.name}
                        value={(form as any)[field.name]}
                        onChange={handleFormChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:outline-none focus:border-gray-300 transition-colors text-sm"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* 주문 상품 */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-gray-400" /> 주문 상품 ({cartItems.length})
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-center">
                      <img
                        src={item.primaryImageUrl ?? 'https://via.placeholder.com/80'}
                        className="w-20 h-20 rounded-xl object-cover border bg-white"
                        alt={item.skuName}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 mb-0.5">{item.skuName}</p>
                        <p className="text-xs text-gray-400">수량: {item.quantity}개</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">₩{item.lineAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 결제 수단 */}
              <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-gray-400" /> 결제 수단
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`group p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${selectedMethod === method.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                    >
                      <div className="text-3xl transition-transform group-hover:scale-110">
                        {method.icon}
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-gray-900">{method.nameKo}</span>
                        <span className="text-[10px] text-gray-400">{method.description}</span>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* 주문 요약 사이드바 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-xl font-medium mb-8">최종 주문 합계</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">상품 금액</span>
                    <span className="font-medium text-gray-900">₩{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">배송비</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-blue-600'}`}>
                      {shipping === 0 ? '무료' : `₩${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-900">최종 결제 금액</span>
                      <span className="text-3xl font-black text-black tracking-tighter">
                        ₩{total.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 text-right">
                      * 부가세 포함
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={cartItems.length === 0 || !selectedMethod || isProcessing}
                  className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${cartItems.length > 0 && selectedMethod && !isProcessing
                      ? 'bg-black text-white hover:bg-gray-800 shadow-black/10 active:scale-[0.98]'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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