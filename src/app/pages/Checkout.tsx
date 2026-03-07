import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CreditCard, MapPin, ChevronRight, Plus } from 'lucide-react';
import Navigation from '../components/Navigation';

// Mock saved addresses
const savedAddresses = [
  {
    id: 1,
    name: 'Home',
    recipient: 'Kim Min-ji',
    address: '123 Gangnam-daero, Gangnam-gu',
    city: 'Seoul',
    zipCode: '06123',
    phone: '+82 10-1234-5678',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Office',
    recipient: 'Kim Min-ji',
    address: '456 Teheran-ro, Gangnam-gu',
    city: 'Seoul',
    zipCode: '06234',
    phone: '+82 10-1234-5678',
    isDefault: false,
  },
];

// Mock payment methods
const savedPaymentMethods = [
  {
    id: 1,
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiry: '12/25',
    isDefault: true,
  },
  {
    id: 2,
    type: 'card',
    last4: '8888',
    brand: 'Mastercard',
    expiry: '09/26',
    isDefault: false,
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(1);
  const [showNewAddress, setShowNewAddress] = useState(false);

  const handlePlaceOrder = () => {
    // Navigate to payment selection with order info
    navigate('/checkout/payment', {
      state: {
        orderInfo: {
          subtotal: 450000,
          shipping: 15000,
          tax: 45000,
          total: 510000,
          items: [
            { name: 'Modern Hanbok Series #001', artist: 'Kim Min-ji', price: 450000 }
          ]
        },
        shippingAddress: savedAddresses.find(a => a.id === selectedAddress),
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl tracking-tight mb-2">Checkout</h1>
            <p className="text-sm text-gray-400">
              Complete your order
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <h2 className="text-xl">Shipping Address</h2>
                  </div>
                  <button
                    onClick={() => setShowNewAddress(!showNewAddress)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                </div>

                {/* Saved Addresses */}
                <div className="space-y-3">
                  {savedAddresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddress === address.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{address.name}</span>
                            {address.isDefault && (
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {address.recipient}
                          </p>
                          <p className="text-sm text-gray-400">
                            {address.address}
                          </p>
                          <p className="text-sm text-gray-400">
                            {address.city} {address.zipCode}
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            {address.phone}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* New Address Form */}
                {showNewAddress && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-medium mb-4">New Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="col-span-2 px-4 py-3 bg-[#F4F4F4] rounded-xl focus:outline-none focus:border-gray-300 border border-transparent transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        className="col-span-2 px-4 py-3 bg-[#F4F4F4] rounded-xl focus:outline-none focus:border-gray-300 border border-transparent transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        className="px-4 py-3 bg-[#F4F4F4] rounded-xl focus:outline-none focus:border-gray-300 border border-transparent transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Zip Code"
                        className="px-4 py-3 bg-[#F4F4F4] rounded-xl focus:outline-none focus:border-gray-300 border border-transparent transition-colors"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="col-span-2 px-4 py-3 bg-[#F4F4F4] rounded-xl focus:outline-none focus:border-gray-300 border border-transparent transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-xl">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {savedPaymentMethods.map((payment) => (
                    <label
                      key={payment.id}
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPayment === payment.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={payment.id}
                        checked={selectedPayment === payment.id}
                        onChange={() => setSelectedPayment(payment.id)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-gradient-to-r from-gray-800 to-gray-600 rounded flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {payment.brand} •••• {payment.last4}
                              </span>
                              {payment.isDefault && (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              Expires {payment.expiry}
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <Link
                  to="/account/payment-methods"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mt-4"
                >
                  <Plus className="w-4 h-4" />
                  Add New Payment Method
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-xl mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-100"></div>
                    <div className="flex-1">
                      <p className="text-sm mb-1">Modern Hanbok Series</p>
                      <p className="text-xs text-gray-400">Qty: 1</p>
                    </div>
                    <p className="text-sm">₩450,000</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₩450,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>₩15,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>₩45,000</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-medium text-lg">₩510,000</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                  Place Order
                  <ChevronRight className="w-4 h-4" />
                </button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}