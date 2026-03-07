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
      country: 'South Korea',
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
    if (currentStep === 'welcome') {
      setCurrentStep('nickname');
    } else if (currentStep === 'nickname') {
      navigate('/');
    } else if (currentStep === 'address') {
      setCurrentStep('preferences');
    } else if (currentStep === 'preferences') {
      setCurrentStep('notifications');
    } else if (currentStep === 'notifications') {
      navigate('/');
    }
  };

  const handleNext = () => {
    if (currentStep === 'welcome') {
      setCurrentStep('nickname');
    } else if (currentStep === 'nickname') {
      if (!formData.nickname.trim()) {
        alert('Please enter a nickname');
        return;
      }
      setCurrentStep('address');
    } else if (currentStep === 'address') {
      setCurrentStep('preferences');
    } else if (currentStep === 'preferences') {
      setCurrentStep('notifications');
    } else if (currentStep === 'notifications') {
      // Save all data and navigate to home
      console.log('Onboarding completed:', formData);
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
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs tracking-wider text-gray-400">
              STEP {getStepNumber()} OF 5
            </span>
            <button
              onClick={handleSkip}
              className="text-xs tracking-wider text-gray-400 hover:text-black transition-colors"
            >
              {currentStep === 'nickname' ? 'FINISH LATER' : 'SKIP'}
            </button>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{ width: `${(getStepNumber() / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Welcome Step */}
        {currentStep === 'welcome' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-4xl tracking-tight mb-4">Welcome to KoALa</h1>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-md mx-auto">
              Let's personalize your experience in the Korean Art Laboratory. 
              This will only take a minute.
            </p>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Nickname Step */}
        {currentStep === 'nickname' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl tracking-tight mb-3">Choose Your Nickname</h2>
            <p className="text-gray-400 mb-8">
              This is how you'll appear in the community
            </p>
            
            <div className="mb-8">
              <label className="block text-sm mb-2 text-gray-700">
                Nickname
              </label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="Enter your nickname"
                className="w-full px-6 py-4 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors text-lg"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-2">
                2-20 characters, letters and numbers only
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Address Step */}
        {currentStep === 'address' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl tracking-tight mb-3">Add Your Address</h2>
            <p className="text-gray-400 mb-8">
              We'll use this for faster checkout (optional)
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.address.fullName}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, fullName: e.target.value }
                    })}
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.address.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, phone: e.target.value }
                    })}
                    placeholder="+82 10-0000-0000"
                    className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, zipCode: e.target.value }
                    })}
                    placeholder="12345"
                    className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-2 text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                    placeholder="Seoul"
                    className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.address.address1}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, address1: e.target.value }
                  })}
                  placeholder="Street address"
                  className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Address Line 2 <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.address.address2}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, address2: e.target.value }
                  })}
                  placeholder="Apartment, suite, etc."
                  className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Country
                </label>
                <select
                  value={formData.address.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-xl focus:outline-none focus:border-gray-300 transition-colors"
                >
                  <option>South Korea</option>
                  <option>United States</option>
                  <option>Japan</option>
                  <option>China</option>
                  <option>United Kingdom</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Preferences Step */}
        {currentStep === 'preferences' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl tracking-tight mb-3">What Interests You?</h2>
            <p className="text-gray-400 mb-8">
              Select your preferences to get personalized recommendations
            </p>
            
            <div className="space-y-3 mb-8">
              {[
                { key: 'artworks', label: 'Original Artworks', desc: 'Paintings, prints, and unique pieces' },
                { key: 'designToys', label: 'Designer Toys', desc: 'Limited edition collectibles' },
                { key: 'limitedEditions', label: 'Limited Editions', desc: 'Exclusive numbered releases' },
                { key: 'collaborations', label: 'Artist Collaborations', desc: 'Special partnership collections' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      [item.key]: !formData.preferences[item.key as keyof typeof formData.preferences]
                    }
                  })}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                    formData.preferences[item.key as keyof typeof formData.preferences]
                      ? 'border-black bg-[#F4F4F4]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium mb-1">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.preferences[item.key as keyof typeof formData.preferences]
                        ? 'border-black bg-black'
                        : 'border-gray-300'
                    }`}>
                      {formData.preferences[item.key as keyof typeof formData.preferences] && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Notifications Step */}
        {currentStep === 'notifications' && (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-[#F4F4F4] rounded-2xl flex items-center justify-center mb-6">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-3xl tracking-tight mb-3">Stay Updated</h2>
            <p className="text-gray-400 mb-8">
              Choose how you'd like to hear from us
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                { key: 'newReleases', label: 'New Releases', desc: 'Be the first to know about new artworks and drops' },
                { key: 'priceDrops', label: 'Price Drops', desc: 'Get notified when items on your wishlist go on sale' },
                { key: 'newsletter', label: 'Newsletter', desc: 'Weekly digest of curated content and artist stories' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between p-5 rounded-xl bg-[#F4F4F4]"
                >
                  <div className="flex-1">
                    <div className="font-medium mb-1">{item.label}</div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                  <label className="relative inline-block w-12 h-6 flex-shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={formData.notifications[item.key as keyof typeof formData.notifications]}
                      onChange={(e) => setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          [item.key]: e.target.checked
                        }
                      })}
                      className="sr-only peer"
                    />
                    <span className="absolute inset-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-black cursor-pointer" />
                    <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6 cursor-pointer" />
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
            >
              Complete Setup
            </button>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              You can change these settings anytime in your account
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
