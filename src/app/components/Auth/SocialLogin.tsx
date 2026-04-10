import { useTranslation } from 'react-i18next';
import { loginWithKakao, loginWithNaver } from '@/api/auth';

interface SocialLoginProps {
  isSignup: boolean;
}

export default function SocialLogin({ isSignup }: SocialLoginProps) {
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
    </>
  );
}