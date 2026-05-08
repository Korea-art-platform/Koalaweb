import { useNavigate } from 'react-router';
import { ArrowLeft, Truck, Clock, MapPin, Package } from 'lucide-react';

export default function Shipping() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">배송 정보</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">

        {/* 요약 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: '배송사', value: 'CJ대한통운' },
            { icon: Clock, label: '출고 기준', value: '결제 후 1~2 영업일' },
            { icon: Package, label: '무료 배송', value: '3만원 이상' },
            { icon: MapPin, label: '배송 가능 지역', value: '국내 전 지역' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center">
              <Icon className="w-5 h-5 mx-auto mb-2 text-gray-400" />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
              <p className="text-sm font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-semibold text-gray-900 text-base">배송비 안내</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">구매 금액</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">배송비</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">비고</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-600">30,000원 이상</td>
                  <td className="px-4 py-3 font-semibold text-black">무료</td>
                  <td className="px-4 py-3 text-gray-400">도서산간 제외</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">30,000원 미만</td>
                  <td className="px-4 py-3 text-gray-600">3,000원</td>
                  <td className="px-4 py-3 text-gray-400"></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-600">제주 / 도서산간</td>
                  <td className="px-4 py-3 text-gray-600">+3,000~5,000원</td>
                  <td className="px-4 py-3 text-gray-400">지역에 따라 상이</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-semibold text-gray-900 text-base">배송 기간</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />결제 완료 후 영업일 기준 1~2일 이내 출고됩니다.</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />출고 후 CJ대한통운 기준 수도권 1~2일, 지방 2~3일이 소요됩니다.</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />한정판 및 특수 포장 작품은 정밀 포장으로 인해 최대 5~7 영업일이 소요될 수 있습니다.</li>
            <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />주말·공휴일·연휴에는 출고가 이루어지지 않습니다.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-semibold text-gray-900 text-base">배송 조회</h2>
          <p className="text-gray-600">
            출고 완료 시 등록된 이메일 또는 문자로 운송장 번호가 발송됩니다. 마이페이지 &gt; 주문 내역에서도
            실시간 배송 상태를 확인할 수 있습니다.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-semibold text-gray-900 text-base">작품 포장 안내</h2>
          <p className="text-gray-600">
            KoALa의 모든 작품은 작품 손상 방지를 위해 에어캡, 완충재, 전용 박스로 안전하게 포장됩니다.
            한정판 에디션은 별도의 보증서 및 아트박스가 함께 제공됩니다.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            배송 중 파손이 발생한 경우, 수령 후 24시간 이내에 포장 상태 및 파손 사진을 포함하여
            고객센터(support@koala-art.co.kr)로 연락해 주세요.
          </div>
        </section>

        <section className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-semibold text-gray-900 text-base">해외 배송</h2>
          <p className="text-gray-600">
            현재 국내 배송만 지원합니다. 글로벌 K-아트의 세계적 확산을 위한 해외 배송 서비스는 현재 준비
            중이며, 오픈 시 공지사항을 통해 안내드리겠습니다.
          </p>
        </section>

        <div className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          배송 관련 추가 문의는 <a href="/contact" className="underline underline-offset-2 hover:text-black transition-colors">고객센터</a>로 연락해 주세요.
        </div>

      </div>
    </div>
  );
}
