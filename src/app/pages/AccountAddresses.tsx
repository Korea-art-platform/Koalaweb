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

// Mock addresses data
const addresses = [
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
  {
    id: 3,
    name: 'Parents House',
    recipient: 'Kim Min-ji',
    address: '789 Seongbuk-ro, Seongbuk-gu',
    city: 'Seoul',
    zipCode: '02876',
    phone: '+82 10-1234-5678',
    isDefault: false,
  },
];

export default function AccountAddresses() {
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
              Manage your shipping addresses
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
                  <h2 className="text-2xl mb-1">Saved Addresses</h2>
                  <p className="text-sm text-gray-400">
                    Manage your shipping addresses
                  </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative"
                  >
                    {/* Default Badge */}
                    {address.isDefault && (
                      <div className="absolute top-6 right-6">
                        <span className="text-xs px-3 py-1 bg-black text-white rounded-full">
                          Default
                        </span>
                      </div>
                    )}

                    {/* Address Info */}
                    <div className="mb-6">
                      <h3 className="font-medium text-lg mb-3">{address.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{address.recipient}</p>
                        <p>{address.address}</p>
                        <p>{address.city} {address.zipCode}</p>
                        <p className="pt-2">{address.phone}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      {!address.isDefault && (
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

                {/* Add New Address Card */}
                <button className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors flex flex-col items-center justify-center min-h-[280px]">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Add New Address</p>
                  <p className="text-xs text-gray-400">
                    Save time on checkout
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
