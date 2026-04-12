import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/context/AuthContext';

export default function OAuth2Callback() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      alert(t('auth.oauth.error'));
      navigate('/login');
      return;
    }

    // 백엔드가 HttpOnly 쿠키로 토큰을 이미 설정했으므로
    // withCredentials: true 인 axios가 자동으로 쿠키를 포함해 요청
    setAuthenticated(true);
    navigate('/');
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">{t('auth.oauth.processing')}</p>
    </div>
  );
}
