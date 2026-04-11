import { AdminLayout } from '@/app/components/layouts/AdminLayout';
import { Search, Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

const orders = [
  {
    id: 'ORD-2026-001',
    customer: '김철수',
    product: 'Harmony Spirit',
    quantity: 1,
    total: 250000,
    status: '배송완료',
    date: '2026-04-09',
    paymentMethod: '카카오페이'
  },
  {
    id: 'ORD-2026-002',
    customer: '이영희',
    product: 'Urban Poetry',
    quantity: 1,
    total: 380000,
    status: '배송중',
    date: '2026-04-10',
    paymentMethod: '네이버페이'
  },
  {
    id: 'ORD-2026-003',
    customer: '박민수',
    product: 'Digital Dreams',
    quantity: 2,
    total: 380000,
    status: '결제완료',
    date: '2026-04-11',
    paymentMethod: '토스페이'
  },
  {
    id: 'ORD-2026-004',
    customer: '최지은',
    product: 'Nature Blend',
    quantity: 1,
    total: 420000,
    status: '주문취소',
    date: '2026-04-08',
    paymentMethod: '카카오페이'
  },
];

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('전체');

  const statuses = ['전체', '결제완료', '배송중', '배송완료', '주문취소'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '배송완료':
        return <CheckCircle className="w-4 h-4" />;
      case '배송중':
        return <Truck className="w-4 h-4" />;
      case '결제완료':
        return <Package className="w-4 h-4" />;
      case '주문취소':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '배송완료':
        return 'bg-green-50 text-green-700';
      case '배송중':
        return 'bg-blue-50 text-blue-700';
      case '결제완료':
        return 'bg-yellow-50 text-yellow-700';
      case '주문취소':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <header className="h-auto md:h-16 bg-white border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-8 py-4 md:py-0 gap-4 md:gap-0 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">주문 관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">고객 주문을 관리합니다</p>
        </div>
        <div className="text-sm text-gray-600">
          총 <span className="font-medium text-gray-900">{orders.length}</span>건의 주문
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">

          {/* Filters */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="주문번호, 고객명, 상품명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">주문번호</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3 hidden md:table-cell">고객명</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">상품</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3 hidden lg:table-cell">수량</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">금액</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3 hidden md:table-cell">결제수단</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">상태</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-gray-900">{order.id}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{order.date}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.product}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{order.quantity}개</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          ₩{order.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{order.paymentMethod}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="상세보기"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
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
