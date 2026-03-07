import { Link, useLocation } from 'react-router';
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react';
import Navigation from '../components/Navigation';

const paymentMethodNames: Record<string, { name: string, nameKo: string, icon: string }> = {
  toss: { name: 'Toss Pay', nameKo: '토스페이', icon: '💙' },
  kakao: { name: 'Kakao Pay', nameKo: '카카오페이', icon: '💛' },
  naver: { name: 'Naver Pay', nameKo: '네이버페이', icon: '💚' },
  payco: { name: 'PAYCO', nameKo: '페이코', icon: '❤️' },
  samsung: { name: 'Samsung Pay', nameKo: '삼성페이', icon: '📱' },
  card: { name: 'Credit/Debit Card', nameKo: '신용/체크카드', icon: '💳' },
};

export default function CheckoutSuccess() {
  const location = useLocation();
  const orderNumber = 'KA-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const estimatedDelivery = 'March 8-10, 2026';

  // Get order info from location state
  const orderInfo = location.state?.orderInfo;
  const paymentMethod = location.state?.paymentMethod || 'card';
  const shippingAddress = location.state?.shippingAddress || {
    recipient: 'Kim Min-ji',
    address: '123 Gangnam-daero, Gangnam-gu',
    city: 'Seoul',
    zipCode: '06123',
  };

  const paymentInfo = paymentMethodNames[paymentMethod];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl tracking-tight mb-3">Order Confirmed!</h1>
            <p className="text-sm text-gray-400">
              Thank you for your purchase from KoALa
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 mb-1">Order Number</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Order Date</p>
                <p className="font-medium">March 6, 2026</p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="py-6 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">
                    Estimated Delivery
                  </p>
                  <p className="text-sm text-gray-400">{estimatedDelivery}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    We'll send tracking information to your email
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="py-6 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Shipping Address</p>
                  <p className="text-sm text-gray-400">{shippingAddress.recipient}</p>
                  <p className="text-sm text-gray-400">
                    {shippingAddress.address}
                  </p>
                  <p className="text-sm text-gray-400">{shippingAddress.city} {shippingAddress.zipCode}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-6">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{paymentInfo.icon}</span>
                    <div>
                      <p className="text-sm text-gray-600">{paymentInfo.name}</p>
                      <p className="text-xs text-gray-400">{paymentInfo.nameKo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg mb-6">Order Items</h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
              {orderInfo?.items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gray-100"></div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">{item.name}</p>
                    <p className="text-sm text-gray-400 mb-1">by {item.artist}</p>
                    <p className="text-xs text-gray-400">Limited Edition</p>
                  </div>
                  <p className="font-medium">₩{item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Order Total */}
            {orderInfo && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₩{orderInfo.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>₩{orderInfo.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>₩{orderInfo.tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Paid</span>
                    <span className="font-medium text-lg">₩{orderInfo.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              to="/account/orders"
              className="flex-1 py-3 bg-black text-white text-center rounded-xl hover:bg-gray-900 transition-colors"
            >
              View Order Details
            </Link>
            <Link
              to="/store"
              className="flex-1 py-3 border border-gray-200 text-center rounded-xl hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Support Message */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-400">
              Need help?{' '}
              <Link to="/support" className="text-black hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}