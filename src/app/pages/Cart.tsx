import { Link, useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Navigation from '../components/layouts/Header';
import { useState, useEffect } from 'react';

interface CartItem {
  id: string | number;
  name: string;
  artist: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

export default function Cart() {
  const navigate = useNavigate();

  // 1. 초기값: localStorage에서 데이터를 가져오거나 없으면 빈 배열
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. 장바구니 상태가 변경될 때마다 localStorage 업데이트 및 헤더 동기화 이벤트 발생
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    // 헤더 아이콘 수량 업데이트를 위한 이벤트 발생
    window.dispatchEvent(new Event('cart-updated'));
  }, [cartItems]);

  // 수량 조절 함수
  const updateQuantity = (id: string | number, delta: number) => {
    setCartItems(prevItems => {
      return prevItems
        .map(item => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0); // 수량이 0 이하면 자동 삭제
    });
  };

  // 삭제 함수
  const removeItem = (id: string | number) => {
    if (window.confirm('장바구니에서 해당 상품을 삭제하시겠습니까?')) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  // 계산 로직
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 15000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1200px] mx-auto">
          {/* 헤더 섹션 */}
          <div className="mb-12">
            <h1 className="text-3xl font-medium tracking-tight mb-2">장바구니</h1>
            <p className="text-sm text-gray-400">
              {cartItems.length === 0 
                ? "장바구니가 비어 있습니다." 
                : `현재 ${cartItems.length}개의 상품이 담겨 있습니다.`}
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-200 mb-4" />
              <h2 className="text-2xl mb-2">장바구니가 비어있습니다.</h2>
              <p className="text-gray-500 mb-8">당신의 공간을 채울 멋진 작품을 찾아보세요.</p>
              <Link
                to="/store"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                쇼핑 계속하기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 장바구니 아이템 리스트 */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md"
                  >
                    <div className="flex gap-6">
                      {/* 상품 이미지 */}
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 상품 상세 정보 */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">{item.artist} 작가</p>
                          <p className="text-xs text-gray-400">{item.size}</p>
                        </div>

                        {/* 수량 조절 및 삭제 */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                            title="삭제"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* 가격 정보 */}
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          ₩{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400 mt-1">
                            개당 ₩{item.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors pt-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  쇼핑 계속하기
                </Link>
              </div>

              {/* 주문 요약 사이드바 */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-28">
                  <h2 className="text-xl mb-6 font-semibold">주문 요약</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">상품 합계</span>
                      <span className="font-medium">₩{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">배송비</span>
                      <span className="font-medium text-green-600">
                        {shipping === 0 ? "무료 배송" : `₩${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="flex justify-between items-end">
                        <span className="font-medium text-gray-900">최종 결제 금액</span>
                        <div className="text-right">
                          <span className="block text-2xl font-bold text-black">
                            ₩{total.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                            부가가치세 포함
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 결제 페이지 이동 버튼 */}
                  <Link
                    to="/checkout"
                    className="block w-full py-4 bg-black text-white text-center rounded-2xl hover:bg-gray-900 transition-transform active:scale-[0.98] font-medium"
                  >
                    주문 결제하기
                  </Link>

                  <div className="mt-6 flex flex-col items-center gap-2">
                    <p className="text-[11px] text-gray-400 text-center">
                      KoALa의 안전 결제 시스템이 적용됩니다
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}