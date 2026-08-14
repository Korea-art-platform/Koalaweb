import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">이용약관</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">최종 업데이트: 2026년 5월 13일</p>
        <p>
          KOALA(이하 "서비스")를 이용해 주셔서 감사합니다. 본 이용약관은 KOALA가 제공하는
          모든 서비스의 이용 조건 및 절차, 회원과 회사 간의 권리·의무 및 책임사항을 규정합니다.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1 leading-relaxed">
          <p className="font-semibold text-gray-800 mb-2">사업자 정보</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">상호명</span>헤론</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">서비스명</span>KOALA-ART</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">사업자등록번호</span>203-87-01972</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">통신판매업 신고</span>제2024-서울서초-3956호</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">대표자</span>정동훈</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">소재지</span>경기도 파주시 파주읍 통일로 1552번길 54</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">고객센터</span>1833-2817</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">이메일</span>koala-art@heron.kr</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">웹사이트</span>https://koala-art.co.kr</p>
        </div>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제1조 (목적)</h2>
          <p>
            본 약관은 헤론(이하 "회사")이 운영하는 미술품 거래 플랫폼 KOALA(이하 "서비스")의
            이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제2조 (정의)</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>"서비스"란 회사가 제공하는 미술품 거래, 아티스트 플랫폼, 리셀 마켓 등 일체의 서비스를 말합니다.</li>
            <li>"회원"이란 본 약관에 동의하고 회원가입을 완료한 자를 말합니다.</li>
            <li>"비회원"이란 회원가입 없이 서비스를 이용하는 자를 말합니다.</li>
            <li>"아티스트"란 KOALA 플랫폼을 통해 작품을 등록·판매하는 창작자를 말합니다.</li>
            <li>"콘텐츠"란 서비스 내 게시된 작품 이미지, 설명, 가격 정보 등을 말합니다.</li>
            <li>"SKU"란 아티스트가 등록한 개별 판매 상품 단위를 말합니다.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제3조 (약관의 효력 및 변경)</h2>
          <p>
            본 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다. 회사는 관련 법령을
            위반하지 않는 범위 내에서 본 약관을 변경할 수 있으며, 변경 시 서비스 내 공지사항을
            통해 사전 고지합니다.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제4조 (회원가입)</h2>
          <p>
            회원가입은 이용자가 약관 내용에 동의한 후 가입 신청을 하고, 회사가 이를 승낙함으로써
            체결됩니다. 만 14세 미만의 아동은 회원가입이 제한됩니다.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제5조 (서비스 이용)</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>서비스는 연중무휴 24시간 제공됨을 원칙으로 합니다.</li>
            <li>시스템 점검, 장애 등의 경우 서비스 제공이 일시 중단될 수 있습니다.</li>
            <li>회원은 타인의 계정을 무단으로 사용할 수 없습니다.</li>
            <li>불법적인 콘텐츠 게시, 저작권 침해 행위는 금지됩니다.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제6조 (구매 및 결제)</h2>
          <p>
            회원은 서비스 내 상품을 선택하고 결제 수단을 통해 구매할 수 있습니다. 결제는
            토스페이먼츠 및 카카오페이를 통해 처리되며, 「전자상거래 등에서의 소비자보호에
            관한 법률」 제17조에 따라 구매일로부터 7일 이내 청약 철회가 가능합니다.
          </p>
          <ul className="space-y-1 list-disc list-inside text-gray-600 mt-2">
            <li>결제 수단: 신용·체크카드, 카카오페이, 토스페이 등</li>
            <li>상품 가격은 부가세를 포함한 금액입니다.</li>
            <li>배송비는 주문 시 별도 표기됩니다.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제7조 (청약 철회 및 환불)</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>상품 수령 후 7일 이내 청약 철회(반품) 신청이 가능합니다.</li>
            <li>작품의 훼손, 사용 흔적, 포장 개봉(작품 가치에 영향을 주는 경우) 시 환불이 제한될 수 있습니다.</li>
            <li>단순 변심 반품 시 왕복 배송비는 구매자 부담입니다.</li>
            <li>불량·오배송의 경우 배송비 전액 회사 부담으로 환불 처리합니다.</li>
            <li>환불 처리는 반품 확인 후 영업일 기준 3~5일 소요됩니다.</li>
            <li>디지털 콘텐츠(다운로드 파일 등)는 제공 즉시 청약 철회가 불가합니다.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제8조 (지식재산권)</h2>
          <p>
            서비스 내 모든 콘텐츠의 지식재산권은 회사 또는 해당 아티스트에게 귀속됩니다.
            회원은 서비스를 통해 제공된 콘텐츠를 상업적 목적으로 무단 복제·배포할 수 없습니다.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제9조 (책임의 한계)</h2>
          <p>
            회사는 천재지변, 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
            회사는 회원이 서비스를 통해 기대하는 이익을 얻지 못하거나 상실한 것에 대해 책임을 지지
            않습니다. 단, 회사의 고의 또는 중과실로 인한 손해는 예외로 합니다.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제10조 (개인정보 보호)</h2>
          <p>
            회사는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호합니다.
            개인정보의 수집, 이용, 처리에 관한 사항은 개인정보처리방침에서 별도로 정합니다.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">제11조 (분쟁 해결)</h2>
          <p>
            본 약관과 관련하여 발생하는 분쟁에 대해서는 대한민국 법률을 적용하며,
            분쟁 해결을 위한 관할 법원은 회사 소재지를 관할하는 법원으로 합니다.
            한국소비자원(https://www.kca.go.kr) 또는 전자거래분쟁조정위원회를 통해
            분쟁 조정을 신청할 수 있습니다.
          </p>
        </section>
        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          본 약관은 2026년 5월 13일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
