import { AdminLayout } from '@/app/components/layouts/AdminLayout';
import { Plus, Edit2, Trash2, Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import { useState } from 'react';

const banners = [
  {
    id: '1',
    title: '봄 신작 컬렉션',
    description: '2026 Spring Collection - 새로운 아티스트 작품 공개',
    link: '/smart-store?collection=spring',
    image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800',
    isActive: true,
    order: 1,
    startDate: '2026-04-01',
    endDate: '2026-04-30'
  },
  {
    id: '2',
    title: '김원근 개인전',
    description: 'Harmony Spirit 시리즈 특별 전시',
    link: '/artist/3',
    image: 'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?w=800',
    isActive: true,
    order: 2,
    startDate: '2026-04-05',
    endDate: '2026-04-20'
  },
  {
    id: '3',
    title: '리셀 마켓 오픈',
    description: '한정판 작품 재판매 마켓 정식 오픈',
    link: '/resell',
    image: 'https://images.unsplash.com/photo-1688673375205-fc457c8516bf?w=800',
    isActive: false,
    order: 3,
    startDate: '2026-03-15',
    endDate: '2026-03-31'
  },
];

export default function AdminBanners() {
  const [bannerList, setBannerList] = useState(banners);

  return (
    <AdminLayout>
      {/* Header */}
      <header className="h-auto md:h-16 bg-white border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-8 py-4 md:py-0 gap-4 md:gap-0 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">배너 관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">홈 화면 배너를 관리합니다</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          새 배너 추가
        </button>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <span className="font-medium">💡 팁:</span> 배너는 순서대로 홈 화면에 표시됩니다. 드래그하거나 화살표 버튼으로 순서를 변경할 수 있습니다.
            </p>
          </div>

          {/* Banners List */}
          <div className="space-y-4">
            {bannerList.map((banner, index) => (
              <div key={banner.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
                  {/* Banner Image */}
                  <div className="aspect-video md:aspect-auto md:h-auto bg-gray-100 overflow-hidden">
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Banner Info */}
                  <div className="p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-900">{banner.title}</h3>
                          <span className="text-xs text-gray-500">순서 #{banner.order}</span>
                          {banner.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                              <Eye className="w-3 h-3" />
                              노출중
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              <EyeOff className="w-3 h-3" />
                              비노출
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>링크: {banner.link}</span>
                          <span>기간: {banner.startDate} ~ {banner.endDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      {/* Order Control */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="위로 이동"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={index === bannerList.length - 1}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="아래로 이동"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          {banner.isActive ? '비활성화' : '활성화'}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
