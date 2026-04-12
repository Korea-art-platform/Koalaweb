import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { login } from '@/api/auth';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      // 백엔드가 HttpOnly 쿠키로 토큰을 자동 설정 — localStorage 저장 불필요
      await login({ email, password });
      setAuthenticated(true);
      setSuccess(t('auth.login.success'));
      setTimeout(() => navigate('/'), 0);
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      {success && (
        <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm mb-2 text-gray-700">{t('auth.common.emailLabel')}</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder={t('auth.common.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"/>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
          <span className="text-gray-600">{t('auth.common.rememberMe')}</span>
        </label>
        <Link to="/forgot-password" className="text-gray-400 hover:text-black transition-colors">
          {t('auth.common.forgotPassword')}
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50">
        {loading ? t('auth.login.submitting') : t('auth.login.submit')}
      </button>
    </form>
  );
}