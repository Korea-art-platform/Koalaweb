import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ArrowLeft, CreditCard, Smartphone, Wallet, Building2, Check } from 'lucide-react';
import Navigation from '../components/Navigation';

// Payment method types
type PaymentMethodType = 'card' | 'toss' | 'kakao' | 'naver' | 'payco' | 'samsung';

interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  nameKo: string;
  icon: string;
  description: string;
  color: string;
  textColor?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'toss',
    name: 'Toss Pay',
    nameKo: '토스페이',
    icon: '💙',
    description: 'Quick payment with Toss',
    color: '#0064FF',
    textColor: '#FFFFFF',
  },
  {
    id: 'kakao',
    name: 'Kakao Pay',
    nameKo: '카카오페이',
    icon: '💛',
    description: 'Pay with Kakao Talk',
    color: '#FEE500',
    textColor: '#000000',
  },
  {
    id: 'naver',
    name: 'Naver Pay',
    nameKo: '네이버페이',
    icon: '💚',
    description: 'Pay with Naver',
    color: '#03C75A',
    textColor: '#FFFFFF',
  },
  {
    id: 'payco',
    name: 'PAYCO',
    nameKo: '페이코',
    icon: '❤️',
    description: 'NHN PAYCO payment',
    color: '#FF0000',
    textColor: '#FFFFFF',
  },
  {
    id: 'samsung',
    name: 'Samsung Pay',
    nameKo: '삼성페이',
    icon: '📱',
    description: 'Pay with Samsung device',
    color: '#1428A0',
    textColor: '#FFFFFF',
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    nameKo: '신용/체크카드',
    icon: '💳',
    description: 'Pay directly with card',
    color: '#000000',
    textColor: '#FFFFFF',
  },
];

export default function PaymentSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get order info from location state or use default
  const orderInfo = location.state?.orderInfo || {
    subtotal: 450000,
    shipping: 15000,
    tax: 45000,
    total: 510000,
    items: [
      { name: 'Modern Hanbok Series #001', artist: 'Kim Min-ji', price: 450000 }
    ]
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // In a real app, you would call the payment API here
      console.log(`Processing payment with ${selectedMethod}`);
      
      // Navigate to order confirmation
      navigate('/checkout/confirm', {
        state: {
          orderInfo,
          paymentMethod: selectedMethod,
        }
      });
      
      setIsProcessing(false);
    }, 1500);
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
            Back to Checkout
          </button>

          <div className="mb-8">
            <h1 className="text-3xl tracking-tight mb-2">Select Payment Method</h1>
            <p className="text-sm text-gray-400">
              Choose how you'd like to pay
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg mb-6">Payment Options</h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                        selectedMethod === method.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Payment Icon */}
                          <div 
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: method.color + '20' }}
                          >
                            {method.icon}
                          </div>
                          
                          {/* Payment Info */}
                          <div>
                            <div className="font-medium mb-0.5">
                              {method.name}
                            </div>
                            <div className="text-sm text-gray-400 mb-1">
                              {method.nameKo}
                            </div>
                            <div className="text-xs text-gray-400">
                              {method.description}
                            </div>
                          </div>
                        </div>

                        {/* Selection Indicator */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedMethod === method.id
                            ? 'border-black bg-black'
                            : 'border-gray-300'
                        }`}>
                          {selectedMethod === method.id && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    🔒 Your payment information is encrypted and secure. 
                    KoALa does not store your payment details.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-lg mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                  {orderInfo.items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate mb-0.5">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>

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
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-medium text-xl">₩{orderInfo.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={!selectedMethod || isProcessing}
                  className={`w-full py-4 rounded-xl transition-all ${
                    selectedMethod && !isProcessing
                      ? 'bg-black text-white hover:bg-gray-900'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing...
                    </span>
                  ) : (
                    `Pay ₩${orderInfo.total.toLocaleString()}`
                  )}
                </button>

                {selectedMethod && (
                  <p className="text-xs text-gray-400 text-center mt-3">
                    You'll be redirected to complete payment
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
