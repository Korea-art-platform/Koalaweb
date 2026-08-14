import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">1:1 문의하기</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            KOALA 고객센터는 여러분의 소중한 작품 경험을 위해 최선을 다합니다.
            문의 전 <Link to="/faq" className="text-black underline underline-offset-2">자주 묻는 질문</Link>에서
            빠르게 해결책을 찾아보세요.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-gray-100 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-koala-navy rounded-xl flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">이메일</p>
                <p className="text-sm font-bold text-gray-900">koala-art@heron.kr</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              이메일 문의 시 주문번호를 함께 기재해 주시면 보다 빠른 처리가 가능합니다.
            </p>
            <a
              href="mailto:koala-art@heron.kr"
              className="block w-full py-2.5 bg-koala-navy text-white text-xs font-bold rounded-xl text-center hover:bg-koala-navy-hover transition-colors"
            >
              이메일 보내기
            </a>
          </div>
          <div className="border border-gray-100 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">운영 시간</p>
                <p className="text-sm font-bold text-gray-900">평일 10:00 – 18:00</p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p>점심 시간: 13:00 – 14:00</p>
              <p>주말 · 공휴일: 휴무</p>
              <p className="text-gray-400 pt-1">운영 시간 외 문의는 다음 영업일 오전 중 순차적으로 답변드립니다.</p>
            </div>
          </div>
        </div>
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">문의 시 참고해 주세요</h2>
          <div className="space-y-3">
            {[
              {
                icon: MessageSquare,
                title: '주문/결제 문의',
                desc: '주문번호, 결제 수단, 결제 금액을 함께 알려주시면 빠르게 처리됩니다.',
              },
              {
                icon: MessageSquare,
                title: '배송/교환/반품 문의',
                desc: '주문번호와 수령 일자, 사유를 함께 기재해 주세요. 불량/파손의 경우 사진 첨부가 필요합니다.',
              },
              {
                icon: MessageSquare,
                title: '계정/서비스 문의',
                desc: '가입 이메일 주소와 문제 상황을 구체적으로 설명해 주세요.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-800 mb-0.5">{title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">관련 페이지</h2>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {[
              { label: '자주 묻는 질문 (FAQ)', path: '/faq' },
              { label: '배송 정보', path: '/shipping' },
              { label: '교환 및 반품 정책', path: '/returns' },
            ].map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">{label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </section>
        <div className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          파트너십 및 작가 입점 문의는 <a href="mailto:koala-art@heron.kr" className="underline underline-offset-2 hover:text-black transition-colors">koala-art@heron.kr</a>로 연락해 주세요.
        </div>
      </div>
    </div>
  );
}
