import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, Lock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/app/components/layouts/Header';
import { signup, loginWithKakao, loginWithNaver } from '@/api/auth';

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t('auth.validation.passwordMismatch'));
      return;
    }
    if (password.length < 8) {
      setError(t('auth.validation.passwordTooShort'));
      return;
    }
    if (!agreed) {
      setError(t('auth.validation.termsRequired'));
      return;
    }

    setLoading(true);
    try {
      await signup({ name, email, phone, password });
      setSuccess(t('auth.signup.success'));

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.signup.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoSignup = () => loginWithKakao();
  const handleNaverSignup = () => loginWithNaver();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-16 px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl tracking-tight mb-3">{t('auth.signup.title')}</h1>
            <p className="text-sm text-gray-400">
              {t('auth.signup.subtitle')}
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* 성공 메시지 */}
              {success && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">
                  {success}
                </div>
              )}

              {/* 에러 메시지 */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-500">
                  {error}
                </div>
              )}

              {/* Name Field */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  {t('auth.signup.nameLabel')}
                </label>
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

              {/* Email Field */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  {t('auth.common.emailLabel')}
                </label>
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

              {/* Phone Field */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  {t('auth.signup.phoneLabel')}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder={t('auth.signup.phonePlaceholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  {t('auth.common.passwordLabel')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder={t('auth.signup.passwordPlaceholderCreate')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {t('auth.signup.passwordHint')}
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  {t('auth.signup.confirmPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    {t('auth.common.termsAgree')}{' '}
                    <Link to="/terms" className="text-black hover:underline">
                      {t('auth.common.termsLink')}
                    </Link>
                    {' '}{t('auth.common.termsAnd')}{' '}
                    <Link to="/privacy" className="text-black hover:underline">
                      {t('auth.common.privacyLink')}
                    </Link>
                  </span>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {loading ? t('auth.signup.submitting') : t('auth.signup.submit')}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400">
                  {t('auth.common.orContinueWith')}
                </span>
              </div>
            </div>

            {/* Social Signup */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleKakaoSignup}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#FEE500] rounded-xl hover:bg-[#FDD800] transition-colors"
              >
                <span className="text-sm font-medium text-black">
                  {t('auth.signup.kakao')}
                </span>
              </button>
              <button
                type="button"
                onClick={handleNaverSignup}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#03C75A] rounded-xl hover:bg-[#02b350] transition-colors"
              >
                <span className="text-sm font-medium text-white">
                  {t('auth.signup.naver')}
                </span>
              </button>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              {t('auth.signup.hasAccount')}{' '}
              <Link to="/login" className="text-black hover:underline">
                {t('auth.signup.signInLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
