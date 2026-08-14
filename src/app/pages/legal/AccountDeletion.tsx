import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function AccountDeletion() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-gray-900">계정 및 데이터 삭제 안내</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">
        <p className="text-xs text-gray-400">최종 업데이트: 2026년 6월 10일</p>
        <p>
          KOALA(코알라) 앱·웹 서비스의 계정과 관련 데이터를 삭제(회원 탈퇴)하는 방법을 안내합니다.
          앱 설치 여부와 관계없이 아래 두 가지 방법 중 하나로 삭제를 요청할 수 있습니다.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1 leading-relaxed">
          <p className="font-semibold text-gray-800 mb-2">서비스 정보</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">앱 이름</span>KOALA</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">개발자/운영</span>헤론</p>
          <p><span className="font-medium text-gray-700 w-28 inline-block">문의 이메일</span>koala-art@heron.kr</p>
        </div>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">방법 1. 앱/웹에서 직접 탈퇴</h2>
          <ol className="space-y-1 list-decimal list-inside text-gray-600">
            <li>KOALA 앱 또는 웹사이트에 로그인합니다.</li>
            <li>마이페이지 → <span className="font-medium text-gray-700">설정</span>으로 이동합니다.</li>
            <li><span className="font-medium text-gray-700">회원 탈퇴</span>를 선택하고 안내에 따라 진행합니다.</li>
          </ol>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">방법 2. 앱 없이 이메일로 요청</h2>
          <p>
            앱을 설치하지 않았거나 로그인이 어려운 경우, 가입에 사용한 이메일 주소를 기재하여
            아래로 삭제를 요청해 주세요. 본인 확인 후 처리해 드립니다.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1 leading-relaxed mt-1">
            <p><span className="font-medium text-gray-700 w-28 inline-block">받는 곳</span>koala-art@heron.kr</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">제목 예시</span>[계정 삭제 요청]</p>
            <p><span className="font-medium text-gray-700 w-28 inline-block">포함 내용</span>가입 이메일, 삭제 요청 의사</p>
          </div>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">삭제되는 데이터</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>계정 정보: 이름, 이메일, 전화번호, 비밀번호</li>
            <li>배송지 주소, 위시리스트, 장바구니, 푸시 알림 토큰</li>
            <li>프로필 및 서비스 이용을 위해 저장된 개인정보</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">법령에 따라 일정 기간 보관되는 데이터</h2>
          <p>
            「전자상거래 등에서의 소비자보호에 관한 법률」 등 관계 법령에 따라, 아래 거래 관련 기록은
            탈퇴 후에도 법정 기간 동안 보관된 뒤 파기됩니다.
          </p>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>계약·청약철회 기록: 5년</li>
            <li>대금 결제 및 재화 공급 기록: 5년</li>
            <li>소비자 불만 또는 분쟁 처리 기록: 3년</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold text-gray-900">처리 기간</h2>
          <p>
            삭제 요청은 접수 후 영업일 기준 3일 이내에 처리되며, 처리 완료 시 안내해 드립니다.
            탈퇴 후 계정은 복구되지 않으며, 동일 정보로 재가입이 필요합니다.
          </p>
        </section>
        <p className="pt-4 pb-8 text-xs text-gray-400 text-center border-t border-gray-100">
          문의: koala-art@heron.kr
        </p>
      </div>
    </div>
  );
}
