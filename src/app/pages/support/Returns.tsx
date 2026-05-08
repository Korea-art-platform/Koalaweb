import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function Returns() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">교환 및 반품 정책</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">

        <p className="text-xs text-gray-400">최종 업데이트: 2025년 1월 1일</p>

        <div className="bg-gray-50 rounded-2xl p-5 space-y-1 text-xs leading-relaxed text-gray-600">
          <p className="font-semibold text-gray-900 text-sm mb-2">핵심 요약</p>
          <p>· 상품 수령 후 <strong>7일 이내</strong> 교환/반품 신청 가능</p>
          <p>· 환불은 반품 상품 확인 후 <strong>영업일 3~5일</strong> 이내 처리</p>
          <p>· 신청 방법: 마이페이지 주문 내역 또는 support@koala-art.co.kr</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">1. 교환/반품 신청 기간</h2>
          <p>
            소비자기본법 및 전자상거래법에 따라 상품 수령 후 <strong>7일 이내</strong>에 교환 또는 반품을 신청하실 수 있습니다.
            단순 변심에 의한 반품의 경우 왕복 배송비(6,000원)는 고객 부담입니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">2. 교환/반품 신청 방법</h2>
          <ol className="space-y-2 text-gray-600 list-decimal list-inside">
            <li>마이페이지 &gt; 주문 내역에서 해당 주문 선택 후 교환/반품 신청</li>
            <li>또는 고객센터(support@koala-art.co.kr)로 주문번호와 사유 기재하여 이메일 발송</li>
            <li>담당자 확인 후 영업일 기준 1~2일 이내 회수 방법 안내</li>
            <li>반품 상품 회수 및 검수 완료 후 환불/교환 처리</li>
          </ol>
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
            <li>맞춤 제작(커스텀) 상품의 경우</li>
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
                  <td className="px-4 py-3 text-gray-600">KoALa 부담</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="bg-gray-50 rounded-xl p-5 text-xs text-gray-500 leading-relaxed space-y-1">
          <p className="font-semibold text-gray-800">교환/반품 문의</p>
          <p>이메일: support@koala-art.co.kr</p>
          <p>운영 시간: 평일 10:00 – 18:00 (주말·공휴일 제외)</p>
        </div>

        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          본 정책은 소비자기본법 및 전자상거래법 등 관련 법령에 의해 보호되는 소비자 권리를 침해하지 않습니다.
        </p>

      </div>
    </div>
  );
}
