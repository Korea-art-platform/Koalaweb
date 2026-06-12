import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function YouthProtection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">청소년보호정책</h1>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">

        <p className="text-xs text-gray-400">최종 업데이트: 2026년 6월 10일</p>

        <p>
          KOALA(이하 "회사")는 청소년이 유해한 정보에 노출되지 않고 건전하게 서비스를 이용할 수 있도록
          「청소년 보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 근거하여 다음과 같이
          청소년보호정책을 수립·시행합니다.
        </p>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제1조 (목적)</h2>
          <p>
            본 정책은 회사가 운영하는 미술품 거래 플랫폼 KOALA에서 청소년을 각종 유해정보로부터 보호하고,
            청소년이 안전하게 서비스를 이용할 수 있는 환경을 조성하는 것을 목적으로 합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제2조 (청소년유해정보로부터의 청소년 보호계획 수립)</h2>
          <p>
            회사는 청소년이 아무런 제한 없이 유해정보에 노출되지 않도록 다음과 같은 보호계획을 수립하여 운영합니다.
          </p>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>청소년보호를 위한 책임자 및 담당자 지정·운영</li>
            <li>청소년유해정보에 대한 청소년 접근 제한 및 관리 조치</li>
            <li>유해정보로 인한 피해상담 및 고충처리</li>
            <li>청소년보호를 위한 임직원 교육 시행</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제3조 (유해정보에 대한 청소년 접근제한 및 관리조치)</h2>
          <p>
            회사는 청소년이 유해정보에 접근할 수 없도록 다음의 조치를 취합니다.
          </p>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>만 14세 미만 아동의 회원가입을 제한합니다.</li>
            <li>성인 인증이 필요한 콘텐츠·상품이 등록될 경우 연령 확인 절차를 거치도록 합니다.</li>
            <li>게시물 및 작품 등록 과정에서 청소년 유해 매체물에 해당하는 콘텐츠를 모니터링하고 차단합니다.</li>
            <li>유해정보가 확인될 경우 즉시 삭제 또는 접근 차단 조치를 시행합니다.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제4조 (유해정보로 인한 피해상담 및 고충처리)</h2>
          <p>
            회사는 청소년 유해정보로 인한 피해 상담 및 고충처리를 위한 창구를 운영하며, 관련 신고가 접수될
            경우 신속히 조사하여 처리하고 그 결과를 신고자에게 통보합니다. 필요한 경우 관계기관(방송통신심의위원회,
            청소년보호 관련 기관 등)과 협력하여 대응합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제5조 (청소년보호를 위한 교육)</h2>
          <p>
            회사는 청소년보호 업무를 담당하는 임직원을 대상으로 청소년보호 관련 법령 및 유해정보 차단·관리
            방법, 피해사례 등에 대한 교육을 정기적으로 시행합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제6조 (청소년보호책임자의 지정)</h2>
          <p>
            회사는 청소년보호 업무를 총괄하고 청소년유해정보로부터 청소년을 보호하기 위하여
            아래와 같이 청소년보호책임자를 지정·운영하고 있습니다.
          </p>

          {/* 청소년보호책임자 정보 */}
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1 leading-relaxed mt-2">
            <p className="font-semibold text-gray-800 mb-2">청소년보호책임자</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">성명</span>정동훈</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">직위</span>대표이사</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">이메일</span>koala-art@heron.kr</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">전화</span>02-0000-0000</p>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제7조 (정책의 변경)</h2>
          <p>
            본 청소년보호정책은 관련 법령 및 회사 내부 방침의 변경에 따라 개정될 수 있으며,
            개정 시 서비스 내 공지사항을 통해 사전 고지합니다.
          </p>
        </section>

        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          본 청소년보호정책은 2026년 6월 10일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
