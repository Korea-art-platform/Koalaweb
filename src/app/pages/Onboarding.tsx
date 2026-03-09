import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, MapPin, Heart, Bell, Check, ChevronRight } from 'lucide-react';

type OnboardingStep = 'welcome' | 'nickname' | 'address' | 'preferences' | 'notifications';

export default function Onboarding() {
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
        alert('닉네임을 입력해 주세요.');
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* 프로그레스 바 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs tracking-wider text-gray-400 font-medium">
              STEP {getStepNumber()} OF 5
            </span>
            <button
              onClick={handleSkip}
              className="text-xs tracking-wider text-gray-400 hover:text-black transition-colors"
            >
              {currentStep === 'nickname' ? '나중에 설정하기' : '건너뛰기'}
            </button>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{ width: `${(getStepNumber() / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* 1단계: 환영 인사 */}
        {currentStep === 'welcome' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-4xl font-medium tracking-tight mb-4">KoALa에 오신 것을 환영합니다</h1>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-md mx-auto">
              사용자님께 꼭 맞는 한국 예술 경험을 위해 몇 가지만 설정해볼까요? 1분이면 충분합니다.
            </p>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all active:scale-95"
            >
              시작하기
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
            <h2 className="text-3xl font-medium tracking-tight mb-3">닉네임을 정해주세요</h2>
            <p className="text-gray-400 mb-8">커뮤니티와 서비스 내에서 사용될 이름입니다.</p>
            
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2 text-gray-700">닉네임</label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="닉네임을 입력하세요"
                className="w-full px-6 py-4 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors text-lg"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-2">2~20자 이내, 한글/영문/숫자만 사용 가능합니다.</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-medium"
            >
              다음 단계로
            </button>
          </div>
        )}

        {/* 3단계: 주소 입력 (선택) */}
        {currentStep === 'address' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl font-medium tracking-tight mb-3">배송지 미리 등록</h2>
            <p className="text-gray-400 mb-8">빠른 결제를 위해 배송 정보를 미리 등록할 수 있습니다. (건너뛰기 가능)</p>
            
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="수령인 성함"
                  value={formData.address.fullName}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, fullName: e.target.value}})}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                />
                <input
                  type="tel"
                  placeholder="연락처 (- 제외)"
                  value={formData.address.phone}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, phone: e.target.value}})}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="우편번호"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, zipCode: e.target.value}})}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                />
                <input
                  type="text"
                  placeholder="도시 (예: 서울특별시)"
                  className="col-span-2 w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                />
              </div>

              <input
                type="text"
                placeholder="도로명 주소"
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
              />
              <input
                type="text"
                placeholder="상세 주소 (아파트, 동/호수 등)"
                className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSkip} className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">나중에 하기</button>
              <button onClick={handleNext} className="flex-1 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">저장하고 계속하기</button>
            </div>
          </div>
        )}

        {/* 4단계: 취향 선택 */}
        {currentStep === 'preferences' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl font-medium tracking-tight mb-3">어떤 작품을 좋아하시나요?</h2>
            <p className="text-gray-400 mb-8">관심사를 선택해주시면 취향에 맞는 작품을 추천해드려요.</p>
            
            <div className="space-y-3 mb-8">
              {[
                { key: 'artworks', label: '원화 및 조형물', desc: '회화, 판화 등 고유한 예술 작품' },
                { key: 'designToys', label: '디자이너 토이', desc: '한정판 아트 피규어 및 컬렉터블' },
                { key: 'limitedEditions', label: '리미티드 에디션', desc: '넘버링이 포함된 독점 출시작' },
                { key: 'collaborations', label: '아티스트 콜라보', desc: '브랜드와 작가의 특별 협업 제품' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, [item.key]: !formData.preferences[item.key as keyof typeof formData.preferences] }
                  })}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                    formData.preferences[item.key as keyof typeof formData.preferences]
                      ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.preferences[item.key as keyof typeof formData.preferences] ? 'border-black bg-black' : 'border-gray-200'
                    }`}>
                      {formData.preferences[item.key as keyof typeof formData.preferences] && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handleSkip} className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">건너뛰기</button>
              <button onClick={handleNext} className="flex-1 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">계속하기</button>
            </div>
          </div>
        )}

        {/* 5단계: 알림 설정 */}
        {currentStep === 'notifications' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-500">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl font-medium tracking-tight mb-3">소식을 받아보시겠어요?</h2>
            <p className="text-gray-400 mb-8">놓치면 아쉬운 작품 소식들을 가장 먼저 보내드려요.</p>
            
            <div className="space-y-4 mb-8">
              {[
                { key: 'newReleases', label: '신규 출시 소식', desc: '새로운 작품과 한정판 드랍 소식' },
                { key: 'priceDrops', label: '가격 변동 알림', desc: '찜한 아이템의 할인 정보' },
                { key: 'newsletter', label: '뉴스레터', desc: '매주 발행되는 작가 인터뷰 및 큐레이션' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-5 rounded-xl bg-[#F4F4F4]">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                  <label className="relative inline-block w-12 h-6 flex-shrink-0 ml-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifications[item.key as keyof typeof formData.notifications]}
                      onChange={(e) => setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, [item.key]: e.target.checked }
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
              시작하기
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">계정 설정에서 언제든지 변경할 수 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}