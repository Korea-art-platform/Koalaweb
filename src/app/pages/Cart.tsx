import { Link, useNavigate } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Navigation from '../components/layouts/Header';
import { useState, useEffect } from 'react';
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../../api/cart';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 장바구니 불러오기
  const fetchCart = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await getCart();
      setCart(res.data.data);
    } catch (e) {
      console.error('장바구니 로딩 실패:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 수량 변경
  const handleUpdateQuantity = async (itemId: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      const res = await updateCartItem(itemId, newQty);
      setCart(res.data.data);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error('수량 변경 실패:', e);
    }
  };

  // 아이템 삭제
  const handleRemoveItem = async (itemId: number) => {
    if (!window.confirm('장바구니에서 해당 상품을 삭제하시겠습니까?')) return;
    try {
      const res = await removeCartItem(itemId);
      setCart(res.data.data);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error('삭제 실패:', e);
    }
  };

  // 장바구니 비우기
  const handleClearCart = async () => {
    if (!window.confirm('장바구니를 모두 비우시겠습니까?')) return;
    try {
      await clearCart();
      setCart(null);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error('장바구니 비우기 실패:', e);
    }
  };

  const cartItems = cart?.items ?? [];
  const subtotal = cart?.subtotalAmount ?? 0;
  const shipping = cartItems.length > 0
    ? (subtotal >= 50000 ? 0 : 3000)
    : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Navigation />
        <div className="pt-24 pb-16 px-8">
          <div className="max-w-[1200px] mx-auto animate-pulse">
            <div className="h-10 bg-gray-100 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-12" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 h-40" />
                ))}
              </div>
              <div className="bg-white rounded-2xl p-8 h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1200px] mx-auto">

          {/* 헤더 */}
          <div className="mb-12">
            <h1 className="text-3xl font-medium tracking-tight mb-2">장바구니</h1>
            <p className="text-sm text-gray-400">
              {cartItems.length === 0
                ? '장바구니가 비어 있습니다.'
                : `현재 ${cartItems.length}개의 상품이 담겨 있습니다.`}
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-200 mb-4" />
              <h2 className="text-2xl mb-2">장바구니가 비어있습니다.</h2>
              <p className="text-gray-500 mb-8">
                당신의 공간을 채울 멋진 작품을 찾아보세요.
              </p>
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
                {cartItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md"
                  >
                    <div className="flex gap-6">
                      {/* 상품 이미지 */}
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.primaryImageUrl ?? 'https://via.placeholder.com/128'}
                          alt={item.skuName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 상품 상세 */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-lg mb-1">{item.skuName}</h3>
                          <p className="text-sm text-gray-400 mb-1">
                            ₩{item.unitPrice.toLocaleString()} / 개
                          </p>
                        </div>

                        {/* 수량 조절 */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* 가격 */}
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          ₩{item.lineAmount.toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400 mt-1">
                            개당 ₩{item.unitPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4">
                  <Link
                    to="/store"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    쇼핑 계속하기
                  </Link>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    전체 삭제
                  </button>
                </div>
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
                      <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                        {shipping === 0 ? '무료 배송' : `₩${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-gray-400">
                        ₩50,000 이상 구매 시 무료 배송
                      </p>
                    )}

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

                  <Link
                    to="/checkout"
                    state={{ cartItems, subtotal, shipping, total }}
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