import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, Lock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { signup } from '@/api/auth';

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== confirm) return setError(t('auth.validation.passwordMismatch'));
    if (password.length < 8) return setError(t('auth.validation.passwordTooShort'));
    if (!agreed) return setError(t('auth.validation.termsRequired'));

    setLoading(true);
    try {
      // 백엔드가 HttpOnly 쿠키로 토큰을 자동 설정 — localStorage 저장 불필요
      await signup({ name, email, phone, password });
      setSuccess(t('auth.signup.success'));
      
      // 성공 시 부모 컴포넌트에게 알려서 로그인 탭으로 넘기게 함
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.signup.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSignup}>
      {success && (
        <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">{success}</div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">{error}</div>
      )}

      <div>
        <label className="block text-sm mb-2 text-gray-700">{t('auth.signup.nameLabel')}</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('auth.signup.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>
      </div>

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
        <label className="block text-sm mb-2 text-gray-700">{t('auth.signup.phoneLabel')}</label>
        <input
          type="tel"
          placeholder={t('auth.signup.phonePlaceholder')}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm mb-2 text-gray-700">{t('auth.common.passwordLabel')}</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            placeholder={t('auth.signup.passwordPlaceholderCombined')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2 text-gray-700">{t('auth.signup.confirmPasswordLabel')}</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            placeholder={t('auth.signup.confirmPasswordPlaceholder')}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded border-gray-300"
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          {t('auth.common.termsAgree')} <Link to="/terms" className="text-black hover:underline">{t('auth.common.termsLink')}</Link> {t('auth.common.termsAnd')} <Link to="/privacy" className="text-black hover:underline">{t('auth.common.privacyLink')}</Link>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
      >
        {loading ? t('auth.signup.submitting') : t('auth.signup.submit')}
      </button>
    </form>
  );
}