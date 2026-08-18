import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NOTIFICATION_KEYS = ['newReleases', 'priceDrops', 'newsletter'] as const;
type NotiKeys = typeof NOTIFICATION_KEYS[number];

interface Props {
  notifications: Record<NotiKeys, boolean>;
  onChange: (notis: Record<NotiKeys, boolean>) => void;
  onNext: () => void;
}

export default function NotificationsStep({ notifications, onChange, onNext }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
      <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
        <Bell className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-3xl font-medium tracking-tight mb-3">{t('auth.onboarding.notifications.title')}</h2>
      <p className="text-gray-400 mb-8">{t('auth.onboarding.notifications.desc')}</p>
      <div className="space-y-4 mb-8">
        {NOTIFICATION_KEYS.map((key) => (
          <div key={key} className="flex items-center justify-between p-5 rounded-xl bg-[#F4F4F4]">
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{t(`onboarding.notifications.items.${key}.label`)}</div>
              <div className="text-sm text-gray-400">{t(`onboarding.notifications.items.${key}.desc`)}</div>
            </div>
            <label className="relative inline-block w-12 h-6 flex-shrink-0 ml-4 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(e) => onChange({ ...notifications, [key]: e.target.checked })}
                className="sr-only peer"
              />
              <span className="absolute inset-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-koala-navy" />
              <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
            </label>
          </div>
        ))}
      </div>
      <button onClick={onNext} className="w-full py-4 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-all font-semibold shadow-lg shadow-black/10">
        {t('auth.onboarding.notifications.start')}
      </button>
      <p className="text-xs text-gray-400 text-center mt-4">{t('auth.onboarding.notifications.changeAnytime')}</p>
    </div>
  );
}
