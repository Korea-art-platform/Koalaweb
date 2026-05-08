import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/context/AuthContext';
import { getMyProfile } from '@/api/user';

export default function OAuth2Callback() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      alert(t('auth.oauth.error'));
      navigate('/login');
      return;
    }

    // 백엔드가 설정한 HttpOnly 쿠키가 실제로 유효한지 검증 후 인증 상태 반영
    getMyProfile()
      .then(() => {
        setAuthenticated(true);
        navigate('/');
      })
      .catch(() => {
        alert(t('auth.oauth.error'));
        navigate('/login');
      });
  }, [error, navigate, setAuthenticated, t]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">{t('auth.oauth.processing')}</p>
    </div>
  );
}
