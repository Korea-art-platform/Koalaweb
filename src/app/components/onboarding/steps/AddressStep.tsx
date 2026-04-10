import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
interface Props {
  address: any;
  onChange: (address: any) => void;
  onNext: () => void;
  onSkip: () => void;
}
export default function AddressStep({ address, onChange, onNext, onSkip }: Props) {
  const { t } = useTranslation('koala');
  return (
    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
      <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
        <MapPin className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-3xl font-medium tracking-tight mb-3">{t('onboarding.address.title')}</h2>
      <p className="text-gray-400 mb-8">{t('onboarding.address.desc')}</p>

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text" placeholder={t('onboarding.address.fullName')}
            value={address.fullName} onChange={(e) => onChange({ ...address, fullName: e.target.value })}
            className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300"/>
          <input
            type="tel" placeholder={t('onboarding.address.phone')}
            value={address.phone} onChange={(e) => onChange({ ...address, phone: e.target.value })}
            className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300"/>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text" placeholder={t('onboarding.address.zipCode')}
            value={address.zipCode} onChange={(e) => onChange({ ...address, zipCode: e.target.value })}
            className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300"/>
          <input
            type="text" placeholder={t('onboarding.address.city')}
            value={address.city} onChange={(e) => onChange({ ...address, city: e.target.value })}
            className="col-span-2 w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300"/>
        </div>
        <input
          type="text" placeholder={t('onboarding.address.address1')}
          value={address.address1} onChange={(e) => onChange({ ...address, address1: e.target.value })}
          className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300"/>
        <input
          type="text" placeholder={t('onboarding.address.address2')}
          value={address.address2} onChange={(e) => onChange({ ...address, address2: e.target.value })}
          className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300"/>
      </div>

      <div className="flex gap-3">
        <button onClick={onSkip} className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          {t('onboarding.address.later')}
        </button>
        <button onClick={onNext} className="flex-1 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
          {t('onboarding.address.save')}
        </button>
      </div>
    </div>
  );
}