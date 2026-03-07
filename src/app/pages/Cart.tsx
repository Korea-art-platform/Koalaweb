import { Link } from 'react-router';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useState } from 'react';

interface CartItem {
  id: number;
  name: string;
  artist: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

// Mock cart data
const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Modern Hanbok Series #001',
    artist: 'Kim Min-ji',
    price: 450000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400',
    size: 'Limited Edition',
  },
  {
    id: 2,
    name: 'Seoul Nights Collectible',
    artist: 'Park Seo-jun',
    price: 280000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400',
    size: 'Standard',
  },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0); // 수량이 0 이하면 삭제
      
      return newItems;
    });
  };

  const removeItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

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
              {cartItems.length} items in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Add some items to get started</p>
              <Link
                to="/smart-store"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
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
                          <h3 className="font-medium mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">
                            by {item.artist}
                          </p>
                          <p className="text-xs text-gray-400">{item.size}</p>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm w-8 text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-medium">
                          ₩{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping */}
                <Link
                  to="/smart-store"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-28">
                  <h2 className="text-xl mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₩{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span>₩{shipping.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-medium text-lg">
                          ₩{total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="block w-full py-3 bg-black text-white text-center rounded-xl hover:bg-gray-900 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    Secure checkout powered by KoALa
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
