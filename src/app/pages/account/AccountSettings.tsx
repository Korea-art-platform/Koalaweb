import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { logout as logoutApi, withdraw as withdrawApi } from '@/api/auth';
import { KeyRound, LogOut, Trash2, ChevronRight } from 'lucide-react';

export default function AccountSettings() {
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();
  const [withdrawing, setWithdrawing] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // 서버 오류여도 클라이언트 상태는 초기화
    } finally {
      setAuthenticated(false);
      window.dispatchEvent(new Event('cart-updated'));
      navigate('/login');
    }
  };

  const handleWithdraw = async () => {
    if (withdrawing) return;
    const ok = window.confirm(
      '정말 탈퇴하시겠습니까?\n계정과 모든 데이터가 삭제되며 복구할 수 없습니다.',
    );
    if (!ok) return;
    setWithdrawing(true);
    try {
      await withdrawApi();
      window.alert('회원 탈퇴가 완료되었습니다.');
      setAuthenticated(false);
      window.dispatchEvent(new Event('cart-updated'));
      navigate('/login');
    } catch {
      window.alert('탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setWithdrawing(false);
    }
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
          onClick={handleWithdraw}
          disabled={withdrawing}
          className="w-full flex items-center justify-between py-3 px-1 rounded-xl hover:bg-red-50/50 transition-colors group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-4 h-4 text-red-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">회원 탈퇴</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {withdrawing ? '처리 중...' : '계정과 모든 데이터가 삭제됩니다'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </button>
      </div>

    </div>
  );
}
