import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { signup } from '@/api/auth';

interface SignupFormProps {
  onSuccess: () => void;
}

type SignupFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  agreed: boolean;
};

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const { t } = useTranslation();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SignupFormData>();

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setServerError('');
    setSuccess('');
    try {
      await signup({ name: data.name, email: data.email, phone: data.phone, password: data.password });
      setSuccess(t('auth.signup.success'));
      setTimeout(() => onSuccess(), 1000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg || t('auth.signup.error'));
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {success && (
        <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">{success}</div>
      )}
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">{serverError}</div>
      )}

      <div>
        <label htmlFor="signup-name" className="block text-sm mb-2 text-gray-700">
          {t('auth.signup.nameLabel')}
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="signup-name"
            type="text"
            placeholder={t('auth.signup.namePlaceholder')}
            {...register('name', { required: true })}
            className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-sm mb-2 text-gray-700">
          {t('auth.common.emailLabel')}
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="signup-email"
            type="email"
            placeholder={t('auth.common.emailPlaceholder')}
            {...register('email', { required: true })}
            className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-phone" className="block text-sm mb-2 text-gray-700">
          {t('auth.signup.phoneLabel')}
        </label>
        <input
          id="signup-phone"
          type="tel"
          placeholder={t('auth.signup.phonePlaceholder')}
          {...register('phone', { required: true })}
          className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-sm mb-2 text-gray-700">
          {t('auth.common.passwordLabel')}
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="signup-password"
            type="password"
            placeholder={t('auth.signup.passwordPlaceholderCombined')}
            {...register('password', { required: true, minLength: 8 })}
            className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>
        {errors.password?.type === 'minLength' && (
          <p className="mt-1 text-xs text-red-500">{t('auth.validation.passwordTooShort')}</p>
        )}
      </div>

      <div>
        <label htmlFor="signup-confirm" className="block text-sm mb-2 text-gray-700">
          {t('auth.signup.confirmPasswordLabel')}
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="signup-confirm"
            type="password"
            placeholder={t('auth.signup.confirmPasswordPlaceholder')}
            {...register('confirm', {
              required: true,
              validate: (val) => val === password || t('auth.validation.passwordMismatch'),
            })}
            className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>
        {errors.confirm && (
          <p className="mt-1 text-xs text-red-500">{errors.confirm.message}</p>
        )}
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...register('agreed', { required: t('auth.validation.termsRequired') })}
          className="w-4 h-4 mt-0.5 rounded border-gray-300"
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          {t('auth.common.termsAgree')}{' '}
          <Link to="/terms" className="text-black hover:underline">{t('auth.common.termsLink')}</Link>
          {' '}{t('auth.common.termsAnd')}{' '}
          <Link to="/privacy" className="text-black hover:underline">{t('auth.common.privacyLink')}</Link>
        </span>
      </label>
      {errors.agreed && (
        <p className="text-xs text-red-500">{errors.agreed.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? t('auth.signup.submitting') : t('auth.signup.submit')}
      </button>
    </form>
  );
}
