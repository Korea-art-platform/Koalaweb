import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Mail, Lock, User } from 'lucide-react';
import Navigation from '../../components/layouts/Header';
import { login, signup, loginWithKakao, loginWithNaver } from '../../../api/auth';

export default function Auth() {
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
      setLoginSuccess('로그인이 완료되었습니다. 홈으로 이동합니다.');
      setTimeout(() => {
        navigate('/');
      }, 0);
    } catch (err: any) {
      setLoginError(err.response?.data?.message || '로그인에 실패했습니다.');
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
      setSignupError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (signupPassword.length < 8) {
      setSignupError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (!signupAgreed) {
      setSignupError('이용약관에 동의해주세요.');
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
      setSignupSuccess('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.');
      setTimeout(() => {
        navigate('/login');
      }, 0);
    } catch (err: any) {
      setSignupError(err.response?.data?.message || '회원가입에 실패했습니다.');
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
              Sign In
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isSignup
                ? 'bg-black text-white shadow-sm'
                : 'text-gray-400 hover:text-black'
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl tracking-tight mb-3 transition-all duration-300">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-gray-400">
              {isSignup
                ? 'Join the Korean Art Laboratory'
                : 'Sign in to your KoALa account'}
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
                  <label className="block text-sm mb-2 text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Enter your password"
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
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {loginLoading ? 'Signing in...' : 'Sign In'}
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
                  <label className="block text-sm mb-2 text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="010-1234-5678"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Create a password (8자 이상)"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Confirm your password"
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
                    I agree to the{' '}
                    <Link to="/terms" className="text-black hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-black hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {signupLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* 소셜 로그인 */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400">OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => loginWithKakao()}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#FEE500] rounded-xl hover:bg-[#FDD800] transition-colors"
              >
                <span className="text-sm font-medium text-black">카카오로 계속하기</span>
              </button>
              <button
                type="button"
                onClick={() => loginWithNaver()}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#03C75A] rounded-xl hover:bg-[#02b350] transition-colors"
              >
                <span className="text-sm font-medium text-white">네이버로 계속하기</span>
              </button>
            </div>
          </div>

          {/* 하단 링크 */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              {isSignup ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsSignup(false)}
                    className="text-black hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsSignup(true)}
                    className="text-black hover:underline font-medium"
                  >
                    Sign up
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
