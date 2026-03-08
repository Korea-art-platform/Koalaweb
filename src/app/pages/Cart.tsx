import { Link } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Navigation from '../components/layouts/Header';
import { useState, useEffect } from 'react';

interface CartItem {
  id: string | number; // ProductDetail의 id 타입과 맞춤
  name: string;
  artist: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

export default function Cart() {
  // 1. 초기값: localStorage에서 데이터를 가져오거나 없으면 빈 배열
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. 장바구니 상태가 변경될 때마다 localStorage 업데이트
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
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
    if (window.confirm('장바구니에서 삭제하시겠습니까?')) {
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
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl tracking-tight mb-2">Shopping Cart</h1>
            <p className="text-sm text-gray-400">
              {cartItems.length === 0 
                ? "Your cart is currently empty" 
                : `${cartItems.length} items in your cart`}
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
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">by {item.artist}</p>
                          <p className="text-xs text-gray-400">{item.size}</p>
                        </div>

                        {/* Quantity Controls */}
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
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          ₩{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400 mt-1">
                            ₩{item.price.toLocaleString()} / each
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
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-28">
                  <h2 className="text-xl mb-6 font-semibold">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium">₩{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium text-green-600">
                        {shipping === 0 ? "Free" : `₩${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="flex justify-between items-end">
                        <span className="font-medium text-gray-900">Total</span>
                        <div className="text-right">
                          <span className="block text-2xl font-bold text-black">
                            ₩{total.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                            VAT included
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('결제 페이지로 이동합니다.')}
                    className="block w-full py-4 bg-black text-white text-center rounded-2xl hover:bg-gray-900 transition-transform active:scale-[0.98] font-medium"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="mt-6 flex flex-col items-center gap-2">
                    <p className="text-[11px] text-gray-400 text-center">
                      Secure checkout powered by KoALa
                    </p>
                    <div className="flex gap-2 opacity-30 grayscale">
                      {/* 결제 수단 아이콘 등 추가 가능 */}
                    </div>
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