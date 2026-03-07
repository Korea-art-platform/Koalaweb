import { Link, useLocation } from 'react-router';
import { User, MapPin, CreditCard, Package, Heart, Settings, LogOut, ChevronRight, Box } from 'lucide-react';
import Navigation from '../components/Navigation';

const menuItems = [
  { icon: User, label: 'Profile', path: '/account' },
  { icon: Package, label: 'Orders', path: '/account/orders' },
  { icon: MapPin, label: 'Addresses', path: '/account/addresses' },
  { icon: CreditCard, label: 'Payment Methods', path: '/account/payment-methods' },
  { icon: Heart, label: 'Wishlist', path: '/account/wishlist' },
  { icon: Settings, label: 'Settings', path: '/account/settings' },
];

// Mock orders data
const orders = [
  {
    id: 'KA-8XN4MP7Q2',
    date: 'February 28, 2026',
    status: 'In Transit',
    statusColor: 'blue',
    total: 510000,
    items: [
      {
        name: 'Modern Hanbok Series #001',
        artist: 'Kim Min-ji',
        quantity: 1,
        price: 450000,
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200',
      },
    ],
    tracking: 'KE123456789KR',
  },
  {
    id: 'KA-2LK9QP5W7',
    date: 'February 15, 2026',
    status: 'Delivered',
    statusColor: 'green',
    total: 820000,
    items: [
      {
        name: 'Seoul Nights Collectible',
        artist: 'Park Seo-jun',
        quantity: 2,
        price: 280000,
        image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=200',
      },
      {
        name: 'K-Culture Art Box',
        artist: 'Lee Hyun-soo',
        quantity: 1,
        price: 180000,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200',
      },
    ],
    deliveredDate: 'February 18, 2026',
  },
  {
    id: 'KA-9FG3HL8M4',
    date: 'January 22, 2026',
    status: 'Delivered',
    statusColor: 'green',
    total: 380000,
    items: [
      {
        name: 'Hanbok Figure Limited',
        artist: 'Choi Ji-woo',
        quantity: 1,
        price: 350000,
        image: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=200',
      },
    ],
    deliveredDate: 'January 25, 2026',
  },
];

const getStatusColor = (color: string) => {
  const colors: { [key: string]: string } = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    gray: 'bg-gray-50 text-gray-600 border-gray-100',
  };
  return colors[color] || colors.gray;
};

export default function AccountOrders() {
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
              View your order history
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
              <div className="mb-8">
                <h2 className="text-2xl mb-1">Order History</h2>
                <p className="text-sm text-gray-400">
                  {orders.length} orders placed
                </p>
              </div>

              {/* Orders List */}
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-6">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Order Number</p>
                            <p className="font-medium">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Order Date</p>
                            <p className="text-sm">{order.date}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Total</p>
                            <p className="font-medium">₩{order.total.toLocaleString()}</p>
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getStatusColor(order.statusColor)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-8">
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{item.name}</h4>
                              <p className="text-sm text-gray-400 mb-2">
                                by {item.artist}
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ₩{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Actions */}
                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
                        {order.status === 'In Transit' && order.tracking && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
                            <Box className="w-4 h-4" />
                            Track Package
                          </button>
                        )}
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        {order.status === 'Delivered' && (
                          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            Buy Again
                          </button>
                        )}
                      </div>

                      {/* Delivery Info */}
                      {order.deliveredDate && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-400">
                            Delivered on {order.deliveredDate}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State (if needed) */}
              {orders.length === 0 && (
                <div className="bg-white rounded-2xl p-16 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl mb-2">No Orders Yet</h3>
                  <p className="text-sm text-gray-400 mb-8">
                    Start exploring our collection
                  </p>
                  <Link
                    to="/store"
                    className="inline-block px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
                  >
                    Browse Store
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
