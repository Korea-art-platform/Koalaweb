import { AdminLayout } from '@/app/components/layouts/AdminLayout';
import { Plus, Search, Filter, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

const products = [
  {
    id: '1',
    name: 'Harmony Spirit',
    artist: '김원근',
    artistId: '3',
    category: 'ART TOY',
    price: 250000,
    originalPrice: 298000,
    status: '판매중',
    isLimited: true,
    edition: '125 / 500',
    image: 'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?w=400'
  },
  {
    id: '2',
    name: 'Urban Poetry',
    artist: '박지영',
    artistId: '1',
    category: 'SCULPTURE',
    price: 380000,
    originalPrice: 380000,
    status: '품절',
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1688673375205-fc457c8516bf?w=400'
  },
  {
    id: '3',
    name: 'Digital Dreams',
    artist: '이수민',
    artistId: '2',
    category: 'CERAMIC',
    price: 190000,
    originalPrice: 230000,
    status: '판매중',
    isLimited: true,
    edition: '45 / 100',
    image: 'https://images.unsplash.com/photo-1764333785980-69a5dc4e514d?w=400'
  },
  {
    id: '4',
    name: 'Nature Blend',
    artist: '김원근',
    artistId: '3',
    category: 'PAINTING',
    price: 420000,
    originalPrice: 420000,
    status: '판매중',
    isLimited: false,
    image: 'https://images.unsplash.com/photo-1769524256027-d2dd0d7b7e16?w=400'
  },
  {
    id: '5',
    name: 'Abstract Mind',
    artist: '최윤아',
    artistId: '4',
    category: 'ART TOY',
    price: 350000,
    originalPrice: 398000,
    status: '판매중',
    isLimited: true,
    edition: '200 / 500',
    image: 'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?w=400'
  },
];

export default function AdminProductList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', 'ART TOY', 'SCULPTURE', 'CERAMIC', 'PAINTING'];

  return (
    <AdminLayout>
      {/* Header */}
      <header className="h-auto md:h-16 bg-white border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-8 py-4 md:py-0 gap-4 md:gap-0 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">상품 관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">등록된 상품을 관리합니다</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 상품 등록
        </Link>
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
                  placeholder="상품명, 아티스트로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400 hidden md:block" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">상품</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3 hidden md:table-cell">아티스트</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3 hidden lg:table-cell">카테고리</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">가격</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3 hidden md:table-cell">상태</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900">{product.name}</div>
                            {product.isLimited && (
                              <div className="text-xs text-gray-500 mt-0.5">Limited {product.edition}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{product.artist}</td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          ₩{product.price.toLocaleString()}
                        </div>
                        {product.originalPrice !== product.price && (
                          <div className="text-xs text-gray-400 line-through">
                            ₩{product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.status === '판매중'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/product/${product.id}`}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="상품 보기"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="수정"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200">
            <div className="text-sm text-gray-600">
              총 <span className="font-medium text-gray-900">{products.length}</span>개 상품
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                이전
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-white bg-black rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                다음
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
