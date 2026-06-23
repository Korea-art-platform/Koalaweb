import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  nickname: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

export default function NicknameStep({ nickname, onChange, onNext }: Props) {
  const { t } = useTranslation('koala');

  const handleNextClick = () => {
    if (!nickname.trim()) {
      alert(t('onboarding.nickname.validation'));
      return;
    }
    onNext();
  };

  return (
    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
      <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
        <User className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-3xl font-medium tracking-tight mb-3">{t('onboarding.nickname.title')}</h2>
      <p className="text-gray-400 mb-8">{t('onboarding.nickname.desc')}</p>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2 text-gray-700">{t('onboarding.nickname.label')}</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('onboarding.nickname.placeholder')}
          className="w-full px-6 py-4 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors text-lg"
          autoFocus
        />
        <p className="text-xs text-gray-400 mt-2">{t('onboarding.nickname.hint')}</p>
      </div>
      <button onClick={handleNextClick} className="w-full py-4 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-all font-medium">
        {t('onboarding.nickname.next')}
      </button>
    </div>
  );
}