import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { FAQS } from '@/data/faq';

export default function FAQ() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleCategoryChange = (idx: number) => {
    setActiveCategory(idx);
    setOpenIndex(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">자주 묻는 질문</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-sm text-gray-500 mb-8">
          궁금한 점을 빠르게 해결해 드립니다. 원하는 답변을 찾지 못하셨다면{' '}
          <a href="/contact" className="text-black underline underline-offset-2">고객센터</a>로 문의해 주세요.
        </p>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 flex-wrap mb-8">
          {FAQS.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleCategoryChange(i)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === i
                  ? 'bg-koala-navy text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 아코디언 */}
        <div className="divide-y divide-gray-100">
          {FAQS[activeCategory].items.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center py-5 text-left gap-4"
              >
                <span className="text-sm font-medium text-gray-900">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="pb-5 text-sm text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-2xl text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">원하는 답변을 찾지 못하셨나요?</p>
          <p className="text-xs text-gray-500 mb-4">평일 10:00 - 18:00, 고객센터에서 도움드립니다.</p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-koala-navy text-white text-xs font-bold rounded-xl hover:bg-koala-navy-hover transition-colors"
          >
            1:1 문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
