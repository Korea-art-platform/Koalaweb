import { AdminLayout } from '@/app/components/layouts/AdminLayout';
import { Package, Users, ShoppingBag, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router';

const stats = [
  {
    label: '총 상품',
    value: '127',
    change: '+12.5%',
    trend: 'up',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    label: '아티스트',
    value: '24',
    change: '+3',
    trend: 'up',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    label: '이번 달 주문',
    value: '89',
    change: '-5.2%',
    trend: 'down',
    icon: ShoppingBag,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    label: '이번 달 매출',
    value: '₩42.5M',
    change: '+18.3%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
];

const recentProducts = [
  { id: '1', name: 'Harmony Spirit', artist: '김원근', price: 250000, status: '판매중', date: '2026-04-10' },
  { id: '2', name: 'Urban Poetry', artist: '박지영', price: 380000, status: '품절', date: '2026-04-09' },
  { id: '3', name: 'Digital Dreams', artist: '이수민', price: 190000, status: '판매중', date: '2026-04-08' },
  { id: '4', name: 'Nature Blend', artist: '김원근', price: 420000, status: '판매중', date: '2026-04-07' },
  { id: '5', name: 'Abstract Mind', artist: '최윤아', price: 350000, status: '판매중', date: '2026-04-06' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">대시보드</h1>
          <p className="text-xs text-gray-500 mt-0.5">KoALa 관리자 패널에 오신 것을 환영합니다</p>
        </div>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-[1400px] mx-auto space-y-8">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">최근 등록 상품</h2>
                <p className="text-sm text-gray-500 mt-0.5">가장 최근에 등록된 상품 목록입니다</p>
              </div>
              <Link
                to="/admin/products"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                전체보기
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">상품명</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">아티스트</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">가격</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">상태</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">등록일</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.artist}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        ₩{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.status === '판매중'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
