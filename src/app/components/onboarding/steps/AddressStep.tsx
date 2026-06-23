import { MapPin, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  address: any;
  onChange: (address: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

interface DaumPostcodeResult {
  address: string;
  addressType: 'R' | 'J';
  zonecode: string;
  bname?: string;
  buildingName?: string;
}

export default function AddressStep({ address, onChange, onNext, onSkip }: Props) {
  const { t } = useTranslation('koala');
  const [showPostcode, setShowPostcode] = useState(false);
  const postcodeContainerRef = useRef<HTMLDivElement>(null);

  const handleAddressSearch = () => {
    setShowPostcode(true);
  };

  useEffect(() => {
    if (!showPostcode) return;

    const initEmbed = () => {
      if (!postcodeContainerRef.current) return;
      postcodeContainerRef.current.innerHTML = '';
      new (window as any).daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: (data: DaumPostcodeResult) => {
          let fullAddress = data.address;
          let extra = '';
          if (data.addressType === 'R') {
            if (data.bname?.trim()) extra += data.bname;
            if (data.buildingName?.trim()) extra += (extra ? `, ${data.buildingName}` : data.buildingName);
            if (extra) fullAddress += ` (${extra})`;
          }
          onChange({ ...address, zipCode: data.zonecode, address1: fullAddress });
          setShowPostcode(false);
        },
      }).embed(postcodeContainerRef.current);
    };

    if ((window as any).daum?.Postcode) {
      initEmbed();
    } else {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.onload = initEmbed;
      document.head.appendChild(script);
    }
  }, [showPostcode]);

  return (
    <>
    {/* 우편번호 검색 오버레이 */}
    {showPostcode && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-medium text-gray-900">주소 검색</span>
            <button
              onClick={() => setShowPostcode(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-700"
            >✕</button>
          </div>
          <div ref={postcodeContainerRef} style={{ width: '100%', height: '460px' }} />
        </div>
      </div>
    )}
    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
      <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
        <MapPin className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-3xl font-medium tracking-tight mb-3">{t('onboarding.address.title')}</h2>
      <p className="text-gray-400 mb-8">{t('onboarding.address.desc')}</p>

      <div className="space-y-4 mb-8">
        {/* 수령인 / 전화번호 */}
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

        {/* 우편번호 + 찾기 버튼 */}
        <div className="flex gap-3">
          <input
            type="text"
            readOnly
            placeholder={t('onboarding.address.zipCode')}
            value={address.zipCode}
            className="flex-1 px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl text-gray-500 cursor-not-allowed"/>
          <button
            type="button"
            onClick={handleAddressSearch}
            className="px-4 py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4" /> 주소 찾기
          </button>
        </div>

        {/* 기본 주소 (검색 후 자동 입력) */}
        <input
          type="text"
          readOnly
          placeholder={t('onboarding.address.address1')}
          value={address.address1}
          className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl text-gray-500 cursor-not-allowed"/>

        {/* 상세 주소 */}
        <input
          type="text" placeholder={t('onboarding.address.address2')}
          value={address.address2} onChange={(e) => onChange({ ...address, address2: e.target.value })}
          className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300"/>
      </div>

      <div className="flex gap-3">
        <button onClick={onSkip} className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          {t('onboarding.address.later')}
        </button>
        <button onClick={onNext} className="flex-1 py-4 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors">
          {t('onboarding.address.save')}
        </button>
      </div>
    </div>
    </>
  );
}
