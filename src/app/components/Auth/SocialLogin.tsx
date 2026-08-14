import { useTranslation } from 'react-i18next';
import { loginWithKakao, loginWithNaver } from '@/api/auth';
import kakaoBtn from '@/app/image/kakao/ko/kakao_login_medium_wide.png';
import naverBtn from '@/app/image/naver/ko/NAVER_login_Light_KR_green_wide_H48.png';

interface SocialLoginProps {
  isSignup?: boolean;
}

export default function SocialLogin({ isSignup: _isSignup }: SocialLoginProps) {
  const { t } = useTranslation();

  return (
    <>
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
          className="w-full rounded-xl overflow-hidden hover:opacity-90 active:opacity-75 transition-opacity"
        >
          <img src={kakaoBtn} alt="카카오로 로그인" className="w-full h-auto block" />
        </button>
        <button
          type="button"
          onClick={() => loginWithNaver()}
          className="w-full rounded-xl overflow-hidden hover:opacity-90 active:opacity-75 transition-opacity"
        >
          <img src={naverBtn} alt="네이버로 로그인" className="w-full h-auto block" />
        </button>
      </div>
    </>
  );
}
