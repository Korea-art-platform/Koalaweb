import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  sendPasswordResetCode,
  verifyPasswordResetCode,
  resetPassword,
} from '@/api/auth';

type Step = 'email' | 'verify' | 'reset';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetCode(email);
      setStep('verify');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || t('auth.forgotPassword.errors.sendCode'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyPasswordResetCode(email, code);
      setStep('reset');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || t('auth.forgotPassword.errors.verifyCode'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError(t('auth.forgotPassword.errors.passwordMismatch'));
      return;
    }
    if (newPassword.length < 8) {
      setError(t('auth.forgotPassword.errors.passwordTooShort'));
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      navigate('/login');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || t('auth.forgotPassword.errors.resetPassword'));
    } finally {
      setLoading(false);
    }
  };

  const stepTitle: Record<Step, string> = {
    email: t('auth.forgotPassword.emailStep.title'),
    verify: t('auth.forgotPassword.verifyStep.title'),
    reset: t('auth.forgotPassword.resetStep.title'),
  };

  const stepDesc: Record<Step, string> = {
    email: t('auth.forgotPassword.emailStep.desc'),
    verify: t('auth.forgotPassword.verifyStep.desc', { email }),
    reset: t('auth.forgotPassword.resetStep.desc'),
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl tracking-tight mb-3">{stepTitle[step]}</h1>
            <p className="text-sm text-gray-400">{stepDesc[step]}</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
                {error}
              </div>
            )}

            {step === 'email' && (
              <form className="space-y-6" onSubmit={handleSendCode}>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    {t('auth.common.emailLabel')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder={t('auth.common.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors disabled:opacity-50"
                >
                  {loading
                    ? t('auth.forgotPassword.emailStep.submitting')
                    : t('auth.forgotPassword.emailStep.submit')}
                </button>
              </form>
            )}

            {step === 'verify' && (
              <form className="space-y-6" onSubmit={handleVerifyCode}>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    {t('auth.forgotPassword.verifyStep.codeLabel')}
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('auth.forgotPassword.verifyStep.codePlaceholder')}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={8}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors tracking-widest text-center text-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {t('auth.forgotPassword.verifyStep.codeHint')}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors disabled:opacity-50"
                >
                  {loading
                    ? t('auth.forgotPassword.verifyStep.submitting')
                    : t('auth.forgotPassword.verifyStep.submit')}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setError(''); }}
                  className="w-full py-3 text-sm text-gray-400 hover:text-black transition-colors"
                >
                  {t('auth.forgotPassword.verifyStep.back')}
                </button>
              </form>
            )}

            {step === 'reset' && (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    {t('auth.forgotPassword.resetStep.newPasswordLabel')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder={t('auth.forgotPassword.resetStep.newPasswordPlaceholder')}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    {t('auth.forgotPassword.resetStep.confirmLabel')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder={t('auth.forgotPassword.resetStep.confirmPlaceholder')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors disabled:opacity-50"
                >
                  {loading
                    ? t('auth.forgotPassword.resetStep.submitting')
                    : t('auth.forgotPassword.resetStep.submit')}
                </button>
              </form>
            )}
          </div>
          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-gray-400 hover:text-black transition-colors">
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
