import { useTranslation } from 'react-i18next';
import { loginWithKakao, loginWithNaver, loginWithToss } from '@/api/auth';
import { isAppsInToss } from '@/utils/appsInToss';
import kakaoBtn from '@/app/image/kakao/ko/kakao_login_medium_wide.png';
import naverBtn from '@/app/image/naver/ko/NAVER_login_Light_KR_green_wide_H48.png';

interface SocialLoginProps {
  isSignup?: boolean;
}

export default function SocialLogin({ isSignup }: SocialLoginProps) {
  const { t } = useTranslation();
  const inToss = isAppsInToss();

  return (
    <>
      {/* 토스 미니앱: 위에 이메일 폼이 없으므로 "또는" 구분선 생략 */}
      {!inToss && (
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-gray-400">{t('auth.common.orContinueWith')}</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {/* 앱인토스 환경: 토스 로그인 버튼만 표시 */}
        {inToss ? (
          <button
            type="button"
            onClick={() => loginWithToss()}
            className="w-full h-[48px] rounded-xl bg-[#0064FF] flex items-center justify-center gap-2 hover:opacity-90 active:opacity-75 transition-opacity"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                fill="white"
              />
            </svg>
            <span className="text-white font-bold text-sm">
              {isSignup ? '토스로 시작하기' : '토스로 로그인'}
            </span>
          </button>
        ) : (
          /* 일반 웹: 카카오 / 네이버 로그인 */
          <>
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
          </>
        )}
      </div>
    </>
  );
}
