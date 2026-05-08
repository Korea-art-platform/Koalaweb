import { useNavigate } from 'react-router';
import { ArrowLeft, MessageSquare, Truck, RotateCcw, HelpCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

const HELP_SECTIONS = [
  {
    icon: HelpCircle,
    title: '자주 묻는 질문',
    desc: '주문, 배송, 교환/반품, 계정 관련 자주 묻는 질문을 확인하세요.',
    path: '/faq',
    cta: '바로가기',
  },
  {
    icon: Truck,
    title: '배송 정보',
    desc: '배송사, 배송 기간, 배송비, 특수 포장 정책을 안내합니다.',
    path: '/shipping',
    cta: '배송 정책 보기',
  },
  {
    icon: RotateCcw,
    title: '교환 및 반품',
    desc: '교환·반품 신청 방법과 환불 처리 기간을 확인하세요.',
    path: '/returns',
    cta: '교환/반품 정책 보기',
  },
  {
    icon: MessageSquare,
    title: '1:1 문의',
    desc: '원하는 답변을 찾지 못하셨나요? 고객센터로 직접 문의해 주세요.',
    path: '/contact',
    cta: '문의하기',
  },
];

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">고객센터</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

        <div className="space-y-1">
          <p className="text-xl font-bold text-gray-900">무엇을 도와드릴까요?</p>
          <p className="text-sm text-gray-500">
            평일 10:00 – 18:00 운영 · 점심 13:00–14:00 제외
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {HELP_SECTIONS.map(({ icon: Icon, title, desc, path, cta }) => (
            <Link
              key={path}
              to={path}
              className="group border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-sm transition-all space-y-4"
            >
              <div className="w-10 h-10 bg-gray-50 group-hover:bg-black rounded-xl flex items-center justify-center transition-colors">
                <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-black transition-colors">
                {cta}
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="text-sm font-bold text-gray-900 mb-0.5">이메일로 직접 문의</p>
            <p className="text-xs text-gray-500">영업일 기준 24시간 이내 답변드립니다.</p>
          </div>
          <a
            href="mailto:support@koala-art.co.kr"
            className="flex-shrink-0 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            support@koala-art.co.kr
          </a>
        </div>

      </div>
    </div>
  );
}
