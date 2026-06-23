import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { login } from '@/api/auth';
import { useAuth } from '@/app/context/AuthContext';

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    setSuccess('');
    try {
      await login(data);
      setAuthenticated(true);
      setSuccess(t('auth.login.success'));
      setTimeout(() => navigate('/'), 0);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg || t('auth.login.error'));
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {success && (
        <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">
          {success}
        </div>
      )}
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="block text-sm mb-2 text-gray-700">
          {t('auth.common.emailLabel')}
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="login-email"
            type="email"
            placeholder={t('auth.common.emailPlaceholder')}
            {...register('email', { required: true })}
            className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm mb-2 text-gray-700">
          {t('auth.common.passwordLabel')}
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="login-password"
            type="password"
            placeholder={t('auth.common.passwordPlaceholder')}
            {...register('password', { required: true })}
            className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
          />
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
        disabled={isSubmitting}
        className="w-full py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors disabled:opacity-50"
      >
        {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
      </button>
    </form>
  );
}
