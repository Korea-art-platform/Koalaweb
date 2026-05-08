import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function Cookies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">쿠키 정책</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">

        <p className="text-xs text-gray-400">최종 업데이트: 2025년 1월 1일</p>

        <p>
          KoALa(이하 "회사")는 서비스 제공, 보안 유지 및 사용자 경험 향상을 위해 쿠키를 사용합니다.
          본 정책은 회사가 사용하는 쿠키의 종류와 목적, 관리 방법을 안내합니다.
        </p>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">1. 쿠키란?</h2>
          <p>
            쿠키(Cookie)는 웹사이트 방문 시 브라우저에 저장되는 소량의 데이터 파일입니다.
            쿠키는 서버가 사용자의 브라우저를 인식하는 데 활용되며, 로그인 상태 유지, 환경 설정 저장,
            서비스 이용 통계 분석 등에 사용됩니다.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-gray-900">2. 사용하는 쿠키 종류</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">종류</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">목적</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">보유 기간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-800">필수 쿠키</td>
                  <td className="px-4 py-3 text-gray-600">로그인 인증 토큰(HttpOnly), 보안 세션 관리</td>
                  <td className="px-4 py-3 text-gray-600">세션 종료 시 / 최대 30일</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-800">기능 쿠키</td>
                  <td className="px-4 py-3 text-gray-600">언어 설정, 테마 환경 설정 저장</td>
                  <td className="px-4 py-3 text-gray-600">1년</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-800">분석 쿠키</td>
                  <td className="px-4 py-3 text-gray-600">Google Tag Manager를 통한 서비스 이용 통계 (익명)</td>
                  <td className="px-4 py-3 text-gray-600">최대 2년</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">필수 쿠키</span>란 서비스 운영에 반드시 필요한 쿠키로, 거부 시 로그인 및 결제 기능 이용이 불가합니다.
            분석 쿠키는 개인을 식별하지 않는 익명 통계 데이터만 수집합니다.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">3. 인증 쿠키 보안</h2>
          <p>
            KoALa의 로그인 인증 토큰은 <strong>HttpOnly</strong> 쿠키로 저장됩니다.
            HttpOnly 쿠키는 JavaScript로 접근이 불가하여 XSS(크로스 사이트 스크립팅) 공격으로부터
            보호됩니다. 또한 프로덕션 환경에서는 <strong>Secure</strong> 속성이 적용되어
            HTTPS 연결에서만 전송됩니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-gray-900">4. 쿠키 관리 방법</h2>
          <p>
            대부분의 브라우저에서 쿠키 허용 여부를 설정할 수 있습니다.
            아래 브라우저별 쿠키 관리 방법을 참고해 주세요.
          </p>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li><strong>Chrome:</strong> 설정 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터</li>
            <li><strong>Safari:</strong> 환경설정 &gt; 개인 정보 보호 &gt; 쿠키 및 웹사이트 데이터</li>
            <li><strong>Edge:</strong> 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터</li>
            <li><strong>Firefox:</strong> 설정 &gt; 개인 정보 및 보안 &gt; 쿠키 및 사이트 데이터</li>
          </ul>
          <p className="text-gray-500 text-xs">
            필수 쿠키를 차단하면 로그인 유지, 장바구니, 결제 등 일부 서비스 기능 이용이 제한될 수 있습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">5. 제3자 쿠키</h2>
          <p>
            Google Tag Manager(GTM)는 서비스 이용 통계 분석을 위해 쿠키를 사용합니다.
            Google의 데이터 수집 및 처리 정책은 <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black transition-colors">Google 개인정보처리방침</a>을 참고해 주세요.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">6. 문의</h2>
          <div className="bg-gray-50 rounded-xl p-4 text-xs space-y-1">
            <p><span className="font-medium text-gray-800">이메일:</span> privacy@koala-art.co.kr</p>
            <p><span className="font-medium text-gray-800">처리 기간:</span> 접수 후 영업일 3일 이내</p>
          </div>
        </section>

        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          본 쿠키 정책은 2025년 1월 1일부터 시행됩니다.
        </p>

      </div>
    </div>
  );
}
