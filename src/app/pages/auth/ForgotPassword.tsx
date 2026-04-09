import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, KeyRound } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import {
  sendPasswordResetCode,
  verifyPasswordResetCode,
  resetPassword,
} from '@/api/auth';

type Step = 'email' | 'verify' | 'reset';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 — 이메일 입력 후 인증코드 발송
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetCode(email);
      setStep('verify');
    } catch (err: any) {
      setError(err.response?.data?.message || '인증코드 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — 인증코드 확인
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyPasswordResetCode(email, code);
      setStep('reset');
    } catch (err: any) {
      setError(err.response?.data?.message || '인증코드가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — 새 비밀번호 설정
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || '비밀번호 재설정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitle: Record<Step, string> = {
    email: '비밀번호 찾기',
    verify: '인증코드 확인',
    reset: '새 비밀번호 설정',
  };

  const stepDesc: Record<Step, string> = {
    email: '가입하신 이메일 주소를 입력해주세요.',
    verify: `${email}로 발송된 6자리 코드를 입력해주세요.`,
    reset: '새로 사용할 비밀번호를 입력해주세요.',
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-16 px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl tracking-tight mb-3">{stepTitle[step]}</h1>
            <p className="text-sm text-gray-400">{stepDesc[step]}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Step 1 — 이메일 */}
            {step === 'email' && (
              <form className="space-y-6" onSubmit={handleSendCode}>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
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
                  className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {loading ? '발송 중...' : '인증코드 발송'}
                </button>
              </form>
            )}

            {/* Step 2 — 인증코드 */}
            {step === 'verify' && (
              <form className="space-y-6" onSubmit={handleVerifyCode}>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    인증코드
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="6자리 코드 입력"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={6}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors tracking-widest text-center text-lg"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    코드는 5분간 유효합니다.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {loading ? '확인 중...' : '인증코드 확인'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setError(''); }}
                  className="w-full py-3 text-sm text-gray-400 hover:text-black transition-colors"
                >
                  이메일 다시 입력
                </button>
              </form>
            )}

            {/* Step 3 — 새 비밀번호 */}
            {step === 'reset' && (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    새 비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="새 비밀번호 (8자 이상)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    새 비밀번호 확인
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="비밀번호 재입력"
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
                  className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {loading ? '변경 중...' : '비밀번호 변경'}
                </button>
              </form>
            )}
          </div>

          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-gray-400 hover:text-black transition-colors">
              로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
