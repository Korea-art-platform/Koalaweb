import { AdminLayout } from '@/app/components/layouts/AdminLayout';
import { Search, Star, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

const reviews = [
  {
    id: '1',
    customer: '김철수',
    product: 'Harmony Spirit',
    rating: 5,
    content: '정말 만족스러운 작품입니다. 디테일이 훌륭하고 포장도 꼼꼼하게 되어 있었어요.',
    status: '승인',
    date: '2026-04-10',
    hasImage: true
  },
  {
    id: '2',
    customer: '이영희',
    product: 'Urban Poetry',
    rating: 4,
    content: '작품은 좋은데 배송이 조금 늦었어요. 그래도 만족합니다.',
    status: '대기',
    date: '2026-04-11',
    hasImage: false
  },
  {
    id: '3',
    customer: '박민수',
    product: 'Digital Dreams',
    rating: 5,
    content: '기대 이상입니다. 아티스트의 작품 세계관이 잘 담겨있네요.',
    status: '승인',
    date: '2026-04-09',
    hasImage: true
  },
  {
    id: '4',
    customer: '최지은',
    product: 'Nature Blend',
    rating: 3,
    content: '작품은 좋지만 가격 대비 크기가 작아요.',
    status: '거부',
    date: '2026-04-08',
    hasImage: false
  },
];

export default function AdminReviews() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('전체');

  const statuses = ['전체', '대기', '승인', '거부'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '승인':
        return 'bg-green-50 text-green-700';
      case '대기':
        return 'bg-yellow-50 text-yellow-700';
      case '거부':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      {/* Header */}
      <header className="h-auto md:h-16 bg-white border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-8 py-4 md:py-0 gap-4 md:gap-0 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">리뷰 관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">고객 리뷰를 관리합니다</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-gray-600">
            대기중 <span className="font-medium text-yellow-600">1</span>건
          </div>
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
                  placeholder="고객명, 상품명으로 검색..."
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

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{review.customer}</h3>
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">{review.rating}.0</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {review.product} · {review.date}
                        {review.hasImage && <span className="ml-2 text-blue-600">📷 사진 포함</span>}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {review.content}
                  </p>

                  {review.status === '대기' && (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                        승인
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        <XCircle className="w-4 h-4" />
                        거부
                      </button>
                      <button className="ml-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {review.status !== '대기' && (
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
