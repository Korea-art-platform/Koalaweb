import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/context/AuthContext';
import { withdraw as withdrawApi } from '@/api/auth';
import { KeyRound, LogOut, Trash2, ChevronRight } from 'lucide-react';
import { notifyCartUpdated } from '@/app/hooks/useCart';
import { useLogout } from '@/app/hooks/useLogout';
import { useTranslation } from 'react-i18next';

export default function AccountSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuthenticated } = useAuth();
  const [withdrawing, setWithdrawing] = useState(false);

  const handleLogout = useLogout();

  const handleWithdraw = async () => {
    if (withdrawing) return;
    const ok = window.confirm(
      t('account.settings.withdrawConfirm'),
    );
    if (!ok) return;
    setWithdrawing(true);
    try {
      await withdrawApi();
      window.alert(t('account.settings.withdrawDone'));
      setAuthenticated(false);
      queryClient.clear();
      notifyCartUpdated();
      navigate('/login');
    } catch {
      window.alert(t('account.settings.withdrawFailed'));
      setWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">{t('account.settings.security')}</h2>
        <button
          onClick={() => navigate('/forgot-password')}
          className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-xl transition-colors group"
        >
          <div className="flex items-center gap-3">
            <KeyRound className="w-4 h-4 text-gray-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">{t('account.settings.changePassword')}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t('account.settings.changePasswordDesc')}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">{t('account.settings.session')}</h2>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-3 px-1 hover:bg-gray-50 rounded-xl transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-800">{t('account.settings.logout')}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('account.settings.logoutDesc')}</p>
          </div>
        </button>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-50">
        <h2 className="text-base font-bold text-red-500 mb-4">{t('account.settings.danger')}</h2>
        <button
          onClick={handleWithdraw}
          disabled={withdrawing}
          className="w-full flex items-center justify-between py-3 px-1 rounded-xl hover:bg-red-50/50 transition-colors group disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-4 h-4 text-red-400" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">{t('account.settings.withdraw')}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {withdrawing ? t('account.settings.processing') : t('account.settings.withdrawDesc')}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </button>
      </div>
    </div>
  );
}
