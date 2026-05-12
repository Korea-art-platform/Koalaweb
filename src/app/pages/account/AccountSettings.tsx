import { useNavigate } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { KeyRound, LogOut, Trash2, ChevronRight } from 'lucide-react';

export default function AccountSettings() {
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const handleLogout = () => {
    setAuthenticated(false);
    window.dispatchEvent(new Event('cart-updated'));
    navigate('/login');
  };

  return (
    <div className="space-y-6">

      {/* 보안 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">보안</h2>
        <button
          onClick={() => navigate('/forgot-password')}
          className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-xl transition-colors group"
        >
          <div className="flex items-center gap-3">
            <KeyRound className="w-4 h-4 text-gray-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">비밀번호 변경</p>
              <p className="text-xs text-gray-400 mt-0.5">이메일로 비밀번호 재설정 링크를 보내드립니다</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </button>
      </div>

      {/* 로그아웃 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">세션</h2>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-3 px-1 hover:bg-gray-50 rounded-xl transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-800">로그아웃</p>
            <p className="text-xs text-gray-400 mt-0.5">현재 기기에서 로그아웃합니다</p>
          </div>
        </button>
      </div>

      {/* 위험 구역 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-50">
        <h2 className="text-base font-bold text-red-500 mb-4">위험 구역</h2>
        <button
          disabled
          className="w-full flex items-center justify-between py-3 px-1 rounded-xl opacity-40 cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-4 h-4 text-red-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">회원 탈퇴</p>
              <p className="text-xs text-gray-400 mt-0.5">계정과 모든 데이터가 삭제됩니다 (준비 중)</p>
            </div>
          </div>
        </button>
      </div>

    </div>
  );
}
