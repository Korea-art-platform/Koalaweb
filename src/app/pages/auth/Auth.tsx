import { useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import Navigation from '@/app/components/layouts/Header';
import LoginForm from '@/app/components/Auth/LoginForm';
import SignupForm from '@/app/components/Auth/SignupForm';
import SocialLogin from '@/app/components/Auth/SocialLogin';

export default function Auth() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(location.pathname === '/signup');

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-16 px-8">
        <div className="max-w-md mx-auto">

          {/* 🌟 쫀득한 슬라이딩 탭 토글 */}
          <div className="relative flex bg-[#F4F4F4] rounded-2xl p-1.5 mb-8 shadow-inner border border-gray-100">
            {/* 스르륵 움직이는 까만색 배경 (Sliding Pill) */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-koala-navy rounded-xl shadow-sm transition-transform duration-300 ease-in-out ${
                isSignup ? 'translate-x-full' : 'translate-x-0'
              }`}
            />

            {/* 로그인 버튼 */}
            <button
              onClick={() => setIsSignup(false)}
              className={`relative flex-1 py-3 rounded-xl text-sm font-bold transition-colors duration-300 z-10 ${
                !isSignup ? 'text-white' : 'text-gray-400 hover:text-black'
              }`}
            >
              {t('auth.tabs.signIn')}
            </button>

            {/* 회원가입 버튼 */}
            <button
              onClick={() => setIsSignup(true)}
              className={`relative flex-1 py-3 rounded-xl text-sm font-bold transition-colors duration-300 z-10 ${
                isSignup ? 'text-white' : 'text-gray-400 hover:text-black'
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
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 overflow-hidden">
            
            {/* 🌟 폼 렌더링 (부드러운 전환 애니메이션 적용) */}
            <div
              key={isSignup ? 'signup' : 'login'}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {!isSignup ? (
                <LoginForm />
              ) : (
                <SignupForm onSuccess={() => setIsSignup(false)} />
              )}
            </div>

            {/* 소셜 로그인 */}
            <SocialLogin isSignup={isSignup} />
          </div>

          {/* 하단 링크 */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              {isSignup ? (
                <>
                  {t('auth.signup.hasAccount')}{' '}
                  <button onClick={() => setIsSignup(false)} className="text-black hover:underline font-medium">
                    {t('auth.signup.signInLink')}
                  </button>
                </>
              ) : (
                <>
                  {t('auth.login.noAccount')}{' '}
                  <button onClick={() => setIsSignup(true)} className="text-black hover:underline font-medium">
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