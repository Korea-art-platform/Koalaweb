import { Link, useLocation } from 'react-router';
import { User, MapPin, CreditCard, Package, Heart, Settings, LogOut } from 'lucide-react';
import Navigation from '../components/Navigation';

const menuItems = [
  { icon: User, label: 'Profile', path: '/account' },
  { icon: Package, label: 'Orders', path: '/account/orders' },
  { icon: MapPin, label: 'Addresses', path: '/account/addresses' },
  { icon: CreditCard, label: 'Payment Methods', path: '/account/payment-methods' },
  { icon: Heart, label: 'Wishlist', path: '/account/wishlist' },
  { icon: Settings, label: 'Settings', path: '/account/settings' },
];

export default function Account() {
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
              Manage your KoALa account and preferences
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
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl mb-8">Profile Information</h2>

                <form className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Min-ji"
                        className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Kim"
                        className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="kim@example.com"
                      className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+82 10-1234-5678"
                      className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>

                  {/* Language Preference */}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Language Preference
                    </label>
                    <select className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors">
                      <option>English</option>
                      <option>한국어</option>
                    </select>
                  </div>

                  {/* Newsletter */}
                  <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          Newsletter Subscription
                        </p>
                        <p className="text-xs text-gray-400">
                          Receive updates about new artists and collections
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Save Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="px-8 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <p className="text-3xl font-light mb-2">12</p>
                  <p className="text-xs text-gray-400">Total Orders</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <p className="text-3xl font-light mb-2">8</p>
                  <p className="text-xs text-gray-400">Wishlist Items</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <p className="text-3xl font-light mb-2">₩2.4M</p>
                  <p className="text-xs text-gray-400">Total Spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
