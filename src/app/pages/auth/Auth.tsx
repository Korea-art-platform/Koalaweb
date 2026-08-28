import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LoginForm from '@/app/components/Auth/LoginForm';
import SignupForm from '@/app/components/Auth/SignupForm';
import SocialLogin from '@/app/components/Auth/SocialLogin';
import { getBanners } from '@/api/banner';
import type { Banner } from '@/api/types';
import PageMeta from '@/app/components/common/PageMeta';

const PANEL_SLIDE = 'transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)]';

const DESKTOP_QUERY = '(min-width: 1024px)';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

export default function Auth() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(location.pathname === '/signup');
  const isDesktop = useIsDesktop();

  const swap = isDesktop && isSignup;
  const visualStyle = { transform: swap ? 'translateX(100%)' : 'translateX(0)' };
  const formStyle = { transform: swap ? 'translateX(-100%)' : 'translateX(0)' };

  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    getBanners('LOGIN')
      .then((res) => setBanners(res.data.data ?? []))
      .catch(() => {  });
  }, []);

  const banner: Banner | null = (isSignup ? banners[1] ?? banners[0] : banners[0]) ?? null;
  const bgKey = `${isSignup ? 'signup' : 'login'}-${banner?.imageUrl ?? 'fallback'}`;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <PageMeta title="로그인" />
      <div className="lg:flex lg:items-stretch overflow-x-hidden">
        <div
          style={visualStyle}
          className={`hidden lg:block relative overflow-hidden bg-koala-purple lg:w-1/2 ${PANEL_SLIDE}`}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={bgKey}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {banner?.imageUrl ? (
                <>
                  <img
                    src={banner.imageUrl}
                    alt={banner.title ?? ''}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-koala-purple/90 via-koala-purple/30 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-koala-purple to-koala-purple-light flex items-center justify-center">
                  <img src="/logo-symbol-white.svg" alt="" className="w-32 h-32 opacity-20" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-0 left-0 p-12 xl:p-16 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/70 mb-3">
              Korea Art Lab
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignup ? 'signup-copy' : 'login-copy'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight break-keep whitespace-pre-line">
                  {banner?.title || (isSignup
                    ? '예술과 함께하는\n첫 걸음을 시작하세요'
                    : '예술을 소장하는\n가장 가까운 방법')}
                </h2>
                <p className="mt-4 text-sm text-white/80 max-w-sm break-keep">
                  {banner?.subtitle || (isSignup
                    ? 'KOALA 회원이 되어 국내 작가들의 작품을 만나보세요.'
                    : '엄선된 한국 현대미술 작품을 지금 만나보세요.')}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div
          style={formStyle}
          className={`flex items-center justify-center min-h-screen pt-24 pb-16 px-6 md:px-8 lg:w-1/2 lg:pt-28 ${PANEL_SLIDE}`}
        >
          <div className="w-full max-w-md">
            <div className="relative flex bg-[#F4F4F4] rounded-2xl p-1.5 mb-8 shadow-inner border border-gray-100">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-koala-purple rounded-xl shadow-sm transition-transform duration-300 ease-in-out ${
                  isSignup ? 'translate-x-full' : 'translate-x-0'
                }`}
              />
              <button
                onClick={() => setIsSignup(false)}
                className={`relative flex-1 py-3 rounded-xl text-sm font-bold transition-colors duration-300 z-10 ${
                  !isSignup ? 'text-white' : 'text-gray-400 hover:text-black'
                }`}
              >
                {t('auth.tabs.signIn')}
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className={`relative flex-1 py-3 rounded-xl text-sm font-bold transition-colors duration-300 z-10 ${
                  isSignup ? 'text-white' : 'text-gray-400 hover:text-black'
                }`}
              >
                {t('auth.tabs.signUp')}
              </button>
            </div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-3 transition-all duration-300">
                {isSignup ? t('auth.signup.title') : t('auth.login.title')}
              </h1>
              <p className="text-sm text-gray-400">
                {isSignup ? t('auth.signup.subtitle') : t('auth.login.subtitle')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 overflow-hidden">
              <div key={isSignup ? 'signup' : 'login'} className="auth-stagger">
                {!isSignup ? (
                  <LoginForm />
                ) : (
                  <SignupForm onSuccess={() => setIsSignup(false)} />
                )}
                <SocialLogin isSignup={isSignup} />
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                {isSignup ? (
                  <>
                    {t('auth.signup.hasAccount')}{' '}
                    <button onClick={() => setIsSignup(false)} className="text-koala-purple hover:underline font-medium">
                      {t('auth.signup.signInLink')}
                    </button>
                  </>
                ) : (
                  <>
                    {t('auth.login.noAccount')}{' '}
                    <button onClick={() => setIsSignup(true)} className="text-koala-purple hover:underline font-medium">
                      {t('auth.login.signUpLink')}
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
