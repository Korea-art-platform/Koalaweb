import { useState } from 'react';
import { AdminLayout } from '@/app/components/layouts/AdminLayout';
import { Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { RichTextEditor } from '@/app/components/ui/RichTextEditor';
import { useParams } from 'react-router';

export default function AdminArtistEdit() {
  const { id } = useParams();
  const [bio, setBio] = useState<string>('');
  const [isActive, setIsActive] = useState(true);

  return (
    <AdminLayout>
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-900">
          {id === 'new' ? '아티스트 등록' : '아티스트 수정'}
        </h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            임시저장
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors">
            {id === 'new' ? '등록하기' : '수정하기'}
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8">

          {/* Left: Profile Image */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h2 className="text-sm font-bold text-gray-900 mb-4">프로필 이미지</h2>
              <div className="w-full aspect-square rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer overflow-hidden">
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-sm">클릭하거나 드래그하여 업로드</span>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                권장 크기: 400x400px 이상
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h2 className="text-sm font-bold text-gray-900 mb-4">포트폴리오 이미지</h2>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
                <button className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-black transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Info Form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-6">
              <h2 className="text-sm font-bold text-gray-900">기본 정보</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      이름 (한글) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="예: 김원근"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      이름 (영문) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="예: Kim Wongeun"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    전문 분야 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: Contemporary Sculpture, Art Toy & Character Design"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    간단 소개
                  </label>
                  <textarea
                    rows={2}
                    placeholder="한 줄 소개 문구를 입력하세요"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
                    <input
                      type="email"
                      placeholder="artist@example.com"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처</label>
                    <input
                      type="tel"
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">웹사이트</label>
                  <input
                    type="url"
                    placeholder="https://artist-portfolio.com"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
                    <input
                      type="text"
                      placeholder="@username"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">가입일</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">활동 상태</div>
                    <div className="text-xs text-gray-500 mt-0.5">아티스트가 현재 활동 중인지 설정합니다.</div>
                  </div>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-black' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900">작가 소개</h2>
                <p className="text-xs text-gray-500 mt-0.5">작가의 경력, 전시 이력, 작품 세계관 등을 상세히 작성하세요.</p>
              </div>
              <RichTextEditor value={bio} onChange={setBio} />
            </div>

            {/* Awards & Exhibitions */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
              <h2 className="text-sm font-bold text-gray-900">수상 이력 및 전시</h2>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="연도"
                    className="w-24 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                  <input
                    type="text"
                    placeholder="수상/전시 내용"
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                  <button className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    추가
                  </button>
                </div>
                <p className="text-xs text-gray-500">예: 2024 | 서울 아트페어 대상 수상</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 pt-4">
              <button className="flex-1 py-3.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                임시저장
              </button>
              <button className="flex-1 py-3.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors">
                {id === 'new' ? '등록하기' : '수정하기'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
