import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import PageMeta from '@/app/components/common/PageMeta';

export default function Returns() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <PageMeta title="교환 및 반품" />
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">교환·반품 및 환불 약관</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">최종 업데이트: 2026년 8월 18일</p>
        <div className="bg-gray-50 rounded-2xl p-5 space-y-1 text-xs leading-relaxed text-gray-600">
          <p className="font-semibold text-gray-900 text-sm mb-2">핵심 요약</p>
          <p>· 상품 수령 후 <strong>7일 이내</strong> 교환/반품 신청 가능</p>
          <p>· 환불은 반품 상품 확인 후 <strong>영업일 3~5일</strong> 이내 처리</p>
          <p>· 신청 방법: 마이페이지 주문 내역 또는 koala-art@heron.kr</p>
        </div>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">1. 교환/반품 신청 기간</h2>
          <p>
            소비자기본법 및 전자상거래법에 따라 상품 수령 후 <strong>7일 이내</strong>에 교환 또는 반품을 신청하실 수 있습니다.
            단순 변심에 의한 반품의 경우 왕복 배송비(6,000원)는 고객 부담입니다.
          </p>
          <p>
            다만 상품이 <strong>표시·광고 내용과 다르거나 계약 내용과 다르게 이행된 경우</strong>에는,
            상품을 공급받은 날부터 <strong>3개월 이내</strong>, 그 사실을 알았거나 알 수 있었던 날부터
            <strong> 30일 이내</strong>에 청약철회를 하실 수 있습니다.
          </p>
          <p className="text-gray-600">
            한정판 상품도 <strong>일반 상품과 동일하게</strong> 청약철회가 가능합니다.
            한정 수량이라는 이유만으로 교환·반품이 제한되지 않습니다.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">2. 교환/반품 신청 방법</h2>
          <ol className="space-y-2 text-gray-600 list-decimal list-inside">
            <li>마이페이지 &gt; 주문 내역에서 해당 주문 선택 후 교환/반품 신청</li>
            <li>또는 고객센터(koala-art@heron.kr)로 주문번호와 사유 기재하여 이메일 발송</li>
            <li>담당자 확인 후 영업일 기준 1~2일 이내 회수 방법 안내</li>
            <li>반품 상품 회수 및 검수 완료 후 환불/교환 처리</li>
          </ol>
          <div className="bg-gray-50 rounded-xl p-5 space-y-1 text-xs leading-relaxed">
            <p className="font-semibold text-gray-800">반송지 주소</p>
            <p className="text-gray-700">경기도 파주시 파주읍 통일로 1552번길 54</p>
            <p className="text-gray-500">
              반송 전 반드시 교환/반품 신청을 먼저 해주세요. 사전 신청 없이 보내신 상품은
              확인이 지연되거나 처리되지 않을 수 있습니다.
            </p>
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">3. 환불 처리 기간</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">결제 수단</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">환불 처리 기간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-600">신용/체크카드</td>
                  <td className="px-4 py-3 text-gray-600">반품 확인 후 3~5 영업일 (카드사 정책에 따라 상이)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">토스페이 / 카카오페이 / 네이버페이</td>
                  <td className="px-4 py-3 text-gray-600">반품 확인 후 3~5 영업일</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">무통장 입금</td>
                  <td className="px-4 py-3 text-gray-600">계좌 확인 후 3~5 영업일</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">4. 교환/반품이 가능한 경우</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>상품 수령 후 7일 이내 단순 변심 (배송비 고객 부담)</li>
            <li>상품 설명과 실제 상품이 현저히 다른 경우</li>
            <li>배송 중 파손 또는 불량이 확인된 경우 (수령 24시간 이내 사진 첨부 필수)</li>
            <li>오배송된 경우</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">5. 교환/반품이 불가한 경우</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>상품 수령 후 7일이 경과한 경우</li>
            <li>고객 과실로 상품이 파손 또는 오염된 경우</li>
            <li>포장 개봉 후 사용 흔적이 있는 경우</li>
            <li>한정판 에디션 번호(넘버링), 진품 보증서, 아트박스 등이 훼손 또는 분실된 경우</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">6. 배송비 부담 기준</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">사유</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">배송비 부담</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-600">단순 변심</td>
                  <td className="px-4 py-3 text-gray-600">고객 부담 (왕복 6,000원)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">불량 / 오배송 / 파손</td>
                  <td className="px-4 py-3 text-gray-600">KOALA 부담</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">7. 미성년자의 계약 취소</h2>
          <p>
            미성년자가 법정대리인의 동의 없이 결제한 경우, 미성년자 본인 또는 법정대리인이
            해당 계약을 취소할 수 있습니다. 취소를 원하시면 고객센터로 연락해 주세요.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">8. 판매자 정보</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-32">상호</td>
                  <td className="px-4 py-3 text-gray-600">헤론 (서비스명: KOALA-ART)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">대표자</td>
                  <td className="px-4 py-3 text-gray-600">정동훈</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">사업장 주소</td>
                  <td className="px-4 py-3 text-gray-600">서울특별시 서초구 서운로6길 26, 4층 4482호(지훈빌딩)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">반송지 주소</td>
                  <td className="px-4 py-3 text-gray-600">경기도 파주시 파주읍 통일로 1552번길 54</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">사업자등록번호</td>
                  <td className="px-4 py-3 text-gray-600">203-87-01972</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">통신판매업</td>
                  <td className="px-4 py-3 text-gray-600">제2024-서울서초-3956호</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50">고객센터</td>
                  <td className="px-4 py-3 text-gray-600">1833-2817 · koala-art@heron.kr</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            사업장 주소와 반송지 주소가 다릅니다. <strong>반품 상품은 반드시 파주 반송지로</strong> 보내 주세요.
          </p>
        </section>

        <div className="bg-gray-50 rounded-xl p-5 text-xs text-gray-500 leading-relaxed space-y-1">
          <p className="font-semibold text-gray-800">교환/반품 문의</p>
          <p>이메일: koala-art@heron.kr</p>
          <p>전화: 1833-2817</p>
          <p>운영 시간: 평일 10:00 – 18:00 (주말·공휴일 제외)</p>
        </div>
        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          본 정책은 소비자기본법 및 전자상거래법 등 관련 법령에 의해 보호되는 소비자 권리를 침해하지 않습니다.
        </p>
      </div>
    </div>
  );
}
