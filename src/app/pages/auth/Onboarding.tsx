import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { OnboardingStep } from '@/app/pages/type';
import ProgressBar from '@/app/components/onboarding/ProgressBar';
import WelcomeStep from '@/app/components/onboarding/steps/WelcomeStep';
import NicknameStep from '@/app/components/onboarding/steps/NicknameStep';
import AddressStep from '@/app/components/onboarding/steps/AddressStep';
import PreferencesStep from '@/app/components/onboarding/steps/PreferencesStep';
import NotificationsStep from '@/app/components/onboarding/steps/NotificationsStep';

export default function Onboarding(){
  const {t} = useTranslation('koala');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [formData, setFormData] = useState({
    nickname: '',
    address: { fullName: '', phone: '', zipCode: '', address1: '', address2: '', city: '', country: 'KR' },
    preferences: { artworks: false, designToys: false, limitedEditions: false, collaborations: false },
    notifications: { newReleases: true, priceDrops: true, newsletter: false },
  });
 const handleSkip = () => {
    if (currentStep === 'welcome') setCurrentStep('nickname');
    else if (currentStep === 'nickname') navigate('/');
    else if (currentStep === 'address') setCurrentStep('preferences');
    else if (currentStep === 'preferences') setCurrentStep('notifications');
    else if (currentStep === 'notifications') navigate('/');
  };
  const handleNext = () => {
    if(currentStep === 'welcome') setCurrentStep('nickname');
    else if(currentStep === 'nickname') setCurrentStep('address');
    else if(currentStep === 'address') setCurrentStep('preferences');
    else if(currentStep === 'preferences') setCurrentStep('notifications');
    else if (currentStep === 'notifications'){
    console.log(t('onboarding.completeLog'), formData);
    navigate('/');
    }
  };
 return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <ProgressBar currentStep={currentStep} onSkip={handleSkip} />

        {currentStep === 'welcome' && (
          <WelcomeStep onNext={handleNext} />
        )}
        
        {currentStep === 'nickname' && (
          <NicknameStep 
            nickname={formData.nickname} 
            onChange={(val) => setFormData({ ...formData, nickname: val })}
            onNext={handleNext} 
          />
        )}
        
        {currentStep === 'address' && (
          <AddressStep 
            address={formData.address}
            onChange={(address) => setFormData({ ...formData, address })}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        )}
        
        {currentStep === 'preferences' && (
          <PreferencesStep 
            preferences={formData.preferences}
            onChange={(preferences) => setFormData({ ...formData, preferences })}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        )}
        
        {currentStep === 'notifications' && (
          <NotificationsStep 
            notifications={formData.notifications}
            onChange={(notifications) => setFormData({ ...formData, notifications })}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}