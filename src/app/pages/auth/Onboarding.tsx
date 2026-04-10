import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, MapPin, Heart, Bell, Check, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type OnboardingStep = 'welcome' | 'nickname' | 'address' | 'preferences' | 'notifications';

const PREFERENCE_KEYS = ['artworks', 'designToys', 'limitedEditions', 'collaborations'] as const;
const NOTIFICATION_KEYS = ['newReleases', 'priceDrops', 'newsletter'] as const;

export default function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [formData, setFormData] = useState({
    nickname: '',
    address: {
      fullName: '',
      phone: '',
      zipCode: '',
      address1: '',
      address2: '',
      city: '',
      country: '대한민국',
    },
    preferences: {
      artworks: false,
      designToys: false,
      limitedEditions: false,
      collaborations: false,
    },
    notifications: {
      newReleases: true,
      priceDrops: true,
      newsletter: false,
    },
  });

  const handleSkip = () => {
    if (currentStep === 'welcome') setCurrentStep('nickname');
    else if (currentStep === 'nickname') navigate('/');
    else if (currentStep === 'address') setCurrentStep('preferences');
    else if (currentStep === 'preferences') setCurrentStep('notifications');
    else if (currentStep === 'notifications') navigate('/');
  };

  const handleNext = () => {
    if (currentStep === 'welcome') {
      setCurrentStep('nickname');
    } else if (currentStep === 'nickname') {
      if (!formData.nickname.trim()) {
        alert(t('auth.onboarding.nickname.validation'));
        return;
      }
      setCurrentStep('address');
    } else if (currentStep === 'address') {
      setCurrentStep('preferences');
    } else if (currentStep === 'preferences') {
      setCurrentStep('notifications');
    } else if (currentStep === 'notifications') {
      console.log('온보딩 완료:', formData);
      navigate('/');
    }
  };

  const getStepNumber = () => {
    const steps: OnboardingStep[] = ['welcome', 'nickname', 'address', 'preferences', 'notifications'];
    return steps.indexOf(currentStep) + 1;
  };

  const TOTAL_STEPS = 5;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* 프로그레스 바 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs tracking-wider text-gray-400 font-medium">
              {t('auth.onboarding.stepOf', { current: getStepNumber(), total: TOTAL_STEPS })}
            </span>
            <button
              onClick={handleSkip}
              className="text-xs tracking-wider text-gray-400 hover:text-black transition-colors"
            >
              {currentStep === 'nickname'
                ? t('auth.onboarding.skipLater')
                : t('auth.onboarding.skip')}
            </button>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{ width: `${(getStepNumber() / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* 1단계: 환영 인사 */}
        {currentStep === 'welcome' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-4xl font-medium tracking-tight mb-4">
              {t('auth.onboarding.welcome.title')}
            </h1>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-md mx-auto">
              {t('auth.onboarding.welcome.desc')}
            </p>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all active:scale-95"
            >
              {t('auth.onboarding.welcome.start')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2단계: 닉네임 설정 */}
        {currentStep === 'nickname' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl font-medium tracking-tight mb-3">
              {t('auth.onboarding.nickname.title')}
            </h2>
            <p className="text-gray-400 mb-8">{t('auth.onboarding.nickname.desc')}</p>

            <div className="mb-8">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                {t('auth.onboarding.nickname.label')}
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder={t('auth.onboarding.nickname.placeholder')}
                className="w-full px-6 py-4 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors text-lg"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-2">
                {t('auth.onboarding.nickname.hint')}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-medium"
            >
              {t('auth.onboarding.nickname.next')}
            </button>
          </div>
        )}

        {/* 3단계: 주소 입력 (선택) */}
        {currentStep === 'address' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl font-medium tracking-tight mb-3">
              {t('auth.onboarding.address.title')}
            </h2>
            <p className="text-gray-400 mb-8">{t('auth.onboarding.address.desc')}</p>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t('auth.onboarding.address.fullName')}
                  value={formData.address.fullName}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, fullName: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                />
                <input
                  type="tel"
                  placeholder={t('auth.onboarding.address.phone')}
                  value={formData.address.phone}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, phone: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder={t('auth.onboarding.address.zipCode')}
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                />
                <input
                  type="text"
                  placeholder={t('auth.onboarding.address.city')}
                  className="col-span-2 w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                />
              </div>

              <input
                type="text"
                placeholder={t('auth.onboarding.address.address1')}
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
              />
              <input
                type="text"
                placeholder={t('auth.onboarding.address.address2')}
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSkip} className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                {t('auth.onboarding.address.later')}
              </button>
              <button onClick={handleNext} className="flex-1 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                {t('auth.onboarding.address.save')}
              </button>
            </div>
          </div>
        )}

        {/* 4단계: 취향 선택 */}
        {currentStep === 'preferences' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl font-medium tracking-tight mb-3">
              {t('auth.onboarding.preferences.title')}
            </h2>
            <p className="text-gray-400 mb-8">{t('auth.onboarding.preferences.desc')}</p>

            <div className="space-y-3 mb-8">
              {PREFERENCE_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, [key]: !formData.preferences[key] }
                  })}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                    formData.preferences[key]
                      ? 'border-black bg-black/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {t(`auth.onboarding.preferences.items.${key}.label`)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {t(`auth.onboarding.preferences.items.${key}.desc`)}
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.preferences[key] ? 'border-black bg-black' : 'border-gray-200'
                    }`}>
                      {formData.preferences[key] && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handleSkip} className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                {t('auth.onboarding.preferences.skip')}
              </button>
              <button onClick={handleNext} className="flex-1 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
                {t('auth.onboarding.preferences.next')}
              </button>
            </div>
          </div>
        )}

        {/* 5단계: 알림 설정 */}
        {currentStep === 'notifications' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl font-medium tracking-tight mb-3">
              {t('auth.onboarding.notifications.title')}
            </h2>
            <p className="text-gray-400 mb-8">{t('auth.onboarding.notifications.desc')}</p>

            <div className="space-y-4 mb-8">
              {NOTIFICATION_KEYS.map((key) => (
                <div key={key} className="flex items-center justify-between p-5 rounded-xl bg-[#F4F4F4]">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {t(`auth.onboarding.notifications.items.${key}.label`)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {t(`auth.onboarding.notifications.items.${key}.desc`)}
                    </div>
                  </div>
                  <label className="relative inline-block w-12 h-6 flex-shrink-0 ml-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications[key]}
                      onChange={(e) => setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, [key]: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <span className="absolute inset-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-black" />
                    <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold shadow-lg shadow-black/10"
            >
              {t('auth.onboarding.notifications.start')}
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              {t('auth.onboarding.notifications.changeAnytime')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
