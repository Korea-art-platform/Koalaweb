import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Mail, Lock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/app/components/layouts/Header';
import { login, signup, loginWithKakao, loginWithNaver } from '@/api/auth';

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로가 /signup이면 회원가입 패널 활성화
  const [isSignup, setIsSignup] = useState(location.pathname === '/signup');

  // 로그인 상태
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // 회원가입 상태
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupAgreed, setSignupAgreed] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  // 로그인 제출
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setLoginLoading(true);
    try {
      const res = await login({ email: loginEmail, password: loginPassword });
      const { accessToken, refreshToken } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setLoginSuccess(t('auth.login.success'));
      setTimeout(() => {
        navigate('/');
      }, 0);
    } catch (err: any) {
      setLoginError(err.response?.data?.message || t('auth.login.error'));
    } finally {
      setLoginLoading(false);
    }
  };

  // 회원가입 제출
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    if (signupPassword !== signupConfirm) {
      setSignupError(t('auth.validation.passwordMismatch'));
      return;
    }
    if (signupPassword.length < 8) {
      setSignupError(t('auth.validation.passwordTooShort'));
      return;
    }
    if (!signupAgreed) {
      setSignupError(t('auth.validation.termsRequired'));
      return;
    }
    setSignupLoading(true);
    try {
      const res = await signup({
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
      });
      const { accessToken, refreshToken } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setSignupSuccess(t('auth.signup.success'));
      setTimeout(() => {
        navigate('/login');
      }, 0);
    } catch (err: any) {
      setSignupError(err.response?.data?.message || t('auth.signup.error'));
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-16 px-8">
        <div className="max-w-md mx-auto">

          {/* 탭 토글 */}
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-8">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${!isSignup
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-400 hover:text-black'
                }`}
            >
              {t('auth.tabs.signIn')}
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isSignup
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-400 hover:text-black'
                }`}
            >
              {t('auth.tabs.signUp')}
            </button>
          </div>

          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl tracking-tight mb-3 transition-all duration-300">
              {isSignup ? t('auth.signup.title') : t('auth.login.title')}
            </h1>
            <p className="text-sm text-gray-400">
              {isSignup ? t('auth.signup.subtitle') : t('auth.login.subtitle')}
            </p>
          </div>

          {/* 카드 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">

            {/* ── 로그인 폼 ── */}
            {!isSignup && (
              <form className="space-y-6" onSubmit={handleLogin}>
                {loginSuccess && (
                  <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">
                    {loginSuccess}
                  </div>
                )}

                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t('auth.common.emailLabel')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder={t('auth.common.emailPlaceholder')}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t('auth.common.passwordLabel')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder={t('auth.common.passwordPlaceholder')}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    <span className="text-gray-600">{t('auth.common.rememberMe')}</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    {t('auth.common.forgotPassword')}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {loginLoading ? t('auth.login.submitting') : t('auth.login.submit')}
                </button>
              </form>
            )}

            {/* ── 회원가입 폼 ── */}
            {isSignup && (
              <form className="space-y-5" onSubmit={handleSignup}>
                {signupSuccess && (
                  <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">
                    {signupSuccess}
                  </div>
                )}

                {signupError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
                    {signupError}
                  </div>
                )}

                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t('auth.signup.nameLabel')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('auth.signup.namePlaceholder')}
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t('auth.common.emailLabel')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder={t('auth.common.emailPlaceholder')}
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t('auth.signup.phoneLabel')}</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder={t('auth.signup.phonePlaceholder')}
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t('auth.common.passwordLabel')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder={t('auth.signup.passwordPlaceholderCombined')}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">{t('auth.signup.confirmPasswordLabel')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                      value={signupConfirm}
                      onChange={(e) => setSignupConfirm(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signupAgreed}
                    onChange={(e) => setSignupAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    {t('auth.common.termsAgree')}{' '}
                    <Link to="/terms" className="text-black hover:underline">{t('auth.common.termsLink')}</Link>
                    {' '}{t('auth.common.termsAnd')}{' '}
                    <Link to="/privacy" className="text-black hover:underline">{t('auth.common.privacyLink')}</Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {signupLoading ? t('auth.signup.submitting') : t('auth.signup.submit')}
                </button>
              </form>
            )}

            {/* 소셜 로그인 */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400">{t('auth.common.orContinueWith')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => loginWithKakao()}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#FEE500] rounded-xl hover:bg-[#FDD800] transition-colors"
              >
                <span className="text-sm font-medium text-black">
                  {isSignup ? t('auth.signup.kakaoAlt') : t('auth.login.kakaoAlt')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => loginWithNaver()}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#03C75A] rounded-xl hover:bg-[#02b350] transition-colors"
              >
                <span className="text-sm font-medium text-white">
                  {isSignup ? t('auth.signup.naverAlt') : t('auth.login.naverAlt')}
                </span>
              </button>
            </div>
          </div>

          {/* 하단 링크 */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              {isSignup ? (
                <>
                  {t('auth.signup.hasAccount')}{' '}
                  <button
                    onClick={() => setIsSignup(false)}
                    className="text-black hover:underline font-medium"
                  >
                    {t('auth.signup.signInLink')}
                  </button>
                </>
              ) : (
                <>
                  {t('auth.login.noAccount')}{' '}
                  <button
                    onClick={() => setIsSignup(true)}
                    className="text-black hover:underline font-medium"
                  >
                    {t('auth.login.signUpLink')}
                  </button>
                </>
              )}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
