import { useState } from 'react';
import { Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { RichTextEditor } from '@/app/components/ui/RichTextEditor';
import { AdminLayout } from '@/app/components/layouts/AdminLayout';
import { useParams } from 'react-router';

export default function AdminProductEdit() {
  const { id } = useParams();
  const [content, setContent] = useState<string>('');
  const [isLimited, setIsLimited] = useState(false);

  return (
    <AdminLayout>
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900">
            {id === 'new' ? '상품 등록' : '상품 수정'}
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
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8">
            
            {/* Left: Images */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h2 className="text-sm font-bold text-gray-900 mb-4">대표 이미지</h2>
                <div className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-sm">클릭하거나 드래그하여 업로드</span>
                </div>
                
                <div className="mt-4 grid grid-cols-4 gap-2">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">아티스트</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5">
                      <option>아티스트 선택...</option>
                      <option>김원근</option>
                      <option>박지영</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">상품명</label>
                    <input type="text" placeholder="상품명을 입력하세요" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">카테고리</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5">
                      <option>ART_TOY</option>
                      <option>SCULPTURE</option>
                      <option>CERAMIC</option>
                      <option>PAINTING</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">판매가 (₩)</label>
                      <input type="number" placeholder="0" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">할인가 (₩)</label>
                      <input type="number" placeholder="0" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5" />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">한정판 (Limited Edition)</div>
                      <div className="text-xs text-gray-500 mt-0.5">이 상품이 에디션 넘버를 가지는지 설정합니다.</div>
                    </div>
                    <button 
                      onClick={() => setIsLimited(!isLimited)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isLimited ? 'bg-black' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLimited ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {isLimited && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">에디션 수량</label>
                        <input type="number" placeholder="예: 500" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Editor Section */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
                <h2 className="text-sm font-bold text-gray-900">상품 설명</h2>
                <RichTextEditor value={content} onChange={setContent} />
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
      </main>
    </AdminLayout>
  );
}
