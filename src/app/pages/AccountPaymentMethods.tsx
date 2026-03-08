import { Link, useLocation } from 'react-router';
import { User, MapPin, CreditCard, Package, Heart, Settings, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';
import Navigation from '../components/layouts/Header';

const menuItems = [
  { icon: User, label: 'Profile', path: '/account' },
  { icon: Package, label: 'Orders', path: '/account/orders' },
  { icon: MapPin, label: 'Addresses', path: '/account/addresses' },
  { icon: CreditCard, label: 'Payment Methods', path: '/account/payment-methods' },
  { icon: Heart, label: 'Wishlist', path: '/account/wishlist' },
  { icon: Settings, label: 'Settings', path: '/account/settings' },
];

// Mock payment methods data
const paymentMethods = [
  {
    id: 1,
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiry: '12/25',
    holder: 'Kim Min-ji',
    isDefault: true,
  },
  {
    id: 2,
    type: 'card',
    brand: 'Mastercard',
    last4: '8888',
    expiry: '09/26',
    holder: 'Kim Min-ji',
    isDefault: false,
  },
  {
    id: 3,
    type: 'card',
    brand: 'American Express',
    last4: '1234',
    expiry: '03/27',
    holder: 'Kim Min-ji',
    isDefault: false,
  },
];

const getCardGradient = (brand: string) => {
  const gradients: { [key: string]: string } = {
    'Visa': 'from-blue-600 to-blue-800',
    'Mastercard': 'from-orange-500 to-red-600',
    'American Express': 'from-gray-700 to-gray-900',
  };
  return gradients[brand] || 'from-gray-700 to-gray-900';
};

export default function AccountPaymentMethods() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl tracking-tight mb-2">My Account</h1>
            <p className="text-sm text-gray-400">
              Manage your payment methods
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Menu */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {/* User Info */}
                <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white">
                    KM
                  </div>
                  <div>
                    <p className="font-medium">Kim Min-ji</p>
                    <p className="text-xs text-gray-400">kim@example.com</p>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gray-50 text-black'
                            : 'text-gray-400 hover:text-black hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Logout */}
                <button className="flex items-center gap-3 px-4 py-3 mt-6 w-full text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header with Add Button */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl mb-1">Payment Methods</h2>
                  <p className="text-sm text-gray-400">
                    Manage your saved payment methods
                  </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Card
                </button>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    {/* Card Visual */}
                    <div className={`bg-gradient-to-br ${getCardGradient(method.brand)} rounded-xl p-6 mb-6 relative overflow-hidden`}>
                      {/* Decorative circles */}
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
                      <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
                      
                      {/* Card Content */}
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                          <CreditCard className="w-8 h-8 text-white/80" />
                          {method.isDefault && (
                            <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-6">
                          <p className="text-white text-lg tracking-wider font-mono">
                            •••• •••• •••• {method.last4}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white/60 text-xs mb-1">Card Holder</p>
                            <p className="text-white text-sm">{method.holder}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-xs mb-1">Expires</p>
                            <p className="text-white text-sm">{method.expiry}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="mb-4">
                      <p className="font-medium mb-1">{method.brand}</p>
                      <p className="text-sm text-gray-400">
                        Ending in {method.last4}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      {!method.isDefault && (
                        <button className="flex-1 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          Set as Default
                        </button>
                      )}
                      <button className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add New Card */}
                <button className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors flex flex-col items-center justify-center min-h-[360px]">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Add New Card</p>
                  <p className="text-xs text-gray-400">
                    Secure checkout with saved cards
                  </p>
                </button>
              </div>

              {/* Security Note */}
              <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Secure Payment</h3>
                    <p className="text-sm text-gray-600">
                      Your payment information is encrypted and stored securely. 
                      We never store your full card number and use industry-standard 
                      security measures to protect your data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
