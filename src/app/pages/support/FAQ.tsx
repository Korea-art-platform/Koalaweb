import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  label: string;
  items: FaqItem[];
}

const FAQS: FaqCategory[] = [
  {
    label: '주문 · 결제',
    items: [
      {
        q: '어떤 결제 수단을 지원하나요?',
        a: '토스페이, 카카오페이, 네이버페이, 페이코, 삼성페이, 신용/체크카드를 지원합니다. 모든 결제는 토스페이먼츠의 PCI-DSS 인증 보안 시스템으로 처리됩니다.',
      },
      {
        q: '주문 후 취소는 언제까지 가능한가요?',
        a: '상품 준비 시작(PREPARING) 전까지 마이페이지 > 주문 내역에서 직접 취소하실 수 있습니다. 배송이 시작된 이후에는 교환/반품 절차를 이용해 주세요.',
      },
      {
        q: '세금계산서 또는 현금영수증 발급이 가능한가요?',
        a: '현금영수증은 결제 완료 후 고객센터(koala-art@heron.kr)로 요청 시 발급 가능합니다. 사업자 세금계산서는 현재 별도 문의 부탁드립니다.',
      },
    ],
  },
  {
    label: '배송',
    items: [
      {
        q: '배송은 얼마나 걸리나요?',
        a: '결제 완료 후 영업일 기준 1~2일 내 출고되며, 출고 후 2~3일 내 수령 가능합니다. 한정판 및 특수 포장 상품은 최대 5~7일이 소요될 수 있습니다.',
      },
      {
        q: '배송비는 얼마인가요?',
        a: '3만원 이상 구매 시 무료 배송이 적용됩니다. 3만원 미만 구매 시 배송비 3,000원이 부과됩니다. 제주 및 도서산간 지역은 추가 배송비(3,000~5,000원)가 발생할 수 있습니다.',
      },
      {
        q: '해외 배송이 가능한가요?',
        a: '현재 국내 배송만 지원합니다. 글로벌 배송 서비스는 준비 중으로, 서비스 오픈 시 공지사항을 통해 안내드리겠습니다.',
      },
    ],
  },
  {
    label: '교환 · 반품',
    items: [
      {
        q: '교환 및 반품 신청은 어떻게 하나요?',
        a: '상품 수령 후 7일 이내에 마이페이지 > 주문 내역에서 신청하거나 고객센터(koala-art@heron.kr)로 문의해 주세요. 상품 상태 확인 후 처리 안내를 드립니다.',
      },
      {
        q: '환불은 언제 처리되나요?',
        a: '반품 상품 회수 및 확인 후 영업일 기준 3~5일 이내 결제 수단으로 환불 처리됩니다. 카드 결제의 경우 카드사 정책에 따라 환불 반영 시점이 다를 수 있습니다.',
      },
      {
        q: '어떤 경우 교환/반품이 불가한가요?',
        a: '수령 후 7일이 경과한 경우, 고객 과실로 상품이 훼손된 경우, 포장이 개봉되거나 사용 흔적이 있는 경우, 한정판 에디션 번호가 훼손된 경우에는 교환/반품이 제한될 수 있습니다.',
      },
    ],
  },
  {
    label: '회원 · 계정',
    items: [
      {
        q: '소셜 로그인과 일반 계정을 함께 사용할 수 있나요?',
        a: '동일한 이메일로 가입된 소셜 계정과 일반 계정은 별도의 계정으로 관리됩니다. 계정 통합이 필요하신 경우 고객센터로 문의해 주세요.',
      },
      {
        q: '회원 탈퇴는 어떻게 하나요?',
        a: '마이페이지 > 프로필 설정 하단에서 탈퇴 신청이 가능합니다. 탈퇴 시 보유 포인트 및 위시리스트 데이터는 복구되지 않으며, 진행 중인 주문이 있는 경우 탈퇴가 제한됩니다.',
      },
    ],
  },
  {
    label: '작품 · 아티스트',
    items: [
      {
        q: '작품의 진품 여부는 어떻게 확인하나요?',
        a: 'KOALA에 등록된 모든 작품은 작가 직접 등록 또는 KOALA 큐레이팀의 검증을 거칩니다. 한정판 에디션의 경우 작가 서명 및 에디션 번호가 포함된 진품 보증서가 함께 제공됩니다.',
      },
      {
        q: '한정판(Limited Edition)이란 무엇인가요?',
        a: '작가가 직접 제작 수량을 한정하여 발행한 에디션 작품입니다. 각 작품마다 고유 에디션 번호(예: 5/50)가 부여되며, 수량 소진 후에는 재입고되지 않습니다.',
      },
      {
        q: 'KOALA에 작가로 등록하고 싶습니다.',
        a: '파트너십 문의 페이지 또는 koala-art@heron.kr로 포트폴리오와 함께 연락 주시면 검토 후 안내드리겠습니다.',
      },
    ],
  },
];

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
