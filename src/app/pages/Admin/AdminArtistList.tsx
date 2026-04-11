import { AdminLayout } from '@/app/components/layouts/AdminLayout';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

const artists = [
  {
    id: '1',
    name: '박지영',
    nameEn: 'Park Jiyoung',
    specialty: 'Contemporary Sculpture',
    bio: '도시적 감성과 자연의 조화를 탐구하는 조각가',
    works: 12,
    status: '활동중',
    joinDate: '2024-03-15',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
  },
  {
    id: '2',
    name: '이수민',
    nameEn: 'Lee Sumin',
    specialty: 'Ceramic Art',
    bio: '전통 도자기에 현대적 감각을 더한 작품 활동',
    works: 8,
    status: '활동중',
    joinDate: '2024-05-20',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
  },
  {
    id: '3',
    name: '김원근',
    nameEn: 'Kim Wongeun',
    specialty: 'Art Toy & Character Design',
    bio: '한국적 정서를 담은 캐릭터 아트 전문',
    works: 15,
    status: '활동중',
    joinDate: '2023-11-08',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
  },
  {
    id: '4',
    name: '최윤아',
    nameEn: 'Choi Yuna',
    specialty: 'Abstract Painting',
    bio: '감정의 추상화를 통한 시각적 표현 연구',
    works: 10,
    status: '휴식중',
    joinDate: '2024-01-12',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
  },
];

export default function AdminArtistList() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AdminLayout>
      {/* Header */}
      <header className="h-auto md:h-16 bg-white border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-8 py-4 md:py-0 gap-4 md:gap-0 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900">아티스트 관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">등록된 아티스트를 관리합니다</p>
        </div>
        <Link
          to="/admin/artists/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 아티스트 등록
        </Link>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">

          {/* Search */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="아티스트 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          {/* Artists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={artist.profileImage} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-0.5">{artist.name}</h3>
                      <p className="text-sm text-gray-500">{artist.nameEn}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
                        artist.status === '활동중'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {artist.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-1">{artist.specialty}</div>
                    <p className="text-sm text-gray-600 line-clamp-2">{artist.bio}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      작품 <span className="font-medium text-gray-900">{artist.works}</span>개
                    </div>
                    <div className="text-xs text-gray-400">
                      {artist.joinDate}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                  <Link
                    to={`/artist/${artist.id}`}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                    title="프로필 보기"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/admin/artists/${artist.id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                    title="수정"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
