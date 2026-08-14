import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">개인정보처리방침</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">최종 업데이트: 2026년 5월 13일</p>
        <p>
          헤론(이하 "회사")이 운영하는 KOALA 서비스는 「개인정보 보호법」,
          「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하며,
          이용자의 개인정보를 안전하게 보호합니다. 본 방침은 회사가 수집하는 개인정보의 항목,
          수집 목적, 보유 기간 및 처리 방법을 안내합니다.
        </p>
        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">1. 수집하는 개인정보 항목</h2>
          <div className="space-y-2">
            <p className="font-medium text-gray-800">회원가입 시 필수 항목</p>
            <ul className="space-y-1 list-disc list-inside text-gray-600">
              <li>이름, 이메일 주소, 휴대폰 번호</li>
              <li>비밀번호 (단방향 암호화 저장, 원문 미보관)</li>
            </ul>
            <p className="font-medium text-gray-800 mt-2">주문·결제 시 수집 항목</p>
            <ul className="space-y-1 list-disc list-inside text-gray-600">
              <li>배송지 정보 (수령인 성명, 주소, 연락처)</li>
              <li>결제 정보 (카드 번호 등 결제 수단은 PG사(토스페이먼츠·카카오페이)가 직접 처리, 당사 미보관)</li>
            </ul>
            <p className="font-medium text-gray-800 mt-2">소셜 로그인 시 추가 수집</p>
            <ul className="space-y-1 list-disc list-inside text-gray-600">
              <li>카카오: 닉네임, 이메일</li>
              <li>네이버: 이름, 이메일</li>
            </ul>
            <p className="font-medium text-gray-800 mt-2">서비스 이용 과정에서 자동 수집</p>
            <ul className="space-y-1 list-disc list-inside text-gray-600">
              <li>접속 IP 주소, 쿠키, 브라우저 환경 정보, 서비스 이용 기록</li>
              <li>푸시 알림 토큰 (FCM 등록 토큰)</li>
              <li>앱 진단 및 오류 로그 (오류 메시지, 기기 환경 정보, 발생 시점 등)</li>
            </ul>
          </div>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">2. 개인정보 수집 및 이용 목적</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>회원 가입 및 본인 확인</li>
            <li>상품 주문, 결제 및 배송 처리</li>
            <li>고객 문의 및 분쟁 처리</li>
            <li>푸시 알림 발송 (주문·배송 안내, 서비스 알림 등)</li>
            <li>서비스 안정성 확보 및 오류 진단·개선</li>
            <li>서비스 개선 및 맞춤형 콘텐츠 제공</li>
            <li>법령상 의무 이행</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">3. 개인정보 보유 및 이용 기간</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>회원 정보: 회원 탈퇴 시까지</li>
            <li>거래 기록: 5년 (전자상거래법)</li>
            <li>소비자 불만 기록: 3년 (전자상거래법)</li>
            <li>접속 로그: 3개월 (통신비밀보호법)</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">4. 개인정보의 제3자 제공</h2>
          <p>
            회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 아래의 경우
            예외로 합니다.
          </p>
          <ul className="space-y-1 list-disc list-inside text-gray-600 mt-2">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 따른 경우</li>
            <li>배송을 위한 택배사 정보 제공 (수령인 정보에 한함)</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">5. 개인정보 처리 위탁</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2 font-medium text-gray-700 border-b border-gray-200">수탁업체</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-700 border-b border-gray-200">위탁 업무</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2 text-gray-600">토스페이먼츠</td>
                  <td className="px-4 py-2 text-gray-600">결제 처리</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-600">Amazon Web Services</td>
                  <td className="px-4 py-2 text-gray-600">서버 인프라 운영</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-600">Google (Firebase)</td>
                  <td className="px-4 py-2 text-gray-600">푸시 알림 발송</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-600">Sentry</td>
                  <td className="px-4 py-2 text-gray-600">앱 오류 진단 및 모니터링</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">6. 이용자의 권리</h2>
          <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
          <ul className="space-y-1 list-disc list-inside text-gray-600 mt-2">
            <li>개인정보 열람 요청</li>
            <li>개인정보 수정·삭제 요청</li>
            <li>개인정보 처리 정지 요청</li>
            <li>회원 탈퇴 (마이페이지에서 가능)</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">7. 쿠키 사용</h2>
          <p>
            회사는 서비스 편의를 위해 쿠키를 사용합니다. 인증 토큰은 HttpOnly 쿠키로 저장되어
            XSS 공격으로부터 보호됩니다. 브라우저 설정을 통해 쿠키를 거부할 수 있으나 일부
            서비스 이용이 제한될 수 있습니다.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">8. 개인정보 보호 책임자</h2>
          <p>이용자는 아래 담당자에게 개인정보 관련 문의, 열람, 정정·삭제, 처리 정지 요청을 할 수 있습니다.</p>
          <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-xs">
            <p><span className="font-medium text-gray-800">회사명:</span> 헤론</p>
            <p><span className="font-medium text-gray-800">책임자:</span> KOALA 개인정보 보호팀</p>
            <p><span className="font-medium text-gray-800">이메일:</span> koala-art@heron.kr</p>
            <p><span className="font-medium text-gray-800">처리 기간:</span> 접수 후 영업일 3일 이내</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            개인정보 침해에 관한 신고·상담은 아래 기관에도 문의하실 수 있습니다.<br />
            • 개인정보보호위원회 개인정보 침해신고센터: <a href="https://www.privacy.go.kr" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black">privacy.go.kr</a> / 국번없이 182<br />
            • 경찰청 사이버수사국: <a href="https://ecrm.cyber.go.kr" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black">ecrm.cyber.go.kr</a> / 국번없이 182
          </p>
        </section>
        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          본 방침은 2026년 5월 13일부터 시행됩니다.
        </p>
      </div>
    </div>
  );
}
