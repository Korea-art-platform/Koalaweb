import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { ArrowLeft, MapPin, CreditCard, Package, AlertCircle } from 'lucide-react';
import Navigation from '../../components/layouts/Header';

const paymentMethodNames: Record<string, { name: string, nameKo: string, icon: string }> = {
  toss: { name: 'Toss Pay', nameKo: '토스페이', icon: '💙' },
  kakao: { name: 'Kakao Pay', nameKo: '카카오페이', icon: '💛' },
  naver: { name: 'Naver Pay', nameKo: '네이버페이', icon: '💚' },
  payco: { name: 'PAYCO', nameKo: '페이코', icon: '❤️' },
  samsung: { name: 'Samsung Pay', nameKo: '삼성페이', icon: '📱' },
  card: { name: 'Credit/Debit Card', nameKo: '신용/체크카드', icon: '💳' },
};

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get order and payment info from location state
  const orderInfo = location.state?.orderInfo || {
    subtotal: 450000,
    shipping: 15000,
    tax: 45000,
    total: 510000,
    items: [
      { name: 'Modern Hanbok Series #001', artist: 'Kim Min-ji', price: 450000 }
    ]
  };

  const paymentMethod = location.state?.paymentMethod || 'card';
  const paymentInfo = paymentMethodNames[paymentMethod];

  // Mock shipping address
  const shippingAddress = {
    recipient: 'Kim Min-ji',
    address: '123 Gangnam-daero, Gangnam-gu',
    city: 'Seoul',
    zipCode: '06123',
    phone: '+82 10-1234-5678',
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      console.log('Order confirmed and placed');
      navigate('/checkout/success', {
        state: {
          orderInfo,
          paymentMethod,
          shippingAddress,
        }
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Payment
          </button>

          <div className="mb-8">
            <h1 className="text-3xl tracking-tight mb-2">Confirm Your Order</h1>
            <p className="text-sm text-gray-400">
              Please review your order details before confirming
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">
                  Review Before Confirming
                </p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Once confirmed, your payment will be processed and the order cannot be cancelled.
                  Please ensure all information is correct.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg">Order Items</h2>
                </div>

                <div className="space-y-4">
                  {orderInfo.items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-20 h-20 rounded-lg bg-gray-200"></div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{item.name}</p>
                        <p className="text-sm text-gray-400 mb-2">by {item.artist}</p>
                        <p className="text-sm">₩{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg">Shipping Address</h2>
                  </div>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="text-sm text-gray-400 hover:text-black transition-colors"
                  >
                    Edit
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-medium mb-2">{shippingAddress.recipient}</p>
                  <p className="text-sm text-gray-600 mb-1">{shippingAddress.address}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {shippingAddress.city} {shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{shippingAddress.phone}</p>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1 font-medium">
                    📦 Estimated Delivery
                  </p>
                  <p className="text-sm text-gray-700">
                    March 8-10, 2026
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg">Payment Method</h2>
                  </div>
                  <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-gray-400 hover:text-black transition-colors"
                  >
                    Change
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{paymentInfo.icon}</div>
                    <div>
                      <p className="font-medium mb-0.5">{paymentInfo.name}</p>
                      <p className="text-sm text-gray-400">{paymentInfo.nameKo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-lg mb-6">Order Summary</h2>

                {/* Pricing */}
                <div className="space-y-3 mb-6">
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
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Total</span>
                      <span className="font-medium text-xl">₩{orderInfo.total.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Payment via {paymentInfo.nameKo}
                    </p>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmOrder}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl mb-3 transition-all ${
                    isProcessing
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                      Processing...
                    </span>
                  ) : (
                    'Confirm & Pay'
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  By confirming, you agree to our{' '}
                  <Link to="/terms" className="text-black hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
