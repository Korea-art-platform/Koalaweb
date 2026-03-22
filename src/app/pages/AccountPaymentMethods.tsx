import { useLocation, useNavigate } from 'react-router';
import { CreditCard, Plus, Smartphone } from 'lucide-react';
import Navigation from '../components/layouts/Header';
import AccountSidebar from '../components/layouts/AccountSidebar';
import { useEffect, useState } from 'react';
import { getMyProfile } from '../../api/user';

const paymentOptions = [
  { id: 'toss', name: '토스페이', icon: '💙', description: '토스 앱 간편 결제', color: 'bg-blue-50 border-blue-100' },
  { id: 'kakao', name: '카카오페이', icon: '💛', description: '카카오톡 간편 결제', color: 'bg-yellow-50 border-yellow-100' },
  { id: 'naver', name: '네이버페이', icon: '💚', description: '네이버 포인트 적립', color: 'bg-green-50 border-green-100' },
  { id: 'card', name: '신용/체크카드', icon: '💳', description: '일반 카드 직접 입력', color: 'bg-gray-50 border-gray-100' },
];

export default function AccountPaymentMethods() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    getMyProfile()
      .then((res) => setUser(res.data.data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">마이페이지</h1>
            <p className="text-xs md:text-sm text-gray-400 font-medium">
              결제 수단을 관리하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <AccountSidebar currentPath={location.pathname} user={user} />
            </div>

            <div className="lg:col-span-3">
              <div className="mb-6 md:mb-8 px-1">
                <h2 className="text-xl md:text-2xl font-bold mb-1 italic">Payment Methods</h2>
                <p className="text-xs md:text-sm text-gray-400 font-medium">
                  결제 시 사용할 수단을 선택하세요
                </p>
              </div>

              {/* 지원 결제 수단 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {paymentOptions.map((method) => (
                  <div
                    key={method.id}
                    className={`bg-white rounded-2xl p-6 border ${method.color} flex items-center gap-4`}
                  >
                    <div className="text-4xl">{method.icon}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-0.5">{method.name}</p>
                      <p className="text-xs text-gray-400">{method.description}</p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">
                      지원
                    </div>
                  </div>
                ))}
              </div>

              {/* 저장된 카드 — 추후 토스 연동 예정 */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">저장된 카드</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                    <Plus className="w-4 h-4" />
                    카드 추가
                  </button>
                </div>
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
                  <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 mb-1">저장된 카드가 없습니다.</p>
                  <p className="text-xs text-gray-300">
                    토스 페이먼츠 연동 후 카드를 등록할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 보안 안내 */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 text-blue-900">안전한 결제 시스템</h3>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      모든 결제 정보는 토스 페이먼츠의 PCI-DSS 인증 보안 시스템으로 암호화되어 보호됩니다.
                      카드 번호는 저장되지 않으며 결제 시 토스 페이먼츠 서버에서 직접 처리됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}